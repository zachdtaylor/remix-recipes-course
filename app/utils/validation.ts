import type { z } from "zod";

type FieldErrors = { [key: string]: string };

type FormFields = {
  [key: string]: FormDataEntryValue | FormDataEntryValue[];
};

function objectify(formData: FormData) {
  const formFields: FormFields = {};

  formData.forEach((value, name) => {
    const isArrayField = name.endsWith("[]");
    const fieldName = isArrayField ? name.slice(0, -2) : name;

    if (!(fieldName in formFields)) {
      formFields[fieldName] = isArrayField ? formData.getAll(name) : value;
    }
  });

  return formFields;
}

export function validateForm<T, R, E>(
  formData: FormData,
  zodSchema: z.Schema<T>,
  successFn: (data: T) => R,
  errorFn: (errors: FieldErrors) => E
) {
  const fields = objectify(formData);
  const result = zodSchema.safeParse(fields);
  if (!result.success) {
    const errors: FieldErrors = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    });
    return errorFn(errors);
  }
  return successFn(result.data);
}
