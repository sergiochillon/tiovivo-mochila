import { Ajv2020, type ErrorObject, type ValidateFunction } from "ajv/dist/2020.js";
import * as formatsModule from "ajv-formats";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { Pack, ProgressEvent } from "./store.js";

const schemaPath = fileURLToPath(
  new URL("../../contracts/pack-v0.1.schema.json", import.meta.url),
);
const schema = JSON.parse(await readFile(schemaPath, "utf8")) as {
  $id: string;
  $defs: Record<string, unknown>;
};

const ajv = new Ajv2020({ allErrors: true, strict: true });
const addFormats = formatsModule.default as unknown as (instance: Ajv2020) => void;
addFormats(ajv);
ajv.addSchema(schema);

function requiredValidator<T>(schemaId: string): ValidateFunction<T> {
  const validator = ajv.getSchema<T>(schemaId);
  if (!validator) throw new Error(`No se encontró el esquema ${schemaId}`);
  return validator;
}

export const validatePack = requiredValidator<Pack>(schema.$id);
export const validateProgressEvent = requiredValidator<ProgressEvent>(
  `${schema.$id}#/$defs/ProgressEvent`,
);
export const validateClassCode = requiredValidator<string>(
  `${schema.$id}#/$defs/ClassCode`,
);

export function describeAjvErrors(errors: ErrorObject[] | null | undefined): string[] {
  return (errors ?? []).map((error) => {
    const location = error.instancePath || "/";
    return `${location}: ${error.message ?? "valor inválido"}`;
  });
}

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    const entries = Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}
