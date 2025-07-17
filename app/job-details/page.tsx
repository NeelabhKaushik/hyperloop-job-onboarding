"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Plus, ArrowRight } from "lucide-react"
import PageLayout from "@/components/page-layout"

const jobOwners = [
  "John Smith - Data Engineer",
  "Sarah Johnson - Senior Analyst",
  "Mike Chen - Data Architect",
  "Lisa Rodriguez - Team Lead",
]

const scheduleTypes = ["Manual", "Scheduled", "Event-based"]

export default function JobDetailsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    jobName: "",
    jobDescription: "",
    jobOwner: "",
    scheduleType: "",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleNext = () => {
    if (formData.jobName && formData.jobOwner && formData.scheduleType) {
      // Save to localStorage or context
      localStorage.setItem("jobData", JSON.stringify(formData))
      router.push("/source")
    }
  }

  const isFormValid = formData.jobName && formData.jobOwner && formData.scheduleType

  return (
    <PageLayout title="Job Details" description="Configure basic job information and settings" currentStep={1}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="jobName" className="text-sm font-medium text-slate-700">
              Job Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jobName"
              placeholder="Enter job name"
              value={formData.jobName}
              onChange={(e) => setFormData((prev) => ({ ...prev, jobName: e.target.value }))}
              className="border-slate-300 focus:border-blue-900 focus:ring-blue-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobOwner" className="text-sm font-medium text-slate-700">
              Job Owner <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.jobOwner}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, jobOwner: value }))}
            >
              <SelectTrigger className="border-slate-300 focus:border-blue-900 focus:ring-blue-900">
                <SelectValue placeholder="Select job owner" />
              </SelectTrigger>
              <SelectContent>
                {jobOwners.map((owner) => (
                  <SelectItem key={owner} value={owner}>
                    {owner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobDescription" className="text-sm font-medium text-slate-700">
            Job Description
          </Label>
          <Textarea
            id="jobDescription"
            placeholder="Describe the purpose and scope of this job"
            value={formData.jobDescription}
            onChange={(e) => setFormData((prev) => ({ ...prev, jobDescription: e.target.value }))}
            rows={4}
            className="border-slate-300 focus:border-blue-900 focus:ring-blue-900"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduleType" className="text-sm font-medium text-slate-700">
            Schedule Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.scheduleType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, scheduleType: value }))}
          >
            <SelectTrigger className="w-full md:w-1/2 border-slate-300 focus:border-blue-900 focus:ring-blue-900">
              <SelectValue placeholder="Select schedule type" />
            </SelectTrigger>
            <SelectContent>
              {scheduleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1 bg-blue-50 text-blue-900 border-blue-200"
              >
                {tag}
                <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-slate-300 focus:border-blue-900 focus:ring-blue-900"
            />
            <Button
              onClick={addTag}
              variant="outline"
              size="sm"
              className="border-blue-900 text-blue-900 hover:bg-blue-50 bg-transparent"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Job Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-slate-600">Name:</span>
              <span className="text-slate-900">{formData.jobName || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-600">Owner:</span>
              <span className="text-slate-900">{formData.jobOwner || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-600">Schedule:</span>
              <span className="text-slate-900">{formData.scheduleType || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-600">Tags:</span>
              <span className="text-slate-900">{formData.tags.length > 0 ? formData.tags.join(", ") : "None"}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={handleNext} disabled={!isFormValid} className="bg-blue-900 hover:bg-blue-800 text-white">
            Next: Configure Source
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
