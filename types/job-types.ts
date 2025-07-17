export interface JobData {
  jobName: string
  jobDescription: string
  jobOwner: string
  scheduleType: string
  tags: string[]
}

export interface Source {
  id?: string
  name: string
  type: string
  system: string
  connectionDetails: Record<string, any>
  isConnected?: boolean
  tables?: string[]
}

export interface Target {
  id?: string
  name: string
  type: string
  system: string
  connectionDetails: Record<string, any>
  isConnected?: boolean
  schema?: string
  tableMappings?: TableMapping[]
}

export interface TransformationRule {
  id?: string
  name: string
  type: string
  sourceColumn: string
  targetColumn: string
  expression?: string
  description?: string
}

export interface ValidationRule {
  id?: string
  name: string
  type: string
  column: string
  condition: string
  errorMessage: string
  severity: "warning" | "error"
}

export interface ConnectionConfig {
  [key: string]: {
    fields: Array<{
      name: string
      label: string
      type: "text" | "number" | "password" | "select"
      required: boolean
      options?: string[]
      placeholder?: string
    }>
  }
}

export interface TableMapping {
  sourceTable: string
  targetTable: string
  columnMappings: ColumnMapping[]
}

export interface ColumnMapping {
  sourceColumn: string
  targetColumn: string
}
