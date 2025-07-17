"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Database, FileText, Cloud, CheckCircle, XCircle, Trash2, Settings } from "lucide-react"
import type { Target } from "@/types/job-types"
import TargetConfigDialog from "@/components/target-config-dialog"

interface TargetStepProps {
  targets: Target[]
  addTarget: (target: Target) => void
}

const getTargetIcon = (type: string) => {
  switch (type) {
    case "database":
      return <Database className="h-5 w-5" />
    case "file":
      return <FileText className="h-5 w-5" />
    case "cloud":
      return <Cloud className="h-5 w-5" />
    default:
      return <Database className="h-5 w-5" />
  }
}

export default function TargetStep({ targets, addTarget }: TargetStepProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Targets</h3>
          <p className="text-sm text-slate-600">Configure your data targets and schema mappings</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Target
        </Button>
      </div>

      {targets.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No targets configured</h3>
            <p className="text-slate-600 text-center mb-4">
              Add your first data target to complete the integration setup
            </p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Target
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {targets.map((target) => (
            <Card key={target.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">{getTargetIcon(target.type)}</div>
                    <div>
                      <CardTitle className="text-base">{target.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {target.type} • {target.system}
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Connection Status</span>
                    <div className="flex items-center space-x-2">
                      {target.isConnected ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                            Connected
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <Badge variant="outline" className="text-red-700 border-red-200">
                            Not Connected
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {target.schema && (
                    <div>
                      <span className="text-sm text-slate-600">Schema</span>
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {target.schema}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {target.tableMappings && target.tableMappings.length > 0 && (
                    <div>
                      <span className="text-sm text-slate-600">Table Mappings</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {target.tableMappings.slice(0, 2).map((mapping, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {mapping.sourceTable} → {mapping.targetTable}
                          </Badge>
                        ))}
                        {target.tableMappings.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{target.tableMappings.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TargetConfigDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSave={addTarget} />
    </div>
  )
}
