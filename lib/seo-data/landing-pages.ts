/**
 * Bilingual content base for the comparison / scenario / guide / research landing
 * pages (v2.md §C1–C4, §D2/D3). One structured, hand-written record per pageCode,
 * rendered by `components/om/om-landing-page.tsx` and consumed by
 * `seo/generate-json-ld.ts` (FAQPage / HowTo). This is the "data底座 → 模板生成每页"
 * approach from v2.md §D3: each page carries unique, fact-rich, citable content
 * instead of a thin shell, and lives colocated in both languages in one place.
 *
 * Editorial discipline (v2.md): comparisons stay honest (real competitor strengths
 * acknowledged), scenarios map to what the tool genuinely does (DOCX/DOC/XLSX/PDF +
 * EXIF/GPS inside embedded images — NOT standalone photos), and no invented statistics.
 */

import type { ExposureFormat, LocalizedText } from "./metadata-exposure"
import type { WorkbenchScope } from "@/components/om/om-workbench"

export interface LandingSection {
  heading: LocalizedText
  paragraphs?: LocalizedText[]
  bullets?: LocalizedText[]
}

export interface LandingTable {
  title: LocalizedText
  intro?: LocalizedText
  /** Column headers, left-to-right. */
  headers: LocalizedText[]
  /** Each row is one cell per header. */
  rows: LocalizedText[][]
  /** 0-based column index to emphasize (e.g. the MetaDocu column). */
  highlightCol?: number
}

export interface LandingHowToStep {
  title: LocalizedText
  desc: LocalizedText
}

export interface LandingHowTo {
  title: LocalizedText
  intro?: LocalizedText
  steps: LandingHowToStep[]
}

export interface LandingFaq {
  q: LocalizedText
  a: LocalizedText
}

export interface LandingCta {
  href: string
  label: LocalizedText
}

export interface LandingPageContent {
  pageCode: string
  badge: LocalizedText
  /** Answer-first lead (GEO citability): ~120–170 words, self-contained, fact-rich. */
  answerLead: LocalizedText
  /** Embed the interactive workbench scoped to a format, for conversion. */
  embedTool?: WorkbenchScope
  toolHeading?: LocalizedText
  toolDesc?: LocalizedText
  sections?: LandingSection[]
  table?: LandingTable
  howTo?: LandingHowTo
  /** Render the exposure dataset filtered to one format. */
  exposureFormat?: ExposureFormat
  exposureTitle?: LocalizedText
  exposureIntro?: LocalizedText
  faqs: LandingFaq[]
  ctaTitle: LocalizedText
  ctaDesc: LocalizedText
  ctas: LandingCta[]
  /** ISO date shown as "Last updated" (E-E-A-T) — used on the research page. */
  updated?: string
}

const CLEAN_CTAS: LandingCta[] = [
  { href: "/tools/word", label: { en: "Word tool", zh: "Word 工具" } },
  { href: "/tools/excel", label: { en: "Excel tool", zh: "Excel 工具" } },
  { href: "/tools/pdf", label: { en: "PDF tool", zh: "PDF 工具" } },
  { href: "/is-it-safe", label: { en: "Is it safe?", zh: "是否安全？" } },
]

export const LANDING_PAGES: Record<string, LandingPageContent> = {
  // ────────────────────────────── C1. Comparison pages ──────────────────────────────
  "compare.ilovepdf": {
    pageCode: "compare.ilovepdf",
    badge: { en: "Honest comparison", zh: "客观对比" },
    answerLead: {
      en: "iLovePDF is a popular all-in-one PDF suite (merge, split, compress, convert) that also removes PDF metadata — but its tools run on iLovePDF's servers: your file is uploaded, processed remotely, and downloaded back. MetaDocu is a focused alternative for one job — cleaning hidden metadata from Word, Excel and PDF before you share them — and it does it 100% in your browser with WebAssembly, so the file never leaves your device. If you need PDF editing, conversion or OCR, iLovePDF is broader. If your goal is privacy — scrubbing author names, company info, file paths, timestamps and revision history without uploading a sensitive document — MetaDocu is the more private, no-upload fit, and it ends with a verification report confirming the file is clean.",
      zh: "iLovePDF 是热门的 PDF 全能套件（合并、拆分、压缩、转换），也能删除 PDF 元数据——但它的处理在 iLovePDF 的服务器上完成：文件被上传、远程处理后再下载回来。MetaDocu 是只做一件事的替代品——在分享前清除 Word、Excel、PDF 中的隐藏元数据——并且全程用 WebAssembly 在你的浏览器里完成，文件永不离开设备。若你需要 PDF 编辑、转换或 OCR，iLovePDF 更全面；若你的目标是隐私——在不上传敏感文档的前提下清除作者名、公司信息、文件路径、时间戳与修订历史——MetaDocu 是更私密、零上传的选择，并在最后给出一份「已清理」的验证报告。",
    },
    embedTool: "pdf",
    toolHeading: { en: "Remove PDF metadata here — no upload", zh: "在此清除 PDF 元数据——无需上传" },
    table: {
      title: { en: "MetaDocu vs. iLovePDF for metadata", zh: "MetaDocu 与 iLovePDF 元数据处理对比" },
      intro: {
        en: "Where they differ for the specific job of removing hidden metadata. Competitor details reflect iLovePDF's documented server-side model.",
        zh: "就「删除隐藏元数据」这一具体任务的差异。竞品信息基于 iLovePDF 公开的服务器端处理模式。",
      },
      headers: [
        { en: "Aspect", zh: "维度" },
        { en: "MetaDocu", zh: "MetaDocu" },
        { en: "iLovePDF", zh: "iLovePDF" },
      ],
      highlightCol: 1,
      rows: [
        [
          { en: "Where processing happens", zh: "处理位置" },
          { en: "100% in your browser (WebAssembly)", zh: "100% 浏览器本地（WebAssembly）" },
          { en: "On iLovePDF servers (file uploaded)", zh: "iLovePDF 服务器（需上传文件）" },
        ],
        [
          { en: "File upload required", zh: "是否需要上传" },
          { en: "No", zh: "否" },
          { en: "Yes", zh: "是" },
        ],
        [
          { en: "Scope", zh: "覆盖范围" },
          { en: "Word, Excel & PDF metadata privacy", zh: "Word、Excel、PDF 元数据隐私" },
          { en: "Broad PDF suite (edit, convert, compress, OCR)", zh: "PDF 全能套件（编辑、转换、压缩、OCR）" },
        ],
        [
          { en: "Before-sharing verification report", zh: "分享前验证报告" },
          { en: "Yes", zh: "有" },
          { en: "No", zh: "无" },
        ],
        [
          { en: "Works offline after load", zh: "加载后可离线" },
          { en: "Yes", zh: "可以" },
          { en: "No (server round-trip)", zh: "不可（需往返服务器）" },
        ],
      ],
    },
    sections: [
      {
        heading: { en: "When iLovePDF is the better choice", zh: "什么时候 iLovePDF 更合适" },
        bullets: [
          { en: "You need to edit, merge, split, compress, sign or OCR PDFs — not just clean metadata.", zh: "你需要编辑、合并、拆分、压缩、签署或 OCR PDF，而不只是清理元数据。" },
          { en: "You want a single suite for many PDF tasks and don't mind server-side processing.", zh: "你想要一个处理多种 PDF 任务的套件，且不介意服务器端处理。" },
          { en: "You're working with non-sensitive files where upload isn't a concern.", zh: "你处理的是非敏感文件，上传不构成顾虑。" },
        ],
      },
      {
        heading: { en: "When MetaDocu is the better choice", zh: "什么时候 MetaDocu 更合适" },
        bullets: [
          { en: "The document is sensitive (a contract, resume, disclosure) and you don't want it uploaded.", zh: "文档很敏感（合同、简历、披露文件），你不希望它被上传。" },
          { en: "You also need to clean Word and Excel files, not only PDF.", zh: "你还需要清理 Word 和 Excel，而不只是 PDF。" },
          { en: "You want a confirmation that author, company, paths and timestamps are actually gone.", zh: "你想要一份确认：作者、公司、路径与时间戳确实已被移除。" },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Is MetaDocu a no-upload alternative to iLovePDF for removing metadata?", zh: "MetaDocu 是 iLovePDF 删除元数据的零上传替代品吗？" },
        a: {
          en: "Yes. iLovePDF processes files on its servers, so removing metadata there means uploading your PDF first. MetaDocu does the same job — stripping author, title, subject, keywords, timestamps, the PDF Info dictionary and the XMP stream — entirely inside your browser using WebAssembly, so the file never leaves your device and there's no server copy to trust. After cleaning it shows a verification report. For sensitive documents, that no-upload model is the core reason to pick MetaDocu over a server-based suite.",
          zh: "是的。iLovePDF 在其服务器上处理文件，因此在那里删除元数据意味着要先上传 PDF。MetaDocu 完成同样的工作——清除作者、标题、主题、关键字、时间戳、PDF Info 字典与 XMP 流——但全程用 WebAssembly 在浏览器内完成，文件永不离开设备，也没有需要信任的服务器副本，并在清理后给出验证报告。对敏感文档而言，这种零上传模式正是选择 MetaDocu 而非服务器套件的核心理由。",
        },
      },
      {
        q: { en: "Can MetaDocu do everything iLovePDF does?", zh: "MetaDocu 能做 iLovePDF 的全部功能吗？" },
        a: {
          en: "No, and it isn't trying to. iLovePDF is a broad suite — merge, split, compress, convert, sign, OCR — running server-side. MetaDocu is purpose-built for one thing: document metadata privacy across Word, Excel and PDF, done locally. If you need PDF editing or conversion, use iLovePDF (or a similar tool). If you specifically need to remove hidden metadata before sharing a file without uploading it, MetaDocu is the focused, more private option.",
          zh: "不能，它也无意如此。iLovePDF 是在服务器端运行的全能套件——合并、拆分、压缩、转换、签署、OCR。MetaDocu 专注于一件事：在本地完成 Word、Excel、PDF 的文档元数据隐私。若你需要 PDF 编辑或转换，请用 iLovePDF（或类似工具）；若你专门要在不上传的前提下、于分享前删除隐藏元数据，MetaDocu 是更专注、更私密的选择。",
        },
      },
      {
        q: { en: "Does removing PDF metadata change the PDF's content?", zh: "删除 PDF 元数据会改变 PDF 内容吗？" },
        a: {
          en: "No. Cleaning metadata only edits the document information fields (author, title, subject, keywords, creation/modification dates) and the XMP stream — the data that travels alongside your pages, not the pages themselves. The visible text, images, layout and page order are untouched. MetaDocu removes the fields from the PDF structure rather than hiding them, so the values are physically gone while the document reads exactly as before.",
          zh: "不会。清理元数据只编辑文档信息字段（作者、标题、主题、关键字、创建/修改时间）与 XMP 流——这些是随页面一起携带的数据，而非页面本身。可见的文字、图片、排版与页序都不受影响。MetaDocu 从 PDF 结构中移除这些字段而非将其隐藏，因此数值被物理清除，文档外观与之前完全一致。",
        },
      },
    ],
    ctaTitle: { en: "Clean your PDF before you share it", zh: "在分享前清理你的 PDF" },
    ctaDesc: { en: "Scan, remove and verify hidden metadata 100% in your browser — nothing uploaded.", zh: "100% 在浏览器内扫描、清除并验证隐藏元数据——零上传。" },
    ctas: CLEAN_CTAS,
  },

  "compare.smallpdf": {
    pageCode: "compare.smallpdf",
    badge: { en: "Honest comparison", zh: "客观对比" },
    answerLead: {
      en: "Smallpdf is a polished, cloud-based PDF platform — compress, convert, edit, e-sign — that also strips PDF metadata, with files processed on its servers (uploaded, handled remotely, then deleted on a schedule). MetaDocu is a narrower, privacy-first alternative: it removes hidden metadata from Word, Excel and PDF documents 100% in your browser, so nothing is ever uploaded. Choose Smallpdf when you want an all-round PDF workflow and are comfortable with cloud processing. Choose MetaDocu when the file is sensitive and you'd rather it never leave your device — it scrubs author names, company info, local file paths, timestamps, revision history and the XMP stream locally, then shows a verification report so you can confirm the document is clean before sending.",
      zh: "Smallpdf 是打磨精良的云端 PDF 平台——压缩、转换、编辑、电子签名——也能清除 PDF 元数据，文件在其服务器上处理（上传、远程处理、按计划删除）。MetaDocu 是更聚焦、隐私优先的替代品：100% 在浏览器内删除 Word、Excel、PDF 的隐藏元数据，全程零上传。当你想要全能 PDF 工作流、且接受云端处理时，选 Smallpdf；当文件敏感、你更希望它永不离开设备时，选 MetaDocu——它在本地清除作者名、公司信息、本地路径、时间戳、修订历史与 XMP 流，并给出验证报告，让你在发送前确认文档已干净。",
    },
    embedTool: "pdf",
    toolHeading: { en: "Remove PDF metadata here — no upload", zh: "在此清除 PDF 元数据——无需上传" },
    table: {
      title: { en: "MetaDocu vs. Smallpdf for metadata", zh: "MetaDocu 与 Smallpdf 元数据处理对比" },
      intro: {
        en: "Differences for the specific task of removing document metadata. Competitor details reflect Smallpdf's documented cloud model.",
        zh: "就「删除文档元数据」这一具体任务的差异。竞品信息基于 Smallpdf 公开的云端处理模式。",
      },
      headers: [
        { en: "Aspect", zh: "维度" },
        { en: "MetaDocu", zh: "MetaDocu" },
        { en: "Smallpdf", zh: "Smallpdf" },
      ],
      highlightCol: 1,
      rows: [
        [
          { en: "Where processing happens", zh: "处理位置" },
          { en: "100% in your browser (WebAssembly)", zh: "100% 浏览器本地（WebAssembly）" },
          { en: "On Smallpdf's cloud (file uploaded)", zh: "Smallpdf 云端（需上传文件）" },
        ],
        [
          { en: "File upload required", zh: "是否需要上传" },
          { en: "No", zh: "否" },
          { en: "Yes", zh: "是" },
        ],
        [
          { en: "Document formats cleaned", zh: "可清理的文档格式" },
          { en: "Word, Excel & PDF", zh: "Word、Excel、PDF" },
          { en: "Primarily PDF (broad PDF suite)", zh: "主要为 PDF（PDF 全能套件）" },
        ],
        [
          { en: "Free use limits", zh: "免费使用限制" },
          { en: "Unlimited, no account, no ads", zh: "无限次、无需账号、无广告" },
          { en: "Daily free-task limits / paid tiers", zh: "每日免费任务上限 / 付费档位" },
        ],
        [
          { en: "Verification report after cleaning", zh: "清理后验证报告" },
          { en: "Yes", zh: "有" },
          { en: "No", zh: "无" },
        ],
      ],
    },
    sections: [
      {
        heading: { en: "When Smallpdf is the better choice", zh: "什么时候 Smallpdf 更合适" },
        bullets: [
          { en: "You want a broad, polished PDF workflow (compress, convert, e-sign, edit) in one place.", zh: "你想在一处获得全面、精致的 PDF 工作流（压缩、转换、电子签名、编辑）。" },
          { en: "Cloud processing and occasional task limits are acceptable for your files.", zh: "对你的文件而言，云端处理与偶尔的任务上限可以接受。" },
        ],
      },
      {
        heading: { en: "When MetaDocu is the better choice", zh: "什么时候 MetaDocu 更合适" },
        bullets: [
          { en: "You don't want a sensitive document uploaded to any cloud, ever.", zh: "你不希望敏感文档被上传到任何云端。" },
          { en: "You need Word and Excel cleaning too, with no daily limits and no account.", zh: "你还需要清理 Word 和 Excel，且不想有每日上限或账号。" },
          { en: "You want proof — a report showing exactly which fields were removed.", zh: "你想要证据——一份显示具体移除了哪些字段的报告。" },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Is there a Smallpdf alternative that doesn't upload my files?", zh: "有不上传文件的 Smallpdf 替代品吗？" },
        a: {
          en: "Yes — MetaDocu. Smallpdf processes documents in its cloud, so cleaning metadata there means uploading the file first. MetaDocu removes hidden metadata from Word, Excel and PDF entirely in your browser with WebAssembly: the bytes are read into local memory, cleaned there, and saved back as a download, with nothing transmitted to a server. There are no daily task limits, no account, and no ads, and it finishes with a verification report. For private documents, that's the practical reason to choose it over a cloud platform.",
          zh: "有——MetaDocu。Smallpdf 在云端处理文档，因此在那里清理元数据意味着要先上传文件。MetaDocu 用 WebAssembly 完全在浏览器内删除 Word、Excel、PDF 的隐藏元数据：字节被读入本地内存、在本地清理、再作为下载保存，不向服务器传输任何内容。没有每日任务上限、无需账号、没有广告，并在最后给出验证报告。对私密文档而言，这正是相对云端平台选择它的现实理由。",
        },
      },
      {
        q: { en: "Does MetaDocu have task or file-size limits like free cloud tools?", zh: "MetaDocu 会像免费云端工具那样有任务或文件大小限制吗？" },
        a: {
          en: "No daily task limit and no account required. Because processing runs on your own machine rather than shared servers, MetaDocu doesn't meter usage the way cloud tools do. Practical limits come from your device's memory rather than a paywall — typical Office and PDF documents clean instantly. Very large files are bounded by available browser memory, not by a subscription tier.",
          zh: "没有每日任务上限，也无需账号。由于处理运行在你自己的设备上而非共享服务器，MetaDocu 不会像云端工具那样对用量计费。实际限制来自设备内存而非付费墙——常见的 Office 与 PDF 文档可瞬间清理；超大文件受可用浏览器内存约束，而不受订阅档位限制。",
        },
      },
      {
        q: { en: "Can it clean Word and Excel, or only PDF?", zh: "它能清理 Word 和 Excel，还是只能 PDF？" },
        a: {
          en: "Both. MetaDocu handles Word (.docx/.doc), Excel (.xlsx) and PDF, plus the EXIF/GPS hidden inside images embedded in those documents. Office files leak a wider set of fields than PDF — last-modified-by names, company, manager, template paths, RSIDs, tracked changes and comments — and MetaDocu strips those from the OOXML structure, not just the visible properties panel. A cloud PDF suite typically focuses on PDF alone.",
          zh: "两者都能。MetaDocu 处理 Word（.docx/.doc）、Excel（.xlsx）与 PDF，还包括这些文档中嵌入图片里的 EXIF/GPS。Office 文件泄露的字段比 PDF 更多——最后修改者、公司、管理者、模板路径、RSID、修订痕迹与批注——MetaDocu 会从 OOXML 结构中清除它们，而不只是清空可见的属性面板。云端 PDF 套件通常只聚焦 PDF。",
        },
      },
    ],
    ctaTitle: { en: "Clean your document before you share it", zh: "在分享前清理你的文档" },
    ctaDesc: { en: "Scan, remove and verify hidden metadata 100% in your browser — nothing uploaded.", zh: "100% 在浏览器内扫描、清除并验证隐藏元数据——零上传。" },
    ctas: CLEAN_CTAS,
  },

  // ────────────────────────────── C1/C2. Guide pages (HowTo) ──────────────────────────────
  "guide.without-acrobat": {
    pageCode: "guide.without-acrobat",
    badge: { en: "How-to guide", zh: "操作指南" },
    answerLead: {
      en: "You don't need Adobe Acrobat (or its subscription) to remove metadata from a PDF. Acrobat Pro can do it via Preflight or \"Sanitize Document,\" but it's paid desktop software. A faster, free option is MetaDocu: open your PDF in the browser and it strips the author, title, subject, keywords, creation/modification dates, the Info dictionary and the XMP metadata stream — all locally, with no upload and no account. The cleaned file downloads back to you with a verification report. Below is exactly how to do it without Acrobat, why the XMP stream matters (clearing only the visible properties can leave a second copy behind), and how to confirm the PDF is actually clean afterward.",
      zh: "删除 PDF 元数据并不需要 Adobe Acrobat（也不需要它的订阅）。Acrobat Pro 可以通过 Preflight 或「清理文档」实现，但那是付费的桌面软件。更快、免费的方式是 MetaDocu：在浏览器中打开 PDF，它会清除作者、标题、主题、关键字、创建/修改时间、Info 字典与 XMP 元数据流——全部在本地完成，零上传、无需账号。清理后的文件会连同验证报告下载回来。下面给出不用 Acrobat 的具体步骤、为什么 XMP 流很关键（只清可见属性可能残留第二份副本），以及之后如何确认 PDF 真的干净。",
    },
    embedTool: "pdf",
    toolHeading: { en: "Remove PDF metadata without Acrobat", zh: "不用 Acrobat 删除 PDF 元数据" },
    howTo: {
      title: { en: "Remove PDF metadata without Adobe Acrobat", zh: "不用 Adobe Acrobat 删除 PDF 元数据" },
      intro: { en: "Four steps, free, entirely in your browser.", zh: "四步，免费，全程在浏览器内。" },
      steps: [
        { title: { en: "Open your PDF in MetaDocu", zh: "在 MetaDocu 中打开 PDF" }, desc: { en: "Drop the PDF into the tool above. It's read into your browser's memory — no file is uploaded to any server.", zh: "把 PDF 拖入上方工具。它被读入浏览器内存——不会上传到任何服务器。" } },
        { title: { en: "Scan the hidden fields", zh: "扫描隐藏字段" }, desc: { en: "MetaDocu lists what the PDF exposes: author, title, subject, keywords, producer/creator software, timestamps and the XMP stream.", zh: "MetaDocu 列出 PDF 暴露的内容：作者、标题、主题、关键字、生成/创建软件、时间戳与 XMP 流。" } },
        { title: { en: "Clear and rebuild", zh: "清除并重建" }, desc: { en: "Remove the fields in one click. MetaDocu wipes both the Info dictionary and the XMP packet so no duplicate metadata survives.", zh: "一键移除这些字段。MetaDocu 会同时清除 Info 字典与 XMP 包，不留重复元数据。" } },
        { title: { en: "Download and verify", zh: "下载并验证" }, desc: { en: "Download the clean PDF and check Document Properties in any viewer — the fields should be empty. A report confirms what was removed.", zh: "下载干净的 PDF，在任意查看器中检查「文档属性」——字段应为空。报告会确认移除了哪些内容。" } },
      ],
    },
    sections: [
      {
        heading: { en: "Why clearing only the visible properties isn't enough", zh: "为什么只清可见属性还不够" },
        paragraphs: [
          { en: "Many PDFs carry metadata twice: once in the Info dictionary (the fields most viewers show) and again in an embedded XMP stream. Editing the visible properties — or even Acrobat's basic property dialog — can leave the XMP copy intact, so author and tool data resurface. MetaDocu removes both, which is why a 'cleaned' file from a quick edit can still leak data that MetaDocu catches.", zh: "很多 PDF 把元数据存了两份：一份在 Info 字典（多数查看器显示的字段），另一份在内嵌的 XMP 流里。只编辑可见属性——甚至 Acrobat 的基础属性对话框——可能让 XMP 副本原封不动，于是作者与工具数据又冒出来。MetaDocu 会同时移除两者，这也是为什么一份经快速编辑「清理过」的文件仍可能泄露数据，而 MetaDocu 能将其捕获。" },
        ],
      },
    ],
    exposureFormat: "pdf",
    exposureTitle: { en: "What a PDF can leak — and how it's removed", zh: "PDF 会泄露什么——以及如何被移除" },
    exposureIntro: { en: "The hidden fields MetaDocu finds and clears in a PDF, locally.", zh: "MetaDocu 在本地从 PDF 中找到并清除的隐藏字段。" },
    faqs: [
      {
        q: { en: "How do I remove metadata from a PDF without Adobe Acrobat?", zh: "不用 Adobe Acrobat 怎么删除 PDF 元数据？" },
        a: {
          en: "Use MetaDocu in your browser: open the PDF, scan it, clear the fields, and download — no Acrobat, no upload, no account. It strips the author, title, subject, keywords, producer/creator, creation and modification dates from the Info dictionary, and also removes the XMP metadata stream so no duplicate copy remains. Everything runs locally with WebAssembly, and a verification report confirms the fields are gone. Open the downloaded file's Document Properties in any viewer to double-check they're empty.",
          zh: "在浏览器里用 MetaDocu：打开 PDF、扫描、清除字段、下载——不用 Acrobat、不上传、无需账号。它会从 Info 字典中清除作者、标题、主题、关键字、生成/创建软件、创建与修改时间，并移除 XMP 元数据流，使其不留重复副本。一切用 WebAssembly 在本地运行，验证报告会确认字段已清除。在任意查看器中打开下载文件的「文档属性」即可复核它们为空。",
        },
      },
      {
        q: { en: "Is removing PDF metadata online safe without Acrobat?", zh: "不用 Acrobat 在线删除 PDF 元数据安全吗？" },
        a: {
          en: "It depends on the tool. Many free online PDF tools upload your file to a server to process it, which is the opposite of private for a sensitive PDF. MetaDocu is safe because it never uploads: the PDF is processed entirely in your browser's sandbox and never transmitted. There's no server copy to be cached, logged, retained or breached. After the page loads you could even go offline and still clean the file. For confidential documents, a no-upload, in-browser tool is the safe choice.",
          zh: "取决于工具。很多免费在线 PDF 工具会把文件上传到服务器处理，对敏感 PDF 而言这恰恰不私密。MetaDocu 之所以安全，是因为它从不上传：PDF 完全在浏览器沙箱中处理，绝不传输，没有会被缓存、记录、留存或泄露的服务器副本。页面加载后你甚至可以断网仍能清理文件。对机密文档而言，零上传的浏览器内工具才是安全选择。",
        },
      },
      {
        q: { en: "Does Acrobat's 'Sanitize Document' do the same thing?", zh: "Acrobat 的「清理文档」能做到一样的效果吗？" },
        a: {
          en: "Acrobat Pro's Sanitize and Preflight can remove metadata and other hidden data, and they're capable tools — but they require a paid Acrobat Pro subscription and a desktop install. MetaDocu covers the core metadata-removal need (Info dictionary plus the XMP stream) for free, in the browser, with no upload. If you already own Acrobat Pro and need its broader redaction and pre-press features, use it; if you just need to strip metadata before sharing, MetaDocu does that specific job without the cost.",
          zh: "Acrobat Pro 的「清理」与 Preflight 可以移除元数据及其他隐藏数据，功能强大——但需要付费的 Acrobat Pro 订阅与桌面安装。MetaDocu 免费、在浏览器内、零上传地覆盖核心的元数据移除需求（Info 字典加 XMP 流）。若你已拥有 Acrobat Pro 并需要其更广泛的涂黑与印前功能，就用它；若你只是想在分享前清除元数据，MetaDocu 能专门完成这件事且无需付费。",
        },
      },
    ],
    ctaTitle: { en: "Clean your PDF — no Acrobat needed", zh: "清理你的 PDF——无需 Acrobat" },
    ctaDesc: { en: "Remove and verify hidden metadata 100% in your browser, free.", zh: "100% 在浏览器内移除并验证隐藏元数据，免费。" },
    ctas: CLEAN_CTAS,
  },

  "guide.before-sending": {
    pageCode: "guide.before-sending",
    badge: { en: "How-to guide", zh: "操作指南" },
    answerLead: {
      en: "The best way to remove metadata before sending a file is to clean it locally, in your browser, and verify it — so nothing sensitive rides along and nothing is uploaded in the process. Every Word, Excel and PDF you create carries hidden data: your real name as author, your company, the last person who edited it, local file paths, timestamps, revision history and tracked changes. With MetaDocu you drop the file in, see exactly what it exposes, remove it in one click, and download a clean copy with a verification report — all 100% on your device. Below is the recommended routine before hitting send, the fields that matter most, and how to confirm the file is clean so you never leak data to a client, recruiter or the public.",
      zh: "在发送文件前删除元数据，最好的方式是在浏览器本地清理并验证——这样不会有敏感信息随文件外流，过程也不上传任何内容。你创建的每个 Word、Excel、PDF 都携带隐藏数据：作为作者的真名、你的公司、最后编辑者、本地文件路径、时间戳、修订历史与修订痕迹。用 MetaDocu，把文件拖进来、看清它暴露了什么、一键移除、下载干净副本并附验证报告——全部 100% 在你的设备上完成。下面给出按下发送前的推荐流程、最关键的字段，以及如何确认文件已干净，让你绝不向客户、招聘方或公众泄露数据。",
    },
    embedTool: "all",
    toolHeading: { en: "Clean any document before sending", zh: "发送前清理任意文档" },
    howTo: {
      title: { en: "Remove metadata before sending a file", zh: "发送文件前删除元数据" },
      intro: { en: "A 4-step routine to run before you hit send — free and local.", zh: "按下发送前的 4 步流程——免费且本地。" },
      steps: [
        { title: { en: "Drop the file into MetaDocu", zh: "把文件拖入 MetaDocu" }, desc: { en: "Word, Excel or PDF. It loads into your browser's memory, never to a server.", zh: "Word、Excel 或 PDF。它加载进浏览器内存，绝不进服务器。" } },
        { title: { en: "Review what it exposes", zh: "查看它暴露了什么" }, desc: { en: "The scan shows author, company, last-modified-by, file paths, timestamps, revision history and more.", zh: "扫描会显示作者、公司、最后修改者、文件路径、时间戳、修订历史等。" } },
        { title: { en: "Remove it in one click", zh: "一键移除" }, desc: { en: "Clear the sensitive fields. MetaDocu rewrites the file structure so the data is physically gone.", zh: "清除敏感字段。MetaDocu 会重写文件结构，使数据被物理清除。" } },
        { title: { en: "Verify, then send", zh: "验证后再发送" }, desc: { en: "The report confirms what was removed; the clean file downloads, ready to share safely.", zh: "报告会确认移除了什么；干净文件随即下载，可安全分享。" } },
      ],
    },
    sections: [
      {
        heading: { en: "Which fields to remove before sending", zh: "发送前该移除哪些字段" },
        bullets: [
          { en: "Author / creator and last-modified-by — your real name and internal reviewers.", zh: "作者/创建者与最后修改者——你的真名与内部审阅者。" },
          { en: "Company, manager and template path — your employer, reporting line and local folder layout.", zh: "公司、管理者与模板路径——你的雇主、汇报关系与本地目录结构。" },
          { en: "Tracked changes, comments and revision history — deleted text and internal notes.", zh: "修订痕迹、批注与修订历史——被删除的文字与内部意见。" },
          { en: "Timestamps and EXIF/GPS in embedded images — your activity timeline and locations.", zh: "时间戳与嵌入图片中的 EXIF/GPS——你的活动时间线与位置。" },
        ],
      },
      {
        heading: { en: "Why local-and-verified beats 'just delete the author'", zh: "为什么「本地+验证」胜过「只删作者」" },
        paragraphs: [
          { en: "Manually blanking the author in an app's properties panel often leaves the data in the file's underlying XML or in a second metadata stream, and gives you no confirmation. Cleaning locally removes the fields from the structure itself, and a verification report tells you it worked — so 'I think I deleted it' becomes 'I can see it's gone' before the file ever leaves your hands.", zh: "在应用的属性面板里手动清空作者，往往会把数据留在文件底层的 XML 或第二份元数据流里，而且没有任何确认。本地清理会从结构本身移除这些字段，验证报告会告诉你确实生效了——于是在文件离手之前，「我以为删了」变成「我能看到它没了」。" },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "What's the best way to remove metadata before sending a file?", zh: "发送文件前删除元数据最好的方式是什么？" },
        a: {
          en: "Clean it locally and verify it. Use a browser-based tool like MetaDocu that processes the file on your device instead of uploading it: drop in the Word, Excel or PDF, review the exposed fields, remove them in one click, and download a clean copy with a verification report. This removes author names, company info, file paths, timestamps and revision history from the file's structure — not just the visible panel — and confirms the result, all without sending your document to a server. That combination of no-upload and verification is what makes it the safest pre-send routine.",
          zh: "在本地清理并验证。使用像 MetaDocu 这样的浏览器工具——它在你的设备上处理文件而非上传：拖入 Word、Excel 或 PDF，查看暴露字段，一键移除，下载附验证报告的干净副本。这会从文件结构中（而非仅可见面板）移除作者名、公司信息、文件路径、时间戳与修订历史，并确认结果，全程不把文档发往服务器。零上传加验证的组合，正是它成为最安全发送前流程的原因。",
        },
      },
      {
        q: { en: "Does sending a PDF instead of Word remove the metadata?", zh: "发 PDF 而不是 Word 就能去掉元数据吗？" },
        a: {
          en: "No — converting to PDF often carries the metadata across rather than removing it. The original creator name, company and timestamps frequently transfer into the PDF's Info dictionary and XMP stream, and the conversion can add new fields (the producing software, for example). 'Save as PDF' is not a privacy step. Clean the document explicitly before sending, in whichever format you're sharing, and verify the fields are empty afterward.",
          zh: "不能——转成 PDF 往往是把元数据带过去而非移除。原始创建者姓名、公司与时间戳常会转入 PDF 的 Info 字典与 XMP 流，转换还可能新增字段（例如生成软件）。「另存为 PDF」不是隐私步骤。请在发送前，针对你要分享的格式显式清理文档，并在之后验证字段为空。",
        },
      },
      {
        q: { en: "Can recipients tell I removed the metadata?", zh: "收件人能看出我删过元数据吗？" },
        a: {
          en: "There's no flag that says 'metadata was removed.' The recipient simply sees empty property fields, which is indistinguishable from a document that never had them filled in — exactly what you want. MetaDocu strips the values from the file's internal structure rather than hiding them, so inspecting the file won't reveal the originals. The visible content, formatting and layout are unchanged; only the hidden fields you chose to clear are gone.",
          zh: "没有任何标记会写着「元数据已被移除」。收件人只会看到空白的属性字段，这与一份从未填写过这些字段的文档无法区分——正是你想要的效果。MetaDocu 会从文件内部结构中清除数值而非将其隐藏，因此检查文件也无法还原原始内容。可见内容、格式与排版保持不变；只有你选择清除的隐藏字段消失了。",
        },
      },
    ],
    ctaTitle: { en: "Make 'clean before sending' a habit", zh: "把「发送前清理」变成习惯" },
    ctaDesc: { en: "Scan, remove and verify hidden metadata 100% in your browser — nothing uploaded.", zh: "100% 在浏览器内扫描、清除并验证隐藏元数据——零上传。" },
    ctas: CLEAN_CTAS,
  },

  // ────────────────────────────── C2. Scenario pages ──────────────────────────────
  "scenario.resume": {
    pageCode: "scenario.resume",
    badge: { en: "Before you apply", zh: "投递之前" },
    answerLead: {
      en: "Before you send a resume, remove the author name and company baked into its metadata — recruiters and applicant-tracking systems can see them even when your name isn't on the page the way you intended. A Word or PDF resume typically carries the real name of whoever created the file (often a previous version's owner or your full legal name), your current employer's name from your Office licence, the last-modified-by identity, local file paths like C:\\Users\\you\\, and timestamps showing when you really wrote it. MetaDocu strips all of this in your browser — nothing uploaded — and shows a verification report so you can apply knowing your resume reveals only what you chose to share. Drop your resume in below to scan and clean it.",
      zh: "在投递简历前，先移除写进元数据里的作者姓名与公司——即便页面上没有按你预期显示，招聘方与简历筛选系统（ATS）仍可能看到它们。一份 Word 或 PDF 简历通常携带文件创建者的真名（往往是上一版本的所有者或你的全名）、来自 Office 授权的当前雇主名称、最后修改者身份、像 C:\\Users\\你\\ 这样的本地路径，以及显示你真实撰写时间的时间戳。MetaDocu 在浏览器内清除这一切——零上传——并给出验证报告，让你在投递时确信简历只展示你选择分享的内容。在下方拖入简历即可扫描并清理。",
    },
    embedTool: "all",
    toolHeading: { en: "Scan & clean your resume", zh: "扫描并清理你的简历" },
    toolDesc: { en: "Word or PDF — processed in your browser, never uploaded.", zh: "Word 或 PDF——在浏览器内处理，绝不上传。" },
    sections: [
      {
        heading: { en: "What a resume leaks about you", zh: "简历会泄露你的哪些信息" },
        bullets: [
          { en: "Your current employer's name (from the Office Company field) — awkward on a confidential job search.", zh: "你当前雇主的名称（来自 Office 公司字段）——在保密求职时很尴尬。" },
          { en: "A previous template owner's or colleague's name as the author, if you reused a file.", zh: "如果你复用了文件，作者可能是上一个模板所有者或同事的名字。" },
          { en: "Local file paths revealing your account name and folder structure.", zh: "暴露你账户名与目录结构的本地文件路径。" },
          { en: "Edit timestamps that contradict a 'just updated for this role' impression.", zh: "与「为这份职位刚更新」印象相矛盾的编辑时间戳。" },
        ],
      },
    ],
    exposureFormat: "docx",
    exposureTitle: { en: "Hidden fields in a Word resume", zh: "Word 简历中的隐藏字段" },
    exposureIntro: { en: "What MetaDocu finds and removes in a .docx resume (PDF resumes carry the Info-dictionary subset).", zh: "MetaDocu 在 .docx 简历中找到并移除的内容（PDF 简历携带其中的 Info 字典子集）。" },
    faqs: [
      {
        q: { en: "How do I remove the author name and company from my resume before applying?", zh: "投递前如何从简历中移除作者名和公司？" },
        a: {
          en: "Open your resume in MetaDocu, scan it, and clear the author, last-modified-by and company fields in one click, then download the clean copy — all in your browser, with no upload. For a Word resume, MetaDocu removes these from the OOXML core and app properties (not just the visible panel); for a PDF resume it clears the Info dictionary and XMP stream. A verification report confirms the fields are empty before you send it, so a recruiter or applicant-tracking system can't read your current employer or someone else's name off the file.",
          zh: "在 MetaDocu 中打开简历、扫描，一键清除作者、最后修改者与公司字段，然后下载干净副本——全程在浏览器内、零上传。对 Word 简历，MetaDocu 会从 OOXML 核心与 app 属性中移除它们（而非仅可见面板）；对 PDF 简历，则清除 Info 字典与 XMP 流。验证报告会在你发送前确认字段为空，这样招聘方或 ATS 就无法从文件里读到你当前的雇主或他人的名字。",
        },
      },
      {
        q: { en: "Can a recruiter or ATS actually see resume metadata?", zh: "招聘方或 ATS 真能看到简历元数据吗？" },
        a: {
          en: "Yes. Metadata fields are part of the file, so anyone who opens the document properties — or any system that parses the file, including applicant-tracking software — can read the author, company, timestamps and editing history. It doesn't show on the printed page, which is exactly why it's easy to forget. Some recruiters do check it. Cleaning the fields before you apply removes that exposure entirely, and because MetaDocu strips them from the file structure, they can't be recovered from the copy you send.",
          zh: "能。元数据字段是文件的一部分，因此任何打开文档属性的人——或任何解析该文件的系统，包括 ATS——都能读到作者、公司、时间戳与编辑历史。它不会显示在打印页面上，这正是它容易被忽视的原因。有些招聘方确实会查看。投递前清理这些字段可彻底消除这种暴露，而且由于 MetaDocu 从文件结构中清除它们，你发送的副本无法再被还原。",
        },
      },
      {
        q: { en: "Will cleaning metadata change how my resume looks?", zh: "清理元数据会改变简历的外观吗？" },
        a: {
          en: "No. Removing metadata only edits the hidden property fields, not your content — the text, fonts, layout, columns and any images stay exactly as designed. Your resume will look and print identically; the only difference is that the author, company, paths and timestamps are no longer embedded. MetaDocu makes that change in your browser and hands back a download that's visually identical to the original, minus the privacy risk.",
          zh: "不会。移除元数据只编辑隐藏的属性字段，不动你的内容——文字、字体、排版、分栏与任何图片都与设计完全一致。你的简历外观与打印效果完全相同；唯一的区别是作者、公司、路径与时间戳不再被嵌入。MetaDocu 在浏览器内完成这一改动，交还一份与原件视觉一致、但去除了隐私风险的下载文件。",
        },
      },
    ],
    ctaTitle: { en: "Apply with a clean resume", zh: "用干净的简历投递" },
    ctaDesc: { en: "Remove the author, company and history in your browser — nothing uploaded.", zh: "在浏览器内移除作者、公司与历史——零上传。" },
    ctas: CLEAN_CTAS,
  },

  "scenario.contract": {
    pageCode: "scenario.contract",
    badge: { en: "Before you send", zh: "发送之前" },
    answerLead: {
      en: "Before you send a contract, clean its metadata — a draft agreement often carries your firm's name, the negotiator's identity, internal reviewers in the last-modified-by field, and, most damaging, tracked changes and comments that survive 'accept all changes.' Those can reveal your fallback terms, internal pricing notes, or which clauses you fought over. MetaDocu scans a Word or PDF contract in your browser, strips author and company info, file paths, timestamps, revision history, comments and RSIDs, and shows a verification report confirming the file is clean — with nothing uploaded to a server you don't control. For a document as sensitive as a contract, local processing means the other side never receives your negotiating hand by accident. Drop the contract in below to scan and clean it.",
      zh: "在发送合同前，先清理它的元数据——一份草拟协议往往携带你所在机构的名称、谈判者身份、最后修改者字段里的内部审阅者，以及最具杀伤力的、在「接受所有修订」后仍残留的修订痕迹与批注。它们可能暴露你的退让条件、内部定价备注，或你们争执过哪些条款。MetaDocu 在浏览器内扫描 Word 或 PDF 合同，清除作者与公司信息、文件路径、时间戳、修订历史、批注与 RSID，并给出确认文件已干净的验证报告——不向任何你无法掌控的服务器上传。对合同这样敏感的文档而言，本地处理意味着对方绝不会意外收到你的谈判底牌。在下方拖入合同即可扫描并清理。",
    },
    embedTool: "all",
    toolHeading: { en: "Scan & clean your contract", zh: "扫描并清理你的合同" },
    toolDesc: { en: "Word or PDF — processed in your browser, never uploaded.", zh: "Word 或 PDF——在浏览器内处理，绝不上传。" },
    sections: [
      {
        heading: { en: "The riskiest thing in a contract: tracked changes", zh: "合同中最危险的东西：修订痕迹" },
        paragraphs: [
          { en: "Tracked changes, comments and the people who made them can persist inside a .docx even after you accept all changes — the deleted text and internal notes remain in the file's XML and comment parts. A counterparty who turns tracking back on, or simply opens the comments, can read your edit history. MetaDocu removes the revision and comment parts outright, so no hidden negotiation history ships with the contract.", zh: "修订痕迹、批注以及做出它们的人，即便你「接受所有修订」后仍可能残留在 .docx 内——被删除的文字与内部备注留在文件的 XML 与批注部件里。对方只要重新打开修订、或直接查看批注，就能读到你的编辑历史。MetaDocu 会彻底移除修订与批注部件，使合同不再携带任何隐藏的谈判历史。" },
        ],
      },
    ],
    exposureFormat: "docx",
    exposureTitle: { en: "Hidden fields in a Word contract", zh: "Word 合同中的隐藏字段" },
    exposureIntro: { en: "What MetaDocu finds and removes in a .docx contract before you send it.", zh: "MetaDocu 在你发送前从 .docx 合同中找到并移除的内容。" },
    faqs: [
      {
        q: { en: "How do I clean metadata from a contract before sending it?", zh: "发送前如何清理合同的元数据？" },
        a: {
          en: "Open the contract in MetaDocu, scan it, and remove the metadata and revision history in one click before downloading the clean copy — all in your browser, nothing uploaded. For a Word contract this clears author, company, last-modified-by, template path, timestamps, RSIDs, and crucially the tracked changes and comments that can leak your negotiating position. For a PDF it clears the Info dictionary and XMP stream. The verification report confirms what was removed so you can send the agreement knowing no hidden edit history travels with it.",
          zh: "在 MetaDocu 中打开合同、扫描，一键移除元数据与修订历史，再下载干净副本——全程在浏览器内、零上传。对 Word 合同，这会清除作者、公司、最后修改者、模板路径、时间戳、RSID，以及关键的、可能泄露你谈判立场的修订痕迹与批注；对 PDF，则清除 Info 字典与 XMP 流。验证报告会确认移除了哪些内容，让你在发送协议时确信没有隐藏的编辑历史随之外流。",
        },
      },
      {
        q: { en: "Does 'accept all changes' remove tracked changes from a contract?", zh: "「接受所有修订」能从合同中移除修订痕迹吗？" },
        a: {
          en: "Not completely. Accepting changes resolves them visually, but comments, commenter names, and remnants of the revision machinery can remain in the document's XML, and in some workflows deleted text persists. The only reliable way to ensure none of it ships is to remove the comment and revision parts from the file itself. MetaDocu does exactly that, stripping those parts so a counterparty cannot reconstruct your edit history — then it shows you a report confirming they're gone.",
          zh: "并不彻底。接受修订只是在视觉上处理了它们，但批注、批注者姓名以及修订机制的残留仍可能留在文档 XML 中，某些流程下被删除的文字也会残留。确保这些都不外流的唯一可靠方式，是从文件本身移除批注与修订部件。MetaDocu 正是这么做的——剥离这些部件，使对方无法重建你的编辑历史——然后给你一份确认它们已清除的报告。",
        },
      },
      {
        q: { en: "Is it safe to clean a confidential contract online?", zh: "在线清理机密合同安全吗？" },
        a: {
          en: "With MetaDocu, yes — because the contract is never uploaded. It's processed entirely in your browser using WebAssembly, so the file stays on your device and there's no server copy to be intercepted, logged or retained. That's a meaningful distinction for a confidential agreement: upload-based tools transmit the document to a remote server, while MetaDocu's local model removes that risk entirely. Once the page has loaded you can even disconnect from the internet and still clean the file.",
          zh: "用 MetaDocu 是安全的——因为合同从不被上传。它完全用 WebAssembly 在浏览器内处理，文件留在你的设备上，没有会被拦截、记录或留存的服务器副本。对一份机密协议而言这是重要区别：上传式工具会把文档传到远程服务器，而 MetaDocu 的本地模式彻底消除了这一风险。页面加载后，你甚至可以断网仍能清理文件。",
        },
      },
    ],
    ctaTitle: { en: "Send the contract, not your edit history", zh: "发送合同，而非你的编辑历史" },
    ctaDesc: { en: "Remove metadata, comments and tracked changes in your browser — nothing uploaded.", zh: "在浏览器内移除元数据、批注与修订痕迹——零上传。" },
    ctas: CLEAN_CTAS,
  },

  "scenario.legal-pdf": {
    pageCode: "scenario.legal-pdf",
    badge: { en: "Before disclosure", zh: "披露之前" },
    answerLead: {
      en: "Before you file or disclose a legal PDF, remove its hidden metadata — court filings, disclosures and regulatory submissions have repeatedly leaked the drafter's name, the law firm, internal timestamps and even prior content through PDF metadata. A PDF carries an Info dictionary (author, title, subject, keywords, producer, creation and modification dates) and a second XMP stream that survives if you only clear the visible properties. MetaDocu removes both in your browser, with no upload, and produces a verification report so you can disclose the document knowing it reveals only its intended content. For privileged or regulated material, local processing means the file never passes through a third-party server. Drop the PDF in below to scan and clean it.",
      zh: "在提交或披露法律 PDF 前，先移除其隐藏元数据——法院文书、披露材料与监管报送，曾多次通过 PDF 元数据泄露起草人姓名、律所、内部时间戳，甚至此前的内容。PDF 携带一个 Info 字典（作者、标题、主题、关键字、生成软件、创建与修改时间）和第二份 XMP 流——若你只清可见属性，后者会残留。MetaDocu 在浏览器内同时移除两者，零上传，并生成验证报告，让你在披露文档时确信它只呈现预期内容。对受特权保护或受监管的材料而言，本地处理意味着文件绝不经过第三方服务器。在下方拖入 PDF 即可扫描并清理。",
    },
    embedTool: "pdf",
    toolHeading: { en: "Scan & clean your legal PDF", zh: "扫描并清理你的法律 PDF" },
    toolDesc: { en: "Processed in your browser, never uploaded.", zh: "在浏览器内处理，绝不上传。" },
    sections: [
      {
        heading: { en: "Why legal PDFs leak more than they look", zh: "为什么法律 PDF 泄露的远比看起来多" },
        paragraphs: [
          { en: "A PDF that began life as a Word document often inherits the original author, company and timestamps into its metadata during conversion, and the conversion tool adds its own producer/creator fingerprint. Because this lives in both the Info dictionary and the XMP packet, clearing one can leave the other behind. For a disclosure where the drafter's identity or timing is sensitive, removing both copies is essential — MetaDocu does this and verifies the result.", zh: "一份源自 Word 的 PDF，在转换时常把原始作者、公司与时间戳带入其元数据，转换工具还会加上自己的生成/创建指纹。由于这些同时存在于 Info 字典与 XMP 包中，清除其一可能留下其二。对一份起草人身份或时间敏感的披露材料而言，移除两份副本至关重要——MetaDocu 会做到并验证结果。" },
        ],
      },
    ],
    exposureFormat: "pdf",
    exposureTitle: { en: "Hidden fields in a legal PDF", zh: "法律 PDF 中的隐藏字段" },
    exposureIntro: { en: "What MetaDocu finds and removes in a PDF before you disclose it.", zh: "MetaDocu 在你披露前从 PDF 中找到并移除的内容。" },
    faqs: [
      {
        q: { en: "How do I remove hidden data from a legal or disclosure PDF?", zh: "如何从法律或披露 PDF 中移除隐藏数据？" },
        a: {
          en: "Open the PDF in MetaDocu, scan it, and clear the metadata in one click before downloading — locally, with no upload. It removes the Info dictionary fields (author, title, subject, keywords, producer/creator, creation and modification dates) and the XMP metadata stream so no duplicate copy of the drafter's identity or tool data remains. A verification report confirms the fields are empty, which matters when you must certify that a disclosure contains only its intended content. Because nothing is uploaded, privileged material never touches a third-party server.",
          zh: "在 MetaDocu 中打开 PDF、扫描，一键清除元数据后下载——本地完成、零上传。它会移除 Info 字典字段（作者、标题、主题、关键字、生成/创建软件、创建与修改时间）与 XMP 元数据流，使起草人身份或工具数据不留重复副本。验证报告会确认字段为空——当你必须确证披露材料只含预期内容时，这一点很重要。由于不上传，受特权保护的材料绝不经过第三方服务器。",
        },
      },
      {
        q: { en: "Why isn't clearing the PDF's visible properties enough?", zh: "为什么只清 PDF 的可见属性还不够？" },
        a: {
          en: "Because PDFs commonly store metadata twice — in the Info dictionary and in an embedded XMP stream. Many quick edits or basic property dialogs touch only the Info dictionary, leaving the XMP copy intact, so the author and tool data reappear when the file is inspected with the right viewer. For legal disclosure, that residual copy is exactly the kind of thing that leaks. MetaDocu removes both the Info dictionary and the XMP packet together, which is why a file it cleans doesn't carry a hidden second copy.",
          zh: "因为 PDF 通常把元数据存两份——一份在 Info 字典，一份在内嵌 XMP 流。许多快速编辑或基础属性对话框只动 Info 字典，留下 XMP 副本，于是用合适的查看器检查文件时，作者与工具数据又会出现。对法律披露而言，这份残留副本正是会泄露的东西。MetaDocu 会把 Info 字典与 XMP 包一并移除，这正是它清理过的文件不会携带隐藏第二副本的原因。",
        },
      },
      {
        q: { en: "Can I be sure the metadata is gone before filing?", zh: "提交前我能确定元数据已被移除吗？" },
        a: {
          en: "Yes. MetaDocu shows a verification report listing what was removed, and you can independently confirm: open the cleaned PDF's Document Properties in any viewer and the author, title, dates and producer fields should be blank. Because MetaDocu strips the fields from the PDF's structure — both the Info dictionary and the XMP stream — rather than hiding them, the values are physically absent, not merely blanked on screen. That gives you something defensible to rely on before a filing.",
          zh: "可以。MetaDocu 会显示一份列出移除内容的验证报告，你也可独立确认：在任意查看器中打开清理后 PDF 的「文档属性」，作者、标题、日期与生成软件字段应为空。由于 MetaDocu 从 PDF 结构中（Info 字典与 XMP 流两处）清除字段而非隐藏，数值是物理缺失而非仅在屏幕上置空。这能在提交前给你一个可依凭的依据。",
        },
      },
    ],
    ctaTitle: { en: "Disclose the content, not the metadata", zh: "披露内容，而非元数据" },
    ctaDesc: { en: "Remove the Info dictionary and XMP stream in your browser — nothing uploaded.", zh: "在浏览器内移除 Info 字典与 XMP 流——零上传。" },
    ctas: CLEAN_CTAS,
  },

  "scenario.photo-gps": {
    pageCode: "scenario.photo-gps",
    badge: { en: "Before you share", zh: "分享之前" },
    answerLead: {
      en: "Photos embedded in a Word or PDF document can carry EXIF metadata — including the exact GPS coordinates where the picture was taken, the camera make and model, the capture time and the editing software. When you share a report, listing or portfolio that contains those images, that location data travels with it and can pinpoint a home, office or site. MetaDocu strips EXIF and GPS from the images inside your DOCX, XLSX and PDF files, in your browser, without uploading anything, and keeps the picture itself intact. (It cleans images embedded in documents; it doesn't process standalone photo files.) A verification report confirms the location data is gone. Drop a document with embedded photos in below to scan and clean it.",
      zh: "嵌入 Word 或 PDF 文档中的照片可能携带 EXIF 元数据——包括拍摄地的精确 GPS 坐标、相机品牌与型号、拍摄时间以及修图软件。当你分享一份含这些图片的报告、房源或作品集时，位置数据会随之外流，可能定位到住所、办公室或现场。MetaDocu 在浏览器内从你的 DOCX、XLSX、PDF 文件里的图片中清除 EXIF 与 GPS，不上传任何内容，并保持图像本身不变。（它清理文档中嵌入的图片，不处理独立的照片文件。）验证报告会确认位置数据已被移除。在下方拖入含嵌入照片的文档即可扫描并清理。",
    },
    embedTool: "all",
    toolHeading: { en: "Scan & clean embedded image data", zh: "扫描并清理嵌入图片数据" },
    toolDesc: { en: "Word, Excel or PDF with embedded photos — processed in your browser.", zh: "含嵌入照片的 Word、Excel 或 PDF——在浏览器内处理。" },
    sections: [
      {
        heading: { en: "What image EXIF/GPS reveals", zh: "图片 EXIF/GPS 会暴露什么" },
        bullets: [
          { en: "Exact latitude/longitude of where a photo was taken — can map to your home or workplace.", zh: "照片拍摄地的精确经纬度——可定位到你的住所或工作地。" },
          { en: "Camera make, model and the editing software used — a device fingerprint.", zh: "相机品牌、型号与所用修图软件——一种设备指纹。" },
          { en: "The original capture timestamp, which may differ from the document's date.", zh: "原始拍摄时间戳，可能与文档日期不同。" },
        ],
      },
      {
        heading: { en: "A note on scope (no overclaiming)", zh: "关于适用范围的说明（不夸大）" },
        paragraphs: [
          { en: "MetaDocu removes EXIF/GPS from images that are embedded inside Office and PDF documents — the common leak when you paste photos into a report or listing. It is a document tool, so it doesn't process standalone .jpg/.heic files on their own. If your photos are inside a document, MetaDocu handles them; if you need to clean loose image files, use a dedicated image EXIF tool.", zh: "MetaDocu 从嵌入 Office 与 PDF 文档内部的图片中移除 EXIF/GPS——这正是你把照片粘进报告或房源时的常见泄露点。它是文档工具，因此不单独处理独立的 .jpg/.heic 文件。若你的照片在文档里，MetaDocu 可以处理；若你要清理散装图片文件，请使用专门的图片 EXIF 工具。" },
        ],
      },
    ],
    exposureFormat: "image",
    exposureTitle: { en: "Hidden data in embedded images", zh: "嵌入图片中的隐藏数据" },
    exposureIntro: { en: "What MetaDocu strips from images inside your documents, keeping the picture intact.", zh: "MetaDocu 从你文档内图片中剥离的内容，且保持图像不变。" },
    faqs: [
      {
        q: { en: "How do I remove GPS location from photos in my document?", zh: "如何移除文档中照片的 GPS 位置？" },
        a: {
          en: "Open the Word, Excel or PDF that contains the photos in MetaDocu, scan it, and clear the embedded-image EXIF/GPS in one click before downloading — locally, no upload. MetaDocu byte-strips the EXIF segments (including GPS latitude/longitude) from each embedded image while leaving the picture itself unchanged, so your report or listing looks identical but no longer reveals where the photos were taken. A verification report confirms the location data is gone. Note it cleans images inside documents, not standalone photo files.",
          zh: "在 MetaDocu 中打开含照片的 Word、Excel 或 PDF、扫描，一键清除嵌入图片的 EXIF/GPS 后下载——本地完成、零上传。MetaDocu 会从每张嵌入图片中按字节剥离 EXIF 段（含 GPS 经纬度），同时保持图像本身不变，因此你的报告或房源外观一致，却不再暴露照片拍摄地。验证报告会确认位置数据已被移除。注意它清理文档内的图片，而非独立照片文件。",
        },
      },
      {
        q: { en: "Does removing EXIF reduce the image quality?", zh: "移除 EXIF 会降低图片质量吗？" },
        a: {
          en: "No. EXIF lives in a separate metadata segment of the image file, not in the pixel data, so removing it doesn't recompress or degrade the picture. MetaDocu strips only the metadata bytes (camera, software, timestamp, GPS) and keeps the image stream intact, so the photo in your document looks exactly the same — same resolution, same clarity — just without the hidden location and device information attached.",
          zh: "不会。EXIF 存在于图片文件的独立元数据段中，而非像素数据里，因此移除它不会重新压缩或降低画质。MetaDocu 只剥离元数据字节（相机、软件、时间戳、GPS）并保持图像流不变，因此文档中的照片外观完全相同——分辨率与清晰度一致——只是不再附带隐藏的位置与设备信息。",
        },
      },
      {
        q: { en: "Can MetaDocu clean a standalone JPG or HEIC photo?", zh: "MetaDocu 能清理独立的 JPG 或 HEIC 照片吗？" },
        a: {
          en: "Not on its own — MetaDocu is a document tool that supports DOCX, DOC, XLSX and PDF, and it removes EXIF/GPS from images embedded inside those documents. That covers the most common accidental leak: pasting geotagged photos into a report, brochure or property listing. If your images are loose files rather than inside a document, a dedicated image-EXIF utility is the right tool. We mention this so you're not relying on MetaDocu for something it doesn't claim to do.",
          zh: "单独不行——MetaDocu 是支持 DOCX、DOC、XLSX、PDF 的文档工具，它从这些文档内部嵌入的图片中移除 EXIF/GPS。这覆盖了最常见的意外泄露：把带地理标记的照片粘进报告、宣传册或房源。若你的图片是散装文件而非文档内部，专门的图片 EXIF 工具才是正确选择。我们如实说明，免得你把 MetaDocu 用于它并未声称能做的事。",
        },
      },
    ],
    ctaTitle: { en: "Share the document, not your location", zh: "分享文档，而非你的位置" },
    ctaDesc: { en: "Strip embedded-image EXIF & GPS in your browser — nothing uploaded.", zh: "在浏览器内剥离嵌入图片的 EXIF 与 GPS——零上传。" },
    ctas: CLEAN_CTAS,
  },

  "scenario.rsid": {
    pageCode: "scenario.rsid",
    badge: { en: "Before you share", zh: "分享之前" },
    answerLead: {
      en: "Before sharing a Word document, remove its revision history — the tracked changes, comments, and the lesser-known RSIDs (revision save IDs). RSIDs are random identifiers Word writes for every editing session; because the same IDs appear across files you've worked on, they can link two seemingly unrelated documents to the same author or machine. Combined with surviving tracked changes and commenter names, they expose how a document evolved and who touched it. MetaDocu physically strips RSID nodes from the document XML, removes the comment and revision parts, and clears the author/company fields — in your browser, nothing uploaded — then verifies the result. Drop your .docx in below to scan and clean it.",
      zh: "在分享 Word 文档前，先移除它的修订历史——修订痕迹、批注，以及较少人知的 RSID（修订会话 ID）。RSID 是 Word 为每次编辑会话写入的随机标识；由于相同的 ID 会出现在你处理过的多个文件中，它们能把两份看似无关的文档关联到同一作者或机器。再加上残留的修订痕迹与批注者姓名，它们会暴露一份文档如何演变、被谁碰过。MetaDocu 会从文档 XML 中物理剥离 RSID 节点、移除批注与修订部件、清除作者/公司字段——在浏览器内、零上传——然后验证结果。在下方拖入你的 .docx 即可扫描并清理。",
    },
    embedTool: "word",
    toolHeading: { en: "Scan & clean your Word document", zh: "扫描并清理你的 Word 文档" },
    toolDesc: { en: "DOCX or DOC — processed in your browser, never uploaded.", zh: "DOCX 或 DOC——在浏览器内处理，绝不上传。" },
    sections: [
      {
        heading: { en: "What RSIDs are and why they matter", zh: "RSID 是什么，为什么重要" },
        paragraphs: [
          { en: "An RSID (revision save ID) is a random value Word stamps onto runs of text and into settings.xml on each save session. They're invisible in the document but persist in the XML. Because a given machine/install reuses RSID values across documents, a recipient with two of your files can correlate them — establishing that the same person or computer produced both, even when you intended them to look independent. Removing the RSID nodes breaks that cross-file fingerprint.", zh: "RSID（修订会话 ID）是 Word 在每次保存会话时打在文本游程上、并写入 settings.xml 的随机值。它们在文档中不可见，却留存于 XML 里。由于同一台机器/安装会在多个文档间复用 RSID 值，持有你两份文件的收件人可以将它们关联起来——证明二者出自同一人或同一台电脑，即便你本想让它们看起来彼此独立。移除 RSID 节点可切断这种跨文件指纹。" },
        ],
      },
    ],
    exposureFormat: "docx",
    exposureTitle: { en: "Revision data hidden in a Word file", zh: "Word 文件中隐藏的修订数据" },
    exposureIntro: { en: "The revision-related fields MetaDocu removes from a .docx, alongside the usual metadata.", zh: "MetaDocu 从 .docx 中移除的与修订相关的字段，连同常规元数据一并清除。" },
    faqs: [
      {
        q: { en: "How do I remove revision history and RSIDs from a Word document?", zh: "如何从 Word 文档中移除修订历史和 RSID？" },
        a: {
          en: "Open the .docx in MetaDocu, scan it, and remove the revision data in one click before downloading — in your browser, nothing uploaded. MetaDocu physically strips the RSID nodes from settings.xml and the run-level markup, removes the comment and tracked-change parts, and clears author, company and last-modified-by. That eliminates both the visible revision history and the hidden RSID fingerprint that can correlate your documents. A verification report confirms what was removed, so you can share the file knowing its editing history doesn't travel with it.",
          zh: "在 MetaDocu 中打开 .docx、扫描，一键移除修订数据后下载——在浏览器内、零上传。MetaDocu 会从 settings.xml 与游程级标记中物理剥离 RSID 节点、移除批注与修订部件，并清除作者、公司与最后修改者。这同时消除了可见的修订历史与可关联你文档的隐藏 RSID 指纹。验证报告会确认移除内容，让你在分享文件时确信其编辑历史不会随之外流。",
        },
      },
      {
        q: { en: "What are RSIDs and can they really identify me?", zh: "RSID 是什么，真能识别出我吗？" },
        a: {
          en: "RSIDs are random per-session identifiers Word adds while you edit. On their own they don't contain your name, but because the same machine reuses RSID values across documents, they act as a correlation fingerprint: someone holding two of your files can show they came from the same source. In analyses of leaked or published documents, RSIDs and other metadata have been used to link or de-anonymize authors. Removing them — which MetaDocu does at the XML level — closes that linkage.",
          zh: "RSID 是 Word 在你编辑时添加的随机会话标识。它们本身不含你的姓名，但由于同一台机器会在多个文档间复用 RSID 值，它们起到关联指纹的作用：持有你两份文件的人可以证明它们同源。在对泄露或公开文档的分析中，RSID 与其他元数据曾被用来关联或去匿名化作者。移除它们——MetaDocu 在 XML 层做到这一点——即可切断这种关联。",
        },
      },
      {
        q: { en: "Will removing RSIDs and comments change my document's text?", zh: "移除 RSID 和批注会改变文档正文吗？" },
        a: {
          en: "No. RSIDs are invisible markup, so removing them has no effect on your visible text, formatting or layout. Removing comments and resolved tracked changes deletes the review annotations and any leftover deleted-text remnants — which is the point — but your accepted, final content stays exactly as it reads. The output is the same document you see on screen, minus the hidden revision history and correlation fingerprint. MetaDocu does this locally and shows you a report of what changed.",
          zh: "不会。RSID 是不可见的标记，移除它们对你的可见正文、格式或排版没有影响。移除批注与已解决的修订会删除审阅注释及任何残留的删除文字——这正是目的——但你已接受的终稿内容与所见完全一致。输出就是你屏幕上看到的同一份文档，只是去掉了隐藏的修订历史与关联指纹。MetaDocu 在本地完成并给你一份变更报告。",
        },
      },
    ],
    ctaTitle: { en: "Share the document, not its history", zh: "分享文档，而非它的历史" },
    ctaDesc: { en: "Strip RSIDs, comments and revision history in your browser — nothing uploaded.", zh: "在浏览器内剥离 RSID、批注与修订历史——零上传。" },
    ctas: CLEAN_CTAS,
  },

  // ────────────────────────────── C4. Original research / explainer ──────────────────────────────
  "research.metadata-leak": {
    pageCode: "research.metadata-leak",
    badge: { en: "Research & explainer", zh: "研究与解读" },
    updated: "2026-06-09",
    answerLead: {
      en: "Document metadata leakage is common because it's automatic and invisible: you don't add it, you can't see it on the page, and most people never remove it. Every Word, Excel or PDF created with a signed-in Office account embeds the account holder's display name as the author by default; the company name from your licence is written in too; PDFs record the producing software, creation and modification timestamps in an Info dictionary and a duplicate XMP stream. None of this shows when you read the document, so it ships unnoticed. This page explains the mechanisms that make leakage the default, catalogues the specific fields each format carries (with their technical locations), and describes a transparent methodology for quantifying real-world exposure rates. It uses only verifiable, mechanism-level facts — no invented statistics.",
      zh: "文档元数据泄露之所以普遍，是因为它自动且不可见：你没有主动添加，页面上看不到，而多数人从不移除。每个用已登录 Office 账户创建的 Word、Excel 或 PDF，默认会把账户持有者的显示名作为作者嵌入；来自授权的公司名也会被写入；PDF 会在 Info 字典与一份重复的 XMP 流中记录生成软件、创建与修改时间戳。这些在你阅读文档时都不显示，于是悄无声息地随文件外流。本页解释让泄露成为默认状态的机制、编目每种格式携带的具体字段（含其技术位置），并描述一套用于量化真实暴露率的透明方法。全文只采用可验证的机制级事实——不含任何编造的统计数字。",
    },
    sections: [
      {
        heading: { en: "Why leakage is the default, not the exception", zh: "为什么泄露是默认而非例外" },
        bullets: [
          { en: "Authorship is automatic: Office writes your account display name into dc:creator without asking.", zh: "作者身份是自动的：Office 不经询问就把你的账户显示名写入 dc:creator。" },
          { en: "It's invisible: none of these fields render in the document body, so there's no visual cue to remove them.", zh: "它不可见：这些字段都不在文档正文中呈现，因此没有提示你去移除的视觉线索。" },
          { en: "It's duplicated: PDFs store metadata in both the Info dictionary and an XMP stream, so a partial clean leaves a copy.", zh: "它是重复的：PDF 把元数据同时存于 Info 字典与 XMP 流，因此局部清理会留下副本。" },
          { en: "It survives edits: tracked-change remnants and RSIDs persist in the XML even after 'accept all changes'.", zh: "它在编辑后残留：修订痕迹残余与 RSID 即便在「接受所有修订」后仍留在 XML 中。" },
          { en: "Conversion carries it: 'Save as PDF' transfers the original author and timestamps rather than removing them.", zh: "转换会带过去：「另存为 PDF」会转移原始作者与时间戳，而非将其移除。" },
        ],
      },
      {
        heading: { en: "What each format carries", zh: "每种格式携带什么" },
        paragraphs: [
          { en: "The table below is the field-level map MetaDocu works from — the specific hidden fields in Word, Excel, PDF and embedded images, where each physically lives, what it exposes, and how it's removed. These are structural facts about the OOXML and PDF formats, independently verifiable by inspecting any file's XML or object tree.", zh: "下表是 MetaDocu 所依据的字段级地图——Word、Excel、PDF 与嵌入图片中的具体隐藏字段、各自的物理位置、暴露什么以及如何移除。这些是关于 OOXML 与 PDF 格式的结构性事实，可通过检查任意文件的 XML 或对象树独立验证。" },
        ],
      },
      {
        heading: { en: "Methodology for quantifying exposure (transparent, reproducible)", zh: "量化暴露率的方法（透明、可复现）" },
        bullets: [
          { en: "Sample: collect a defined set of publicly available documents (e.g. resumes, public-body PDFs) under their licences/terms.", zh: "样本：在其许可/条款下，收集一组明确界定的公开文档（如简历、公共机构 PDF）。" },
          { en: "Measure locally: run each file through MetaDocu's scanner in the browser and record which fields are non-empty.", zh: "本地测量：在浏览器中用 MetaDocu 扫描器处理每个文件，记录哪些字段非空。" },
          { en: "Aggregate: report the share of files exposing a real name, a company, a local path, GPS, or revision history.", zh: "汇总：报告暴露真名、公司、本地路径、GPS 或修订历史的文件占比。" },
          { en: "Publish method + numbers together, so the rates are reproducible rather than asserted.", zh: "方法与数字一并公布，使比率可复现而非空口断言。" },
        ],
      },
    ],
    exposureFormat: undefined,
    exposureTitle: { en: "The field-level exposure map (all formats)", zh: "字段级暴露地图（全部格式）" },
    exposureIntro: { en: "Each hidden field, its technical location, what it leaks, and how MetaDocu removes it — verifiable structural facts.", zh: "每个隐藏字段、其技术位置、泄露什么，以及 MetaDocu 如何移除——可验证的结构性事实。" },
    faqs: [
      {
        q: { en: "How common is metadata leakage in documents?", zh: "文档中的元数据泄露有多普遍？" },
        a: {
          en: "It's the default rather than the exception, because the leak is automatic and invisible. Any Word, Excel or PDF made with a signed-in Office account embeds the author's display name and often the company name without the user doing anything, and these fields never appear in the visible document — so they're rarely removed. PDFs compound it by storing metadata twice (Info dictionary plus XMP). Rather than cite an invented percentage, we describe the mechanisms that make exposure near-universal and provide a reproducible methodology to measure real rates on a defined sample.",
          zh: "它是默认而非例外，因为这种泄露自动且不可见。任何用已登录 Office 账户创建的 Word、Excel 或 PDF，都会在用户毫无操作的情况下嵌入作者显示名、常常还有公司名，而这些字段从不出现在可见文档中——因此很少被移除。PDF 把元数据存两份（Info 字典加 XMP）更使其雪上加霜。我们不引用编造的百分比，而是描述使暴露近乎普遍的机制，并提供一套可复现的方法，在明确样本上测量真实比率。",
        },
      },
      {
        q: { en: "Has document metadata ever caused a real privacy incident?", zh: "文档元数据真的造成过隐私事件吗？" },
        a: {
          en: "Yes — metadata in published documents has repeatedly been used to identify authors, link supposedly independent files, and reveal editing timelines, which is why newsrooms, law firms and government bodies adopt metadata-removal policies. We deliberately avoid attaching specific names or numbers we can't verify here; the verifiable, general point is that author fields, timestamps and RSIDs provide exactly the kind of identifying and correlating signal that has driven those policies. The practical takeaway is to remove the data before sharing, which this tool does locally.",
          zh: "是的——已发布文档中的元数据曾多次被用来识别作者、关联本应彼此独立的文件、揭示编辑时间线，这正是新闻编辑部、律所与政府机构采纳元数据移除政策的原因。我们刻意不在此附上无法核实的具体名称或数字；可验证的普遍要点是：作者字段、时间戳与 RSID 恰好提供了推动这些政策的那类识别与关联信号。务实的结论是在分享前移除这些数据——本工具在本地完成此事。",
        },
      },
      {
        q: { en: "How can I check what my own documents are leaking?", zh: "我怎么检查自己的文档在泄露什么？" },
        a: {
          en: "Run them through MetaDocu's scanner: drop a Word, Excel or PDF into the tool and it lists every populated metadata field — author, company, last-modified-by, paths, timestamps, RSIDs, XMP, embedded-image EXIF/GPS — in your browser, with nothing uploaded. That's both a privacy check and the same measurement step in the methodology above. You can then clear the fields in one click and download a verified-clean copy. Because it's local, you can audit even sensitive files without sending them anywhere.",
          zh: "用 MetaDocu 扫描器跑一遍：把 Word、Excel 或 PDF 拖入工具，它会在浏览器内列出每个已填充的元数据字段——作者、公司、最后修改者、路径、时间戳、RSID、XMP、嵌入图片的 EXIF/GPS——且不上传任何内容。这既是隐私检查，也是上述方法中的同一测量步骤。随后你可一键清除字段并下载经验证的干净副本。由于在本地进行，你甚至可以审计敏感文件而无需将其发往任何地方。",
        },
      },
    ],
    ctaTitle: { en: "Check what your documents are leaking", zh: "检查你的文档在泄露什么" },
    ctaDesc: { en: "Scan any Word, Excel or PDF in your browser — see every exposed field, nothing uploaded.", zh: "在浏览器内扫描任意 Word、Excel 或 PDF——看清每个暴露字段，零上传。" },
    ctas: CLEAN_CTAS,
  },
}

export function getLandingPage(pageCode: string): LandingPageContent | undefined {
  return LANDING_PAGES[pageCode]
}
