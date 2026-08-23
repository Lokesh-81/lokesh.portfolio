"use client"

import { useState, useRef, useEffect } from "react"
import { Play, RotateCcw, Sparkles, Sliders, Cpu, Activity, Zap } from "lucide-react"

export default function StudioPlayground() {
  const [activeTab, setActiveTab] = useState<"particles" | "ai-stream" | "shader" | "waveform">("particles")

  // Particle canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particleCount, setParticleCount] = useState(45)
  const [particleColor, setParticleColor] = useState<"purple" | "cyan" | "emerald">("purple")

  useEffect(() => {
    if (activeTab !== "particles") return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500)
    let height = (canvas.height = 240)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.parentElement?.clientWidth || 500
      height = canvas.height = 240
    }
    window.addEventListener("resize", handleResize)

    // Particles setup
    let mouse = { x: width / 2, y: height / 2, isHovered: false }

    const colors = {
      purple: ["#a855f7", "#c084fc", "#e9d5ff"],
      cyan: ["#06b6d4", "#38bdf8", "#bae6fd"],
      emerald: ["#10b981", "#34d399", "#a7f3d0"]
    }

    const currentColors = colors[particleColor]

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
    }> = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2.5 + 1,
        color: currentColors[Math.floor(Math.random() * currentColors.length)]
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.isHovered = true
    }

    const onMouseLeave = () => {
      mouse.isHovered = false
    }

    canvas.addEventListener("mousemove", onMouseMove)
    canvas.addEventListener("mouseleave", onMouseLeave)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 80)})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Update & Draw particles
      particles.forEach((p) => {
        if (mouse.isHovered) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const force = (100 - dist) / 100
            p.vx += (dx / dist) * force * 0.2
            p.vy += (dy / dist) * force * 0.2
          }
        }

        p.x += p.vx
        p.y += p.vy

        // Drag
        p.vx *= 0.98
        p.vy *= 0.98

        // Bound
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", onMouseMove)
      canvas.removeEventListener("mouseleave", onMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [activeTab, particleCount, particleColor])

  // AI Stream Simulator state
  const [promptText, setPromptText] = useState("Analyze quarterly architecture performance...")
  const [streamOutput, setStreamOutput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  const runAiSimulation = () => {
    setIsStreaming(true)
    setStreamOutput("")
    const simulatedResponse =
      "⚡ [GEMINI 2.5 FLASH]: Initializing vector synthesis...\n" +
      "• Latency Benchmark: 42ms cold-start via Edge Runtime\n" +
      "• Throughput: 142 tokens/sec streaming throughput\n" +
      "• Memory Footprint: 2.1 MB zero-copy buffer\n" +
      "✔ Model inference completed successfully with 100% token accuracy."

    let i = 0
    const interval = setInterval(() => {
      if (i < simulatedResponse.length) {
        setStreamOutput((prev) => prev + simulatedResponse[i])
        i++
      } else {
        clearInterval(interval)
        setIsStreaming(false)
      }
    }, 18)
  }

  // Waveform state
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const [waveSpeed, setWaveSpeed] = useState(0.04)

  useEffect(() => {
    if (activeTab !== "waveform") return
    const canvas = waveCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let step = 0

    const renderWave = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 500)
      const h = (canvas.height = 240)
      ctx.clearRect(0, 0, w, h)

      step += waveSpeed

      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath()
        ctx.moveTo(0, h / 2)
        for (let x = 0; x < w; x += 5) {
          const y =
            h / 2 +
            Math.sin(x * 0.015 + step + layer) * 35 * Math.sin(step * 0.5) +
            Math.cos(x * 0.03 - step) * 15
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = layer === 0 ? "#a855f7" : layer === 1 ? "#38bdf8" : "#ec4899"
        ctx.lineWidth = layer === 0 ? 2 : 1.2
        ctx.globalAlpha = 0.7 - layer * 0.2
        ctx.stroke()
      }

      animId = requestAnimationFrame(renderWave)
    }

    renderWave()
    return () => cancelAnimationFrame(animId)
  }, [activeTab, waveSpeed])

  return (
    <div className="rounded-3xl border border-purple-500/20 bg-black/60 p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-300">
            <Zap className="size-4 text-purple-400" />
            <span>INTERACTIVE PLAYGROUND</span>
          </div>
          <h3 className="mt-1 text-2xl font-light text-white tracking-tight">
            Digital <span className="instrument italic font-normal">Experiments & Physics</span>
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("particles")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "particles" ? "bg-purple-600 text-white shadow-sm" : "text-white/60 hover:text-white"
            }`}
          >
            Particle Gravity
          </button>
          <button
            onClick={() => setActiveTab("ai-stream")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "ai-stream" ? "bg-purple-600 text-white shadow-sm" : "text-white/60 hover:text-white"
            }`}
          >
            LLM Streamer
          </button>
          <button
            onClick={() => setActiveTab("waveform")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "waveform" ? "bg-purple-600 text-white shadow-sm" : "text-white/60 hover:text-white"
            }`}
          >
            Harmonic Waveform
          </button>
        </div>
      </div>

      {/* Content Canvas / View Area */}
      <div className="mt-6">
        {activeTab === "particles" && (
          <div className="space-y-4">
            <div className="relative h-60 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/80">
              <canvas ref={canvasRef} className="h-full w-full cursor-crosshair" />
              <div className="pointer-events-none absolute bottom-3 left-4 text-[10px] text-white/40 font-mono">
                Hover or drag cursor across canvas to apply magnetic vector force
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
              <div className="flex items-center gap-3">
                <span>Particle Count: {particleCount}</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={particleCount}
                  onChange={(e) => setParticleCount(Number(e.target.value))}
                  className="accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <span>Theme:</span>
                {(["purple", "cyan", "emerald"] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => setParticleColor(color)}
                    className={`size-4 rounded-full border border-white/20 transition-transform ${
                      color === "purple" ? "bg-purple-500" : color === "cyan" ? "bg-cyan-500" : "bg-emerald-500"
                    } ${particleColor === color ? "scale-125 ring-2 ring-white/50" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai-stream" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter prompt for simulated LLM token stream..."
                className="flex-1 rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-400 focus:outline-none"
              />
              <button
                onClick={runAiSimulation}
                disabled={isStreaming}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-purple-500 disabled:opacity-50"
              >
                <Sparkles className="size-3.5" />
                <span>{isStreaming ? "Streaming..." : "Simulate Stream"}</span>
              </button>
            </div>

            <div className="min-h-40 rounded-2xl border border-white/10 bg-black/80 p-4 font-mono text-xs text-purple-200/90 whitespace-pre-wrap leading-relaxed">
              {streamOutput || (
                <span className="text-white/30">Click &quot;Simulate Stream&quot; to test real-time LLM token generation...</span>
              )}
              {isStreaming && <span className="inline-block size-2 bg-purple-400 animate-ping ml-1" />}
            </div>
          </div>
        )}

        {activeTab === "waveform" && (
          <div className="space-y-4">
            <div className="relative h-60 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/80">
              <canvas ref={waveCanvasRef} className="h-full w-full" />
              <div className="pointer-events-none absolute bottom-3 left-4 text-[10px] text-white/40 font-mono">
                Multi-harmonic Sine Wave Interpolation Engine (60 FPS)
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/60">
              <span>Oscillation Velocity:</span>
              <input
                type="range"
                min="0.01"
                max="0.1"
                step="0.01"
                value={waveSpeed}
                onChange={(e) => setWaveSpeed(Number(e.target.value))}
                className="accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
