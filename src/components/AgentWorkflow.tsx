import { useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { playSound } from "./SoundFX"
import { Section } from "./Section"
import {
  Cpu,
  Sprout,
  Compass,
  Shield,
  Satellite,
  Layers,
  ArrowUpRight,
  Check,
  Activity,
} from "./icons"

interface AgentNode {
  id: string
  name: string
  role: string
  altitude: string
  icon: any
  objective: string
  tools: string[]
  inputs: string[]
  outputs: string[]
  deliverable: string
}

const AGENT_NODES: AgentNode[] = [
  {
    id: "agent-agri",
    name: "Agronomy Agent",
    role: "Living Soil & Crop Health Specialist",
    altitude: "0m Ground",
    icon: Sprout,
    objective: "Diagnose soil chemistry, nutrient balancing, and cyanogenic glycoside biochemistry in sorghum.",
    tools: ["Soil Assay Kits", "Digital EC/pH Sensors", "Chromatography", "NFT Polyhouse Automation"],
    inputs: ["Field soil samples", "Transpiration rates", "Crop phenology stage"],
    outputs: ["HCN safety threshold (<200 ppm)", "Nutrient replenishment prescription"],
    deliverable: "Peer-reviewed published research in Agri Express (Vol. 02, E-ISSN: 2584-2498).",
  },
  {
    id: "agent-uav",
    name: "UAV Drone Agent",
    role: "Aerial Photogrammetry & Sensor Navigator",
    altitude: "80m–120m Aerial",
    icon: Compass,
    objective: "Execute autonomous grid survey flights and radiometric calibration over crop canopies.",
    tools: ["DJI P4 Multispectral (G, R, RE, NIR)", "Sunlight Sensor", "Pix4Dmapper", "Mission Planner"],
    inputs: ["Flight perimeter waypoints", "Solar irradiance targets", "Downwelling sensor metrics"],
    outputs: ["Radiometrically calibrated orthomosaics", "Sub-centimeter GSD vegetation layers"],
    deliverable: "Early nitrogen deficit detection 12 days prior to visual crop chlorosis.",
  },
  {
    id: "agent-gis",
    name: "GIS & Terrain Agent",
    role: "Hydrological & Geomorphic Modeler",
    altitude: "3,500m Terrain",
    icon: Shield,
    objective: "Delineate micro-watershed boundaries, flow accumulation networks, and slope classifications.",
    tools: ["ArcGIS Spatial Analyst", "ArcMap", "QGIS", "SRTM 30m DEM", "MATLAB"],
    inputs: ["Digital Elevation Models (DEM)", "Hydro-enforced drainage lines", "Rainfall rasters"],
    outputs: ["Catchment pour-point delineation", "Strahler stream orders (1–5)", "Slope & aspect grids"],
    deliverable: "National institute research modeling 450+ sq km watershed terrain at CSIR-NGRI.",
  },
  {
    id: "agent-sat",
    name: "Satellite Telemetry Agent",
    role: "Orbital Earth Observation Ingestion",
    altitude: "705km Orbit",
    icon: Satellite,
    objective: "Ingest and process multispectral and SAR passes for regional vegetation and aquifer mapping.",
    tools: ["Sentinel-2 Multispectral", "Landsat-8/9 OLI", "Sentinel-1 C-Band SAR", "Google Earth Engine"],
    inputs: ["Level-2A Bottom-Of-Atmosphere reflectance", "Radar backscatter cross-sections"],
    outputs: ["Time-series NDVI/SAVI trends", "Structural fracture & lineament density maps"],
    deliverable: "CSIR-NGRI subsurface aquifer fracture mapping correlated with ERT geophysics.",
  },
  {
    id: "agent-orch",
    name: "Synthesis Orchestrator",
    role: "Multi-Agent Precision Intelligence Hub",
    altitude: "Full Continuum",
    icon: Cpu,
    objective: "Cross-correlate ground soil assays, drone NDVI, and orbital passes into automated farmer decisions.",
    tools: ["Multi-Domain Spatial Fusion", "Prescription Geopackages", "CSIR Geostatistics"],
    inputs: ["All agent feeds (Soil + UAV + DEM + Orbit)"],
    outputs: ["Variable-rate fertilizer spray maps", "Groundwater recharge zoning", "Irrigation schedules"],
    deliverable: "22% reduction in fertilizer waste & 90% water conservation in hydroponic polyhouses.",
  },
]

export function AgentWorkflow() {
  const { soundEnabled } = usePortfolio()
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-agri")

  const selected = AGENT_NODES.find((a) => a.id === selectedAgentId) || AGENT_NODES[0]
  const ActiveIcon = selected.icon

  const handleSelect = (id: string) => {
    setSelectedAgentId(id)
    playSound("click", soundEnabled)
  }

  return (
    <Section
      id="workflow"
      index="04"
      eyebrow="Multi-Agent Pipeline Architecture"
      title="Autonomous Precision Agriculture Pipeline"
      className="zone-ground"
    >
      <div className="mb-6 rounded-2xl border border-hair bg-primary/[0.03] p-4 text-xs sm:text-sm text-mist leading-relaxed">
        Inspired by multi-agent architectures (<strong>CrewAI</strong>, <strong>MetaGPT</strong>, <strong>Langflow</strong>, and <strong>n8n</strong>), this pipeline demonstrates how autonomous specialized agents collaborate to transform living soil data into space-borne precision farming intelligence.
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left: Interactive Workflow Node Graph (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-faint mb-1">
            Pipeline Agents (Click to Inspect)
          </p>

          {AGENT_NODES.map((node, index) => {
            const isSelected = node.id === selectedAgentId
            const Icon = node.icon
            return (
              <div
                key={node.id}
                onClick={() => handleSelect(node.id)}
                className={`group relative flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-primary/50 bg-primary/[0.1] shadow-md -translate-x-1"
                    : "border-hair bg-card-bg hover:border-primary/30 hover:bg-primary/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                      isSelected
                        ? "bg-primary text-white shadow-xs"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                  >
                    <Icon width={16} height={16} />
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-faint font-bold uppercase">
                        Node {index + 1}
                      </span>
                      <span className="font-mono text-[10px] text-primary-light font-bold">
                        {node.altitude}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-ink group-hover:text-primary transition-colors">
                      {node.name}
                    </h4>
                  </div>
                </div>

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isSelected ? "bg-emerald-500 animate-ping" : "bg-primary/20"
                  }`}
                />
              </div>
            )
          })}
        </div>

        {/* Right: Selected Agent Node Deep-Dive Inspector (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-primary/25 bg-card-bg p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hair pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/25">
                <ActiveIcon width={22} height={22} />
              </span>
              <div>
                <span className="rounded-full bg-primary/[0.08] px-2.5 py-0.5 font-mono text-[10px] font-bold text-primary uppercase">
                  {selected.altitude}
                </span>
                <h3 className="mt-0.5 font-display text-2xl font-bold text-primary">
                  {selected.name}
                </h3>
                <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {selected.role}
                </p>
              </div>
            </div>
          </div>

          {/* Objective */}
          <div className="mt-5">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-faint mb-1.5">
              Agent Objective &amp; Autonomous Function
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-mist">
              {selected.objective}
            </p>
          </div>

          {/* Inputs & Outputs Bento */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {/* Inputs */}
            <div className="rounded-2xl border border-hair bg-primary/[0.02] p-4">
              <h5 className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Input Data Streams
              </h5>
              <ul className="space-y-1.5">
                {selected.inputs.map((inp, i) => (
                  <li key={i} className="font-mono text-[11px] text-mist flex items-start gap-1.5">
                    <span className="text-primary-light">›</span>
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outputs */}
            <div className="rounded-2xl border border-hair bg-primary/[0.02] p-4">
              <h5 className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Output Analytical Products
              </h5>
              <ul className="space-y-1.5">
                {selected.outputs.map((out, i) => (
                  <li key={i} className="font-mono text-[11px] text-mist flex items-start gap-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tools & Algorithms */}
          <div className="mt-5">
            <h5 className="font-mono text-[10px] font-bold uppercase tracking-wider text-faint mb-2">
              Integrated Tools &amp; Model Libraries
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {selected.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg border border-primary/20 bg-card-bg px-2.5 py-1 font-mono text-[11px] font-semibold text-primary shadow-2xs"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Concrete Field Deliverable */}
          <div className="mt-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
            <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
              Verified Practical Deliverable
            </span>
            <p className="text-xs sm:text-sm font-medium text-ink">
              {selected.deliverable}
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
