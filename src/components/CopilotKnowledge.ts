// Knowledge Base & Semantic Query Engine for Akshit AI Copilot
// Inspired by LangChain, Dify, and Mem0 patterns.

export interface CopilotMessage {
  id: string
  role: "user" | "assistant"
  text: string
  timestamp: string
  action?: {
    label: string
    type: "cv" | "email" | "projects" | "telemetry" | "contact" | "theme"
  }
}

export const COPILOT_SUGGESTIONS = [
  "Summarize research & publications",
  "Top GIS and UAV skills?",
  "Role at CSIR-NGRI Hyderabad?",
  "Explain 10.0 CGPA at SHUATS",
  "How can I contact or hire him?",
]

export function generateCopilotResponse(query: string): {
  text: string
  action?: CopilotMessage["action"]
} {
  const q = query.toLowerCase().trim()

  // 1. Published Research / Sorghum / HCN / Paper
  if (q.includes("research") || q.includes("sorghum") || q.includes("hcn") || q.includes("paper") || q.includes("publish")) {
    return {
      text: `Akshit is the lead author of peer-reviewed published research in **Agri Express** (Vol. 02, Art. V02I01.13, E-ISSN: 2584-2498) titled *"Unlocking Potential of HCN Content in Sorghum"*, co-authored with Amrita Sinha and Lokesh Singh.\n\nKey Highlights:\n• Investigated Dhurrin cyanogenic glycoside biochemistry under moisture stress.\n• Established safe grazing guidelines (<200 ppm safe threshold for ruminant livestock).\n• Formulated physiological crop protection models against pests.`,
      action: { label: "View Research Spotlight", type: "projects" },
    }
  }

  // 2. Academic Background / CGPA / Degrees / Education
  if (q.includes("cgpa") || q.includes("gpa") || q.includes("degree") || q.includes("education") || q.includes("shuats") || q.includes("itm") || q.includes("academic")) {
    return {
      text: `Akshit possesses a distinguished academic track record bridging crop agronomy with space-borne Earth observation:\n\n1. **M.Sc in Remote Sensing & GIS** — SHUATS, Prayagraj (2025–2027)\n• Currently maintaining a **perfect 10.0 CGPA** (Semester III).\n• Specialized in satellite Earth observation, photogrammetry, and spatial process modeling.\n\n2. **B.Sc (Hons) in Agriculture** — ITM University, Gwalior (2021–2025)\n• Graduated with **8.78 GPA** (ICAR Accredited degree).\n• Comprehensive foundation in agronomy, soil chemistry, plant pathology, and RAWE field practice.`,
      action: { label: "Download Official CV", type: "cv" },
    }
  }

  // 3. CSIR-NGRI / Watershed / GIS / DEM / Hydrology
  if (q.includes("csir") || q.includes("ngri") || q.includes("watershed") || q.includes("dem") || q.includes("gis") || q.includes("terrain")) {
    return {
      text: `At the prestigious **CSIR – National Geophysical Research Institute (NGRI), Hyderabad**, Akshit completed intensive national research training on *"Applications of Remote Sensing & GIS in Earth Surface Processes"*:\n\n• Performed 30m SRTM DEM pit-filling, D8 flow accumulation routing, and Strahler stream order extraction.\n• Modeled watershed boundaries across 450+ sq km to analyze hydrological controls on drainage.\n• Integrated optical and radar lineament analysis with Electrical Resistivity Tomography (ERT) for subsurface fractured aquifer recharge zoning.`,
      action: { label: "Explore Telemetry Lab", type: "telemetry" },
    }
  }

  // 4. Drone / UAV / Multispectral / NDVI
  if (q.includes("drone") || q.includes("uav") || q.includes("ndvi") || q.includes("spectral") || q.includes("precision")) {
    return {
      text: `In Precision Agriculture & UAV Technology:\n\n• Trained as a **Drone Technology Intern** at AgriTech Innovations (Apr 2023).\n• Operated autonomous UAV multi-rotor systems at 80m AGL capturing calibrated multispectral data (G, R, RedEdge, NIR).\n• Computed vegetation indices (**NDVI, NDRE, SAVI**) in Pix4D and QGIS for early crop nitrogen deficiency detection 12 days prior to visual symptoms.`,
      action: { label: "Open Multispectral Simulator", type: "telemetry" },
    }
  }

  // 5. Skills & Software Tools
  if (q.includes("skill") || q.includes("tool") || q.includes("software") || q.includes("arcgis") || q.includes("qgis") || q.includes("matlab")) {
    return {
      text: `Akshit's technical & field toolkit spans four main domains:\n\n• **Geospatial & RS**: Remote Sensing Analytics, GIS Mapping, Multi-Domain Spatial Modeling, GPS Survey Tools, ERDAS.\n• **Software**: ArcGIS, ArcMap, QGIS, MATLAB, Microsoft Office, Pix4D.\n• **Agriculture**: Precision Farming, Hydroponics NFT, Organic Certification (ANGRAU), Drone Monitoring, Crop Diagnostics.\n• **Languages**: Telugu (Native), English, Hindi, Tamil, Kannada.`,
      action: { label: "View Skills Matrix", type: "projects" },
    }
  }

  // 6. Resume / CV
  if (q.includes("cv") || q.includes("resume") || q.includes("download") || q.includes("pdf")) {
    return {
      text: `You can access and download Akshit's official verified Curriculum Vitae (PDF) documenting his degrees, CSIR-NGRI training, published Sorghum research, and field certifications.`,
      action: { label: "Download Official CV (PDF)", type: "cv" },
    }
  }

  // 7. Contact / Email / Hire / Reach
  if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("reach") || q.includes("phone") || q.includes("location") || q.includes("job")) {
    return {
      text: `Akshit is open to research collaborations, geospatial roles, precision agriculture projects, and Earth observation opportunities.\n\n• **Email**: akshitvinay4636@gmail.com\n• **Location**: Nellore, Andhra Pradesh, India\n• **Availability**: Seeking Geospatial, Remote Sensing & Precision Agri Roles\n• **LinkedIn**: linkedin.com/in/neelam-akshit-vinay-b18554322\n• **GitHub**: github.com/virahitvin8`,
      action: { label: "Copy Email Address", type: "email" },
    }
  }

  // 8. Default overview
  return {
    text: `Hello! I am **Akshit's AI Copilot**, an autonomous agent trained on Akshit's academic, research, and geospatial portfolio.\n\nAkshit holds a **B.Sc (Hons) in Agriculture** (ICAR accredited, 8.78 GPA) and is pursuing **M.Sc in Remote Sensing & GIS** at SHUATS (maintaining a perfect **10.0 CGPA**), backed by national institute training at **CSIR-NGRI Hyderabad** and published peer-reviewed research in *Agri Express*.\n\nFeel free to ask me about his research papers, watershed delineation work, UAV multispectral flights, or how to contact him!`,
    action: { label: "Explore Projects", type: "projects" },
  }
}
