"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Check } from "lucide-react"
import { useState, useMemo } from "react"
import Image from "next/image"
import toolsData from "@/data/pdf-tools.json"

interface ToolSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTools: string[]
  onSelectTool: (toolId: string) => void
  maxSelections?: number
}

export default function ToolSelectionModal({ 
  open, 
  onOpenChange, 
  selectedTools, 
  onSelectTool,
  maxSelections = 3 
}: ToolSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTools = useMemo(() => {
    return toolsData.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleToolClick = (toolId: string) => {
    onSelectTool(toolId)
  }

  const isToolSelected = (toolId: string) => selectedTools.includes(toolId)
  const canSelectMore = selectedTools.length < maxSelections

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Tools to Compare</DialogTitle>
          <DialogDescription>
            Choose up to {maxSelections} tools to compare. Currently selected: {selectedTools.length}
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tools List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {filteredTools.map((tool) => {
            const isSelected = isToolSelected(tool.id)
            const isDisabled = !isSelected && !canSelectMore

            return (
              <div
                key={tool.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-primary/10 border-primary' 
                    : isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-muted'
                }`}
                onClick={() => !isDisabled && handleToolClick(tool.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image 
                      src={tool.logo} 
                      alt={tool.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-semibold">{tool.name}</h4>
                      {isSelected && (
                        <Button size="sm" variant="default" className="gap-2">
                          <Check className="h-3 w-3" />
                          Selected
                        </Button>
                      )}
                    </div>
                    <Badge variant="secondary" className="mb-2">
                      {tool.category}
                    </Badge>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {tool.description}
                    </p>
                    
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Accuracy:</span>
                        <span className="font-medium">{tool.benchmarks.accuracy}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Speed:</span>
                        <span className="font-medium">{tool.benchmarks.speed}ms</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Cost:</span>
                        <span className="font-medium">
                          {tool.benchmarks.costPerPage === 0 ? "Free" : `$${tool.benchmarks.costPerPage}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedTools.length} of {maxSelections} tools selected
          </p>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
