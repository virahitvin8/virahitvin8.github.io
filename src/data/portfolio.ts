// ═══════════════════════════════════════════════════════════════
// DEFAULT PORTFOLIO CONTENT — N. Akshit Vinay
// This is the seed data. Admin edits are stored as overrides in
// localStorage and merged on top of this at runtime.
// ═══════════════════════════════════════════════════════════════

// Real CV, served as a static asset so "Download CV" works anywhere.
import cvUrl from "../assets/cv.pdf?url"

export interface Certification {
  id: string
  title: string
  issuer: string
  date: string
  blurb: string
  /** Optional uploaded certificate image (data URL or path). Falls back to a rendered cert. */
  image?: string
  /**
   * Filename stem used to find a scan dropped into `public/certs/`.
   *
   * Explicit rather than derived from the title, because the scan is a file on
   * disk: renaming the certificate for a better wording must not silently
   * orphan it. The values below are the same slugs the classic build at
   * `/classic/` derives, so one file serves both builds.
   */
  slug?: string
  /**
   * The credential is held, but its certificate has not been issued to the
   * holder (or is not published). The card stays on the page — the training and
   * the skill are real — but it must not offer to show a document that does not
   * exist. These cards ask the visitor to request it instead, and never open the
   * secure viewer.
   */
  onRequest?: boolean
}

export interface TimelineItem {
  id: string
  title: string
  org: string
  period: string
  detail: string
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  link?: string
}

export interface SkillGroup {
  id: string
  label: string
  items: string[]
}

export interface FeedPost {
  id: string
  text: string
  date: string
  link: string
}

export interface PortfolioData {
  profile: {
    name: string
    shortName: string
    photo: string
    /** Small header avatar — a separate image from the hero portrait. */
    avatar: string
    roles: string[]
    tagline: string
    availability: string
    location: string
    email: string
    /** Resume/CV source — a served asset URL by default, or an admin-uploaded data URL. */
    cvUrl: string
    /** Display name + last-updated label for the résumé section. */
    resumeName: string
    resumeUpdated: string
  }
  social: {
    github: string // username
    githubUrl: string
    linkedinUrl: string
    scholarUrl: string
  }
  stats: { value: string; label: string }[];
  about: {
    lead: string;
    body: string;
    focus: string[];
  };
  education: TimelineItem[];
  experience: TimelineItem[];
  skills: SkillGroup[];
  certifications: Certification[];
  projects: Project[];
  linkedinPosts: FeedPost[];
  contact: { headline: string; sub: string };
}

export const DEFAULT_DATA: PortfolioData = {
  profile: {
    name: "N. Akshit Vinay",
    shortName: "Akshit Vinay",
    /* The owner's own portrait, served from /public. This was previously an
       Unsplash stock photo — i.e. a stranger's face on a personal portfolio —
       until it was replaced with the real 512x512 square headshot. */
    photo: "/resume-photo.png",
    /* The header avatar: passport portrait from the user's resume */
    avatar: "/avatar.png",
    roles: [
      "B.Sc (Hons) Agriculture Graduate",
      "M.Sc Remote Sensing & GIS Scholar",
      "CSIR-NGRI Geospatial Analyst",
      "Precision Agriculture & UAV Specialist",
      "Earth Surface & Watershed Modeler",
    ],
    tagline:
      "Graduate of B.Sc (Hons) Agriculture with ICAR accreditation, advancing in M.Sc Remote Sensing & GIS (CSIR-NGRI trained) — bridging foundational crop agronomy and soil science with satellite Earth observation, UAV precision analytics, and GIS spatial modeling.",
    availability: "Seeking Geospatial, Remote Sensing & Precision Agri Roles",
    location: "Nellore, Andhra Pradesh, India",
    email: "akshitvinay4636@gmail.com",
    cvUrl,
    resumeName: "Akshit_Vinay_CV.pdf",
    resumeUpdated: "Sep 2026",
  },
  social: {
    github: "virahitvin8",
    githubUrl: "https://github.com/virahitvin8",
    linkedinUrl: "https://www.linkedin.com/in/neelam-akshit-vinay-b18554322",
    scholarUrl: "#",
  },
  stats: [
    { value: "10.0", label: "M.Sc CGPA" },
    { value: "8.78", label: "B.Sc (Hons) GPA" },
    { value: "7+", label: "Field Roles" },
    { value: "5", label: "Languages" },
  ],
  about: {
    lead: "From agrarian crop reality to space-borne orbital intelligence.",
    body: "My academic path is built on a rigorous foundation in B.Sc (Hons) Agriculture (ICAR accredited, 8.78 GPA) from ITM University, encompassing in-depth agronomy, soil chemistry, crop genetics, and practical Rural Agricultural Work Experience (RAWE). To scale precision farm management to regional landscapes, I transitioned into M.Sc Remote Sensing & GIS at SHUATS (10.0 CGPA) backed by intensive research training at CSIR-National Geophysical Research Institute (NGRI), Hyderabad. Today, I connect living soils with orbital telemetry — translating Sentinel/Landsat multispectral passes, UAV drone reflectance, and DEM terrain modeling into on-the-ground precision agriculture and sustainable spatial decisions.",
    focus: [
      "B.Sc (Hons) Agriculture Foundation",
      "M.Sc Remote Sensing & GIS (10.0 CGPA)",
      "CSIR-NGRI Earth Surface Analysis",
      "Precision Agriculture & UAV Drone Mapping",
      "GIS Watershed & Terrain Modeling (ArcGIS / QGIS)",
      "Hydroponics & Crop Health Analytics",
    ],
  },
  education: [
    {
      id: "edu-1",
      title: "M.Sc — Remote Sensing & GIS",
      org: "SHUATS, Prayagraj",
      period: "2025 — 2027",
      detail:
        "Specializing in satellite Earth observation, photogrammetry, and spatial process modeling. Currently maintaining a perfect 10.0 CGPA (Semester III).",
    },
    {
      id: "edu-2",
      title: "B.Sc (Hons.) — Agriculture",
      org: "ITM University, Gwalior (ICAR Accredited)",
      period: "2021 — 2025",
      detail:
        "Rigorous 4-year degree in agronomy, plant pathology, soil science, and agricultural extension. Graduated with 8.78 GPA; authored published research on Sorghum HCN biochemistry.",
    },
    {
      id: "edu-3",
      title: "Class XII — BiPC",
      org: "Sri Chaitanya Jr College, Kakinada",
      period: "Jan 2021",
      detail:
        "Biology, Physics and Chemistry stream — the springboard into agricultural science.",
    },
  ],
  experience: [
    {
      id: "exp-1",
      title: "Remote Sensing & GIS Trainee",
      org: "CSIR – NGRI, Hyderabad",
      period: "6 – 10 Jul 2026",
      detail:
        "ArcMap (ArcGIS): DEM, contour mapping, slope & aspect analysis, and precise watershed delineation of terrain controls on drainage patterns. MATLAB data handling.",
    },
    {
      id: "exp-2",
      title: "Marketing Intern",
      org: "Sid's Farm Pvt Ltd, Bangalore",
      period: "Nov 2024 — Mar 2025",
      detail:
        "Designed and supported dairy product marketing strategies; ran customer outreach and grew digital engagement.",
    },
    {
      id: "exp-3",
      title: "Agro-Industrial Intern",
      org: "NSL Sugars Pvt Ltd, Bellary",
      period: "Aug 2024 — Nov 2024",
      detail:
        "Maintained nursery and sugarcane bud propagation under the Zonal Manager; conducted pest/disease inspections and promoted sustainable practices.",
    },
    {
      id: "exp-4",
      title: "Drone Technology Intern",
      org: "AgriTech Innovations, Gwalior",
      period: "Apr 2023",
      detail:
        "Operated UAVs to capture crop-health data and analyse field conditions for precision agronomy.",
    },
    {
      id: "exp-5",
      title: "Organic Farming & Hydroponics",
      org: "ANGRAU · ITM University",
      period: "2023 — 2024",
      detail:
        "Applied sustainable crop-management techniques, soil & crop diagnostics for certification readiness, and maintained hydroponic systems with tuned nutrient levels.",
    },
  ],
  skills: [
    {
      id: "sk-1",
      label: "Geospatial & RS",
      items: [
        "Remote Sensing Analytics",
        "GIS Mapping",
        "Earth Surface Process Analysis",
        "Multi-Domain Spatial Modelling",
        "GPS Survey Tools",
      ],
    },
    {
      id: "sk-2",
      label: "Software Tools",
      items: ["ArcGIS", "ArcMap", "QGIS", "MATLAB", "Microsoft Office"],
    },
    {
      id: "sk-3",
      label: "Agriculture",
      items: [
        "Precision Farming",
        "Hydroponics",
        "Organic Certification",
        "Drone Monitoring",
        "Crop Health Analysis",
      ],
    },
    {
      id: "sk-4",
      label: "Languages",
      items: ["Telugu (Native)", "English", "Hindi", "Tamil", "Kannada"],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      title:
        "Next Generation Remote Sensing Data Analytics & Multi-Domain Applications",
      issuer: "Development Programme",
      date: "3 – 14 Aug 2026",
      blurb:
        "Satellite big data to multi-domain geospatial applications and analytics.",
      slug: "next-gen-remote-sensing-analytics",
    },
    {
      id: "cert-2",
      title: "Applications of Remote Sensing & GIS in Earth Surface Processes",
      issuer: "CSIR – NGRI, Hyderabad",
      date: "6 – 10 Jul 2026",
      blurb:
        "National-institute training on geospatial analysis of Earth surface dynamics.",
      slug: "csir-ngri-remote-sensing-gis",
    },
    {
      id: "cert-3",
      title: "Sid's Farm Internship",
      issuer: "Sid's Farm Pvt Ltd, Bangalore",
      // Same period as the internship entry in `experience` above, so the card
      // and the timeline cannot disagree about when it ran.
      date: "Nov 2024 — Mar 2025",
      blurb:
        "Dairy product marketing strategy, customer outreach and digital engagement.",
      slug: "sids-farm-internship",
    },
    {
      id: "cert-4",
      title: "Hydroponics Systems",
      issuer: "ITM University, Gwalior",
      date: "Oct 2023",
      blurb:
        "Soil-less cultivation and nutrient management for optimal crop growth.",
      slug: "itm-hydroponics-systems",
    },
    {
      id: "cert-5",
      title: "Organic Farming",
      issuer: "ANGRAU, Andhra Pradesh",
      date: "Feb 2024",
      blurb:
        "Sustainable crop management and certification-readiness diagnostics.",
      slug: "angrau-organic-farming",
    },
    {
      id: "cert-6",
      title: "Drone Technology in Agriculture",
      issuer: "AgriTech Innovations",
      date: "Apr 2023",
      blurb:
        "UAV operation for crop-health data capture and field condition analysis.",
      slug: "drone-technology-in-agriculture",
      onRequest: true,
    },
    {
      id: "cert-7",
      title: "Mushroom Cultivation",
      issuer: "ITM University, Gwalior",
      date: "Nov 2021",
      blurb:
        "Oyster mushroom cultivation with controlled humidity and temperature.",
      slug: "mushroom-cultivation",
      onRequest: true,
    },
    {
      id: "cert-8",
      title: "Agro-Industrial Attachment",
      issuer: "NSL Sugars Pvt Ltd, Bellary",
      date: "Aug 2024 — Nov 2024",
      blurb:
        "Sugarcane nursery maintenance, bud propagation, pest/disease inspections and sustainable crop practices.",
      slug: "nsl-sugars-agro-industrial",
      onRequest: true,
    },
  ],
  projects: [
    {
      id: "prj-1",
      title: "GIS Watershed & Terrain Delineation",
      category: "GIS & Hydrology",
      description:
        "Comprehensive DEM flow accumulation, stream order hierarchy, slope/aspect classification, and catchment boundary delineation using ArcGIS, QGIS, and SRTM data to evaluate geological and hydrological terrain controls.",
      tags: ["ArcGIS", "QGIS", "DEM", "Watershed Delineation", "CSIR-NGRI"],
    },
    {
      id: "prj-2",
      title: "Unlocking Potential of HCN Content in Sorghum",
      category: "Published Research",
      description:
        'Peer-reviewed published research in Agri Express (Vol. 02, Art. V02I01.13, E-ISSN: 2584-2498) authored by Neelam Akshit Vinay, Amrita Sinha, and Lokesh Singh. Investigating hydrogen cyanide biochemistry in sorghum for sustainable crop protection and livestock forage safety.',
      tags: ["Peer-Reviewed", "Agri Express", "Sorghum", "Crop Protection", "ITM"],
      link: "https://www.agriexpress.in/article/40/",
    },
    {
      id: "prj-3",
      title: "UAV Multispectral Crop-Health Survey",
      category: "Drone Precision Survey",
      description:
        "High-resolution aerial drone survey and multispectral orthomosaic analytics calculating NDVI, NDRE, and SAVI vegetation indices for rapid crop stress detection, moisture profiling, and precision spray zoning.",
      tags: ["UAV Drone", "NDVI Mapping", "Precision Agriculture", "Crop Health"],
    },
    {
      id: "prj-4",
      title: "Cassava as a Bio-Ethanol Fuel Resource",
      category: "Bio-Economy Innovation",
      description:
        "SheFuture Entrepreneurship Competition entry presenting an agricultural bio-refinery model utilizing high-starch Cassava (Manihot esculenta) as a clean bio-ethanol feedstock to support renewable energy blending and farmer prosperity.",
      tags: ["SheFuture", "Bioethanol", "Renewable Fuel", "Cassava"],
    },
    {
      id: "prj-5",
      title: "Automated Hydroponic NFT Polyhouse",
      category: "Smart Soilless Agriculture",
      description:
        "Engineered and monitored Nutrient Film Technique (NFT) polyhouse closed-loop systems at ITM University, automating EC/pH balanced nutrient delivery, achieving 90% water conservation and accelerated leafy vegetable harvest cycles.",
      tags: ["Hydroponics", "NFT System", "Smart Farming", "Water Conservation"],
    },
    {
      id: "prj-6",
      title: "CSIR-NGRI Subsurface & Lineament Mapping",
      category: "Geospatial & Hydrogeology",
      description:
        "Integrated satellite optical/radar lineament analysis with Electrical Resistivity Tomography (ERT) at CSIR-NGRI Hyderabad to delineate fractured subsurface aquifers and map sustainable groundwater recharge zones.",
      tags: ["CSIR-NGRI", "Earth Surface", "Geophysics", "Aquifer Mapping"],
    },
  ],
  linkedinPosts: [
    {
      id: "li-1",
      text: "Enrolled in the Next-Gen Remote Sensing Data Analytics & Multi-Domain Applications programme — from satellite big data to real applications. 🛰️",
      date: "AUG 2026",
      link: "https://www.linkedin.com/in/neelam-akshit-vinay-b18554322",
    },
    {
      id: "li-2",
      text: "Trained at CSIR-NGRI Hyderabad on Applications of Remote Sensing & GIS in Earth Surface Processes — DEM, watershed delineation and terrain analysis in ArcGIS.",
      date: "JUL 2026",
      link: "https://www.linkedin.com/in/neelam-akshit-vinay-b18554322",
    },
    {
      id: "li-3",
      text: 'My article "Unlocking the HCN Content in Sorghum" is published in Agri Express — food safety meets crop science. 🌾',
      date: "APR 2024",
      link: "https://www.linkedin.com/in/neelam-akshit-vinay-b18554322",
    },
  ],
  contact: {
    headline: "Let's map the future of agriculture together.",
    sub: "Open to research collaborations, geospatial roles, and precision-agriculture projects. Reach out through any channel below.",
  },
}

/** Default admin PIN — the owner can change it in the admin panel. */
export const DEFAULT_PIN = "2080"
