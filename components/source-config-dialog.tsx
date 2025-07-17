"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import type { Source, ConnectionConfig } from "@/types/job-types"

interface SourceConfigDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (source: Source) => void
}

const sourceTypes = [
  { value: "database", label: "Database" },
  { value: "file", label: "File" },
  { value: "api", label: "API" },
  { value: "cloud", label: "Cloud Storage" },
]

const systemsByType: Record<string, string[]> = {
  database: ["PostgreSQL", "MySQL", "SQL Server", "Oracle", "MongoDB"],
  file: ["CSV", "JSON", "XML", "Parquet", "Excel"],
  api: ["REST API", "GraphQL", "SOAP", "Webhook"],
  cloud: ["AWS S3", "Azure Blob", "Google Cloud Storage", "Snowflake"],
}

const connectionConfigs: ConnectionConfig = {
  PostgreSQL: {
    fields: [
      { name: "host", label: "Host", type: "text", required: true, placeholder: "localhost" },
      { name: "port", label: "Port", type: "number", required: true, placeholder: "5432" },
      { name: "database", label: "Database", type: "text", required: true, placeholder: "mydb" },
      { name: "username", label: "Username", type: "text", required: true, placeholder: "user" },
      { name: "password", label: "Password", type: "password", required: true, placeholder: "••••••••" },
    ],
  },
  MySQL: {
    fields: [
      { name: "host", label: "Host", type: "text", required: true, placeholder: "localhost" },
      { name: "port", label: "Port", type: "number", required: true, placeholder: "3306" },
      { name: "database", label: "Database", type: "text", required: true, placeholder: "mydb" },
      { name: "username", label: "Username", type: "text", required: true, placeholder: "user" },
      { name: "password", label: "Password", type: "password", required: true, placeholder: "••••••••" },
    ],
  },
  "REST API": {
    fields: [
      { name: "baseUrl", label: "Base URL", type: "text", required: true, placeholder: "https://api.example.com" },
      { name: "apiKey", label: "API Key", type: "password", required: false, placeholder: "Optional API key" },
      {
        name: "authType",
        label: "Authentication",
        type: "select",
        required: true,
        options: ["None", "API Key", "Bearer Token", "Basic Auth"],
      },
    ],
  },
  "AWS S3": {
    fields: [
      { name: "accessKey", label: "Access Key ID", type: "text", required: true, placeholder: "AKIA..." },
      { name: "secretKey", label: "Secret Access Key", type: "password", required: true, placeholder: "••••••••" },
      { name: "region", label: "Region", type: "text", required: true, placeholder: "us-east-1" },
      { name: "bucket", label: "Bucket Name", type: "text", required: true, placeholder: "my-bucket" },
    ],
  },
}

export default function SourceConfigDialog({ isOpen, onClose, onSave }: SourceConfigDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    system: "",
    connectionDetails: {} as Record<string, any>,
  })
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

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
  }

  const handleSave = () => {
    const source: Source = {
      name: formData.name,
      type: formData.type,
      system: formData.system,
      connectionDetails: formData.connectionDetails,
      isConnected: connectionStatus === "success",
      tables: connectionStatus === "success" ? ["users", "orders", "products", "customers"] : [],
    }

    onSave(source)
    onClose()

    // Reset form
    setFormData({
      name: "",
      type: "",
      system: "",
      connectionDetails: {},
    })
    setConnectionStatus("idle")
  }

  const availableSystems = formData.type ? systemsByType[formData.type] || [] : []
  const connectionConfig = formData.system ? connectionConfigs[formData.system] : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Data Source</DialogTitle>
          <DialogDescription>Configure a new data source for your job</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceName">Source Name</Label>
              <Input
                id="sourceName"
                placeholder="Enter source name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceType">Source Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  {sourceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.type && (
              <div className="space-y-2">
                <Label htmlFor="sourceSystem">Source System</Label>
                <Select value={formData.system} onValueChange={(value) => handleInputChange("system", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source system" />
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
                      {field.type === "select" ? (
                        <Select
                          value={formData.connectionDetails[field.name] || ""}
                          onValueChange={(value) => handleConnectionDetailChange(field.name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData.connectionDetails[field.name] || ""}
                          onChange={(e) => handleConnectionDetailChange(field.name, e.target.value)}
                        />
                      )}
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
              <div className="text-center py-8 text-slate-500">Please select a source type and system first</div>
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
            Add Source
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
