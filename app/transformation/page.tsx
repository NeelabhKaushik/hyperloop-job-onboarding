"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowRight, ArrowLeft, Code, Filter, Calculator, Trash2 } from "lucide-react"
import PageLayout from "@/components/page-layout"

const transformationTypes = [
  { value: "mapping", label: "Column Mapping", icon: ArrowRight },
  { value: "filter", label: "Data Filter", icon: Filter },
  { value: "calculation", label: "Calculated Field", icon: Calculator },
  { value: "custom", label: "Custom Script", icon: Code },
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

interface TransformationRule {
  id: string
  name: string
  type: string
  sourceColumn: string
  targetColumn: string
  expression?: string
  description?: string
}

export default function TransformationPage() {
  const router = useRouter()
  const [transformations, setTransformations] = useState<TransformationRule[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTransformation, setNewTransformation] = useState({
    name: "",
    type: "",
    sourceColumn: "",
    targetColumn: "",
    expression: "",
    description: "",
  })

  const handleAddTransformation = () => {
    if (newTransformation.name && newTransformation.type) {
      const transformation: TransformationRule = {
        ...newTransformation,
        id: Date.now().toString(),
      }
      setTransformations((prev) => [...prev, transformation])
      setNewTransformation({
        name: "",
        type: "",
        sourceColumn: "",
        targetColumn: "",
        expression: "",
        description: "",
      })
      setShowAddForm(false)
    }
  }

  const removeTransformation = (id: string) => {
    setTransformations((prev) => prev.filter((t) => t.id !== id))
  }

  const handleNext = () => {
    if (transformations.length > 0) {
      localStorage.setItem("transformationData", JSON.stringify(transformations))
      router.push("/validation")
    }
  }

  const handleBack = () => {
    router.push("/target")
  }

  return (
    <PageLayout
      title="Data Transformations"
      description="Configure data mapping and transformation rules"
      currentStep={4}
    >
      <div className="space-y-6">
        {/* Data Preview */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Sample Data Preview</CardTitle>
            <CardDescription className="text-slate-600">Preview of source data structure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-3 font-medium text-slate-700 bg-slate-50">users.id</th>
                    <th className="text-left p-3 font-medium text-slate-700 bg-slate-50">users.name</th>
                    <th className="text-left p-3 font-medium text-slate-700 bg-slate-50">users.email</th>
                    <th className="text-left p-3 font-medium text-slate-700 bg-slate-50">orders.total</th>
                    <th className="text-left p-3 font-medium text-slate-700 bg-slate-50">orders.created_at</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 text-slate-900">1</td>
                    <td className="p-3 text-slate-900">John Doe</td>
                    <td className="p-3 text-slate-900">john@example.com</td>
                    <td className="p-3 text-slate-900">$299.99</td>
                    <td className="p-3 text-slate-900">2024-01-15</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 text-slate-900">2</td>
                    <td className="p-3 text-slate-900">Jane Smith</td>
                    <td className="p-3 text-slate-900">jane@example.com</td>
                    <td className="p-3 text-slate-900">$149.50</td>
                    <td className="p-3 text-slate-900">2024-01-16</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-900">3</td>
                    <td className="p-3 text-slate-900">Bob Johnson</td>
                    <td className="p-3 text-slate-900">bob@example.com</td>
                    <td className="p-3 text-slate-900">$89.99</td>
                    <td className="p-3 text-slate-900">2024-01-17</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add Transformation Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Transformation Rules</h3>
            <p className="text-sm text-slate-600">Define how your data should be transformed</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-blue-900 hover:bg-blue-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Transformation
          </Button>
        </div>

        {/* Add Transformation Form */}
        {showAddForm && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base text-blue-900">Add New Transformation</CardTitle>
              <CardDescription className="text-blue-700">Configure a new data transformation rule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transformationName" className="text-sm font-medium text-slate-700">
                    Transformation Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="transformationName"
                    placeholder="Enter transformation name"
                    value={newTransformation.name}
                    onChange={(e) => setNewTransformation((prev) => ({ ...prev, name: e.target.value }))}
                    className="border-slate-300 focus:border-blue-900 focus:ring-blue-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transformationType" className="text-sm font-medium text-slate-700">
                    Transformation Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newTransformation.type}
                    onValueChange={(value) => setNewTransformation((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="border-slate-300 focus:border-blue-900 focus:ring-blue-900">
                      <SelectValue placeholder="Select transformation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {transformationTypes.map((type) => (
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceColumn" className="text-sm font-medium text-slate-700">
                    Source Column <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newTransformation.sourceColumn}
                    onValueChange={(value) => setNewTransformation((prev) => ({ ...prev, sourceColumn: value }))}
                  >
                    <SelectTrigger className="border-slate-300 focus:border-blue-900 focus:ring-blue-900">
                      <SelectValue placeholder="Select source column" />
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
                  <Label htmlFor="targetColumn" className="text-sm font-medium text-slate-700">
                    Target Column <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="targetColumn"
                    placeholder="Enter target column name"
                    value={newTransformation.targetColumn}
                    onChange={(e) => setNewTransformation((prev) => ({ ...prev, targetColumn: e.target.value }))}
                    className="border-slate-300 focus:border-blue-900 focus:ring-blue-900"
                  />
                </div>
              </div>

              {(newTransformation.type === "calculation" || newTransformation.type === "custom") && (
                <div className="space-y-2">
                  <Label htmlFor="expression" className="text-sm font-medium text-slate-700">
                    Expression/Script
                  </Label>
                  <Textarea
                    id="expression"
                    placeholder="Enter transformation expression or script"
                    value={newTransformation.expression}
                    onChange={(e) => setNewTransformation((prev) => ({ ...prev, expression: e.target.value }))}
                    rows={3}
                    className="border-slate-300 focus:border-blue-900 focus:ring-blue-900 font-mono text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this transformation does"
                  value={newTransformation.description}
                  onChange={(e) => setNewTransformation((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="border-slate-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-blue-200">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-slate-300 text-slate-700"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTransformation} className="bg-blue-900 hover:bg-blue-800 text-white">
                  Add Transformation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Transformations */}
        {transformations.length === 0 && !showAddForm ? (
          <Card className="border-dashed border-2 border-slate-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ArrowRight className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No transformations configured</h3>
              <p className="text-slate-600 text-center mb-4">Add transformation rules to map and process your data</p>
              <Button
                onClick={() => setShowAddForm(true)}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transformation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {transformations.map((transformation) => {
              const typeConfig = transformationTypes.find((t) => t.value === transformation.type)
              const TypeIcon = typeConfig?.icon || ArrowRight

              return (
                <Card key={transformation.id} className="border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <TypeIcon className="h-5 w-5 text-blue-900" />
                        </div>
                        <div>
                          <CardTitle className="text-base text-slate-900">{transformation.name}</CardTitle>
                          <CardDescription className="text-slate-600">
                            {typeConfig?.label || transformation.type}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeTransformation(transformation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-900 border-blue-200">
                          {transformation.sourceColumn}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                        <Badge variant="outline" className="text-xs border-slate-300 text-slate-700">
                          {transformation.targetColumn}
                        </Badge>
                      </div>

                      {transformation.expression && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <Label className="text-xs font-medium text-slate-600">Expression</Label>
                          <code className="block text-sm mt-1 font-mono text-slate-900">
                            {transformation.expression}
                          </code>
                        </div>
                      )}

                      {transformation.description && (
                        <p className="text-sm text-slate-600">{transformation.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
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
          <Button
            onClick={handleNext}
            disabled={transformations.length === 0}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            Next: Configure Validation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
