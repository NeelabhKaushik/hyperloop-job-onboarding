"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Database, FileText, Globe, CheckCircle, XCircle, Trash2 } from "lucide-react"
import type { Source } from "@/types/job-types"
import SourceConfigDialog from "@/components/source-config-dialog"

interface SourceStepProps {
  sources: Source[]
  addSource: (source: Source) => void
}

const getSourceIcon = (type: string) => {
  switch (type) {
    case "database":
      return <Database className="h-5 w-5" />
    case "file":
      return <FileText className="h-5 w-5" />
    case "api":
      return <Globe className="h-5 w-5" />
    default:
      return <Database className="h-5 w-5" />
  }
}

export default function SourceStep({ sources, addSource }: SourceStepProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Sources</h3>
          <p className="text-sm text-slate-600">Configure your data sources and test connections</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Source
        </Button>
      </div>

      {sources.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No sources configured</h3>
            <p className="text-slate-600 text-center mb-4">
              Add your first data source to begin the integration process
            </p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((source) => (
            <Card key={source.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">{getSourceIcon(source.type)}</div>
                    <div>
                      <CardTitle className="text-base">{source.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {source.type} • {source.system}
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
                      {source.isConnected ? (
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

                  {source.tables && source.tables.length > 0 && (
                    <div>
                      <span className="text-sm text-slate-600">Available Tables</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {source.tables.slice(0, 3).map((table) => (
                          <Badge key={table} variant="secondary" className="text-xs">
                            {table}
                          </Badge>
                        ))}
                        {source.tables.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{source.tables.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SourceConfigDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSave={addSource} />
    </div>
  )
}
