import assert from "node:assert/strict"
import { scanOoxmlResidue, scanPdfResidue } from "../lib/documents/verify/residue-rules"

// core.xml residue is detected
const core = `<?xml version="1.0"?><cp:coreProperties xmlns:cp="x" xmlns:dc="y">
<dc:creator>Alice</dc:creator><cp:lastModifiedBy>Bob</cp:lastModifiedBy></cp:coreProperties>`
const r1 = scanOoxmlResidue({ "core.xml": core })
assert.equal(r1.length, 2)
assert.ok(r1.find(f => f.key === "creator" && f.value === "Alice"))

// blanked core.xml is clean
const cleanCore = `<dc:creator></dc:creator><cp:lastModifiedBy/>`
assert.deepEqual(scanOoxmlResidue({ "core.xml": cleanCore }), [])

// app.xml Template path is high risk
const app = `<Properties><Template>C:\\Users\\alice\\Normal.dotm</Template><Company>ACME</Company></Properties>`
const r2 = scanOoxmlResidue({ "app.xml": app })
assert.ok(r2.find(f => f.key === "template" && f.risk === "high"))
assert.ok(r2.find(f => f.key === "company"))

// custom.xml presence is residue
const custom = `<Properties><property name="Classification"><vt:lpwstr>Secret</vt:lpwstr></property></Properties>`
assert.equal(scanOoxmlResidue({ "custom.xml": custom }).length, 1)
assert.deepEqual(scanOoxmlResidue({ "custom.xml": "<Properties></Properties>" }), [])

// pdf info residue
const r3 = scanPdfResidue({ Author: "Carol", Title: "", Producer: undefined })
assert.equal(r3.length, 1)
assert.equal(r3[0].part, "pdf-info")

console.log("residue-rules self-test passed")

import JSZip from "jszip"
import { verifyCleaned } from "../lib/documents/verify/verify-clean"

// a docx whose core.xml still has a creator is NOT verified
const dirtyZip = new JSZip()
dirtyZip.file("docProps/core.xml", `<cp:coreProperties xmlns:cp="x" xmlns:dc="y"><dc:creator>Alice</dc:creator></cp:coreProperties>`)
const dirtyBytes = await dirtyZip.generateAsync({ type: "uint8array" })
const vDirty = await verifyCleaned(dirtyBytes, "docx")
assert.equal(vDirty.verified, false)
assert.ok(vDirty.residue.some(r => r.key === "creator"))

// a docx with blanked core.xml IS verified
const cleanZip = new JSZip()
cleanZip.file("docProps/core.xml", `<cp:coreProperties xmlns:cp="x" xmlns:dc="y"><dc:creator></dc:creator></cp:coreProperties>`)
const cleanBytes = await cleanZip.generateAsync({ type: "uint8array" })
const vClean = await verifyCleaned(cleanBytes, "docx")
assert.equal(vClean.verified, true)
assert.equal(vClean.residue.length, 0)

// garbage bytes are unverifiable, never reported as clean-success
const vBad = await verifyCleaned(new Uint8Array([1, 2, 3]), "docx")
assert.equal(vBad.verified, false)
assert.equal(vBad.unverifiable, true)

console.log("verify-clean self-test passed")
