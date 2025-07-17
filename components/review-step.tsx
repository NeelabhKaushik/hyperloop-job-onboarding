"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Database, ArrowRight, Shield, AlertTriangle, XCircle, Play } from "lucide-react"
import type { JobData } from "@/types/job-types"

interface ReviewStepProps {
  jobData: JobData
}

export default function ReviewStep({ jobData }: ReviewStepProps) {
  const handleSubmitJob = () => {
    // Handle job submission
    console.log("Submitting job:", jobData)
    alert("Job submitted successfully! You will be redirected to the job monitoring dashboard.")
  }

  const getSourceIcon = (type: string) => {
    return <Database className="h-4 w-4" />
  }

  const getValidationIcon = (severity: string) => {
    return severity === "error" ? XCircle : AlertTriangle
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Review & Submit</h3>
          <p className="text-sm text-slate-600">Review your job configuration before submission</p>
        </div>
        <Button onClick={handleSubmitJob} className="bg-emerald-600 hover:bg-emerald-700">
          <Play className="h-4 w-4 mr-2" />
          Submit Job
        </Button>
      </div>

      {/* Job Details Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span>Job Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Job Name</p>
              <p className="text-sm">{jobData.jobName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Job Owner</p>
              <p className="text-sm">{jobData.jobOwner}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Schedule Type</p>
              <p className="text-sm">{jobData.scheduleType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Tags</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {jobData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          {jobData.jobDescription && (
            <div>
              <p className="text-sm font-medium text-slate-600">Description</p>
              <p className="text-sm text-slate-700">{jobData.jobDescription}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sources Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span>Data Sources ({jobData.sources.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {jobData.sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getSourceIcon(source.type)}
                  <div>
                    <p className="text-sm font-medium">{source.name}</p>
                    <p className="text-xs text-slate-600 capitalize">
                      {source.type} • {source.system}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {source.isConnected ? (
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-700 border-red-200">
                      Not Connected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Targets Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Database className="h-5 w-5 text-purple-600" />
            <span>Data Targets ({jobData.targets.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {jobData.targets.map((target) => (
              <div key={target.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getSourceIcon(target.type)}
                  <div>
                    <p className="text-sm font-medium">{target.name}</p>
                    <p className="text-xs text-slate-600 capitalize">
                      {target.type} • {target.system}
                    </p>
                    {target.schema && <p className="text-xs text-slate-500">Schema: {target.schema}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {target.isConnected ? (
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-700 border-red-200">
                      Not Connected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transformations Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <ArrowRight className="h-5 w-5 text-orange-600" />
            <span>Transformations ({jobData.transformations.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {jobData.transformations.map((transformation) => (
              <div key={transformation.id} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{transformation.name}</p>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {transformation.type}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{transformation.sourceColumn}</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded">
                    {transformation.targetColumn}
                  </span>
                </div>
                {transformation.description && (
                  <p className="text-xs text-slate-500 mt-2">{transformation.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validations Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Validation Rules ({jobData.validations.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {jobData.validations.map((validation) => {
              const ValidationIcon = getValidationIcon(validation.severity)
              return (
                <div key={validation.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ValidationIcon
                        className={`h-4 w-4 ${validation.severity === "error" ? "text-red-600" : "text-yellow-600"}`}
                      />
                      <p className="text-sm font-medium">{validation.name}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        validation.severity === "error"
                          ? "text-red-700 border-red-200"
                          : "text-yellow-700 border-yellow-200"
                      }
                    >
                      {validation.severity}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600">
                    <p>Column: {validation.column}</p>
                    {validation.condition && <p>Condition: {validation.condition}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardHeader>
          <CardTitle className="text-base text-emerald-900">Configuration Summary</CardTitle>
          <CardDescription className="text-emerald-700">Your job is ready for submission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-600">{jobData.sources.length}</p>
              <p className="text-sm text-emerald-700">Sources</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{jobData.targets.length}</p>
              <p className="text-sm text-emerald-700">Targets</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{jobData.transformations.length}</p>
              <p className="text-sm text-emerald-700">Transformations</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{jobData.validations.length}</p>
              <p className="text-sm text-emerald-700">Validations</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-center">
            <Button onClick={handleSubmitJob} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Play className="h-5 w-5 mr-2" />
              Submit Job for Processing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
