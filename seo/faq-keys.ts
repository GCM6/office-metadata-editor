/**
 * Maps Chinese question text to stable key IDs for i18n answer lookup.
 * Used by SeoContent to bridge seoMap paaQuestions (Chinese text) to
 * translated answers in messages JSON (keyed by semantic ID).
 */
const faqKeyMap: Record<string, string> = {
  // Chinese Questions
  "如何在线修改Word文档的作者信息？": "edit-word-author",
  "Office文档元数据包含哪些信息？": "office-metadata-info",
  "PDF文件的属性信息可以修改吗？": "edit-pdf-properties",
  "如何批量清除多个文档的元数据？": "batch-clear-metadata",
  "在线修改文档元数据安全吗？": "online-metadata-security",
  "Word文档的元数据在哪里查看？": "view-word-metadata",
  "修改Word文档属性后对方能发现吗？": "modify-word-detectable",
  "如何彻底删除Word文档中的个人隐私信息？": "remove-word-privacy",
  "Excel工作簿的元数据包含哪些信息？": "excel-metadata-info",
  "PDF文件的元数据存储在什么地方？": "pdf-metadata-location",
  "将Word转为PDF后元数据会保留吗？": "word-to-pdf-metadata",
  "Word文档中有哪些隐藏的元数据？": "word-hidden-metadata",
  "删除文档属性后对方还能看到吗？": "delete-properties-visible",
  "如何批量删除多个Word文档的隐私信息？": "batch-delete-word-privacy",
  "如何批量修改多个Excel文件的属性？": "batch-edit-excel-properties",
  "Excel属性修改后会影响公式和图表吗？": "excel-formula-impact",
  "如何彻底清除PDF中的所有隐藏信息？": "clear-pdf-hidden-info",
  "在线修改PDF属性需要上传文件吗？": "online-pdf-upload",
  "在线去除元数据安全吗？文件会被上传吗？": "safe-no-upload",
  "MetaDocu 的浏览器本地处理是如何工作的？": "how-in-browser-works",
  "为什么本地处理比上传式工具更安全？": "local-vs-upload-safer",
  "清理后如何确认文件已经干净？": "verify-file-clean",
  "本地处理会改变我的文件内容或格式吗？": "local-preserves-content",
  "MetaDocu 和 MetadataKit 有什么区别？": "compare-metadocu-vs-metadatakit",
  "有没有专注文档（Word/Excel/PDF）的 MetadataKit 替代品？": "metadatakit-alternative-documents",
  "MetaDocu 和 MetadataKit 都是本地处理、不上传吗？": "both-local-no-upload",
  "什么时候该用 MetaDocu，什么时候用 MetadataKit？": "when-metadocu-vs-metadatakit",

  // English Questions
  "How to edit the author information of a Word document online?": "edit-word-author",
  "What information is included in Office document metadata?": "office-metadata-info",
  "Can PDF file properties be edited?": "edit-pdf-properties",
  "How to batch clear metadata from multiple documents?": "batch-clear-metadata",
  "Is it safe to edit document metadata online?": "online-metadata-security",
  "Where can I view the metadata of a Word document?": "view-word-metadata",
  "Can others tell if Word document properties have been modified?": "modify-word-detectable",
  "How to completely delete personal privacy information in a Word document?": "remove-word-privacy",
  "What information is included in Excel workbook metadata?": "excel-metadata-info",
  "Where is PDF file metadata stored?": "pdf-metadata-location",
  "Will metadata be preserved after converting Word to PDF?": "word-to-pdf-metadata",
  "What hidden metadata is in a Word document?": "word-hidden-metadata",
  "Can others still see the properties after deleting them?": "delete-properties-visible",
  "How to batch delete privacy information from multiple Word documents?": "batch-delete-word-privacy",
  "How to batch edit the properties of multiple Excel files?": "batch-edit-excel-properties",
  "Will Excel formulas and charts be affected after modifying properties?": "excel-formula-impact",
  "How to completely clear all hidden information in a PDF?": "clear-pdf-hidden-info",
  "Do I need to upload files to edit PDF properties online?": "online-pdf-upload",
  "Is it safe to remove metadata online? Are my files uploaded?": "safe-no-upload",
  "How does MetaDocu's in-browser processing work?": "how-in-browser-works",
  "Why is local processing safer than upload-based tools?": "local-vs-upload-safer",
  "How can I verify my file is clean after removing metadata?": "verify-file-clean",
  "Does local processing change my file's content or formatting?": "local-preserves-content",
  "What's the difference between MetaDocu and MetadataKit?": "compare-metadocu-vs-metadatakit",
  "Is there a MetadataKit alternative focused on documents?": "metadatakit-alternative-documents",
  "Do both MetaDocu and MetadataKit process locally without uploading?": "both-local-no-upload",
  "When should I use MetaDocu vs MetadataKit?": "when-metadocu-vs-metadatakit",
}

export function questionToKey(question: string): string {
  return faqKeyMap[question] ?? "online-metadata-security"
}
