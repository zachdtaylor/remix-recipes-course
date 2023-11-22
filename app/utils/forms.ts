export function asString(value: FormDataEntryValue | null | undefined) {
  return typeof value === "string" ? value : null;
}
