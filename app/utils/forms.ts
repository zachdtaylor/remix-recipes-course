export function formDataValueAsString(
  value: FormDataEntryValue | null | undefined
) {
  return typeof value === "string" ? value : null;
}
