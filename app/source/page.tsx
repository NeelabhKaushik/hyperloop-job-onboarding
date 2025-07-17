"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Loader2, Database, FileText, Globe, ArrowRight, ArrowLeft } from "lucide-react"
import PageLayout from "@/components/page-layout"
import type { ConnectionConfig } from "@/types/job-types"

const sourceTypes = [
  { value: "database", label: "Database", icon: Database },
  { value: "file", label: "File", icon: FileText },
  { value: "api", label: "API", icon: Globe },
]

const systemsByType: Record<string, string[]> = {
  database: ["PostgreSQL", "MySQL", "SQL Server", "Oracle", "MongoDB"],
  file: ["CSV", "JSON", "XML", "Parquet", "Excel"],
  api: ["REST API", "GraphQL", "SOAP", "Webhook"],
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
}

export default function SourcePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    system: "",
    connectionDetails: {} as Record<string, any>,
  })
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [availableTables, setAvailableTables] = useState<string[]>([])

  const handleInputChange = (field: string, value: string) => {
    if (field === "type") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        system: "",
        connectionDetails: {},
      }))
      setConnectionStatus("idle")
    } else if (field === "system") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        connectionDetails: {},
      }))
      setConnectionStatus("idle")
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
      setAvailableTables(["users", "orders", "products", "customers", "transactions"])
    }
  }

  const handleNext = () => {
    if (formData.name && formData.type && formData.system && connectionStatus === "success") {
      const sourceData = {
        ...formData,
        isConnected: true,
        tables: availableTables,
      }
      localStorage.setItem("sourceData", JSON.stringify(sourceData))
      router.push("/target")
    }
  }

  const handleBack = () => {
    router.push("/job-details")
  }

  const availableSystems = formData.type ? systemsByType[formData.type] || [] : []
  const connectionConfig = formData.system ? connectionConfigs[formData.system] : null
  const isFormValid = formData.name && formData.type && formData.system && connectionStatus === "success"

  const getTypeIcon = (type: string) => {
    const typeConfig = sourceTypes.find((t) => t.value === type)
    return typeConfig?.icon || Database
  }

  return (
    <PageLayout title="Data Source" description="Configure your data source connection" currentStep={2}>
      <div className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
            <TabsTrigger value="connection">Connection Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sourceName" className="text-sm font-medium text-slate-700">
                  Source Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sourceName"
                  placeholder="Enter source name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-slate-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceType" className="text-sm font-medium text-slate-700">
                  Source Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className="border-slate-300 focus:border-blue-900 focus:ring-blue-900">
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.type && (
                <div className="space-y-2">
                  <Label htmlFor="sourceSystem" className="text-sm font-medium text-slate-700">
                    Source System <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.system} onValueChange={(value) => handleInputChange("system", value)}>
                    <SelectTrigger className="border-slate-300 focus:border-blue-900 focus:ring-blue-900">
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
            </div>
          </TabsContent>

          <TabsContent value="connection" className="space-y-6">
            {connectionConfig ? (
              <>
                <div className="space-y-4">
                  {connectionConfig.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name} className="text-sm font-medium text-slate-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === "select" ? (
                        <Select
                          value={formData.connectionDetails[field.name] || ""}
                          onValueChange={(value) => handleConnectionDetailChange(field.name, value)}
                        >
                          <SelectTrigger className="border-slate-300 focus:border-blue-900 focus:ring-blue-900">
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
                          className="border-slate-300 focus:border-blue-900 focus:ring-blue-900"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-slate-200">
                  <Button
                    onClick={testConnection}
                    disabled={isTestingConnection}
                    variant="outline"
                    className="flex items-center space-x-2 border-blue-900 text-blue-900 hover:bg-blue-50 bg-transparent"
                  >
                    {isTestingConnection ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : connectionStatus === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : connectionStatus === "error" ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : null}
                    <span>{isTestingConnection ? "Testing..." : "Test Connection"}</span>
                  </Button>

                  {connectionStatus === "success" && (
                    <span className="text-sm text-green-600 font-medium">Connection successful!</span>
                  )}
                  {connectionStatus === "error" && (
                    <span className="text-sm text-red-600 font-medium">
                      Connection failed. Please check your settings.
                    </span>
                  )}
                </div>

                {connectionStatus === "success" && availableTables.length > 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-green-900">Available Tables</CardTitle>
                      <CardDescription className="text-green-700">
                        Found {availableTables.length} tables in your source
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {availableTables.map((table) => (
                          <Badge
                            key={table}
                            variant="secondary"
                            className="bg-green-100 text-green-800 border-green-300"
                          >
                            {table}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Database className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p>Please configure basic settings first</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Source Summary */}
        {formData.name && formData.type && formData.system && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                {React.createElement(getTypeIcon(formData.type), { className: "h-5 w-5 text-blue-900" })}
                <span>Source Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-600">Name:</span>
                  <span className="text-slate-900">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-600">Type:</span>
                  <span className="text-slate-900 capitalize">{formData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-600">System:</span>
                  <span className="text-slate-900">{formData.system}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-600">Status:</span>
                  <Badge
                    variant="outline"
                    className={
                      connectionStatus === "success"
                        ? "text-green-700 border-green-200"
                        : "text-slate-600 border-slate-300"
                    }
                  >
                    {connectionStatus === "success" ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!isFormValid} className="bg-blue-900 hover:bg-blue-800 text-white">
            Next: Configure Target
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
