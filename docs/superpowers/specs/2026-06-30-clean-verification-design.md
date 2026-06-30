# 清理后强制校验 + 受限自动补清 — 设计 Spec

**日期**: 2026-06-30
**状态**: 已与用户确认设计决策,待 spec 复核
**作者**: Claude (brainstorming)

## 1. 背景与动机

MetaDocu 当前有两条独立的"清理元数据"代码路径,且**都在清理后未做任何校验就声称成功**:

- **审计流(WASM clean)** — `components/om/om-audit-report.tsx` 的 `handleRemoveMetadata` 收到 worker 的 `CLEAN_SUCCESS` 后,直接 3D 翻转到绿色 "100% CLEAN" 卡片并自动下载。不管有没有真清掉。
- **编辑器 / 批量 clear** — `contexts/metadata-context.tsx` 的 `clearAndSaveDocument` / `batchClearAndSave` → 资源层 `destroyMetadataMany` → web 的 `clearDocx` / `clearXlsx` / `clearPdf`。同样无校验。

且现有清理实现本身有确凿缺口:

- `lib/documents/web/ooxml-utils.ts` 的 `writeOoxmlMetadata`:`setTagText` 只对**已存在**的标签赋空值;`app.xml` 只清了 6 个字段(Company/Manager/Template/TotalTime/Application/AppVersion),未动 Pages/Words/Characters;`custom.xml` 完全没碰;revision 被设回 "1"。
- `lib/documents/web/pdf-processor.ts` 的 `clearPdf`:只清 Info 字典 + 删日期,**未动 XMP 包**(PDF 双元数据存储之一)。
- web 的 `clear()`(`clearDocx` 等)**只触发下载、不回写 file-store**,导致 `clearAndSaveDocument` 之后 `resource.show()` re-read 读到的是**原始未清理字节**,界面回显与实际下载文件不一致。

**目标**:在所有清理路径完成后,强制运行一道独立校验,确认元数据真的被移除;若仍有残留,自动补清(有次数上限),到上限后转为提示用户手动重试。校验结果以诚实口径展示("未检测到残留",而非"保证零残留")。

## 2. 市场调研结论(支撑设计)

调研了 Microsoft Document Inspector、Adobe Acrobat Sanitize、ExifTool、mat2、Dangerzone、verexif/EXIFPurge 等(完整报告见对话记录)。要点:

1. **"清理后回扫确认零残留"作为用户可见功能,市面上基本只有微软 Document Inspector 的 "Reinspect" 做了。** 其余工具要么隐式验证(ExifTool 重读、mat2 重建、Dangerzone 栅格化),要么不验证(Adobe 只在删除前扫描;在线工具只给删除前预览)。→ **本功能是真正的差异化。**
2. **同引擎回扫会"说谎"**:writer 与 verifier 共用 schema 就共用盲区,writer 没建模的字段 reader 也读不到,于是假报"干净"(mat2 明确警告此点)。→ **独立字节扫描必须是主门禁,同引擎 scan 只作辅助。**
3. **诚实口径**:mat2 只说"未检测到残留",绝不说"保证零残留"。
4. **OOXML 真正盲区**(naive 清理器全漏):`word/settings.xml` 的 RSID、`word/people.xml`、`comments.xml` + 修订痕迹 `w:ins/w:del`、`docProps/thumbnail.jpeg`。
5. **PDF 双存储 + 增量更新残留**:Info 字典与 XMP 必须都清;增量更新会把旧元数据物理留在文件前段、可恢复,**唯一可靠解是整体重写为单一修订版**。

## 3. 已确认的设计决策

| # | 决策点 | 选择 |
|---|--------|------|
| 1 | 覆盖范围 | **全部清理路径**:审计 WASM clean + 编辑器 clear/save + 批量 |
| 2 | 校验方法 | **独立字节扫描(主门禁)+ 同引擎回扫(辅助)** |
| 3 | 失败处理 | **阻断 + 自动 deepClean 重试**,上限 `MAX_AUTO_RECLEAN`(默认 1),到上限转手动"再次清理" |
| 4 | 残留门槛 | **docProps(core.xml / app.xml / custom.xml)**;RSID/people/comments/thumbnail/PDF-XMP 做成可扩展开关、默认关 |
| 5 | 展示口径 | "未检测到残留",不喊"100% 保证" |

## 4. 架构

### 4.1 新模块:独立校验器 `lib/documents/verify/`

```
lib/documents/verify/
  verify-clean.ts      # verifyCleaned(bytes, fileType) — 主入口
  residue-rules.ts     # 可扩展的残留规则表(门槛配置)
  deep-clean.ts        # deepClean(bytes, fileType, residue) — 更激进的补清
  clean-and-verify.ts  # cleanAndVerify(produce, fileType) — 编排器(校验+受限重试)
```

#### `verifyCleaned(bytes: Uint8Array, fileType: DocumentFileType): Promise<VerifyResult>`

```ts
interface ResidueField {
  part: "core.xml" | "app.xml" | "custom.xml" | "pdf-info" | "pdf-xmp"
  key: string
  value: string          // 实际残留值(用于展示/脱敏)
  risk: "high" | "medium" | "low"
}

interface VerifyResult {
  verified: boolean      // 字节扫描 + 同引擎回扫都通过才 true
  residue: ResidueField[]
  unverifiable?: boolean // 校验本身无法可靠执行(如 doc 老格式、加密 PDF、zip 损坏)
}
```

判定逻辑(**字节扫描是硬门禁**):

- **OOXML(docx/xlsx)**:`unzip` 后**不复用 writer 的命名空间 DOM-setter 路径**,而是对解出的 `docProps/core.xml`、`app.xml`、`custom.xml` 原始文本做正则/子串扫描。门槛规则由 `residue-rules.ts` 提供;默认规则(docProps 门槛):
  - core.xml:`dc:creator` / `cp:lastModifiedBy` / `dc:title` / `dc:subject` / `dc:description` / `cp:keywords` 等标签**有非空文本** → 残留。
  - app.xml:`Company` / `Manager` / `Template`(含路径)/ `Application` 等**有非空文本** → 残留。
  - custom.xml:**该 part 存在且含任意 `<property>`** → 残留。
- **PDF**:`pdf-lib` 重新加载输出字节,检查 Info 字典 `Author/Title/Subject/Creator/Producer/Keywords/CreationDate/ModDate` 是否仍有值;**外加**对原始字节做子串扫描兜底(Info 门槛)。XMP 残留与"单一修订版"检查列为**默认关闭的扩展规则**(见 4.4)。
- **同引擎回扫(辅助)**:OOXML 跑一次 `readOoxmlMetadata`,PDF 跑一次 `showPdf`,任一返回非空敏感字段 → 也判 `verified=false`。仅作二次确认,不替代字节扫描。
- **`unverifiable`**:`doc` 老格式、加密 PDF、zip/pdf 解析抛错时置 true。**此时绝不显示"已清理成功"**,而是显示"无法完全校验"。

#### `deepClean(bytes, fileType, residue): Promise<Uint8Array>`

比首轮清理更激进,且**每轮必须比上轮更狠**(配合上限防死循环):

- **OOXML**:对 residue 命中的标签**直接清空文本**(不依赖标签预先存在);`custom.xml` 命中则**整段删除该 part**(同时清理 `[Content_Types].xml` 与 `.rels` 引用,避免悬挂指针损坏文件);(扩展)thumbnail 命中则删 `docProps/thumbnail.*`。
- **PDF**:强删整个 Info 字典(而非逐字段置空);(扩展)清 XMP `/Metadata` 流并整体重写为单一修订版。

#### `cleanAndVerify(produce, fileType, options?): Promise<CleanVerifyResult>`

编排器,两条路径共用:

```ts
const MAX_AUTO_RECLEAN = 1  // 常量,集中可调

interface CleanVerifyResult {
  bytes: Uint8Array
  verified: boolean
  residue: ResidueField[]
  attempts: number        // 1 = 首轮即过;>1 = 经过自动补清
  exhausted: boolean      // 达到自动上限仍残留 → UI 转手动重试
  unverifiable?: boolean
}
```

流程:
1. `bytes = await produce()` — 首轮清理产物(WASM 或 JS,由调用方注入)。
2. `result = await verifyCleaned(bytes, fileType)`;`verified` 则返回。
3. 有残留且 `attempts <= MAX_AUTO_RECLEAN`:`bytes = await deepClean(bytes, fileType, residue)`,回到步骤 2。
4. 达到上限仍残留:返回 `{ verified:false, exhausted:true, residue }`,**不再自动重试**。

### 4.2 接入审计流(WASM)

`om-audit-report.tsx` 的 `handleRemoveMetadata`:收到 `CLEAN_SUCCESS` 的 worker 产物后,**不再直接翻绿卡**,而是调用 `cleanAndVerify(() => Promise.resolve(workerBytes), fileExt)`(校验与 deepClean 均在 JS 侧对 worker 产物执行,与 Rust writer 独立)。仅 `verified` 才翻绿卡 + `setFileData` + 自动下载;否则进入新增"残留态"卡片。

### 4.3 接入编辑器 / 批量(资源层)

把校验织进 web 资源的 `destroyMetadataMany`(`lib/resources/documents.ts` 的 `createWebResourceForType`),使 `clearAndSaveDocument` / `batchClearAndSave` 都拿到 `verified` + `residue`。

**配套修复(纳入本次范围)**:重构 web 的 `clear()`(`clearDocx`/`clearXlsx`/`clearPdf`),使其**返回清理后字节并回写 file-store**(`setFileData`),不再仅触发下载。这样:
- `cleanAndVerify` 能拿到真实产物校验;
- 后续 `resource.show()` re-read 读到的是清理后字节,界面回显与下载文件一致(修掉现有副作用)。

`BatchSaveResultItem` 增补可选字段携带校验结果:`{ filePath, success, error?, verified?, residue?, exhausted? }`。

### 4.4 可扩展残留规则(默认关闭)

`residue-rules.ts` 暴露一个规则注册表,默认仅启用 docProps 门槛。预留(`enabled: false`)规则,后续分期点亮:

- OOXML:`word/settings.xml` RSID(`<w:rsids>`)、`word/people.xml`、`comments.xml` + 修订痕迹、`docProps/thumbnail.*`。
- PDF:XMP `/Metadata` 残留、"单一修订版"检查(扫原始字节确认无旧 `/Author` 等、xref 仅一份)。**这是调研指出的最高价值扩展,建议作为第一个点亮项。**

## 5. UI / 反馈

### 审计卡(`om-audit-report.tsx`)

- 扫描步骤新增第 5 步 "Verifying removal"(复用现有 `StepItem` 渐进打勾)。
- 终态三选一:
  1. `verified && attempts === 1` → 绿卡:**"未检测到残留 ✓ 已校验"**(口径从 "100% CLEAN" 改为不夸大)。
  2. `verified && attempts > 1` → 绿卡 + 小字:"已自动二次清理后校验通过"。
  3. `exhausted` → 黄/红"残留态"卡片:列出 `residue`(沿用现有脱敏 `redactValue`)、**"再次清理"按钮(手动触发,绕过自动上限)** + "手动编辑"跳 `/editor`。
  4. `unverifiable` → 中性提示"已清理,但无法完全校验(格式限制)",不喊成功也不报危险。

### 编辑器 / 批量

- `clearAndSaveDocument` 成功:状态/toast 标注"已校验";`exhausted` 则置 `error` 态显示残留计数 + 手动重试入口。
- `batchClearAndSave`:按文件聚合 `verified`/`exhausted`,残留文件单独标红并提供手动重试。

## 6. 错误处理 / 边界

- `verifyCleaned` 抛错(zip/pdf 损坏)→ `unverifiable: true`,**绝不**显示"已清理成功"。
- 每轮 `deepClean` 必须比上轮更激进,配合 `MAX_AUTO_RECLEAN` 防死循环。
- `doc`(老格式)、加密 PDF → `unverifiable`,显式标"未完全校验"。
- 文案口径全局对齐"未检测到残留 / detected",新增 i18n key 同步 `messages/en.json` 与 `messages/zh-CN.json`(英文为索引主语言,需完整填写)。

## 7. 怎么验证这套东西(本仓库无测试套件)

- 把 `verifyCleaned` 同时做成 `scripts/verify-clean.ts` CLI:传清理前后文件,打印残留字段——既是运行时库,又是手动验收工具。
- `pnpm typecheck` + `pnpm lint` + `pnpm build`(prebuild 含 `seo:check`)全绿。
- 手测 fixture:一个带 `custom.xml` 的 docx + 一个 Info/XMP 都有值的 PDF,分别走审计流与编辑器流,确认:残留态能触发、自动补清能转绿、达上限能转手动。

## 8. 明确不做(YAGNI / 本期不含)

- Tauri 原生路径的校验(本期只覆盖 web;原生路径 `trackedInvoke` 另行处理)。
- 法医级 OOXML 深度字段(RSID/people/comments/thumbnail)与 PDF XMP/单一修订版重写的**实现**——仅预留架构开关,不在本期点亮。
- 文档正文内容(track-changes 文本、隐藏文本)的清理——属正文范畴,非元数据。

## 9. 开放问题(待用户复核确认)

- `MAX_AUTO_RECLEAN` 默认 1 是否合适(可改 2)。
- 残留态 UI 的视觉强度(黄色"提醒" vs 红色"警告")。
