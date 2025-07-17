"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import type { JobData } from "@/types/job-types"

interface JobDetailsStepProps {
  jobData: JobData
  updateJobData: (updates: Partial<JobData>) => void
}

const jobOwners = [
  "John Smith - Data Engineer",
  "Sarah Johnson - Senior Analyst",
  "Mike Chen - Data Architect",
  "Lisa Rodriguez - Team Lead",
]

const scheduleTypes = ["Manual", "Scheduled", "Event-based"]

export default function JobDetailsStep({ jobData, updateJobData }: JobDetailsStepProps) {
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !jobData.tags.includes(newTag.trim())) {
      updateJobData({
        tags: [...jobData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateJobData({
      tags: jobData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="jobName" className="text-sm font-medium">
            Job Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="jobName"
            placeholder="Enter job name"
            value={jobData.jobName}
            onChange={(e) => updateJobData({ jobName: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobOwner" className="text-sm font-medium">
            Job Owner <span className="text-red-500">*</span>
          </Label>
          <Select value={jobData.jobOwner} onValueChange={(value) => updateJobData({ jobOwner: value })}>
            <SelectTrigger>
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
        <Label htmlFor="jobDescription" className="text-sm font-medium">
          Job Description
        </Label>
        <Textarea
          id="jobDescription"
          placeholder="Describe the purpose and scope of this job"
          value={jobData.jobDescription}
          onChange={(e) => updateJobData({ jobDescription: e.target.value })}
          rows={4}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduleType" className="text-sm font-medium">
          Schedule Type <span className="text-red-500">*</span>
        </Label>
        <Select value={jobData.scheduleType} onValueChange={(value) => updateJobData({ scheduleType: value })}>
          <SelectTrigger className="w-full md:w-1/2">
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
        <Label className="text-sm font-medium">Tags</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {jobData.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
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
            className="flex-1"
          />
          <Button onClick={addTag} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="font-medium text-slate-900 mb-2">Job Summary</h3>
        <div className="space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-medium">Name:</span> {jobData.jobName || "Not specified"}
          </p>
          <p>
            <span className="font-medium">Owner:</span> {jobData.jobOwner || "Not specified"}
          </p>
          <p>
            <span className="font-medium">Schedule:</span> {jobData.scheduleType || "Not specified"}
          </p>
          <p>
            <span className="font-medium">Tags:</span> {jobData.tags.length > 0 ? jobData.tags.join(", ") : "None"}
          </p>
        </div>
      </div>
    </div>
  )
}
