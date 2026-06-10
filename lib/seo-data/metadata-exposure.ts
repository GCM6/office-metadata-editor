/**
 * D3 — the "unique data base" (per v2.md §D3 / §C structured dataset).
 *
 * A structured, factual map of: document format × hidden metadata field ×
 * what it exposes × how MetaDocu removes it. This is the single source that
 * powers the trust page's exposure table and (later) the per-scenario pages,
 * so every derived page carries Google-recognized unique value rather than a
 * thin shell. It is also an ideal answer-engine (GEO) citation surface.
 *
 * Bilingual by design (en + zh) so both locales render first-class content.
 * Facts reflect the real OOXML / PDF / embedded-EXIF structures MetaDocu parses.
 */

export type ExposureFormat = "docx" | "xlsx" | "pdf" | "image"

export type ExposureRisk = "high" | "medium" | "low"

export interface LocalizedText {
  en: string
  zh: string
}

export interface MetadataExposureField {
  /** Stable id (used as React key and for future per-field scenario pages). */
  id: string
  /** Which document families carry this field. "image" = images embedded inside OOXML files. */
  formats: ExposureFormat[]
  /** Human-readable field name. */
  field: LocalizedText
  /** Where it physically lives — the technical key/location. */
  technicalKey: string
  /** What this field can leak about you or your organization. */
  exposes: LocalizedText
  risk: ExposureRisk
  /** How MetaDocu removes/neutralizes it (always 100% local, in-browser). */
  removal: LocalizedText
}

export const METADATA_EXPOSURE_FIELDS: MetadataExposureField[] = [
  {
    id: "creator",
    formats: ["docx", "xlsx", "pdf"],
    field: { en: "Author / Creator", zh: "作者 / 创建者" },
    technicalKey: "dc:creator · PDF /Author",
    exposes: {
      en: "The real name (or Office sign-in name) of whoever first created the file — often your full legal name.",
      zh: "首次创建文件者的真实姓名（或 Office 登录名）——往往就是你的真名。",
    },
    risk: "high",
    removal: {
      en: "Cleared from the OOXML core properties / PDF Info dictionary in browser memory; the field is emptied, not just hidden.",
      zh: "在浏览器内存中从 OOXML 核心属性 / PDF Info 字典里清空，是真正置空而非界面隐藏。",
    },
  },
  {
    id: "lastModifiedBy",
    formats: ["docx", "xlsx"],
    field: { en: "Last Modified By", zh: "最后修改者" },
    technicalKey: "cp:lastModifiedBy",
    exposes: {
      en: "The name of the last person to save the file — exposes internal reviewers and collaboration chains.",
      zh: "最后保存文件者的姓名——暴露内部审阅者与协作链路。",
    },
    risk: "high",
    removal: {
      en: "Stripped from the core properties XML so no editor identity remains.",
      zh: "从核心属性 XML 中剥离，不留任何编辑者身份。",
    },
  },
  {
    id: "company",
    formats: ["docx", "xlsx"],
    field: { en: "Company", zh: "公司" },
    technicalKey: "Company (app.xml)",
    exposes: {
      en: "The organization name baked in from your Office licence — reveals your employer even on a personal document.",
      zh: "由 Office 授权信息写入的组织名称——即便是个人文档也会暴露你所属的公司。",
    },
    risk: "medium",
    removal: {
      en: "Removed from the extended (app) properties part.",
      zh: "从扩展（app）属性部件中移除。",
    },
  },
  {
    id: "manager",
    formats: ["docx", "xlsx"],
    field: { en: "Manager", zh: "管理者" },
    technicalKey: "Manager (app.xml)",
    exposes: {
      en: "The manager name some templates embed — leaks your reporting line.",
      zh: "部分模板会写入的管理者姓名——泄露你的汇报关系。",
    },
    risk: "medium",
    removal: {
      en: "Cleared from the extended properties.",
      zh: "从扩展属性中清空。",
    },
  },
  {
    id: "template",
    formats: ["docx", "xlsx"],
    field: { en: "Template path", zh: "模板路径" },
    technicalKey: "Template (app.xml)",
    exposes: {
      en: "An absolute file path to the template (e.g. C:\\Users\\<you>\\…) — leaks your account name and local folder layout.",
      zh: "模板的绝对路径（如 C:\\Users\\<你>\\…）——泄露你的账户名与本地目录结构。",
    },
    risk: "high",
    removal: {
      en: "Path is wiped so no local filesystem clue ships with the file.",
      zh: "清除路径，文件不再携带任何本地文件系统线索。",
    },
  },
  {
    id: "application",
    formats: ["docx", "xlsx", "pdf"],
    field: { en: "Application & version", zh: "所用软件与版本" },
    technicalKey: "Application/AppVersion · PDF /Producer · /Creator",
    exposes: {
      en: "The exact software and version used — a fingerprint for targeting known vulnerabilities or deanonymizing authors.",
      zh: "所用软件及精确版本——可作为指纹用于针对已知漏洞或对作者去匿名化。",
    },
    risk: "low",
    removal: {
      en: "Normalized/removed from app properties and the PDF Producer/Creator fields.",
      zh: "从 app 属性及 PDF Producer/Creator 字段中归一化或移除。",
    },
  },
  {
    id: "revision",
    formats: ["docx", "xlsx"],
    field: { en: "Revision number", zh: "修订次数" },
    technicalKey: "cp:revision",
    exposes: {
      en: "How many times the file was saved — hints at how heavily a 'final' document was reworked.",
      zh: "文件被保存的次数——暗示一份「终稿」实际被反复改了多少遍。",
    },
    risk: "low",
    removal: {
      en: "Reset in the core properties.",
      zh: "在核心属性中重置。",
    },
  },
  {
    id: "totalTime",
    formats: ["docx", "xlsx"],
    field: { en: "Total editing time", zh: "累计编辑时长" },
    technicalKey: "TotalTime (app.xml)",
    exposes: {
      en: "Cumulative minutes spent editing — can contradict claims about when/how long work was done.",
      zh: "累计编辑分钟数——可能与「何时、花多久完成」的说法相矛盾。",
    },
    risk: "low",
    removal: {
      en: "Zeroed out in the extended properties.",
      zh: "在扩展属性中清零。",
    },
  },
  {
    id: "timestamps",
    formats: ["docx", "xlsx", "pdf"],
    field: { en: "Created / Modified dates", zh: "创建 / 修改时间" },
    technicalKey: "dcterms:created/modified · PDF /CreationDate /ModDate",
    exposes: {
      en: "Precise creation and last-edit timestamps — builds a timeline of your activity.",
      zh: "精确的创建与最后编辑时间戳——可拼出你的活动时间线。",
    },
    risk: "medium",
    removal: {
      en: "Removed or reset so no editing timeline leaks.",
      zh: "移除或重置，不泄露编辑时间线。",
    },
  },
  {
    id: "titleSubject",
    formats: ["docx", "xlsx", "pdf"],
    field: { en: "Title / Subject / Keywords", zh: "标题 / 主题 / 关键字" },
    technicalKey: "dc:title, dc:subject, cp:keywords · PDF /Title /Subject /Keywords",
    exposes: {
      en: "Internal codenames, client names, or tags left in the properties even when not shown in the document text.",
      zh: "属性里残留的内部代号、客户名或标签——即便正文中并不显示。",
    },
    risk: "medium",
    removal: {
      en: "Cleared from both OOXML properties and the PDF Info dictionary.",
      zh: "从 OOXML 属性与 PDF Info 字典中一并清空。",
    },
  },
  {
    id: "rsid",
    formats: ["docx"],
    field: { en: "Revision save IDs (RSID)", zh: "修订会话 ID（RSID）" },
    technicalKey: "w:rsid in settings.xml + run-level rsids",
    exposes: {
      en: "Random per-editing-session IDs that let two documents be linked to the same author/machine across files.",
      zh: "每次编辑会话生成的随机 ID——可把两份文档关联到同一作者/机器。",
    },
    risk: "medium",
    removal: {
      en: "RSID nodes are physically stripped from the document XML, breaking cross-file correlation.",
      zh: "从文档 XML 中物理剥离 RSID 节点，切断跨文件关联。",
    },
  },
  {
    id: "trackChanges",
    formats: ["docx"],
    field: { en: "Tracked changes & comments", zh: "修订痕迹与批注" },
    technicalKey: "w:ins/w:del, comments.xml, people.xml",
    exposes: {
      en: "Deleted text, internal review notes and commenter names that survive inside the file after 'accepting all'.",
      zh: "被删除的文字、内部审阅意见与批注者姓名——即便「接受所有修订」后仍残留在文件内。",
    },
    risk: "high",
    removal: {
      en: "Comment and revision parts are removed so no hidden review history ships.",
      zh: "移除批注与修订部件，不再携带隐藏的审阅历史。",
    },
  },
  {
    id: "customProps",
    formats: ["docx", "xlsx"],
    field: { en: "Custom properties", zh: "自定义属性" },
    technicalKey: "custom.xml",
    exposes: {
      en: "Bespoke fields added by DMS/templates (matter numbers, classifications, internal IDs).",
      zh: "由文档系统/模板写入的自定义字段（案号、密级、内部 ID 等）。",
    },
    risk: "medium",
    removal: {
      en: "The custom properties part is cleared.",
      zh: "清空自定义属性部件。",
    },
  },
  {
    id: "pdfXmp",
    formats: ["pdf"],
    field: { en: "XMP metadata stream", zh: "XMP 元数据流" },
    technicalKey: "/Metadata XMP packet (xmpMM:DocumentID, InstanceID, History)",
    exposes: {
      en: "A second copy of author/tool data plus document/instance IDs that survive even when the Info dictionary is cleared.",
      zh: "作者/工具数据的「第二副本」，外加文档/实例 ID——即便清了 Info 字典它仍残留。",
    },
    risk: "high",
    removal: {
      en: "The XMP packet is removed alongside the Info dictionary so no duplicate metadata remains.",
      zh: "连同 Info 字典一并移除 XMP 包，不留重复元数据。",
    },
  },
  {
    id: "exifCamera",
    formats: ["image"],
    field: { en: "Image EXIF (camera & software)", zh: "图片 EXIF（相机与软件）" },
    technicalKey: "EXIF Make/Model/Software/DateTimeOriginal in embedded images",
    exposes: {
      en: "Camera make/model, capture time and editing software of photos embedded in the document.",
      zh: "文档中嵌入图片的相机型号、拍摄时间与修图软件。",
    },
    risk: "medium",
    removal: {
      en: "EXIF segments are byte-stripped from embedded images while keeping the picture intact.",
      zh: "在保持图像不变的前提下，从嵌入图片中按字节剥离 EXIF 段。",
    },
  },
  {
    id: "exifGps",
    formats: ["image"],
    field: { en: "Image GPS coordinates", zh: "图片 GPS 坐标" },
    technicalKey: "EXIF GPSLatitude/GPSLongitude in embedded images",
    exposes: {
      en: "The exact latitude/longitude where a photo was taken — can pinpoint your home or office.",
      zh: "照片拍摄地的精确经纬度——可定位到你的住所或办公室。",
    },
    risk: "high",
    removal: {
      en: "GPS EXIF tags are wiped so no location ships with the file.",
      zh: "清除 GPS EXIF 标签，文件不再携带任何位置信息。",
    },
  },
]

/** All formats present in the dataset, in display order. */
export const EXPOSURE_FORMATS: ExposureFormat[] = ["docx", "xlsx", "pdf", "image"]

export const EXPOSURE_FORMAT_LABELS: Record<ExposureFormat, LocalizedText> = {
  docx: { en: "Word (.docx)", zh: "Word (.docx)" },
  xlsx: { en: "Excel (.xlsx)", zh: "Excel (.xlsx)" },
  pdf: { en: "PDF", zh: "PDF" },
  image: { en: "Embedded images", zh: "嵌入图片" },
}

/** Fields that apply to a given format. */
export function exposureFieldsForFormat(format: ExposureFormat): MetadataExposureField[] {
  return METADATA_EXPOSURE_FIELDS.filter(row => row.formats.includes(format))
}

/** Count of distinct sensitive fields a format can leak — handy for citable stats. */
export function exposureCountForFormat(format: ExposureFormat): number {
  return exposureFieldsForFormat(format).length
}
