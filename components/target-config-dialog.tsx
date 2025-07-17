"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import type { Target, TableMapping, ConnectionConfig } from "@/types/job-types"

interface TargetConfigDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (target: Target) => void
}

const targetTypes = [
  { value: "database", label: "Database" },
  { value: "file", label: "File" },
  { value: "cloud", label: "Cloud Storage" },
  { value: "warehouse", label: "Data Warehouse" },
]

const systemsByType: Record<string, string[]> = {
  database: ["PostgreSQL", "MySQL", "SQL Server", "Oracle"],
  file: ["CSV", "JSON", "Parquet", "Excel"],
  cloud: ["AWS S3", "Azure Blob", "Google Cloud Storage"],
  warehouse: ["Snowflake", "BigQuery", "Redshift", "Databricks"],
}

const connectionConfigs: ConnectionConfig = {
  PostgreSQL: {
    fields: [
      { name: "host", label: "Host", type: "text", required: true, placeholder: "localhost" },
      { name: "port", label: "Port", type: "number", required: true, placeholder: "5432" },
      { name: "database", label: "Database", type: "text", required: true, placeholder: "mydb" },
      { name: "schema", label: "Schema", type: "text", required: true, placeholder: "public" },
      { name: "username", label: "Username", type: "text", required: true, placeholder: "user" },
      { name: "password", label: "Password", type: "password", required: true, placeholder: "••••••••" },
    ],
  },
  Snowflake: {
    fields: [
      {
        name: "account",
        label: "Account",
        type: "text",
        required: true,
        placeholder: "xy12345.snowflakecomputing.com",
      },
      { name: "warehouse", label: "Warehouse", type: "text", required: true, placeholder: "COMPUTE_WH" },
      { name: "database", label: "Database", type: "text", required: true, placeholder: "MYDB" },
      { name: "schema", label: "Schema", type: "text", required: true, placeholder: "PUBLIC" },
      { name: "username", label: "Username", type: "text", required: true, placeholder: "user" },
      { name: "password", label: "Password", type: "password", required: true, placeholder: "••••••••" },
    ],
  },
}

export default function TargetConfigDialog({ isOpen, onClose, onSave }: TargetConfigDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    system: "",
    connectionDetails: {} as Record<string, any>,
  })
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [tableMappings, setTableMappings] = useState<TableMapping[]>([])

  const handleInputChange = (field: string, value: string) => {
    if (field === "type") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        system: "",
        connectionDetails: {},
      }))
    } else if (field === "system") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        connectionDetails: {},
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleConnectionDetailChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      connectionDetails: {
        ...prev.connectionDetails,
        [field]: value,
      },
    }))
  }

  const testConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Random success/failure for demo
    const isSuccess = Math.random() > 0.3
    setConnectionStatus(isSuccess ? "success" : "error")
    setIsTestingConnection(false)

    if (isSuccess) {
      // Add sample table mappings
      setTableMappings([
        {
          sourceTable: "users",
          targetTable: "dim_users",
          columnMappings: [
            { sourceColumn: "id", targetColumn: "user_id" },
            { sourceColumn: "name", targetColumn: "full_name" },
            { sourceColumn: "email", targetColumn: "email_address" },
          ],
        },
        {
          sourceTable: "orders",
          targetTable: "fact_orders",
          columnMappings: [
            { sourceColumn: "order_id", targetColumn: "order_key" },
            { sourceColumn: "user_id", targetColumn: "user_key" },
            { sourceColumn: "total", targetColumn: "order_amount" },
          ],
        },
      ])
    }
  }

  const handleSave = () => {
    const target: Target = {
      name: formData.name,
      type: formData.type,
      system: formData.system,
      connectionDetails: formData.connectionDetails,
      isConnected: connectionStatus === "success",
      schema: formData.connectionDetails.schema || "public",
      tableMappings: tableMappings,
    }

    onSave(target)
    onClose()

    // Reset form
    setFormData({
      name: "",
      type: "",
      system: "",
      connectionDetails: {},
    })
    setConnectionStatus("idle")
    setTableMappings([])
  }

  const availableSystems = formData.type ? systemsByType[formData.type] || [] : []
  const connectionConfig = formData.system ? connectionConfigs[formData.system] : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Data Target</DialogTitle>
          <DialogDescription>Configure a new data target for your job</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="mapping">Table Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetName">Target Name</Label>
              <Input
                id="targetName"
                placeholder="Enter target name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetType">Target Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target type" />
                </SelectTrigger>
                <SelectContent>
                  {targetTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.type && (
              <div className="space-y-2">
                <Label htmlFor="targetSystem">Target System</Label>
                <Select value={formData.system} onValueChange={(value) => handleInputChange("system", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target system" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSystems.map((system) => (
                      <SelectItem key={system} value={system}>
                        {system}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>

          <TabsContent value="connection" className="space-y-4">
            {connectionConfig ? (
              <>
                <div className="space-y-4">
                  {connectionConfig.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData.connectionDetails[field.name] || ""}
                        onChange={(e) => handleConnectionDetailChange(field.name, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t">
                  <Button
                    onClick={testConnection}
                    disabled={isTestingConnection}
                    variant="outline"
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    {isTestingConnection ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : connectionStatus === "success" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : connectionStatus === "error" ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : null}
                    <span>{isTestingConnection ? "Testing..." : "Test Connection"}</span>
                  </Button>

                  {connectionStatus === "success" && (
                    <span className="text-sm text-emerald-600">Connection successful!</span>
                  )}
                  {connectionStatus === "error" && (
                    <span className="text-sm text-red-600">Connection failed. Please check your settings.</span>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">Please select a target type and system first</div>
            )}
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            {connectionStatus === "success" && tableMappings.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Table Mappings</h4>
                  <p className="text-sm text-slate-600 mb-4">Configure how source tables map to target tables</p>
                </div>

                {tableMappings.map((mapping, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Source Table</Label>
                        <div className="mt-1 p-2 bg-slate-50 rounded border text-sm">{mapping.sourceTable}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Target Table</Label>
                        <div className="mt-1 p-2 bg-slate-50 rounded border text-sm">{mapping.targetTable}</div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Column Mappings</Label>
                      <div className="mt-2 space-y-2">
                        {mapping.columnMappings.map((colMapping, colIndex) => (
                          <div key={colIndex} className="flex items-center space-x-2 text-sm">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                              {colMapping.sourceColumn}
                            </span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded">
                              {colMapping.targetColumn}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">Test connection first to configure table mappings</div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.name || !formData.type || !formData.system}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Add Target
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
