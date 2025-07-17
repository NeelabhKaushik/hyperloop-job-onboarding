"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ArrowRight, Code, Filter, Calculator, Trash2 } from "lucide-react"
import type { TransformationRule, Source, Target } from "@/types/job-types"

interface TransformationStepProps {
  transformations: TransformationRule[]
  addTransformation: (transformation: TransformationRule) => void
  sources: Source[]
  targets: Target[]
}

const transformationTypes = [
  { value: "mapping", label: "Column Mapping", icon: ArrowRight },
  { value: "filter", label: "Data Filter", icon: Filter },
  { value: "calculation", label: "Calculated Field", icon: Calculator },
  { value: "custom", label: "Custom Script", icon: Code },
]

export default function TransformationStep({
  transformations,
  addTransformation,
  sources,
  targets,
}: TransformationStepProps) {
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
      addTransformation(newTransformation as TransformationRule)
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

  const getAvailableColumns = () => {
    const columns: string[] = []
    sources.forEach((source) => {
      if (source.tables) {
        source.tables.forEach((table) => {
          // Mock column names for demo
          columns.push(`${table}.id`, `${table}.name`, `${table}.created_at`, `${table}.updated_at`)
        })
      }
    })
    return columns
  }

  const availableColumns = getAvailableColumns()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Transformations</h3>
          <p className="text-sm text-slate-600">Define mapping rules and data transformations</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Transformation
        </Button>
      </div>

      {/* Sample Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Preview</CardTitle>
          <CardDescription>Sample data from your sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">users.id</th>
                  <th className="text-left p-2 font-medium">users.name</th>
                  <th className="text-left p-2 font-medium">users.email</th>
                  <th className="text-left p-2 font-medium">orders.total</th>
                  <th className="text-left p-2 font-medium">orders.created_at</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">1</td>
                  <td className="p-2">John Doe</td>
                  <td className="p-2">john@example.com</td>
                  <td className="p-2">$299.99</td>
                  <td className="p-2">2024-01-15</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">2</td>
                  <td className="p-2">Jane Smith</td>
                  <td className="p-2">jane@example.com</td>
                  <td className="p-2">$149.50</td>
                  <td className="p-2">2024-01-16</td>
                </tr>
                <tr>
                  <td className="p-2">3</td>
                  <td className="p-2">Bob Johnson</td>
                  <td className="p-2">bob@example.com</td>
                  <td className="p-2">$89.99</td>
                  <td className="p-2">2024-01-17</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Transformation Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Transformation</CardTitle>
            <CardDescription>Configure a new data transformation rule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transformationName">Transformation Name</Label>
                <Input
                  id="transformationName"
                  placeholder="Enter transformation name"
                  value={newTransformation.name}
                  onChange={(e) => setNewTransformation((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transformationType">Transformation Type</Label>
                <Select
                  value={newTransformation.type}
                  onValueChange={(value) => setNewTransformation((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
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
                <Label htmlFor="sourceColumn">Source Column</Label>
                <Select
                  value={newTransformation.sourceColumn}
                  onValueChange={(value) => setNewTransformation((prev) => ({ ...prev, sourceColumn: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source column" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetColumn">Target Column</Label>
                <Input
                  id="targetColumn"
                  placeholder="Enter target column name"
                  value={newTransformation.targetColumn}
                  onChange={(e) => setNewTransformation((prev) => ({ ...prev, targetColumn: e.target.value }))}
                />
              </div>
            </div>

            {newTransformation.type === "calculation" || newTransformation.type === "custom" ? (
              <div className="space-y-2">
                <Label htmlFor="expression">Expression/Script</Label>
                <Textarea
                  id="expression"
                  placeholder="Enter transformation expression or script"
                  value={newTransformation.expression}
                  onChange={(e) => setNewTransformation((prev) => ({ ...prev, expression: e.target.value }))}
                  rows={3}
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this transformation does"
                value={newTransformation.description}
                onChange={(e) => setNewTransformation((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTransformation} className="bg-emerald-600 hover:bg-emerald-700">
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
            <Button onClick={() => setShowAddForm(true)} variant="outline">
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
              <Card key={transformation.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{transformation.name}</CardTitle>
                        <CardDescription className="capitalize">
                          {typeConfig?.label || transformation.type}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="text-xs">
                        {transformation.sourceColumn}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                      <Badge variant="outline" className="text-xs">
                        {transformation.targetColumn}
                      </Badge>
                    </div>

                    {transformation.expression && (
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <Label className="text-xs font-medium text-slate-600">Expression</Label>
                        <code className="block text-sm mt-1 font-mono">{transformation.expression}</code>
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
    </div>
  )
}
