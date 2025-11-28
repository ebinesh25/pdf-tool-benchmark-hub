"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, DollarSign, Gauge } from "lucide-react"
import Image from "next/image"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  logo: string
  benchmarks: {
    accuracy: number
    speed: number
    costPerPage: number
    fileSize: string
    maintenance: string
  }
  features: string[]
  sampleDocument: {
    title: string
    originalText: string
    extractedText: string
    notes: string
  }
}

interface ToolDetailModalProps {
  tool: Tool | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ToolDetailModal({ tool, open, onOpenChange }: ToolDetailModalProps) {
  if (!tool) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image 
                src={tool.logo} 
                alt={tool.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{tool.name}</DialogTitle>
              <DialogDescription className="mt-2">
                {tool.description}
              </DialogDescription>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">{tool.category}</Badge>
                <Badge variant="outline">{tool.benchmarks.maintenance}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="benchmarks" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="sample">Sample Extraction</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="benchmarks" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
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

          <TabsContent value="sample" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge>Test Document</Badge>
                  {tool.sampleDocument.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{tool.sampleDocument.notes}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Original Text</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {tool.sampleDocument.originalText}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 text-primary">Extracted Text</h4>
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {tool.sampleDocument.extractedText}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tool.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
