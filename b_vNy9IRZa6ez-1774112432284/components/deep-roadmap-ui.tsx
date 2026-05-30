"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Edge,
  Node,
} from '@xyflow/react'
import dagre from 'dagre'

import { X, Sparkles, BrainCircuit, Maximize2, Minimize2, Variable } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

import CosmicBackground from './CosmicBackground'

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 250
const nodeHeight = 80

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    }
    return newNode
  })

  return { nodes: newNodes, edges }
}

const CustomNode = ({ data }: any) => {
  return (
    <div className={`px-4 py-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-xl border object-contain backdrop-blur-md bg-black/60 w-[250px] cursor-pointer transition-all hover:scale-105 hover:bg-black/80 hover:shadow-[0_0_20px_rgba(100,50,250,0.6)] ${data.isRoot ? 'border-emerald-500' : data.isModule ? 'border-cyan-500' : 'border-purple-500/80'} ${data.isSelected ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`} onClick={() => data.onClick(data)}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-emerald-500" />
      <div className="flex items-center space-x-2">
        {data.isRoot && <BrainCircuit className="h-5 w-5 text-emerald-400" />}
        {data.isModule && <Sparkles className="h-4 w-4 text-cyan-400" />}
        {!data.isRoot && !data.isModule && <Variable className="h-4 w-4 text-purple-400" />}
        
        <div className="text-sm font-semibold truncate flex-1 text-white" title={data.label}>
          {data.label}
        </div>
      </div>
      {data.isModule && (
        <div className="text-xs text-blue-200/70 mt-1 cursor-pointer hover:text-emerald-400 transition-colors">
          Click to expand subtopics
        </div>
      )}
      {!data.isRoot && !data.isModule && (
         <div className="text-xs text-orange-200/70 mt-1 transition-colors">
          Click for insights
         </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-emerald-500" />
    </div>
  )
}

const nodeTypes = { custom: CustomNode }

export function DeepRoadmapUI({ subject, isOpen, onClose }: { subject: string, isOpen: boolean, onClose: () => void }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [loading, setLoading] = useState(false)
  const [roadmapData, setRoadmapData] = useState<any>(null)
  const [selectedPanel, setSelectedPanel] = useState<'explain' | 'realworld' | null>(null)
  const [panelTopic, setPanelTopic] = useState("")
  const [panelContent, setPanelContent] = useState("")
  const [panelLoading, setPanelLoading] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Fetch Roadmap
  useEffect(() => {
    if (isOpen && subject && !roadmapData) {
      const fetchRoadmap = async () => {
        setLoading(true)
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
          const res = await fetch(`${API_URL}/exam-prep/deep-roadmap?subject=${encodeURIComponent(subject)}`)
          const data = await res.json()
          setRoadmapData(data)
          
          // Construct initial Tree (Subject + Modules)
          const initialNodes: Node[] = [
            {
              id: 'root',
              type: 'custom',
              position: { x: 0, y: 0 },
              data: { label: data.subject, isRoot: true, onClick: () => {} }
            }
          ]
          const initialEdges: Edge[] = []
          
          data.modules.forEach((mod: any, i: number) => {
            const modId = `mod-${i}`
            initialNodes.push({
              id: modId,
              type: 'custom',
              position: { x: 0, y: 0 },
              data: { label: mod.title, isModule: true, onClick: (nodeData: any) => handleExpandModule(modId, i, mod.subtopics) }
            })
            initialEdges.push({
              id: `edge-root-${modId}`,
              source: 'root',
              target: modId,
              animated: true,
              style: { stroke: 'hsl(var(--primary))' }
            })
          })
          
          const layouted = getLayoutedElements(initialNodes, initialEdges)
          setNodes(layouted.nodes)
          setEdges(layouted.edges)
        } catch (e) {
          console.error(e)
        }
        setLoading(false)
      }
      fetchRoadmap()
    }
  }, [isOpen, subject, roadmapData])

  const handleExpandModule = useCallback((modId: string, modIndex: number, subtopics: string[]) => {
    setNodes((nds) => {
      // Check if already expanded
      const hasChildren = edges.some(e => e.source === modId)
      if (hasChildren) return nds // Add collapse logic later if needed
      
      const newNodes = [...nds]
      const newEdges = [...edges]
      
      subtopics.forEach((sub, j) => {
        const subId = `sub-${modIndex}-${j}`
        newNodes.push({
          id: subId,
          type: 'custom',
          position: { x: 0, y: 0 },
          data: { label: sub, isSub: true, onClick: () => openSidePanel(sub) }
        })
        newEdges.push({
          id: `edge-${modId}-${subId}`,
          source: modId,
          target: subId,
          animated: false,
          style: { stroke: 'hsl(var(--muted-foreground))' }
        })
      })
      
      const layouted = getLayoutedElements(newNodes, newEdges)
      setEdges(layouted.edges)
      return layouted.nodes
    })
  }, [edges])

  const openSidePanel = (topic: string) => {
    setPanelTopic(topic)
    setSelectedPanel(null)
    setPanelContent("Select an action below to generate insights.")
  }

  const fetchExplanation = async () => {
    setSelectedPanel('explain')
    setPanelLoading(true)
    setPanelContent("")
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${API_URL}/exam-prep/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: panelTopic, subject: subject })
      })
      const data = await res.json()
      setPanelContent(data.explanation || "No explanation found.")
    } catch(e) {
      setPanelContent("Failed to load explanation.")
    }
    setPanelLoading(false)
  }

  const fetchRealWorld = async () => {
    setSelectedPanel('realworld')
    setPanelLoading(true)
    setPanelContent("")
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${API_URL}/exam-prep/real-world`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: panelTopic, subject: subject })
      })
      const data = await res.json()
      setPanelContent(data.explanation || "No data found.")
    } catch(e) {
      setPanelContent("Failed to load real-world applications.")
    }
    setPanelLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`flex flex-col p-4 bg-black/80 border-none backdrop-blur-md shadow-[0_0_50px_rgba(100,50,255,0.4)] text-white overflow-hidden transition-all duration-300 ${isFullScreen ? '!max-w-none !w-screen !h-screen !m-0 !p-6 !rounded-none data-[state=open]:!zoom-in-100' : '!max-w-[95vw] !w-[95vw] !h-[95vh]'}`}>
        {/* Dynamic Saturn-like Cosmic Background behind everything */}
        <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden opacity-70">
          <CosmicBackground />
          <div className="absolute top-[20%] left-[80%] w-64 h-64 rounded-full bg-gradient-to-tr from-emerald-900 to-cyan-900 blur-2xl opacity-60 mix-blend-screen animate-pulse"></div>
          <div className="absolute top-[30%] left-[80%] w-72 h-4 bg-emerald-300 blur-md transform -rotate-12 opacity-80"></div>
          <div className="absolute top-[30%] left-[80%] w-80 h-1 bg-cyan-100 transform -rotate-12 opacity-50"></div>
        </div>

        <DialogHeader className="mb-2 shrink-0 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="flex flex-row items-center gap-2 text-2xl text-white">
              <Maximize2 className="h-6 w-6 text-emerald-400" /> Deep Knowledge Tree: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{subject}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Scroll to zoom, click and drag to pan. Click on Modules to expand Subtopics. Click on Subtopics for dedicated formulas and insights.
            </DialogDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsFullScreen(!isFullScreen)} className="bg-white/10 hover:bg-white/20 border-none text-white mr-8">
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 w-full relative flex rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-inner">
          {loading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
              <div className="relative w-32 h-32 mb-4 animate-[spin_10s_linear_infinite]">
                 {/* CSS Saturn loading animation */}
                 <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-800 shadow-[0_0_30px_rgba(255,150,50,0.5)]"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-8 border-t-4 border-b-4 border-amber-200/80 rounded-[50%] transform rotate-12"></div>
              </div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-orange-400 animate-pulse">
                Mapping the Cosmos of Knowledge...
              </h3>
              <p className="text-sm text-gray-400 mt-2">Deep space calculations take a moment.</p>
            </div>
          )}
          
          <div className="flex-1 h-full relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              panOnScroll={true}
              zoomOnDoubleClick={true}
              attributionPosition="bottom-left"
            >
              <Background gap={16} size={1} color="rgba(255,255,255,0.1)" />
              <Controls className="bg-white/10 border-none fill-white text-white rounded-md overflow-hidden" />
            </ReactFlow>
          </div>

          {/* Right Side Panel */}
          {panelTopic && (
            <div className="w-[450px] h-full border-l border-white/20 bg-black/60 backdrop-blur-xl flex flex-col shrink-0 overflow-hidden shadow-2xl z-10 transition-all">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-lg text-white truncate flex-1">{panelTopic}</h3>
                <Button variant="ghost" size="icon" onClick={() => setPanelTopic("")} className="text-white hover:bg-white/20">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4 grid grid-cols-2 gap-3 border-b border-white/10">
                <Button 
                  variant={selectedPanel === 'explain' ? 'default' : 'secondary'} 
                  onClick={fetchExplanation}
                  className={`w-full text-xs font-semibold ${selectedPanel === 'explain' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-200'}`}
                >
                  <BrainCircuit className="h-4 w-4 mr-2" /> Explain Context
                </Button>
                <Button 
                  variant={selectedPanel === 'realworld' ? 'default' : 'secondary'} 
                  onClick={fetchRealWorld}
                  className={`w-full text-xs font-semibold ${selectedPanel === 'realworld' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-200'}`}
                >
                  <Sparkles className="h-4 w-4 mr-2" /> Real-World Scenarios
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto w-full p-6 custom-scrollbar">
                {panelLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400 mb-4"></div>
                    <p className="text-gray-400 text-sm animate-pulse">Generating insights...</p>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none w-full">
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {panelContent}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
