"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Clock, DollarSign, Gauge } from "lucide-react"
import Image from "next/image"
import toolsData from "@/data/pdf-tools.json"

export default function ToolDetailPage() {
  const router = useRouter()
  const params = useParams()
  const toolId = params.id as string
  
  const [selectedToolId, setSelectedToolId] = useState(toolId)
  const tool = toolsData.tools.find(t => t.id === selectedToolId)

  useEffect(() => {
    setSelectedToolId(toolId)
  }, [toolId])

  const handleToolChange = (newToolId: string) => {
    setSelectedToolId(newToolId)
    router.push(`/tools/${newToolId}`)
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">Tool not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-8">
          {/* Tool Header with Dropdown */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex items-start gap-4 flex-1">
              <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image 
                  src={tool.logo} 
                  alt={tool.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                <p className="text-muted-foreground mt-2">
                  {tool.description}
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">{tool.category}</Badge>
                  <Badge variant="outline">{tool.benchmarks.maintenance}</Badge>
                </div>
              </div>
            </div>

            {/* Tool Selector Dropdown */}
            <div className="w-full md:w-64">
              <label className="text-sm font-medium mb-2 block">Switch Tool</label>
              <Select value={selectedToolId} onValueChange={handleToolChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toolsData.tools.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs for Details */}
          <Tabs defaultValue="benchmarks" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
              <TabsTrigger value="sample">Sample Extraction</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="benchmarks" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-primary" />
                      Accuracy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{tool.benchmarks.accuracy}%</div>
                    <Progress value={tool.benchmarks.accuracy} className="mt-2 h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Processing Speed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{tool.benchmarks.speed}ms</div>
                    <p className="text-xs text-muted-foreground mt-1">per page average</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Cost Per Page
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {tool.benchmarks.costPerPage === 0 
                        ? "Free" 
                        : `$${tool.benchmarks.costPerPage}`
                      }
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">operational cost</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      File Size Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-sm">{tool.benchmarks.fileSize}</div>
                    <p className="text-xs text-muted-foreground mt-1">optimal range</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sample" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>Test Document</Badge>
                    {tool.sampleDocument.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{tool.sampleDocument.notes}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Original Text</h4>
                    <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {tool.sampleDocument.originalText}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-primary">Extracted Text</h4>
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {tool.sampleDocument.extractedText}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tool.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-4 rounded-lg border bg-card"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
