import { getAxios, postAxios } from './services/http.js'

export function List(params) {
  return getAxios('database/get-database-list.html', params)
}

export function SourceType(params) {
  return getAxios('database/get-source-type.html', params)
}

export function DbName(params) {
  return getAxios('database/get-db-name.html', params)
}

export function TableName(params) {
  return getAxios('database/get-table-name.html', params)
}

export function FieldName(params) {
  return getAxios('database/get-field-name.html', params)
}

export function DataSummary(params) {
  return getAxios('database/get-data-summary.html', params)
}

export function DimensionStatus(params) {
  return postAxios('database/set-dimension-status.html', params)
}

export function DimensionRecord(params) {
  return getAxios('database-record/get-database-record-list.html', params)
}