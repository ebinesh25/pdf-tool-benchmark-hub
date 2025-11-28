"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight } from "lucide-react"
import ToolCard from "@/components/ToolCard"
import toolsData from "@/data/pdf-tools.json"

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTools, setSelectedTools] = useState<string[]>([])

  const filteredTools = useMemo(() => {
    return toolsData.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleToolSelect = (toolId: string) => {
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId)
      } else if (prev.length < 3) {
        return [...prev, toolId]
      }
      return prev
    })
  }

  const handleCompare = () => {
    router.push(`/compare?tools=${selectedTools.join(',')}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              PDF Extraction Tools
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Compare and explore the best PDF extraction tools. View benchmark stats, 
              sample extractions, and find the perfect tool for your needs.
            </p>
          </div>

          {/* Search Bar and Selection Info */}
          <div className="mx-auto max-w-xl space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tools by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {selectedTools.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div>
                  <p className="font-medium">
                    {selectedTools.length} tool{selectedTools.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {3 - selectedTools.length} more can be selected
                  </p>
                </div>
                <Button onClick={handleCompare} className="gap-2">
                  Compare Selected
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredTools.length} of {toolsData.tools.length} tools
          </div>

          {/* Tools Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool}
                isSelected={selectedTools.includes(tool.id)}
                onSelect={() => handleToolSelect(tool.id)}
                selectionMode={true}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredTools.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No tools found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}