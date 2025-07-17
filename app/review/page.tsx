"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Database, ArrowRight, Shield, AlertTriangle, XCircle, Play, ArrowLeft } from "lucide-react"
import PageLayout from "@/components/page-layout"

interface JobSummary {
  jobData: any
  sourceData: any
  targetData: any
  transformationData: any[]
  validationData: any[]
}

export default function ReviewPage() {
  const router = useRouter()
  const [jobSummary, setJobSummary] = useState<JobSummary | null>(null)

  useEffect(() => {
    // Load all data from localStorage
    const jobData = JSON.parse(localStorage.getItem("jobData") || "{}")
    const sourceData = JSON.parse(localStorage.getItem("sourceData") || "{}")
    const targetData = JSON.parse(localStorage.getItem("targetData") || "{}")
    const transformationData = JSON.parse(localStorage.getItem("transformationData") || "[]")
    const validationData = JSON.parse(localStorage.getItem("validationData") || "[]")

    setJobSummary({
      jobData,
      sourceData,
      targetData,
      transformationData,
      validationData,
    })
  }, [])

  const handleSubmitJob = () => {
    // Handle job submission
    console.log("Submitting job:", jobSummary)
    alert("Job submitted successfully! You will be redirected to the job monitoring dashboard.")
    // Clear localStorage
    localStorage.removeItem("jobData")
    localStorage.removeItem("sourceData")
    localStorage.removeItem("targetData")
    localStorage.removeItem("transformationData")
    localStorage.removeItem("validationData")
    router.push("/")
  }

  const handleBack = () => {
    router.push("/validation")
  }

  const getValidationIcon = (severity: string) => {
    return severity === "error" ? XCircle : AlertTriangle
  }

  if (!jobSummary) {
    return (
      <PageLayout title="Review & Submit" description="Loading job configuration..." currentStep={6}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading job configuration...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title="Review & Submit"
      description="Review your complete job configuration before submission"
      currentStep={6}
    >
      <div className="space-y-6">
        {/* Job Details Summary */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-slate-900">Job Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Job Name</p>
                <p className="text-sm text-slate-900">{jobSummary.jobData.jobName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Job Owner</p>
                <p className="text-sm text-slate-900">{jobSummary.jobData.jobOwner}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Schedule Type</p>
                <p className="text-sm text-slate-900">{jobSummary.jobData.scheduleType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {jobSummary.jobData.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-900 border-blue-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            {jobSummary.jobData.jobDescription && (
              <div>
                <p className="text-sm font-medium text-slate-600">Description</p>
                <p className="text-sm text-slate-700">{jobSummary.jobData.jobDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Source Summary */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-900" />
              <span className="text-slate-900">Data Source</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-4 w-4 text-blue-900" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{jobSummary.sourceData.name}</p>
                  <p className="text-xs text-slate-600 capitalize">
                    {jobSummary.sourceData.type} • {jobSummary.sourceData.system}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-700 border-green-200">
                  Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Summary */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Database className="h-5 w-5 text-purple-600" />
              <span className="text-slate-900">Data Target</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{jobSummary.targetData.name}</p>
                  <p className="text-xs text-slate-600 capitalize">
                    {jobSummary.targetData.type} • {jobSummary.targetData.system}
                  </p>
                  {jobSummary.targetData.schema && (
                    <p className="text-xs text-slate-500">Schema: {jobSummary.targetData.schema}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-700 border-green-200">
                  Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transformations Summary */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <ArrowRight className="h-5 w-5 text-orange-600" />
              <span className="text-slate-900">Transformations ({jobSummary.transformationData.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobSummary.transformationData.map((transformation: any) => (
                <div key={transformation.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-900">{transformation.name}</p>
                    <Badge
                      variant="secondary"
                      className="text-xs capitalize bg-orange-50 text-orange-900 border-orange-200"
                    >
                      {transformation.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{transformation.sourceColumn}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded">{transformation.targetColumn}</span>
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
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-slate-900">Validation Rules ({jobSummary.validationData.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobSummary.validationData.map((validation: any) => {
                const ValidationIcon = getValidationIcon(validation.severity)
                return (
                  <div key={validation.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <ValidationIcon
                          className={`h-4 w-4 ${validation.severity === "error" ? "text-red-600" : "text-yellow-600"}`}
                        />
                        <p className="text-sm font-medium text-slate-900">{validation.name}</p>
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
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base text-blue-900">Configuration Summary</CardTitle>
            <CardDescription className="text-blue-700">Your job is ready for submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-900">1</p>
                <p className="text-sm text-blue-700">Source</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">1</p>
                <p className="text-sm text-blue-700">Target</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{jobSummary.transformationData.length}</p>
                <p className="text-sm text-blue-700">Transformations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{jobSummary.validationData.length}</p>
                <p className="text-sm text-blue-700">Validations</p>
              </div>
            </div>

            <Separator className="my-4 bg-blue-200" />

            <div className="flex items-center justify-center">
              <Button onClick={handleSubmitJob} size="lg" className="bg-blue-900 hover:bg-blue-800 text-white">
                <Play className="h-5 w-5 mr-2" />
                Submit Job for Processing
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleSubmitJob} className="bg-blue-900 hover:bg-blue-800 text-white">
            <Play className="h-5 w-5 mr-2" />
            Submit Job
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
