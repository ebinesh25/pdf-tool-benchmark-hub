"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, X, FileText, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import ToolSelectionModal from "@/components/ToolSelectionModal"
import toolsData from "@/data/pdf-tools.json"

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Initialize selected tools from URL params
  useEffect(() => {
    const toolsParam = searchParams.get('tools')
    if (toolsParam) {
      const toolIds = toolsParam.split(',').filter(id => 
        toolsData.tools.some(tool => tool.id === id)
      ).slice(0, 3)
      setSelectedTools(toolIds)
    }
  }, [searchParams])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
    }
  }

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

  const removeToolSlot = (toolId: string) => {
    setSelectedTools(prev => prev.filter(id => id !== toolId))
  }

  const getToolById = (id: string) => {
    return toolsData.tools.find(tool => tool.id === id)
  }

  const selectedToolsData = selectedTools
    .map(id => getToolById(id))
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Compare PDF Tools
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Upload your PDF and compare extraction results from up to 3 different tools side by side.
            </p>
          </div>

          {/* PDF Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF Document</CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF files only (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUploadedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tool Selection Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Selected Tools</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedTools.length} of 3 tools selected
                </p>
              </div>
              <Button onClick={() => setModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                {selectedTools.length > 0 ? 'Change Tools' : 'Add Tools'}
              </Button>
            </div>

            {selectedTools.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No tools selected for comparison</p>
                  <Button onClick={() => setModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Select Tools
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {selectedToolsData.map((tool: any) => (
                  <Card key={tool.id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 z-10"
                      onClick={() => removeToolSlot(tool.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CardHeader>
                      <CardTitle className="text-lg pr-8">{tool.name}</CardTitle>
                      <Badge variant="secondary" className="w-fit">{tool.category}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Accuracy</span>
                          <span className="font-medium">{tool.benchmarks.accuracy}%</span>
                        </div>
                        <Progress value={tool.benchmarks.accuracy} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Speed</span>
                        <span className="font-medium">{tool.benchmarks.speed}ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cost</span>
                        <span className="font-medium">
                          {tool.benchmarks.costPerPage === 0 
                            ? "Free" 
                            : `$${tool.benchmarks.costPerPage}/page`
                          }
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Comparison Results */}
          {selectedToolsData.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Benchmark Comparison</h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {selectedToolsData.map((tool: any) => (
                  <Card key={tool.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{tool.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Accuracy</span>
                            <span className="font-medium">{tool.benchmarks.accuracy}%</span>
                          </div>
                          <Progress value={tool.benchmarks.accuracy} className="h-2" />
                        </div>

                        <div className="flex justify-between text-sm pt-2 border-t">
                          <span className="text-muted-foreground">Speed</span>
                          <span className="font-medium">{tool.benchmarks.speed}ms</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cost</span>
                          <span className="font-medium">
                            {tool.benchmarks.costPerPage === 0 
                              ? "Free" 
                              : `$${tool.benchmarks.costPerPage}/page`
                            }
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">File Size</span>
                          <span className="font-medium text-xs">{tool.benchmarks.fileSize}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-semibold mb-2">Features</h4>
                        <div className="space-y-1">
                          {tool.features.slice(0, 3).map((feature: string, idx: number) => (
                            <p key={idx} className="text-xs text-muted-foreground">• {feature}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sample Extraction Comparison */}
              {uploadedFile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Extraction Preview (Sample Data)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {selectedToolsData.map((tool: any) => (
                        <div key={tool.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{tool.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {tool.benchmarks.accuracy}% accuracy
                            </Badge>
                          </div>
                          <div className="bg-muted p-3 rounded-lg max-h-64 overflow-y-auto">
                            <pre className="text-xs whitespace-pre-wrap font-mono">
                              {tool.sampleDocument.extractedText.slice(0, 300)}...
                            </pre>
                          </div>
                          <p className="text-xs text-muted-foreground italic">
                            {tool.sampleDocument.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tool Selection Modal */}
      <ToolSelectionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedTools={selectedTools}
        onSelectTool={handleToolSelect}
        maxSelections={3}
      />
    </div>
  )
}