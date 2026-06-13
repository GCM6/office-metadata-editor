import type { SeoPageContract } from "./seo-types"

export const seoMap: Record<string, SeoPageContract> = {
  home: {
    pageCode: "home",
    path: "/",
    level: 1,
    pageType: "home",
    primaryKeyword: "Office元数据在线编辑器",
    secondaryKeywords: [
      "在线修改Office文档属性",
      "清除文档元数据",
      "Word作者信息修改",
      "PDF属性编辑",
      "Excel元数据清除",
      "DOCX元数据编辑器",
      "免费在线元数据工具",
      "隐私保护文档工具",
      "批量处理Office元数据",
    ],
    intent: "mixed",
    serpPageType: "home",
    indexable: true,
    title: "发送前清除 Word/Excel/PDF 文档隐藏数据 - 浏览器本地元数据清理 | MetaDocu",
    description:
      "在发送或分享文档前，于浏览器本地扫描、清除并验证 Word、Excel、PDF 中的隐藏元数据——作者、公司、本地路径、修订历史，文件零上传，保护您的隐私。",
    keywords: [
      "Office元数据编辑器",
      "修改文档属性",
      "在线清除元数据",
      "Word作者修改",
      "PDF属性编辑",
    ],
    h1: "发送文档前，清除其中的隐藏数据",
    canonical: "/",
    og: {
      title: "Office元数据在线编辑器 - 免费修改文档属性，全程本地处理",
      description:
        "在线编辑Word、Excel、PDF元数据，无需上传服务器，保护文档隐私安全。支持批量处理，一键清除敏感信息。",
      image: "/og-default.png",
    },
    schemaTypes: ["Organization", "FAQPage"],
    internalLinksTo: ["tool.word", "tool.excel", "tool.pdf", "trust.is-it-safe", "compare.metadatakit"],
    paaQuestions: [
      "如何在线修改Word文档的作者信息？",
      "Office文档元数据包含哪些信息？",
      "PDF文件的属性信息可以修改吗？",
      "如何批量清除多个文档的元数据？",
      "在线修改文档元数据安全吗？",
    ],
    status: "published",
    en: {
      title: "Clean Hidden Metadata Before You Share | MetaDocu",
      description: "Scan, remove, and verify hidden metadata in Word, Excel, and PDF documents before you share — 100% in your browser, nothing uploaded. Free, no accounts.",
      h1: "Clean Hidden Data From Your Documents Before You Share",
      keywords: [
        "Office metadata editor",
        "Edit document properties",
        "Remove metadata online",
        "Word author editor",
        "PDF properties editor",
        "Excel metadata cleaner",
        "DOCX metadata editor",
        "Free online metadata tool"
      ],
      og: {
        title: "Office Metadata Editor Online - Free Edit Document Properties, 100% Local",
        description: "Edit Word, Excel, and PDF metadata online. No server upload, protecting your privacy. Supports batch processing and one-click removal.",
        image: "/og-default.png"
      }
    },
  },

  "tool.word": {
    pageCode: "tool.word",
    path: "/tools/word",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "在线修改Word文档属性",
    secondaryKeywords: [
      "修改DOCX作者",
      "清除Word元数据",
      "Word文档隐私保护",
      "docx属性编辑器在线",
    ],
    intent: "transactional",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "在线修改Word文档属性 - 修改作者、清除元数据 | Office元数据编辑器",
    description:
      "免费在线修改Word(.docx)文档属性，轻松删除原始作者、公司名称、修改日期等隐藏信息。无需安装软件，全程本地处理，保护文档隐私。",
    h1: "Word 文档元数据在线编辑器",
    canonical: "/tools/word",
    internalLinksTo: ["home", "tool.pdf", "tool.excel", "trust.is-it-safe"],
    schemaTypes: ["FAQPage", "SoftwareApplication"],
    paaQuestions: [
      "Word文档的元数据在哪里查看？",
      "修改Word文档属性后对方能发现吗？",
      "如何彻底删除Word文档中的个人隐私信息？",
      "DOCX和DOC的元数据有什么区别？",
    ],
    status: "published",
    en: {
      title: "Edit Word Document Properties Online - Modify Author & Clear Metadata | Office Metadata Editor",
      description: "Free online Word (.docx) document properties editor. Easily delete original author, company name, modification dates, and other hidden metadata. 100% local, safe and private.",
      h1: "Word Document Metadata Online Editor",
      paaQuestions: [
        "What hidden metadata is in a Word document?",
        "Can others still see the properties after deleting them?",
        "How to batch delete privacy information from multiple Word documents?",
        "Will metadata be preserved after converting Word to PDF?"
      ]
    }
  },

  "tool.excel": {
    pageCode: "tool.excel",
    path: "/tools/excel",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "在线修改Excel文档属性",
    secondaryKeywords: ["修改XLSX属性", "清除Excel元数据", "Excel工作簿信息修改"],
    intent: "transactional",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "在线修改Excel文档属性 - 清除工作簿元数据 | Office元数据编辑器",
    description:
      "免费在线修改Excel(.xlsx)文档属性，编辑作者、标题、公司等工作簿信息。全程本地处理，无需上传文件，保障数据安全。",
    h1: "Excel 工作簿元数据在线编辑器",
    canonical: "/tools/excel",
    internalLinksTo: ["home", "tool.word", "tool.pdf", "trust.is-it-safe"],
    schemaTypes: ["FAQPage", "SoftwareApplication"],
    paaQuestions: [
      "Excel工作簿的元数据包含哪些信息？",
      "如何批量修改多个Excel文件的属性？",
      "Excel属性修改后会影响公式和图表吗？",
    ],
    status: "published",
    en: {
      title: "Edit Excel Document Properties Online - Clear Workbook Metadata | Office Metadata Editor",
      description: "Free online Excel (.xlsx) workbook properties editor. Edit author, title, company, and other properties. 100% local, protecting your business data privacy.",
      h1: "Excel Workbook Metadata Online Editor",
      paaQuestions: [
        "What information is included in Excel workbook metadata?",
        "How to batch edit the properties of multiple Excel files?",
        "Will Excel formulas and charts be affected after modifying properties?"
      ]
    }
  },

  "tool.pdf": {
    pageCode: "tool.pdf",
    path: "/tools/pdf",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "在线修改PDF文档属性",
    secondaryKeywords: ["修改PDF元数据", "清除PDF属性信息", "PDF作者修改", "PDF信息编辑"],
    intent: "transactional",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "在线修改PDF文档属性 - 编辑PDF元数据信息 | Office元数据编辑器",
    description:
      "免费在线编辑PDF文档属性，修改作者、标题、主题等元数据信息。无需安装Adobe Acrobat，全程本地处理，安全便捷。",
    h1: "PDF 文档元数据在线编辑器",
    canonical: "/tools/pdf",
    internalLinksTo: ["home", "tool.word", "tool.excel", "trust.is-it-safe"],
    schemaTypes: ["FAQPage", "SoftwareApplication"],
    paaQuestions: [
      "PDF文件的元数据存储在什么地方？",
      "将Word转为PDF后元数据会保留吗？",
      "如何彻底清除PDF中的所有隐藏信息？",
      "在线修改PDF属性需要上传文件吗？",
    ],
    status: "published",
    en: {
      title: "Edit PDF Document Properties Online - Modify PDF Metadata | Office Metadata Editor",
      description: "Free online PDF document properties editor. Modify PDF author, title, subject, and other metadata. No Adobe Acrobat required. 100% local, safe and convenient.",
      h1: "PDF Document Metadata Online Editor",
      paaQuestions: [
        "Where is PDF file metadata stored?",
        "Will metadata be preserved after converting Word to PDF?",
        "How to completely clear all hidden information in a PDF?",
        "Do I need to upload files to edit PDF properties online?"
      ]
    }
  },

  editor: {
    pageCode: "editor",
    path: "/editor",
    level: 1,
    pageType: "tool-detail",
    primaryKeyword: "Office元数据在线编辑",
    secondaryKeywords: [
      "文档元数据编辑器",
      "在线查看修改文档属性",
      "docx属性编辑",
      "xlsx元数据修改",
    ],
    intent: "transactional",
    serpPageType: "tool-detail",
    indexable: false,
    parentPageCode: "home",
    title: "Office元数据在线编辑 | Office元数据编辑器",
    description:
      "在线编辑Office文档元数据，支持Word、Excel、PDF文件。直接在浏览器中修改文档属性，全程本地处理，安全高效。",
    h1: "Office 文档元数据编辑",
    canonical: "/editor",
    internalLinksTo: ["home"],
    status: "published",
    en: {
      title: "Office Metadata Online Editor | Office Metadata Editor",
      description: "Edit Office document metadata online. Support Word, Excel, and PDF files. Directly modify document properties in your browser. 100% local and efficient.",
      h1: "Office Document Metadata Editor"
    }
  },

  batch: {
    pageCode: "batch",
    path: "/batch",
    level: 1,
    pageType: "tool-detail",
    primaryKeyword: "Office元数据批量处理",
    secondaryKeywords: ["批量修改文档属性", "批量清除元数据", "批量处理Office文件"],
    intent: "transactional",
    serpPageType: "tool-detail",
    indexable: false,
    parentPageCode: "home",
    title: "Office元数据批量处理 - 一键修改多个文档属性 | Office元数据编辑器",
    description:
      "批量处理Office文档元数据，支持同时修改多个Word、Excel、PDF文件的属性。一键清除或批量替换，大幅提升工作效率。",
    h1: "批量处理 Office 文档元数据",
    canonical: "/batch",
    internalLinksTo: ["home"],
    status: "published",
    en: {
      title: "Batch Office Metadata Processing - Edit Multiple Document Properties | Office Metadata Editor",
      description: "Batch process Office document metadata. Support modifying properties of multiple Word, Excel, and PDF files simultaneously. Clear or replace in one click.",
      h1: "Batch Office Document Metadata Processing"
    }
  },

  blog: {
    pageCode: "blog",
    path: "/blog",
    level: 2,
    pageType: "blog-hub",
    primaryKeyword: "Office文档元数据知识",
    secondaryKeywords: ["文档隐私保护指南", "元数据修改技巧", "Office安全使用"],
    intent: "informational",
    serpPageType: "blog-hub",
    indexable: true,
    parentPageCode: "home",
    title: "Office文档元数据知识 - 隐私保护与编辑技巧 | Office元数据编辑器",
    description:
      "学习Office文档元数据相关知识，了解如何保护文档隐私、修改文档属性、清除隐藏信息。专业实用的Office文档安全使用指南。",
    h1: "Office 文档元数据知识库",
    canonical: "/blog",
    internalLinksTo: ["home", "tool.word", "tool.excel", "tool.pdf"],
    schemaTypes: ["ItemList"],
    status: "published",
    en: {
      title: "Office Document Metadata Knowledge - Privacy Protection & Editing Tips | Office Metadata Editor",
      description: "Learn about Office document metadata, how to protect document privacy, modify properties, and clear hidden information. Professional guide for safe Office usage.",
      h1: "Office Document Metadata Knowledge Hub"
    }
  },

  "blog.remove-author-docx": {
    pageCode: "blog.remove-author-docx",
    path: "/blog/remove-original-author-docx",
    level: 3,
    pageType: "blog-post",
    primaryKeyword: "如何删除Word文档中的原始作者信息",
    secondaryKeywords: [
      "彻底清除docx个人隐私",
      "Word文档作者怎么修改",
      "删除文档属性信息",
      "Office文档安全检查",
    ],
    intent: "informational",
    serpPageType: "blog-post",
    indexable: true,
    parentPageCode: "blog",
    title: "如何彻底删除Word文档中的原始作者信息？完整指南 | Office元数据编辑器",
    description:
      "教你如何彻底删除Word(.docx)文档中的原始作者、公司名称、修订记录等隐藏元数据。保护文档隐私，避免敏感信息泄露的专业指南。",
    h1: "如何彻底删除 Word 文档中的原始作者信息",
    canonical: "/blog/remove-original-author-docx",
    internalLinksTo: ["tool.word", "home"],
    schemaTypes: ["Article", "BreadcrumbList"],
    paaQuestions: [
      "Word文档中有哪些隐藏的元数据？",
      "删除文档属性后对方还能看到吗？",
      "如何批量删除多个Word文档的隐私信息？",
    ],
    status: "published",
    en: {
      title: "How to Completely Delete Original Author Information in Word? Guide | Office Metadata Editor",
      description: "Learn how to completely delete original author, company name, revision history, and other hidden metadata in Word (.docx) documents. Avoid privacy leakage.",
      h1: "How to Completely Delete Original Author Information in Word",
      paaQuestions: [
        "What hidden metadata is in a Word document?",
        "Can others still see the properties after deleting them?",
        "How to batch delete privacy information from multiple Word documents?"
      ]
    }
  },

  about: {
    pageCode: "about",
    path: "/about",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "About MetaDocu",
    secondaryKeywords: ["MetaDocu team", "document privacy tool", "browser local metadata scanner"],
    intent: "informational",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "关于 MetaDocu - 发送前清除文档隐藏数据的本地工具",
    description: "了解 MetaDocu 的使命与技术——一款免费的、100% 浏览器本地运行的文档隐私工具，让你在发送前清除文档中的隐藏元数据。",
    h1: "关于 MetaDocu",
    canonical: "/about",
    internalLinksTo: ["home", "tool.word", "tool.excel", "tool.pdf"],
    schemaTypes: ["BreadcrumbList"],
    status: "published",
    en: {
      title: "About MetaDocu - Clean Document Data Before Sharing",
      description: "Learn about MetaDocu — a free, 100% browser-local document privacy tool that lets you clean hidden metadata from Word, Excel, and PDF files before you share them. No uploads, no servers.",
      h1: "About MetaDocu"
    }
  },

  "trust.is-it-safe": {
    pageCode: "trust.is-it-safe",
    path: "/is-it-safe",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "在线去除元数据安全吗",
    secondaryKeywords: [
      "is it safe to remove metadata online",
      "does metadata remover upload my files",
      "remove metadata without uploading",
      "in-browser metadata cleaning",
      "local metadata processing safe",
    ],
    intent: "informational",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "在线去除元数据安全吗？文件会上传吗 | MetaDocu",
    description:
      "安全——MetaDocu 全程不上传。文件通过 WebAssembly 在你的浏览器里扫描与清理，永不离开设备。本页讲清原理、本地 vs 上传对比，以及如何验证文件已干净。",
    h1: "在线去除元数据安全吗？MetaDocu 如何在本地工作",
    canonical: "/is-it-safe",
    internalLinksTo: ["home", "tool.word", "tool.pdf", "guide.before-sending", "scenario.resume", "scenario.contract"],
    schemaTypes: ["FAQPage", "BreadcrumbList"],
    paaQuestions: [
      "在线去除元数据安全吗？文件会被上传吗？",
      "MetaDocu 的浏览器本地处理是如何工作的？",
      "为什么本地处理比上传式工具更安全？",
      "清理后如何确认文件已经干净？",
      "本地处理会改变我的文件内容或格式吗？",
    ],
    status: "published",
    en: {
      title: "Is It Safe to Remove Metadata Online? | MetaDocu",
      description:
        "Yes — with MetaDocu nothing is uploaded. Your files are scanned and cleaned 100% in your browser, so they never leave your device. Here's exactly how it works.",
      h1: "Is It Safe to Remove Metadata Online? How MetaDocu Works",
      paaQuestions: [
        "Is it safe to remove metadata online? Are my files uploaded?",
        "How does MetaDocu's in-browser processing work?",
        "Why is local processing safer than upload-based tools?",
        "How can I verify my file is clean after removing metadata?",
        "Does local processing change my file's content or formatting?",
      ],
    },
  },

  "compare.metadatakit": {
    pageCode: "compare.metadatakit",
    path: "/metadatakit-alternative",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "MetadataKit 替代方案",
    secondaryKeywords: [
      "MetadataKit alternative",
      "document metadata remover no upload",
      "alternative to MetadataKit for documents",
      "Word PDF metadata cleaner before sharing",
    ],
    intent: "commercial",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "MetadataKit 替代方案：发送前清理文档隐私 | MetaDocu",
    description:
      "MetaDocu 与 MetadataKit 都是免费、100% 本地、不上传的元数据工具。区别在重心：MetadataKit 格式广、强于照片/音频/视频；MetaDocu 专注 Word/Excel/PDF 文档隐私与发送前清理验证。客观对比，帮你选对工具。",
    h1: "MetadataKit 替代方案：专注文档隐私的本地清理工具",
    canonical: "/metadatakit-alternative",
    internalLinksTo: ["home", "compare.ilovepdf", "compare.smallpdf", "tool.pdf", "trust.is-it-safe"],
    schemaTypes: ["FAQPage", "BreadcrumbList"],
    paaQuestions: [
      "MetaDocu 和 MetadataKit 有什么区别？",
      "有没有专注文档（Word/Excel/PDF）的 MetadataKit 替代品？",
      "MetaDocu 和 MetadataKit 都是本地处理、不上传吗？",
      "什么时候该用 MetaDocu，什么时候用 MetadataKit？",
    ],
    status: "published",
    en: {
      title: "MetadataKit Alternative for Document Privacy | MetaDocu",
      description:
        "MetaDocu and MetadataKit are both free, 100% local, no-upload metadata tools. The difference is focus: MetadataKit is broad and strong on photos/audio/video; MetaDocu is built for Word/Excel/PDF document privacy and before-sharing cleanup. An honest comparison.",
      h1: "MetadataKit Alternative — Focused on Document Privacy",
      paaQuestions: [
        "What's the difference between MetaDocu and MetadataKit?",
        "Is there a MetadataKit alternative focused on documents?",
        "Do both MetaDocu and MetadataKit process locally without uploading?",
        "When should I use MetaDocu vs MetadataKit?",
      ],
    },
  },

  "compare.ilovepdf": {
    pageCode: "compare.ilovepdf",
    path: "/ilovepdf-alternative",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "iLovePDF 去元数据替代方案",
    secondaryKeywords: [
      "iLovePDF alternative remove metadata",
      "remove PDF metadata no upload",
      "iLovePDF 替代 不上传",
    ],
    intent: "commercial",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "iLovePDF 元数据替代方案：本地清理不上传 | MetaDocu",
    description:
      "iLovePDF 在服务器处理文件；MetaDocu 在浏览器本地清除 Word/Excel/PDF 隐藏元数据，零上传并给出验证报告。客观对比，助你选对工具。",
    h1: "iLovePDF 元数据删除替代方案",
    canonical: "/ilovepdf-alternative",
    internalLinksTo: ["tool.pdf", "compare.metadatakit", "trust.is-it-safe", "home"],
    schemaTypes: ["FAQPage", "BreadcrumbList", "SoftwareApplication"],
    status: "published",
    en: {
      title: "iLovePDF Alternative for Removing Metadata (No Upload)",
      description:
        "iLovePDF processes files on its servers. MetaDocu removes Word/Excel/PDF metadata in your browser — no upload, with a verification report. Honest comparison.",
      h1: "iLovePDF Alternative for Removing Metadata",
    },
  },

  "compare.smallpdf": {
    pageCode: "compare.smallpdf",
    path: "/smallpdf-alternative",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "Smallpdf 元数据替代方案",
    secondaryKeywords: [
      "Smallpdf alternative metadata",
      "remove document metadata no upload",
      "Smallpdf 替代 文档元数据",
    ],
    intent: "commercial",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "Smallpdf 元数据替代方案：浏览器本地零上传 | MetaDocu",
    description:
      "Smallpdf 在云端处理文件；MetaDocu 100% 在浏览器本地清除 Word/Excel/PDF 隐藏元数据，无每日上限、无需账号、零上传。客观对比帮你选择。",
    h1: "Smallpdf 元数据删除替代方案",
    canonical: "/smallpdf-alternative",
    internalLinksTo: ["tool.pdf", "compare.metadatakit", "trust.is-it-safe", "home"],
    schemaTypes: ["FAQPage", "BreadcrumbList", "SoftwareApplication"],
    status: "published",
    en: {
      title: "Smallpdf Alternative for Document Metadata (No Upload)",
      description:
        "Smallpdf processes files in its cloud. MetaDocu removes Word/Excel/PDF metadata 100% in your browser — no upload, no limits, no account. Honest comparison.",
      h1: "Smallpdf Alternative for Document Metadata",
    },
  },

  "guide.without-acrobat": {
    pageCode: "guide.without-acrobat",
    path: "/remove-pdf-metadata-without-acrobat",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "不用 Acrobat 删除 PDF 元数据",
    secondaryKeywords: [
      "remove PDF metadata without Acrobat",
      "delete PDF metadata free",
      "PDF 去元数据 免费 不用 Adobe",
    ],
    intent: "mixed",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "不用 Acrobat 删除 PDF 元数据：免费浏览器本地 | MetaDocu",
    description:
      "无需 Adobe Acrobat 即可删除 PDF 元数据。MetaDocu 在浏览器本地清除作者、标题、Info 字典与 XMP 流，免费、零上传，并验证结果。",
    h1: "不用 Adobe Acrobat 删除 PDF 元数据",
    canonical: "/remove-pdf-metadata-without-acrobat",
    internalLinksTo: ["tool.pdf", "scenario.legal-pdf", "trust.is-it-safe", "home"],
    schemaTypes: ["FAQPage", "BreadcrumbList", "SoftwareApplication", "HowTo"],
    status: "published",
    en: {
      title: "Remove PDF Metadata Without Adobe Acrobat (Free)",
      description:
        "No Adobe Acrobat needed. MetaDocu removes PDF author, title, the Info dictionary and the XMP stream in your browser — free, no upload, verified.",
      h1: "Remove PDF Metadata Without Adobe Acrobat",
    },
  },

  "guide.before-sending": {
    pageCode: "guide.before-sending",
    path: "/remove-metadata-before-sending",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "发送文件前删除元数据",
    secondaryKeywords: [
      "remove metadata before sending a file",
      "best way to remove metadata",
      "clean document before sending",
    ],
    intent: "mixed",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "发送文件前删除元数据：浏览器本地清理指南 | MetaDocu",
    description:
      "发送前在浏览器本地清除 Word、Excel、PDF 中的作者、公司、路径、时间戳与修订历史，零上传并验证。按下发送前的推荐清理流程。",
    h1: "发送文件前删除元数据的最佳方式",
    canonical: "/remove-metadata-before-sending",
    internalLinksTo: ["tool.word", "tool.pdf", "trust.is-it-safe", "home"],
    schemaTypes: ["FAQPage", "BreadcrumbList", "SoftwareApplication", "HowTo"],
    status: "published",
    en: {
      title: "Remove Metadata Before Sending a File (Best Way)",
      description:
        "The best way to remove metadata before sending: clean Word, Excel & PDF in your browser, verify it, and send — no upload. A simple pre-send routine.",
      h1: "The Best Way to Remove Metadata Before Sending a File",
    },
  },

  "scenario.resume": {
    pageCode: "scenario.resume",
    path: "/remove-metadata-from-resume",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "投简历前删除作者和公司信息",
    secondaryKeywords: [
      "remove author from resume",
      "remove metadata from resume before applying",
      "简历 去元数据 公司 作者",
    ],
    intent: "transactional",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "投简历前清除简历元数据：作者与公司 | MetaDocu",
    description:
      "投递前删除简历中的作者姓名、公司、路径与时间戳。MetaDocu 在浏览器本地清理 Word/PDF 简历并验证，零上传，招聘方读不到隐藏信息。",
    h1: "投简历前删除作者与公司信息",
    canonical: "/remove-metadata-from-resume",
    internalLinksTo: ["tool.word", "tool.pdf", "trust.is-it-safe", "home"],
    schemaTypes: ["FAQPage", "BreadcrumbList", "SoftwareApplication"],
    status: "published",
    en: {
      title: "Remove Author & Company From a Resume Before Applying",
      description:
        "Recruiters and ATS can read your resume's metadata. Remove the author name, company and history from a Word/PDF resume in your browser — no upload.",
      h1: "Remove Author & Company From a Resume Before Applying",
    },
  },

  "scenario.contract": {
    pageCode: "scenario.contract",
    path: "/remove-metadata-from-contract",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "发送合同前清除元数据",
    secondaryKeywords: [
      "clean metadata from a contract",
      "remove tracked changes from contract",
      "合同 去元数据 修订痕迹",
    ],
    intent: "transactional",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "发送合同前清除元数据与修订痕迹 | MetaDocu",
    description:
      "发送合同前删除作者、公司、修订历史、批注与 RSID，避免泄露谈判底牌。MetaDocu 在浏览器本地清理 Word/PDF 合同并验证，零上传。",
    h1: "发送合同前，清理元数据与修订痕迹",
    canonical: "/remove-metadata-from-contract",
    internalLinksTo: ["tool.word", "tool.pdf", "scenario.rsid", "home"],
    schemaTypes: ["FAQPage", "BreadcrumbList", "SoftwareApplication"],
    status: "published",
    en: {
      title: "Clean Metadata From a Contract Before Sending It",
      description:
        "Remove author, company, tracked changes and comments from a contract before sending — don't leak your negotiating position. In-browser, no upload.",
      h1: "Clean Metadata From a Contract Before Sending",
    },
  },

  "scenario.legal-pdf": {
    pageCode: "scenario.legal-pdf",
    path: "/remove-metadata-from-legal-pdf",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "披露 PDF 前删除隐藏数据",
    secondaryKeywords: [
      "remove hidden data from legal PDF",
      "remove metadata from disclosure PDF",
      "法律 PDF 隐藏数据 删除",
    ],
    intent: "transactional",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "披露法律 PDF 前删除隐藏数据 | MetaDocu",
    description:
      "提交或披露法律 PDF 前，删除作者、律所、时间戳、Info 字典与 XMP 流。MetaDocu 在浏览器本地清理并验证，受特权材料零上传。",
    h1: "披露法律 PDF 前删除隐藏数据",
    canonical: "/remove-metadata-from-legal-pdf",
    internalLinksTo: ["tool.pdf", "guide.without-acrobat", "trust.is-it-safe", "home"],
    schemaTypes: ["FAQPage", "BreadcrumbList", "SoftwareApplication"],
    status: "published",
    en: {
      title: "Remove Hidden Data From a Legal or Disclosure PDF",
      description:
        "Court filings leak the drafter, firm and timestamps via PDF metadata. Remove the Info dictionary and XMP stream in your browser — no upload, verified.",
      h1: "Remove Hidden Data From a Legal PDF",
    },
  },

  "scenario.photo-gps": {
    pageCode: "scenario.photo-gps",
    path: "/remove-gps-exif-from-document-images",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "删除文档内嵌图片的 GPS 与 EXIF",
    secondaryKeywords: [
      "remove GPS from images in documents",
      "strip EXIF from embedded photos",
      "文档 图片 GPS EXIF 删除",
    ],
    intent: "transactional",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "删除文档内嵌图片的 GPS 与 EXIF | MetaDocu",
    description:
      "分享前删除 Word/PDF 内嵌图片的 GPS 坐标与 EXIF。MetaDocu 在浏览器本地剥离位置与相机信息并保持图像不变，零上传。",
    h1: "删除文档内嵌图片的 GPS 与 EXIF",
    canonical: "/remove-gps-exif-from-document-images",
    internalLinksTo: ["tool.word", "tool.pdf", "trust.is-it-safe", "home"],
    schemaTypes: ["FAQPage", "BreadcrumbList", "SoftwareApplication"],
    status: "published",
    en: {
      title: "Remove GPS & EXIF From Images in Your Documents",
      description:
        "Photos embedded in Word/PDF carry GPS and camera EXIF. MetaDocu strips location data from images inside your documents in the browser — no upload.",
      h1: "Remove GPS & EXIF From Images in Your Documents",
    },
  },

  "scenario.rsid": {
    pageCode: "scenario.rsid",
    path: "/remove-rsid-tracked-changes-word",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "删除 Word 的修订历史与 RSID",
    secondaryKeywords: [
      "remove RSID from Word",
      "remove revision history from docx",
      "Word 修订痕迹 RSID 删除",
    ],
    intent: "transactional",
    serpPageType: "tool-detail",
    indexable: true,
    parentPageCode: "home",
    title: "删除 Word 的 RSID 与修订历史 | MetaDocu",
    description:
      "分享前删除 Word 的修订痕迹、批注与 RSID（会话指纹）。MetaDocu 在 XML 层物理剥离 RSID 并清除作者信息，浏览器本地、零上传、可验证。",
    h1: "删除 Word 的修订历史、批注与 RSID",
    canonical: "/remove-rsid-tracked-changes-word",
    internalLinksTo: ["tool.word", "scenario.contract", "trust.is-it-safe", "home"],
    schemaTypes: ["FAQPage", "BreadcrumbList", "SoftwareApplication"],
    status: "published",
    en: {
      title: "Remove Revision History & RSIDs From Word",
      description:
        "Word stamps RSIDs that link your files. Remove tracked changes, comments and RSIDs from a .docx in your browser — physically, no upload, verified.",
      h1: "Remove Revision History (RSID & Tracked Changes) From Word",
    },
  },

  "research.metadata-leak": {
    pageCode: "research.metadata-leak",
    path: "/metadata-leak-study",
    level: 3,
    pageType: "blog-post",
    primaryKeyword: "文档元数据泄露普遍程度",
    secondaryKeywords: [
      "how common is metadata leakage",
      "document metadata privacy study",
      "元数据泄露 机制 普遍",
    ],
    intent: "informational",
    serpPageType: "blog-post",
    indexable: true,
    parentPageCode: "blog",
    title: "文档元数据泄露有多普遍？机制与方法 | MetaDocu",
    description:
      "文档元数据为何默认泄露：作者、公司、时间戳自动嵌入且不可见。本文用可验证的机制事实解释普遍性，并给出量化暴露率的透明方法。",
    h1: "文档元数据泄露有多普遍？机制、字段与测量方法",
    canonical: "/metadata-leak-study",
    internalLinksTo: ["tool.word", "tool.pdf", "trust.is-it-safe", "home"],
    schemaTypes: ["Article", "BreadcrumbList", "FAQPage"],
    status: "published",
    en: {
      title: "How Common Is Document Metadata Leakage?",
      description:
        "Document metadata leaks by default: author, company and timestamps are embedded automatically and invisibly. The mechanisms, the fields, and how to measure it.",
      h1: "How Common Is Document Metadata Leakage? A Study",
    },
  },

  privacy: {
    pageCode: "privacy",
    path: "/privacy",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "MetaDocu Privacy Policy",
    secondaryKeywords: ["privacy policy", "data protection", "local processing privacy"],
    intent: "informational",
    serpPageType: "tool-detail",
    indexable: false,
    parentPageCode: "home",
    title: "隐私政策 - MetaDocu",
    description: "MetaDocu 隐私政策——了解我们如何保护您的数据。100% 浏览器本地处理，零文件上传，零文档内容追踪。",
    h1: "隐私政策",
    canonical: "/privacy",
    internalLinksTo: ["home"],
    status: "published",
    en: {
      title: "Privacy Policy - MetaDocu",
      description: "MetaDocu Privacy Policy — Learn how we protect your data. 100% browser-local processing, zero file uploads, zero tracking of document content.",
      h1: "Privacy Policy"
    }
  },

  terms: {
    pageCode: "terms",
    path: "/terms",
    level: 2,
    pageType: "tool-detail",
    primaryKeyword: "MetaDocu Terms of Service",
    secondaryKeywords: ["terms of service", "usage terms", "service agreement"],
    intent: "informational",
    serpPageType: "tool-detail",
    indexable: false,
    parentPageCode: "home",
    title: "服务条款 - MetaDocu",
    description: "MetaDocu 服务条款——了解使用我们免费的浏览器本地文档元数据扫描器和编辑器的相关条款。",
    h1: "服务条款",
    canonical: "/terms",
    internalLinksTo: ["home"],
    status: "published",
    en: {
      title: "Terms of Service - MetaDocu",
      description: "MetaDocu Terms of Service — Understand the terms governing use of our free, browser-local document metadata scanner and editor.",
      h1: "Terms of Service"
    }
  },
}

export function getPublishedPages(): SeoPageContract[] {
  return Object.values(seoMap).filter((page) => page.status === "published" && page.indexable)
}

export function getIndexablePages(): SeoPageContract[] {
  return Object.values(seoMap).filter((page) => page.indexable)
}
