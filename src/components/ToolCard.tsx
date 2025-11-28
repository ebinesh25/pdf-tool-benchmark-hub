"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface ToolCardProps {
  tool: {
    id: string
    name: string
    description: string
    category: string
    logo: string
    benchmarks: {
      accuracy: number
      speed: number
      costPerPage: number
    }
  }
  isSelected?: boolean
  onSelect?: () => void
  selectionMode?: boolean
}

export default function ToolCard({ tool, isSelected = false, onSelect, selectionMode = false }: ToolCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    if (selectionMode && onSelect) {
      onSelect()
    } else {
      router.push(`/tools/${tool.id}`)
    }
  }

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
              <Image 
                src={tool.logo} 
                alt={tool.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {tool.category}
              </Badge>
            </div>
          </div>
          {selectionMode && (
            <Button
              size="icon"
              variant={isSelected ? "default" : "outline"}
              className="flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.()
              }}
            >
              {isSelected && <Check className="h-4 w-4" />}
            </Button>
          )}
        </div>
        <CardDescription className="mt-3">
          {tool.description}
        </CardDescription>
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
        </div>
      </CardContent>
    </Card>
  )
}