"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Network, Save, Info } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { CoPoMatrix } from '@/components/accreditation/co-po-matrix'
import { useState } from 'react'

export default function CoPoMappingPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({ title: "Mapping Saved", description: "Your CO-PO mapping has been successfully updated." })
    }, 1000)
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Network className="w-8 h-8 text-primary" />
            CO-PO Mapping
          </h2>
          <p className="text-muted-foreground mt-1">
            Map your Course Outcomes (CO) to Program Outcomes (PO) for accreditation compliance.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-sidebar" onClick={() => toast({ title: "Import Successful", description: "Previous semester mappings applied." })}>
            Import Previous
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 min-w-[120px]"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Mapping
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Interactive Matrix Mapping</CardTitle>
                <CardDescription>Click cells to toggle correlation levels: High (3), Medium (2), Low (1)</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1.5 py-1 px-3">
                <Info className="w-4 h-4" /> ECE401: Digital Signal Processing
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2 border-t border-sidebar-border mt-4">
            <div className="pt-6">
              <CoPoMatrix />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
