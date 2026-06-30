import type { DocumentProperties, CoreProperties, AppProperties } from "@/types/metadata"

// `jszip` (~95KB) is loaded via dynamic import() inside the read/write functions
// below, so the bundler emits it as a separate async chunk that downloads only
// when a document is actually parsed — never in a page's first-load bundle.

export interface OoxmlMetadata {
  documentProperties: DocumentProperties
  coreProperties: CoreProperties
  appProperties: AppProperties
}

const CORE_XML_PATH = "docProps/core.xml"
const APP_XML_PATH = "docProps/app.xml"

const CORE_NS = "http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
const DC_NS = "http://purl.org/dc/elements/1.1/"
const DCTERMS_NS = "http://purl.org/dc/terms/"
const APP_NS = "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"

function getTagText(xml: XMLDocument, ns: string | null, tag: string): string {
  const el = ns ? xml.getElementsByTagNameNS(ns, tag)[0] : xml.getElementsByTagName(tag)[0]
  return el?.textContent ?? ""
}

function setTagText(doc: XMLDocument, ns: string | null, tag: string, value: string): void {
  const el = ns ? doc.getElementsByTagNameNS(ns, tag)[0] : doc.getElementsByTagName(tag)[0]
  if (el) {
    el.textContent = value
  }
}

export async function readOoxmlMetadata(data: Uint8Array): Promise<OoxmlMetadata> {
  const { default: JSZip } = await import("jszip")
  const zip = await JSZip.loadAsync(data)

  const defaultDocProps: DocumentProperties = {
    title: "", subject: "", creator: "", keywords: "", description: "",
    lastModifiedBy: "", revision: "1", created: "", modified: "",
    category: "", contentStatus: "", version: "", language: "zh-CN",
    identifier: "", source: "",
  }
  const defaultCoreProps: CoreProperties = {
    dcTitle: "", dcSubject: "", dcCreator: "", dcDescription: "",
    dcKeywords: "", dcLanguage: "zh-CN", dcIdentifier: "", dcSource: "",
  }
  const defaultAppProps: AppProperties = {
    application: "", appVersion: "", company: "", manager: "",
    template: "", totalTime: "0", pages: 0, words: 0,
    characters: 0, charactersWithSpaces: 0, paragraphs: 0, lines: 0,
  }

  const coreFile = zip.file(CORE_XML_PATH)
  if (coreFile) {
    const coreXmlStr = await coreFile.async("string")
    const coreDoc = new DOMParser().parseFromString(coreXmlStr, "text/xml")

    defaultDocProps.title = getTagText(coreDoc, DC_NS, "title")
    defaultDocProps.subject = getTagText(coreDoc, DC_NS, "subject")
    defaultDocProps.creator = getTagText(coreDoc, DC_NS, "creator")
    defaultDocProps.description = getTagText(coreDoc, DC_NS, "description")
    defaultDocProps.keywords = getTagText(coreDoc, CORE_NS, "keywords")
    defaultDocProps.lastModifiedBy = getTagText(coreDoc, CORE_NS, "lastModifiedBy")
    defaultDocProps.revision = getTagText(coreDoc, CORE_NS, "revision") || "1"
    defaultDocProps.created = getTagText(coreDoc, DCTERMS_NS, "created")
    defaultDocProps.modified = getTagText(coreDoc, DCTERMS_NS, "modified")
    defaultDocProps.category = getTagText(coreDoc, CORE_NS, "category")
    defaultDocProps.contentStatus = getTagText(coreDoc, CORE_NS, "contentStatus")
    defaultDocProps.version = getTagText(coreDoc, CORE_NS, "version")
    defaultDocProps.language = getTagText(coreDoc, CORE_NS, "language") || "zh-CN"
    defaultDocProps.identifier = getTagText(coreDoc, CORE_NS, "identifier")
    defaultDocProps.source = getTagText(coreDoc, CORE_NS, "source")

    defaultCoreProps.dcTitle = defaultDocProps.title
    defaultCoreProps.dcSubject = defaultDocProps.subject
    defaultCoreProps.dcCreator = defaultDocProps.creator
    defaultCoreProps.dcDescription = defaultDocProps.description
    defaultCoreProps.dcKeywords = defaultDocProps.keywords
    defaultCoreProps.dcLanguage = defaultDocProps.language
    defaultCoreProps.dcIdentifier = defaultDocProps.identifier
    defaultCoreProps.dcSource = defaultDocProps.source
  }

  const appFile = zip.file(APP_XML_PATH)
  if (appFile) {
    const appXmlStr = await appFile.async("string")
    const appDoc = new DOMParser().parseFromString(appXmlStr, "text/xml")

    defaultAppProps.application = getTagText(appDoc, APP_NS, "Application")
    defaultAppProps.appVersion = getTagText(appDoc, APP_NS, "AppVersion")
    defaultAppProps.company = getTagText(appDoc, APP_NS, "Company")
    defaultAppProps.manager = getTagText(appDoc, APP_NS, "Manager")
    defaultAppProps.template = getTagText(appDoc, APP_NS, "Template")
    defaultAppProps.totalTime = getTagText(appDoc, APP_NS, "TotalTime") || "0"
    defaultAppProps.pages = parseInt(getTagText(appDoc, APP_NS, "Pages")) || 0
    defaultAppProps.words = parseInt(getTagText(appDoc, APP_NS, "Words")) || 0
    defaultAppProps.characters = parseInt(getTagText(appDoc, APP_NS, "Characters")) || 0
    defaultAppProps.charactersWithSpaces = parseInt(getTagText(appDoc, APP_NS, "CharactersWithSpaces")) || 0
    defaultAppProps.paragraphs = parseInt(getTagText(appDoc, APP_NS, "Paragraphs")) || 0
    defaultAppProps.lines = parseInt(getTagText(appDoc, APP_NS, "Lines")) || 0
  }

  return {
    documentProperties: defaultDocProps,
    coreProperties: defaultCoreProps,
    appProperties: defaultAppProps,
  }
}

export async function writeOoxmlMetadata(
  data: Uint8Array,
  metadata: OoxmlMetadata,
): Promise<Uint8Array> {
  const { default: JSZip } = await import("jszip")
  const zip = await JSZip.loadAsync(data)

  const coreFile = zip.file(CORE_XML_PATH)
  if (coreFile) {
    const coreXmlStr = await coreFile.async("string")
    const coreDoc = new DOMParser().parseFromString(coreXmlStr, "text/xml")

    setTagText(coreDoc, DC_NS, "title", metadata.documentProperties.title)
    setTagText(coreDoc, DC_NS, "subject", metadata.documentProperties.subject)
    setTagText(coreDoc, DC_NS, "creator", metadata.documentProperties.creator)
    setTagText(coreDoc, DC_NS, "description", metadata.documentProperties.description)
    setTagText(coreDoc, CORE_NS, "keywords", metadata.documentProperties.keywords)
    setTagText(coreDoc, CORE_NS, "lastModifiedBy", metadata.documentProperties.lastModifiedBy)
    setTagText(coreDoc, CORE_NS, "revision", metadata.documentProperties.revision)
    setTagText(coreDoc, CORE_NS, "category", metadata.documentProperties.category)
    setTagText(coreDoc, CORE_NS, "contentStatus", metadata.documentProperties.contentStatus)
    setTagText(coreDoc, CORE_NS, "version", metadata.documentProperties.version)
    setTagText(coreDoc, CORE_NS, "language", metadata.documentProperties.language)
    setTagText(coreDoc, CORE_NS, "identifier", metadata.documentProperties.identifier)
    setTagText(coreDoc, CORE_NS, "source", metadata.documentProperties.source)
    setTagText(coreDoc, DCTERMS_NS, "created", metadata.documentProperties.created)
    setTagText(coreDoc, DCTERMS_NS, "modified", metadata.documentProperties.modified)

    const serializer = new XMLSerializer()
    zip.file(CORE_XML_PATH, serializer.serializeToString(coreDoc))
  }

  const appFile = zip.file(APP_XML_PATH)
  if (appFile) {
    const appXmlStr = await appFile.async("string")
    const appDoc = new DOMParser().parseFromString(appXmlStr, "text/xml")

    setTagText(appDoc, APP_NS, "Company", metadata.appProperties.company)
    setTagText(appDoc, APP_NS, "Manager", metadata.appProperties.manager)
    setTagText(appDoc, APP_NS, "Template", metadata.appProperties.template)
    setTagText(appDoc, APP_NS, "TotalTime", metadata.appProperties.totalTime)
    setTagText(appDoc, APP_NS, "Application", metadata.appProperties.application)
    setTagText(appDoc, APP_NS, "AppVersion", metadata.appProperties.appVersion)

    const serializer = new XMLSerializer()
    zip.file(APP_XML_PATH, serializer.serializeToString(appDoc))
  }

  const blob = await zip.generateAsync({ type: "uint8array" })
  return blob
}

export function createEmptyOoxmlMetadata(): OoxmlMetadata {
  return {
    documentProperties: {
      title: "", subject: "", creator: "", keywords: "", description: "",
      lastModifiedBy: "", revision: "1", created: "", modified: "",
      category: "", contentStatus: "", version: "", language: "zh-CN",
      identifier: "", source: "",
    },
    coreProperties: {
      dcTitle: "", dcSubject: "", dcCreator: "", dcDescription: "",
      dcKeywords: "", dcLanguage: "zh-CN", dcIdentifier: "", dcSource: "",
    },
    appProperties: {
      application: "", appVersion: "", company: "", manager: "",
      template: "", totalTime: "0", pages: 0, words: 0,
      characters: 0, charactersWithSpaces: 0, paragraphs: 0, lines: 0,
    },
  }
}
