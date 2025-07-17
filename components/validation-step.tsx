"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Shield, AlertTriangle, XCircle, Trash2, CheckCircle } from "lucide-react"
import type { ValidationRule } from "@/types/job-types"

interface ValidationStepProps {
  validations: ValidationRule[]
  addValidation: (validation: ValidationRule) => void
}

const validationTypes = [
  { value: "null_check", label: "Null Check", description: "Check for null or empty values" },
  { value: "range_check", label: "Range Check", description: "Validate numeric ranges" },
  { value: "format_check", label: "Format Check", description: "Validate data format (email, phone, etc.)" },
  { value: "length_check", label: "Length Check", description: "Validate string length" },
  { value: "custom", label: "Custom Rule", description: "Custom validation logic" },
]

const severityOptions = [
  { value: "warning", label: "Warning", color: "text-yellow-700 border-yellow-200" },
  { value: "error", label: "Error", color: "text-red-700 border-red-200" },
]

const sampleColumns = [
  "users.id",
  "users.name",
  "users.email",
  "users.age",
  "orders.order_id",
  "orders.total",
  "orders.created_at",
]

export default function ValidationStep({ validations, addValidation }: ValidationStepProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newValidation, setNewValidation] = useState({
    name: "",
    type: "",
    column: "",
    condition: "",
    errorMessage: "",
    severity: "error" as "warning" | "error",
  })

  const handleAddValidation = () => {
    if (newValidation.name && newValidation.type && newValidation.column) {
      addValidation(newValidation as ValidationRule)
      setNewValidation({
        name: "",
        type: "",
        column: "",
        condition: "",
        errorMessage: "",
        severity: "error",
      })
      setShowAddForm(false)
    }
  }

  const getValidationIcon = (severity: string) => {
    return severity === "error" ? XCircle : AlertTriangle
  }

  const getConditionPlaceholder = (type: string) => {
    switch (type) {
      case "null_check":
        return "IS NOT NULL"
      case "range_check":
        return "BETWEEN 0 AND 100"
      case "format_check":
        return "LIKE '%@%.%'"
      case "length_check":
        return "LENGTH > 5"
      case "custom":
        return "Custom SQL condition"
      default:
        return "Enter validation condition"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Validation Rules</h3>
          <p className="text-sm text-slate-600">Set up data quality checks and validation rules</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Validation
        </Button>
      </div>

      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Rules</p>
                <p className="text-2xl font-bold text-emerald-600">{validations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {validations.filter((v) => v.severity === "warning").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {validations.filter((v) => v.severity === "error").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Validation Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Validation Rule</CardTitle>
            <CardDescription>Configure a new data validation rule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validationName">Rule Name</Label>
                <Input
                  id="validationName"
                  placeholder="Enter validation rule name"
                  value={newValidation.name}
                  onChange={(e) => setNewValidation((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validationType">Validation Type</Label>
                <Select
                  value={newValidation.type}
                  onValueChange={(value) => setNewValidation((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select validation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {validationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-slate-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="column">Column</Label>
                <Select
                  value={newValidation.column}
                  onValueChange={(value) => setNewValidation((prev) => ({ ...prev, column: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column to validate" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={newValidation.severity}
                  onValueChange={(value: "warning" | "error") =>
                    setNewValidation((prev) => ({ ...prev, severity: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Validation Condition</Label>
              <Input
                id="condition"
                placeholder={getConditionPlaceholder(newValidation.type)}
                value={newValidation.condition}
                onChange={(e) => setNewValidation((prev) => ({ ...prev, condition: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="errorMessage">Error Message</Label>
              <Textarea
                id="errorMessage"
                placeholder="Enter error message to display when validation fails"
                value={newValidation.errorMessage}
                onChange={(e) => setNewValidation((prev) => ({ ...prev, errorMessage: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddValidation} className="bg-emerald-600 hover:bg-emerald-700">
                Add Validation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Validations */}
      {validations.length === 0 && !showAddForm ? (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No validation rules configured</h3>
            <p className="text-slate-600 text-center mb-4">Add validation rules to ensure data quality and integrity</p>
            <Button onClick={() => setShowAddForm(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Validation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {validations.map((validation) => {
            const ValidationIcon = getValidationIcon(validation.severity)
            const typeConfig = validationTypes.find((t) => t.value === validation.type)
            const severityConfig = severityOptions.find((s) => s.value === validation.severity)

            return (
              <Card key={validation.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${validation.severity === "error" ? "bg-red-100" : "bg-yellow-100"}`}
                      >
                        <ValidationIcon
                          className={`h-5 w-5 ${validation.severity === "error" ? "text-red-600" : "text-yellow-600"}`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">{validation.name}</CardTitle>
                        <CardDescription>
                          {typeConfig?.label} • {validation.column}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={severityConfig?.color}>
                        {severityConfig?.label}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {validation.condition && (
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <Label className="text-xs font-medium text-slate-600">Condition</Label>
                        <code className="block text-sm mt-1 font-mono">{validation.condition}</code>
                      </div>
                    )}

                    {validation.errorMessage && (
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Error Message</Label>
                        <p className="text-sm mt-1">{validation.errorMessage}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Sample Validation Results */}
      {validations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sample Validation Results</CardTitle>
            <CardDescription>Preview of validation results on sample data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium">Row 1: All validations passed</p>
                    <p className="text-xs text-emerald-700">users.email: john@example.com</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                  Valid
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Row 2: Warning detected</p>
                    <p className="text-xs text-yellow-700">users.age: Value outside recommended range</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-yellow-700 border-yellow-200">
                  Warning
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">Row 3: Validation failed</p>
                    <p className="text-xs text-red-700">users.email: Invalid email format</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-red-700 border-red-200">
                  Error
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
