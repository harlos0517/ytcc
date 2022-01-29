import { Schema } from 'mongoose'

export const schemaRequireAll = (schema: Schema) => {
  Object.entries(schema.paths).forEach(([k, _]) => {
    const attr = schema.path(k)
    if (attr.options.required === undefined) attr.required(true)
    if (attr.schema) schemaRequireAll(attr.schema)
  })
}
