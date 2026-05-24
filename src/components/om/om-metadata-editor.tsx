import React, { useCallback, useMemo, useState } from "react"
import { z } from "zod"
import { useLocale, useTranslations } from "next-intl"
import { useMetadata } from "@/contexts/metadata-context"
import { OmMetadataSection } from "@/components/om/om-metadata-section"
import { OmMetadataFieldList } from "@/components/om/om-metadata-field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"
import { resolveMetadataSections } from "@/lib/documents/metadata"
import type { DocumentFileType } from "@/types/metadata"

const COMMON_LOCALE_CODES = [
  "zh-CN",
  "zh-TW",
  "zh-HK",
  "en-US",
  "en-GB",
  "ja-JP",
  "ko-KR",
  "de-DE",
  "fr-FR",
  "es-ES",
  "pt-BR",
  "it-IT",
  "ru-RU",
  "ar-SA",
  "hi-IN",
  "th-TH",
  "vi-VN",
  "id-ID",
  "tr-TR",
  "nl-NL",
] as const

const textFieldSchema = z
  .string()
  .max(4000, "MAX_LENGTH")
  .refine(value => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value), {
    message: "INVISIBLE_CHARS",
  })
  .refine(value => !value.includes("\uFFFD"), {
    message: "ENCODING_ERROR",
  })

function formatDateValue(value: string, locale: string): string {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function toFieldPath(category: string, key: string): string {
  return `${category}.${key}`
}

const ERROR_KEY_MAP: Record<string, string> = {
  MAX_LENGTH: "validation.maxLength",
  INVISIBLE_CHARS: "validation.invisibleChars",
  ENCODING_ERROR: "validation.encodingError",
  INVALID_BCP47: "validation.invalidBcp47",
  INVALID_INPUT: "validation.invalidInput",
}

export interface OmMetadataEditorProps {
  fileType: DocumentFileType
}

export const OmMetadataEditor: React.FC<OmMetadataEditorProps> = ({ fileType }) => {
  const { metadata, updateField } = useMetadata()
  const locale = useLocale()
  const tv = useTranslations("validation")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({})

  const resolvedMetadata = metadata!
  const sections = useMemo(
    () => resolveMetadataSections(fileType, resolvedMetadata),
    [fileType, resolvedMetadata],
  )

  const translateError = useCallback(
    (errorKey: string): string => {
      const messageKey = ERROR_KEY_MAP[errorKey]
      if (messageKey) return tv(messageKey)
      return errorKey
    },
    [tv],
  )

  const handleFieldChange = useCallback(
    (
      category: "documentProperties" | "coreProperties" | "appProperties",
      field: string,
      asLanguageField = false,
    ) =>
      (value: string) => {
        const fieldPath = toFieldPath(category, field)
        let result = textFieldSchema.safeParse(value)

        if (asLanguageField && value.trim() !== "") {
          try {
            void new Intl.Locale(value)
          } catch {
            result = {
              success: false,
              error: {
                issues: [{ message: "INVALID_BCP47" }],
              },
            } as typeof result
          }
        }

        setFieldErrors(prev => ({
          ...prev,
          [fieldPath]: result.success
            ? null
            : translateError(result.error.issues[0]?.message ?? "INVALID_INPUT"),
        }))

        updateField(category, field, value)
      },
    [updateField, translateError],
  )

  return (
    <div className="flex flex-col gap-3">
      {sections.map(section => (
        <OmMetadataSection
          key={section.id}
          title={section.title}
          description={section.description}
        >
          <OmMetadataFieldList>
            {section.fields.map(field => {
              const fieldPath = toFieldPath(section.category, field.key)
              const value = String(field.value ?? "")
              const errorText = fieldErrors[fieldPath] ?? null
              const languageInputListId = `${fieldPath}-language-options`

              return (
                <div
                  key={`${section.id}-${field.key}`}
                  className={`grid items-start gap-1 ${field.span === 2 ? "md:col-span-2" : "md:col-span-1"}`}
                >
                  <div className="flex min-h-6 items-center gap-1.5">
                    <Label
                      htmlFor={fieldPath}
                      className="text-[11px] font-medium tracking-wide text-muted-foreground"
                    >
                      {field.label}
                    </Label>
                    {!field.editable && <Lock className="h-3 w-3 text-muted-foreground/50" />}
                  </div>
                  <div className="flex items-center">
                    {field.editable ? (
                      isLanguageField(field) ? (
                        <div className="w-full">
                          <Input
                            id={fieldPath}
                            value={value}
                            list={languageInputListId}
                            onChange={e => {
                              handleFieldChange(section.category, field.key, true)(e.target.value)
                            }}
                            placeholder={tv("placeholderLang")}
                            className="h-8 rounded-md border border-border/70 bg-background px-2 text-sm"
                          />
                          <datalist id={languageInputListId}>
                            {COMMON_LOCALE_CODES.map(code => (
                              <option
                                key={code}
                                value={code}
                                label={getLanguageOptionLabel(code, locale)}
                              >
                                {getLanguageOptionLabel(code, locale)}
                              </option>
                            ))}
                          </datalist>
                        </div>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          id={fieldPath}
                          value={value}
                          onChange={e => {
                            handleFieldChange(section.category, field.key)(e.target.value)
                          }}
                          placeholder={`${tv("placeholderInput")}${field.label}`}
                          className="min-h-16 rounded-none border-0 border-b border-border/55 bg-transparent px-0 py-1 text-sm leading-6 shadow-none focus-visible:border-primary/40 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none"
                        />
                      ) : (
                        <Input
                          id={fieldPath}
                          type="text"
                          value={value}
                          onChange={e => {
                            handleFieldChange(section.category, field.key)(e.target.value)
                          }}
                          placeholder={`${tv("placeholderInput")}${field.label}`}
                          className="h-8 rounded-none border-0 border-b border-border/55 bg-transparent px-0 text-sm shadow-none focus-visible:border-primary/40 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none"
                        />
                      )
                    ) : (
                      <div className="flex h-8 w-full items-center px-0">
                        <span className="text-sm text-foreground/90">
                          {field.type === "date" ? formatDateValue(value, locale) : value || "-"}
                        </span>
                      </div>
                    )}
                  </div>
                  {errorText && field.editable ? (
                    <p className="text-[11px] text-destructive">{errorText}</p>
                  ) : null}
                </div>
              )
            })}
          </OmMetadataFieldList>
        </OmMetadataSection>
      ))}
    </div>
  )
}

function getLanguageOptionLabel(localeCode: string, locale: string): string {
  const normalized = localeCode.trim()
  if (!normalized) {
    return ""
  }

  const languageCode = normalized.split("-")[0] ?? normalized
  let languageName: string
  try {
    languageName =
      new Intl.DisplayNames([locale], { type: "language" }).of(languageCode) ?? normalized
  } catch {
    languageName = normalized
  }
  return `${normalized} · ${languageName}`
}

function isLanguageField(field: { key: string; editable: boolean; type: string }) {
  if (!field.editable || field.type !== "text") {
    return false
  }

  return field.key === "language" || field.key === "dcLanguage"
}

export default OmMetadataEditor
