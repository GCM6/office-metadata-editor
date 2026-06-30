import type { DocumentFileType } from "@/types/metadata"
import { verifyCleaned } from "./verify-clean"
import { deepClean } from "./deep-clean"
import type { ResidueField } from "./residue-rules"

export const MAX_AUTO_RECLEAN = 1

export interface CleanVerifyResult {
  bytes: Uint8Array
  verified: boolean
  residue: ResidueField[]
  attempts: number
  exhausted: boolean
  unverifiable?: boolean
}

// Wrap any "produce cleaned bytes" function with verify → deepClean → re-verify,
// capped at MAX_AUTO_RECLEAN automatic deep-clean rounds. When the cap is hit
// with residue still present, returns exhausted=true (UI offers manual retry).
export async function cleanAndVerify(
  produce: () => Promise<Uint8Array>,
  fileType: DocumentFileType,
): Promise<CleanVerifyResult> {
  let bytes = await produce()
  let attempts = 1
  let result = await verifyCleaned(bytes, fileType)

  while (!result.verified && !result.unverifiable && attempts <= MAX_AUTO_RECLEAN) {
    bytes = await deepClean(bytes, fileType, result.residue)
    attempts += 1
    result = await verifyCleaned(bytes, fileType)
  }

  return {
    bytes,
    verified: result.verified,
    residue: result.residue,
    attempts,
    exhausted: !result.verified && !result.unverifiable,
    unverifiable: result.unverifiable,
  }
}
