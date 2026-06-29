# MetaDocu GEO 冷启动与监控优化执行文档

版本：v1.0
目标网站：https://metadocu.com/
核心定位：Browser-local document metadata privacy scanner & cleaner
当前状态：GA4 已接入，自测能看到实时用户；但自然用户少，暂无明显 GEO / AI 搜索抓取与引用信号。

---

# 0. 实施现状对照（更新于 2026-06）

> ⚠️ **URL 方案以代码为准**：本文档 v1.0 规划的 URL（如 `/remove-author-from-word-document`、`/remove-pdf-xmp-metadata`、`/remove-metadata-before-sending-file`、`/local-processing-proof`）**与实际上线方案不同**。实际站点的唯一事实来源是 **`seo/seo-map.ts`**（由 `pnpm seo:check` 构建门禁校验）。本文档保留为**策略参考**，凡涉及具体 URL 一律以 seo-map 为准。

## 0.1 已落地（无需重复做）

```txt
GA4 已接入
sitemap.xml 动态生成（app/sitemap.ts，源自 seo-map，已修复 lastmod 用真实日期而非 new Date()）
robots.txt：AI 爬虫 allow + /editor /batch /api disallow（app/robots.ts）
llms.txt（public/llms.txt）
结构化数据 JSON-LD：Organization / WebSite / BreadcrumbList / FAQPage / Article / SoftwareApplication / HowTo（seo/generate-json-ld.ts）
TDK 契约 + 构建门禁（seo/validate-seo.ts）
工具页 word/excel/pdf：字段表 + FAQ + 嵌入式工具
is-it-safe 信任页
19 个可索引页已上线（见 0.3）
站内链接：footer「指南与场景」枢纽 + 工具页 hub→长尾页（2026-06 修复站内链接饥饿/孤儿页问题）
```

## 0.2 仍待办

```txt
Bot 访问日志 middleware（§3.3）—— 未实现，middleware.ts 目前只处理 locale cookie
人工 GEO 监控表（§3.4）—— 运营动作
GSC 手动「请求编入索引」+ 重新提交 sitemap（针对「已发现-尚未编入索引」）
内容差异化 —— 多个长尾页结构同模板，需增强独特性，降低 doorway 感知
外链 / 品牌冷启动（§9）—— 新域名权重的主要杠杆
部分规划长尾页尚未建（见 §6 标注）
```

## 0.3 实际上线 URL 清单（来自 seo-map）

可索引（19 个，进 sitemap）：

```txt
/                                         （首页 L1）
/tools/word  /tools/excel  /tools/pdf      （工具页 L2）
/is-it-safe                                （信任页 L2）
/about  /blog                              （L2）
/metadatakit-alternative                   （对比页 L2）
/ilovepdf-alternative
/smallpdf-alternative
/remove-pdf-metadata-without-acrobat       （指南页 L2）
/remove-metadata-before-sending
/remove-metadata-from-resume               （场景页 L2）
/remove-metadata-from-contract
/remove-metadata-from-legal-pdf
/remove-gps-exif-from-document-images
/remove-rsid-tracked-changes-word
/blog/remove-original-author-docx          （博文 L3）
/metadata-leak-study                       （研究 L3）
```

不索引（noindex，不进 sitemap）：

```txt
/editor   /batch   （应用功能页，robots 亦 disallow）
/privacy  /terms   （法务页）
```

---

# 1. 当前判断

## 1.1 已确认事项

根据当前情况，GA4 自测已经能看到用户，说明：

* GA4 / GTM 基础安装大概率正常；
* 页面访问事件可以被记录；
* 问题不主要出在 GA4 是否接入；
* 当前主要问题是：外部真实流量不足、搜索发现不足、GEO/AI Bot 抓取不可见、内容资产还不够强。

## 1.2 不能用 GA4 判断爬虫是否访问

GA4 主要用于记录真实浏览器用户行为，不适合判断搜索爬虫、AI Bot、GEO Bot 是否访问网站。

原因：

* 很多爬虫不会执行 GA4 JavaScript；
* GA4 会过滤部分已知 bot 和 spider；
* AI 搜索机器人访问页面时，不一定会触发 GA4；
* 即使 AI 工具引用了网页，也不一定表现为 GA4 实时用户。

因此，后续监控必须拆成四套系统：

```txt
GA4：监控真实用户与工具转化
GSC：监控 Google 索引、曝光、查询词
服务器日志：监控 Googlebot / Bingbot / OAI-SearchBot / PerplexityBot 等爬虫
人工 GEO 监控表：监控 ChatGPT / Perplexity / Gemini / Bing Copilot 是否引用
```

---

# 2. 90 天核心目标

## 2.1 总目标

把 MetaDocu 从一个普通 metadata 工具站，升级为：

```txt
一个可以被搜索引擎和 AI 搜索反复引用的 no-upload document metadata privacy 工具站。
```

核心表达：

```txt
MetaDocu scans and removes hidden metadata from Word, Excel, PDF and image files entirely inside your browser, without uploading your documents.
```

## 2.2 90 天结果目标

| 指标                     | 目标                                                       |
| ---------------------- | -------------------------------------------------------- |
| GSC 收录页面               | 30-50 个                                                  |
| GSC 长尾查询数              | 100+                                                     |
| 自然搜索曝光                 | 每周持续增长                                                   |
| Googlebot / Bingbot 访问 | 可在服务器日志看到                                                |
| AI Bot 访问              | 至少看到 OAI-SearchBot / PerplexityBot / Claude-SearchBot 之一 |
| 工具页到文件选择转化率            | 10%-20%                                                  |
| 扫描成功率                  | 80%+                                                     |
| 清理点击率                  | 35%+                                                     |
| 人工 GEO 测试引用率           | 50 个问题里至少 3-5 个出现 MetaDocu                               |

---

# 3. 监控体系设计

## 3.1 GA4：只看真实用户和转化

GA4 不用来看 GEO 爬虫，只看真实用户行为。

### 必须埋点事件

| 事件名                   | 触发时机      | 参数                                                   |
| --------------------- | --------- | ---------------------------------------------------- |
| `page_view`           | 页面访问      | `page_path`, `lang`                                  |
| `tool_page_view`      | 进入工具页     | `tool_type`                                          |
| `file_select`         | 用户选择或拖入文件 | `file_type`, `file_count`, `size_range`              |
| `scan_start`          | 开始扫描      | `tool_type`, `file_type`                             |
| `scan_success`        | 扫描完成      | `tool_type`, `file_type`, `risk_level`, `risk_count` |
| `scan_error`          | 扫描失败      | `tool_type`, `file_type`, `error_type`               |
| `risk_report_view`    | 风险报告展示    | `risk_level`, `risk_count`                           |
| `clean_click`         | 点击清理      | `tool_type`, `risk_level`                            |
| `clean_success`       | 清理成功      | `tool_type`, `removed_count`                         |
| `download_clean_file` | 下载清理后文件   | `file_type`, `risk_level`                            |
| `cta_click`           | 内容页点击工具入口 | `source_page`, `target_page`, `target_tool`          |
| `privacy_proof_click` | 点击隐私证明页   | `source_page`                                        |

### 禁止采集的数据

为了保持 MetaDocu 的隐私定位，不能采集：

```txt
文件名
文件正文
Author 原始值
Company 原始值
本地路径
GPS 坐标
邮箱
手机号
文档中的任何具体内容
```

### 可以采集的数据

```txt
文件类型：pdf / docx / xlsx / pptx / jpg / png
文件大小区间：0-1MB / 1-5MB / 5-20MB / 20MB+
风险等级：low / medium / high
风险字段数量
字段类别：author / company / timestamp / local_path / xmp / exif
工具类型
页面路径
```

---

## 3.2 GSC：看 Google 是否发现你

Search Console 是搜索可见性的主控台。

### 立刻检查

```txt
1. Domain Property 是否已验证
2. sitemap.xml 是否提交
3. 首页是否已索引
4. /tools/word 是否已索引
5. /tools/pdf 是否已索引
6. /tools/excel 是否已索引
7. /is-it-safe 是否已索引
8. Page indexing 是否有大量 excluded
9. Crawl stats 是否有 Googlebot 访问
10. Performance 是否已有 impressions
```

### 每周查看指标

| 指标               | 判断               |
| ---------------- | ---------------- |
| Impressions      | 是否开始被搜索触发        |
| Clicks           | 是否有自然流量          |
| CTR              | 标题和摘要是否有效        |
| Average position | 页面排名趋势           |
| Queries          | 长尾词覆盖情况          |
| Pages            | 哪些页面开始曝光         |
| Countries        | 是否有英文市场流量        |
| Devices          | 移动端表现            |
| Crawl stats      | Googlebot 是否持续抓取 |
| Indexing status  | 页面是否被索引          |

---

## 3.3 服务器日志：看 GEO / AI Bot 是否访问

必须单独加 Bot 访问日志。

### 需要监控的 Bot

| 类型                | User-Agent         |
| ----------------- | ------------------ |
| Google 搜索         | `Googlebot`        |
| Bing 搜索           | `Bingbot`          |
| OpenAI 搜索         | `OAI-SearchBot`    |
| ChatGPT 用户触发访问    | `ChatGPT-User`     |
| OpenAI 训练爬虫       | `GPTBot`           |
| Anthropic 搜索      | `Claude-SearchBot` |
| Claude 用户触发访问     | `Claude-User`      |
| Anthropic 训练爬虫    | `ClaudeBot`        |
| Perplexity 搜索     | `PerplexityBot`    |
| Perplexity 用户触发访问 | `Perplexity-User`  |
| Apple 搜索          | `Applebot`         |
| Common Crawl      | `CCBot`            |
| DuckDuckGo        | `DuckDuckBot`      |
| Yandex            | `YandexBot`        |
| 百度                | `Baiduspider`      |

### Next.js middleware 示例

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const BOT_PATTERN =
  /(Googlebot|Bingbot|OAI-SearchBot|ChatGPT-User|GPTBot|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|Applebot|CCBot|DuckDuckBot|YandexBot|Baiduspider)/i

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent') || ''
  const match = ua.match(BOT_PATTERN)

  if (match) {
    const log = {
      type: 'bot_visit',
      bot: match[1],
      ua,
      path: req.nextUrl.pathname,
      search: req.nextUrl.search,
      referer: req.headers.get('referer') || '',
      ts: new Date().toISOString(),
    }

    console.log(JSON.stringify(log))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
```

### 日志字段

| 字段             | 说明               |
| -------------- | ---------------- |
| `bot`          | 识别出的爬虫名称         |
| `ua`           | 完整 User-Agent    |
| `path`         | 访问路径             |
| `search`       | URL query        |
| `referer`      | 来源               |
| `ts`           | 访问时间             |
| `status`       | HTTP 状态码，建议后续补充  |
| `country`      | 如果部署平台支持，可以记录国家  |
| `cache_status` | 如果用 CDN，可以记录缓存状态 |

### 每日检查

```txt
是否访问 robots.txt
是否访问 sitemap.xml
是否访问首页
是否访问 /tools/word
是否访问 /tools/pdf
是否访问 /is-it-safe
是否出现 404 / 500
是否只抓静态资源，不抓页面
```

---

## 3.4 人工 GEO 监控表

不要等工具自动告诉你。每周固定测试 50 个问题。

### 平台

```txt
Google Search
Google AI Overview / AI Mode
ChatGPT Search
Perplexity
Gemini
Bing Copilot
Claude Search
```

### 查询池

#### 安全类

```txt
is it safe to remove metadata online
is it safe to upload a document to a metadata remover
how to remove metadata without uploading files
how to check document metadata without uploading
best no upload metadata remover
browser local metadata cleaner
local document metadata cleaner
```

#### Word 类

```txt
how to remove author from Word document
remove last modified by from Word document
can Word documents reveal previous editor
remove company name from Word metadata
remove template path from Word document
what are RSID tags in Word documents
remove hidden comments and revisions from Word
```

#### PDF 类

```txt
how to remove author from PDF without uploading
remove PDF XMP metadata
does PDF keep Word author after conversion
how to check PDF metadata safely
remove PDF producer and creator metadata
PDF metadata cleaner no upload
```

#### Excel 类

```txt
remove author from Excel workbook
remove company name from Excel file
does Excel metadata reveal company name
clean Excel workbook properties before sharing
batch remove Excel metadata
```

#### 场景类

```txt
remove metadata from resume before applying
can a recruiter see Word document author
remove metadata before sending contract
clean document metadata before sending to client
metadata cleaner for lawyers
metadata cleaner for journalists
metadata cleaner for freelancers
```

### 监控表字段

| 字段                  | 示例                                      |
| ------------------- | --------------------------------------- |
| Date                | 2026-06-29                              |
| Query               | how to remove author from Word document |
| Platform            | ChatGPT Search                          |
| Country             | US                                      |
| Language            | English                                 |
| AI answer appeared? | Yes / No                                |
| MetaDocu appeared?  | Yes / No                                |
| MetaDocu cited?     | Yes / No                                |
| Cited URL           | `/remove-author-from-word-document`     |
| Organic rank        | 8                                       |
| Competitors cited   | Adobe / PDF24 / Metadata2Go             |
| Missing angle       | No-upload proof missing                 |
| Next action         | Add verification section                |

---

# 4. 技术可发现性优化

## 4.1 robots.txt 建议

目标：允许搜索和 AI 搜索抓取核心页面，同时可以选择阻止训练型爬虫。

推荐配置：

```txt
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Applebot
Allow: /

# 可选：如果只想做 AI 搜索曝光，不希望训练型爬虫抓取
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: https://metadocu.com/sitemap.xml
```

注意：

* 不要误封 `/tools/word`、`/tools/pdf`、`/is-it-safe` 等核心页面；
* 不要把核心内容放在需要登录、点击后才出现、JS 交互后才加载的位置；
* 上传工具可以是交互式，但页面核心文字必须 SSR / SSG 输出在 HTML 中。

---

## 4.2 sitemap.xml 必须包含的页面

> ✅ **已实现**：sitemap 由 `app/sitemap.ts` 从 `seo-map` 的 `getPublishedPages()` 自动生成——新增可索引页会自动进 sitemap，无需手动维护此清单。实际进 sitemap 的 19 个 URL 见 **§0.3**。
>
> 注意：`/privacy` 为 noindex，**不**在 sitemap 内（本节 v1.0 原清单把它列入是错误的）。下方原规划 URL 中，多数已用**不同命名**的实际页面承接：

```txt
原规划 URL                                  → 实际承接页（或状态）
/remove-author-from-word-document          → /blog/remove-original-author-docx（已上线）
/remove-pdf-author-online-no-upload        → /remove-pdf-metadata-without-acrobat（已上线）
/remove-pdf-xmp-metadata                   → /remove-pdf-metadata-without-acrobat（含 XMP，已上线）
/remove-metadata-before-sending-file       → /remove-metadata-before-sending（已上线）
/remove-metadata-from-resume               → /remove-metadata-from-resume（已上线）
/remove-metadata-from-contract             → /remove-metadata-from-contract（已上线）
/remove-company-from-word-document         → 未建（可作为 /tools/word 下的 H3，避免与现有页内耗）
/remove-last-modified-by-word              → 未建（同上，建议并入 /remove-rsid-tracked-changes-word）
/remove-excel-company-metadata             → 未建（可作为 /tools/excel 下的 H3）
/local-processing-proof                    → 未建（/is-it-safe 已覆盖「不上传」论证）
/how-to-verify-no-upload                   → 未建（/is-it-safe 已含 DevTools 验证）
/check-document-metadata-without-uploading → 未建
/local-vs-upload-metadata-remover          → 未建（对比意图已由 *-alternative 页部分承接）
/browser-local-metadata-cleaner           → 未建
/metadata-risk-report                      → 未建
```

---

## 4.3 页面 HTML 检查

每个核心页面都要检查：

```txt
title 是否唯一
description 是否唯一
H1 是否只有一个
正文是否 SSR/SSG 可见
工具入口是否是普通按钮或链接
内部链接是否是 <a href="">
canonical 是否正确
语言标记是否正确
OpenGraph 是否完整
页面是否返回 200
是否存在 noindex
是否被 robots 禁止
```

### 关键页面标题建议

| 页面                        | Title                                                                           |
| ------------------------- | ------------------------------------------------------------------------------- |
| 首页                        | `MetaDocu — Clean Hidden Document Metadata Without Uploading Files`             |
| `/tools/word`             | `Word Metadata Scanner & Cleaner — Remove Author, Company and RSID Locally`     |
| `/tools/pdf`              | `PDF Metadata Scanner & Cleaner — Remove Author, Producer and XMP Locally`      |
| `/tools/excel`            | `Excel Metadata Scanner & Cleaner — Remove Author and Company Metadata Locally` |
| `/is-it-safe`             | `Is MetaDocu Safe? How Browser-Local Metadata Cleaning Works`                   |
| `/local-processing-proof` | `How to Verify MetaDocu Never Uploads Your Files`                               |

---

# 5. 内容优化方案

## 5.1 首页优化

首页需要更像一个“答案入口”，不是单纯工具入口。

### 推荐首屏文案

```txt
Clean Hidden Metadata From Documents Without Uploading Them

MetaDocu scans and removes hidden author names, company fields, local paths, RSIDs, PDF XMP data, timestamps and image EXIF from Word, Excel, PDF and image files — entirely inside your browser.
```

### 首页新增模块

#### 模块 1：Sample Risk Report

```txt
Risk Level: High
7 hidden metadata risks found
3 identity fields detected
2 timeline fields detected
1 local path detected
1 embedded EXIF item detected
```

#### 模块 2：Before / After

| Before                     | After   |
| -------------------------- | ------- |
| Author: John Smith         | Removed |
| Company: Acme Corp         | Removed |
| Template: C:\Users\john... | Removed |
| PDF Producer: Word 16.0    | Removed |
| GPSLatitude: Detected      | Removed |

#### 模块 3：Who uses MetaDocu?

| 用户               | 场景                |
| ---------------- | ----------------- |
| Job seekers      | 投递简历前移除作者、公司、模板路径 |
| Lawyers          | 发送合同前移除审阅痕迹和内部字段  |
| Journalists      | 保护文件来源和图片 GPS 信息  |
| Freelancers      | 给客户交付文件前移除个人机器信息  |
| Compliance teams | 批量扫描敏感文件元数据风险     |

---

## 5.2 工具页重构

当前最重要的是重构：

```txt
/tools/word
/tools/pdf
/tools/excel
```

不要让工具页只是上传组件。每个工具页必须变成：

```txt
工具入口 + 问题答案 + 风险字段表 + 清理步骤 + 验证方法 + FAQ
```

---

## 5.3 `/tools/word` 页面结构

### H1

```txt
Word Metadata Scanner & Cleaner — Remove Author, Company, RSID and Hidden Review Data Locally
```

### 首屏短答案

```txt
MetaDocu scans and removes hidden Word document metadata including author, last modified by, company, template path, RSID, comments, tracked-change data and embedded image EXIF — 100% inside your browser, without uploading the file.
```

### 字段表

| Field               | Risk       | Where it exists     | MetaDocu action |
| ------------------- | ---------- | ------------------- | --------------- |
| Author              | 暴露真实姓名     | `docProps/core.xml` | 清空              |
| Last Modified By    | 暴露最后编辑者    | `cp:lastModifiedBy` | 清空              |
| Company             | 暴露公司/雇主    | `docProps/app.xml`  | 清空              |
| Template Path       | 暴露本地路径/用户名 | extended properties | 移除              |
| RSID                | 关联编辑会话     | Word XML nodes      | 删除              |
| Comments            | 暴露审阅意见     | comments.xml        | 删除              |
| Tracked changes     | 暴露修改历史     | document.xml        | 删除              |
| Embedded image EXIF | 暴露图片来源/GPS | media files         | 清理 EXIF         |

### FAQ

```txt
Can Word documents reveal the original author?
Can Word metadata show the company name?
What is Last Modified By in Word?
What are RSID tags?
Does removing metadata change the document content?
Can comments and tracked changes still expose private information?
Can I clean Word metadata without uploading the file?
How can I verify the metadata is gone?
```

---

## 5.4 `/tools/pdf` 页面结构

### H1

```txt
PDF Metadata Scanner & Cleaner — Remove Author, Producer, Creator and XMP Locally
```

### 必须覆盖的问题

```txt
PDF metadata 存在哪里？
PDF Info Dictionary 是什么？
PDF XMP metadata 是什么？
为什么清理 Author 还不够？
Word 转 PDF 后是否会带作者和公司信息？
清理 PDF metadata 是否影响数字签名？
如何验证 PDF metadata 已经删除？
为什么 no-upload PDF cleaner 更适合敏感文件？
```

### 字段表

| Field               | Risk    | Location        | MetaDocu action |
| ------------------- | ------- | --------------- | --------------- |
| Author              | 暴露作者    | PDF Info        | 清空              |
| Creator             | 暴露来源软件  | PDF Info        | 清空              |
| Producer            | 暴露生成工具  | PDF Info        | 清空              |
| CreationDate        | 暴露创建时间  | PDF Info / XMP  | 清空              |
| ModDate             | 暴露修改时间  | PDF Info / XMP  | 清空              |
| XMP metadata        | 隐藏重复元数据 | XMP stream      | 移除              |
| Embedded image EXIF | 暴露图片来源  | embedded images | 清理              |

---

## 5.5 `/tools/excel` 页面结构

### H1

```txt
Excel Metadata Scanner & Cleaner — Remove Workbook Author, Company and Hidden Properties Locally
```

### 必须覆盖的问题

```txt
Excel workbook 会泄露哪些 metadata？
Excel 是否会暴露公司名称？
Excel metadata 是否会影响公式和图表？
清理 workbook properties 是否改变 sheet 内容？
如何批量清理 Excel 文件？
如何验证 Excel metadata 已经删除？
```

### 字段表

| Field             | Risk   | Location        | MetaDocu action |
| ----------------- | ------ | --------------- | --------------- |
| Author            | 暴露作者   | core properties | 清空              |
| Last Modified By  | 暴露编辑者  | core properties | 清空              |
| Company           | 暴露组织   | app properties  | 清空              |
| Manager           | 暴露管理者  | app properties  | 清空              |
| Created Time      | 暴露时间线  | core properties | 清空              |
| Modified Time     | 暴露时间线  | core properties | 清空              |
| Custom Properties | 暴露内部字段 | custom.xml      | 移除              |

---

# 6. 新增页面计划

> 状态说明：本节为 v1.0 原始规划。多数 P0 意图已由**不同命名**的实际页面承接（见 §0.3 / §4.2）。下表已补「实际状态」列。

## 6.1 第 1 周必须上线

| URL（规划）                                    | 目的                   | 优先级 | 实际状态 |
| -------------------------------------------- | -------------------- | --- | ---- |
| `/local-processing-proof`                    | 证明文件不上传              | P0  | ✅ 已由 `/is-it-safe` 覆盖 |
| `/how-to-verify-no-upload`                   | 教用户用 DevTools 验证无上传  | P0  | ✅ 已并入 `/is-it-safe` |
| `/check-document-metadata-without-uploading` | 承接 no-upload 查询      | P0  | ⬜ 未建 |
| `/remove-author-from-word-document`          | 承接 Word author 长尾词   | P0  | ✅ `/blog/remove-original-author-docx` |
| `/remove-pdf-author-online-no-upload`        | 承接 PDF no-upload 长尾词 | P0  | ✅ `/remove-pdf-metadata-without-acrobat` |

---

## 6.2 第 2-4 周上线

| URL（规划）                              | 搜索意图          | 实际状态 |
| -------------------------------------- | ------------- | ---- |
| `/remove-company-from-word-document`   | 删除 Word 公司字段  | ⬜ 未建（建议并入 `/tools/word` H3） |
| `/remove-last-modified-by-word`        | 删除最后修改者       | ⬜ 未建（建议并入 `/remove-rsid-tracked-changes-word`） |
| `/remove-pdf-xmp-metadata`             | 删除 PDF XMP    | ✅ 由 `/remove-pdf-metadata-without-acrobat` 覆盖 |
| `/remove-excel-company-metadata`       | 删除 Excel 公司字段 | ⬜ 未建（建议并入 `/tools/excel` H3） |
| `/remove-metadata-before-sending-file` | 文件发送前清理       | ✅ `/remove-metadata-before-sending` |
| `/remove-metadata-from-resume`         | 简历投递场景        | ✅ `/remove-metadata-from-resume` |
| `/remove-metadata-from-contract`       | 合同发送场景        | ✅ `/remove-metadata-from-contract` |
| `/local-vs-upload-metadata-remover`    | 本地处理 vs 上传工具  | 🟡 部分由 `*-alternative` 对比页承接 |
| `/browser-local-metadata-cleaner`      | 浏览器本地工具       | ⬜ 未建 |
| `/metadata-risk-report`                | 风险报告解释        | ⬜ 未建 |

> 此外，实际已上线但本文档未规划的页面：`/metadatakit-alternative`、`/ilovepdf-alternative`、`/smallpdf-alternative`、`/remove-metadata-from-legal-pdf`、`/remove-gps-exif-from-document-images`、`/remove-rsid-tracked-changes-word`、`/metadata-leak-study`。

---

## 6.3 页面统一模板

所有长尾问题页都按这个结构写：

```md
# H1：直接命中问题

Short answer:
2-3 句话直接回答用户问题。

## What hidden metadata can be exposed?
字段表。

## How to remove it locally
步骤。

## How to verify it is gone
验证方式。

## Why no-upload matters
解释上传型工具风险。

## Try MetaDocu
工具入口。

## FAQ
8-10 个真实问题。
```

---

# 7. 最重要的新页面：Local Processing Proof

## URL

```txt
/local-processing-proof
```

## 页面标题

```txt
How to Verify MetaDocu Never Uploads Your Files
```

## 页面正文建议

```md
# How to Verify MetaDocu Never Uploads Your Files

Short answer:
MetaDocu processes documents inside your browser. Your file bytes are read locally, scanned locally, cleaned locally, and downloaded locally. No document upload request is made.

## What happens after you drop a file

1. Your browser reads the file from your local disk.
2. MetaDocu scans metadata in browser memory.
3. Sensitive fields are listed in a local risk report.
4. The cleaned file is generated as a browser download.
5. The original document is never uploaded to a server.

## How to verify with Chrome DevTools

1. Open Chrome DevTools.
2. Go to the Network tab.
3. Clear existing network records.
4. Drop a sample document into MetaDocu.
5. Confirm that no file upload request appears.
6. Check that no document bytes, file names, or extracted metadata values are sent.

## What network requests may still appear

MetaDocu may still load normal website resources such as:

- JavaScript bundles
- CSS files
- analytics scripts
- static assets

These requests should not contain:

- document bytes
- document content
- file names
- author names
- company names
- local paths
- GPS coordinates

## Airplane mode test

You can load MetaDocu once, disconnect from the internet, and then test local scanning with a supported file. If the page and required assets are already loaded, the metadata scan can run in your browser without uploading the file.

## Limitations

Some files may not be fully processed:

- encrypted files
- corrupted files
- password-protected files
- digitally signed PDFs
- unsupported formats
- very large files that exceed browser memory limits
```

---

# 8. 内链结构

网站要形成一个清晰主题网络。

```txt
Home
 ├── Is it safe?
 ├── Local processing proof
 ├── Tools
 │    ├── Word metadata cleaner
 │    ├── Excel metadata cleaner
 │    └── PDF metadata cleaner
 ├── Scenarios
 │    ├── Resume metadata removal
 │    ├── Contract metadata removal
 │    ├── Journalist metadata protection
 │    └── Freelancer file delivery
 ├── Guides
 │    ├── Remove author from Word
 │    ├── Remove company from Excel
 │    ├── Remove XMP from PDF
 │    └── Check metadata without uploading
 └── Research
      ├── Metadata leakage report
      └── Metadata fields database
```

每个页面底部都要固定放：

```txt
Check metadata without uploading
Is MetaDocu safe?
Word metadata cleaner
PDF metadata cleaner
Local vs upload metadata remover
```

---

# 9. 外部冷启动计划

现在没有用户，不能只等 Google 和 GEO 爬虫自然发现。必须主动做冷启动。

## 9.1 工具目录提交

优先提交：

```txt
Product Hunt
AlternativeTo
SaaSHub
BetaList
Microlaunch
Uneed
Futurepedia
There's An AI For That
Indie Hackers
Hacker News Show HN
Dev.to
Hashnode
Medium
```

## 9.2 提交文案

### 标题

```txt
MetaDocu — Clean hidden document metadata without uploading files
```

### 一句话介绍

```txt
A browser-local privacy scanner for Word, Excel, PDF and image metadata. No file upload, no account, no server-side document processing.
```

### 长描述

```txt
MetaDocu helps users scan and clean hidden metadata from Word, Excel, PDF and image files before sharing them. It detects privacy-sensitive fields such as author names, company fields, last modified by, local paths, timestamps, PDF XMP data and image EXIF. Files are processed locally inside the browser, so documents are not uploaded to a server.
```

---

## 9.3 社区内容选题

不要硬广。发实用内容，最后带工具。

### 文章标题

```txt
How Word documents can leak your name and company before you send them
How to verify a metadata remover does not upload your file
I built a browser-local metadata privacy scanner for Word, Excel and PDF files
Before sending a resume, check these hidden Word fields
PDF metadata is not just Author and Title — XMP can still expose data
Why no-upload metadata cleaning matters for contracts and resumes
```

### 适合平台

```txt
Reddit r/privacy
Reddit r/cybersecurity
Reddit r/webdev
Reddit r/freelance
Reddit r/jobs
Hacker News
Indie Hackers
Dev.to
Hashnode
Medium
LinkedIn
X
```

---

# 10. 90 天执行排期

## 第 1 周：基础监控 + 核心页面

### 任务

```txt
确认 GA4 自测正常
接入 GSC
提交 sitemap
检查 robots.txt
加 Bot middleware
重构 /tools/word
重构 /tools/pdf
重构 /tools/excel
上线 /local-processing-proof
上线 /how-to-verify-no-upload
上线 /check-document-metadata-without-uploading
```

### 验收标准

```txt
GA4 能看到 page_view
GA4 能看到 file_select
GSC 能验证首页
sitemap 已提交
server log 能看到 bot_visit 结构化日志
3 个工具页有字段表、步骤、FAQ
local-processing-proof 页面上线
```

---

## 第 2 周：长尾页面

### 任务

```txt
上线 /remove-author-from-word-document
上线 /remove-company-from-word-document
上线 /remove-last-modified-by-word
上线 /remove-pdf-author-online-no-upload
上线 /remove-pdf-xmp-metadata
```

### 验收标准

```txt
所有页面进入 sitemap
所有页面可被 URL Inspection 抓取
每页有 Short answer
每页有风险字段表
每页有工具 CTA
```

---

## 第 3-4 周：场景页 + 对比页

### 任务

```txt
上线 /remove-excel-company-metadata
上线 /remove-metadata-before-sending-file
上线 /remove-metadata-from-resume
上线 /remove-metadata-from-contract
上线 /local-vs-upload-metadata-remover
上线 /browser-local-metadata-cleaner
上线 /metadata-risk-report
```

### 验收标准

```txt
GSC 开始出现部分 impressions
Googlebot 访问 sitemap 或页面
内容页到工具页 CTA 有点击
工具页有 file_select 事件
```

---

## 第 5-8 周：外部冷启动

### 任务

```txt
提交 10 个工具目录
发布 5 篇外部实用文章
发 3 个社区讨论帖
根据 GSC 查询词补页面
根据 GA4 漏斗优化工具页 CTA
```

### 验收标准

```txt
出现 referral 流量
GSC query 数开始增加
部分长尾页面有曝光
工具页访问增加
file_select 事件开始出现自然流量来源
```

---

## 第 9-12 周：权威资产

### 任务

```txt
制作 metadata fields database
制作 Document Metadata Leakage Report
增加 sample risk report 页面
增加 before/after verification 页面
整理 FAQ hub
```

### 验收标准

```txt
收录页面 30+
长尾查询 100+
自然搜索持续曝光
人工 GEO 监控中开始出现 MetaDocu
至少一种 AI Bot 出现在日志中
```

---

# 11. 每周复盘模板

```md
# MetaDocu Weekly GEO Review

Week:
Date range:

## 1. GA4 用户行为

- Total users:
- New users:
- Tool page views:
- File select:
- Scan success:
- Clean click:
- Download clean file:
- Top landing pages:
- Top traffic sources:

## 2. GSC 搜索表现

- Total impressions:
- Total clicks:
- CTR:
- Average position:
- New queries:
- Top growing queries:
- Top pages:
- Indexed pages:
- Excluded pages:

## 3. Bot 访问日志

- Googlebot last seen:
- Bingbot last seen:
- OAI-SearchBot last seen:
- ChatGPT-User last seen:
- PerplexityBot last seen:
- Claude-SearchBot last seen:
- Applebot last seen:
- Sitemap accessed? Yes / No
- Robots accessed? Yes / No
- 404 / 500 issues:

## 4. 人工 GEO 测试

- Tested queries:
- MetaDocu appeared:
- MetaDocu cited:
- Best query:
- Worst query:
- Competitors cited:
- Missing content:

## 5. 下周动作

1.
2.
3.
```

---

# 12. 优先级总表

## P0：必须立刻做

```txt
确认 GA4 事件完整
接入 GSC 并提交 sitemap
配置 robots.txt
加 Bot middleware
重构 Word / PDF / Excel 工具页
上线 local-processing-proof
上线 how-to-verify-no-upload
上线 check-document-metadata-without-uploading
```

## P1：两周内完成

```txt
上线 remove-author-from-word-document
上线 remove-company-from-word-document
上线 remove-pdf-author-online-no-upload
上线 remove-pdf-xmp-metadata
上线 remove-excel-company-metadata
建立每周 GEO 人工监控表
建立 GA4 工具漏斗看板
```

## P2：一个月内完成

```txt
上线 resume / contract 场景页
上线 local-vs-upload 对比页
提交工具目录
发外部社区内容
根据 GSC 查询词扩页面
```

## P3：三个月内完成

```txt
Document Metadata Leakage Report
Metadata Fields Database
Sample Risk Report
Before / After Verification 页面
行业场景页：lawyers / journalists / freelancers / job seekers
```

---

# 13. 最终判断

当前 GA4 自测有用户，说明追踪基础没问题。

现在没有用户、没有 GEO 抓取，核心不是 GA4 问题，而是：

```txt
搜索发现不足
内容资产不足
外部入口不足
Bot 日志缺失
GEO 监控方式不对
```

下一步必须从“看 GA4 实时”转为完整闭环：

```txt
GA4 看真实用户
GSC 看索引和曝光
服务器日志看爬虫
人工问题池看 AI 引用
内容页和外部入口做冷启动
工具漏斗看转化
```

执行顺序：

```txt
1. GSC + sitemap + robots
2. Bot middleware
3. GA4 工具事件
4. 重构工具页
5. 上线 local-processing-proof
6. 上线 10 个长尾问题页
7. 提交工具目录和社区冷启动
8. 每周用 GSC + GA4 + Bot log + 人工 GEO 表复盘
```

MetaDocu 后续能不能做起来，关键不在于“有没有接 GA4”，而在于是否能让搜索引擎和 AI 搜索明确理解：

```txt
MetaDocu 是一个不用上传文件、在浏览器本地扫描并清理文档隐藏元数据风险的隐私工具。
```

只要这个认知被页面、内链、外部内容、搜索索引和用户行为反复强化，GEO 才会逐步起来。
