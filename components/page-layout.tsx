"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Database } from "lucide-react"
import Link from "next/link"

const steps = [
  { id: 1, name: "Job Details", path: "/job-details" },
  { id: 2, name: "Source", path: "/source" },
  { id: 3, name: "Target", path: "/target" },
  { id: 4, name: "Transformation", path: "/transformation" },
  { id: 5, name: "Validation", path: "/validation" },
  { id: 6, name: "Review & Submit", path: "/review" },
]

interface PageLayoutProps {
  title: string
  description: string
  currentStep: number
  children: React.ReactNode
}

export default function PageLayout({ title, description, currentStep, children }: PageLayoutProps) {
  const progress = (currentStep / steps.length) * 100

  const isStepComplete = (stepId: number): boolean => {
    return stepId < currentStep
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Hyperloop</h1>
                <p className="text-sm text-slate-600">Data Integration Platform</p>
              </div>
            </Link>
            <div className="text-right">
              <p className="text-sm text-slate-600">Morgan Stanley</p>
              <Badge variant="outline" className="text-xs border-blue-900 text-blue-900">
                Step {currentStep} of {steps.length}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Progress</CardTitle>
                <CardDescription className="text-slate-600">Track your onboarding progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step) => (
                  <Link
                    key={step.id}
                    href={step.path}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                      currentStep === step.id
                        ? "bg-blue-50 border border-blue-200"
                        : isStepComplete(step.id)
                          ? "hover:bg-green-50"
                          : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {isStepComplete(step.id) ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className={`h-5 w-5 ${currentStep === step.id ? "text-blue-900" : "text-slate-400"}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          currentStep === step.id
                            ? "text-blue-900"
                            : isStepComplete(step.id)
                              ? "text-green-900"
                              : "text-slate-900"
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="min-h-[600px] border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">{title}</CardTitle>
                <CardDescription className="text-slate-600">{description}</CardDescription>
              </CardHeader>
              <CardContent>{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
