"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Database, Target, ArrowRightLeft, Shield, CheckCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Hyperloop</h1>
                <p className="text-sm text-slate-600">Data Integration Platform</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Morgan Stanley</p>
              <p className="text-xs text-slate-500">Enterprise Data Solutions</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Job Onboarding Platform</h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Create and configure automated data integration jobs with our enterprise-grade platform. Streamline your
            data workflows with powerful transformation and validation capabilities.
          </p>
          <Link href="/job-details">
            <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white">
              Start New Job
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Process Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Onboarding Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: FileText, title: "Job Details", description: "Basic information" },
              { icon: Database, title: "Source", description: "Data source" },
              { icon: Target, title: "Target", description: "Data destination" },
              { icon: ArrowRightLeft, title: "Transform", description: "Data mapping" },
              { icon: Shield, title: "Validate", description: "Quality checks" },
              { icon: CheckCircle, title: "Review", description: "Final submission" },
            ].map((step, index) => (
              <Card key={index} className="text-center border-slate-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <step.icon className="h-6 w-6 text-blue-900" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <Database className="h-5 w-5 text-blue-900" />
                <span>Multiple Connectors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Connect to various data sources including databases, APIs, cloud storage, and file systems with built-in
                validation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <ArrowRightLeft className="h-5 w-5 text-blue-900" />
                <span>Smart Transformations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Configure complex data transformations with visual mapping, calculated fields, and custom business
                logic.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <Shield className="h-5 w-5 text-blue-900" />
                <span>Data Quality</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Ensure data integrity with comprehensive validation rules, quality checks, and error handling
                mechanisms.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-blue-900 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Begin your data integration journey with our step-by-step onboarding process. Create your first job in
              minutes with our intuitive interface.
            </p>
            <Link href="/job-details">
              <Button size="lg" variant="secondary" className="bg-white text-blue-900 hover:bg-slate-100">
                Create Your First Job
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
