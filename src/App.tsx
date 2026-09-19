import { useReveal } from "./hooks/useReveal"
import { PortfolioProvider } from "./content/PortfolioContext"
import { Atmosphere } from "./components/Atmosphere"
import { BootSequence } from "./components/BootSequence"
import { Navbar } from "./components/Navbar"
import { Hero } from "./components/Hero"
import { Marquee } from "./components/Marquee"
import { GeospatialTelemetry } from "./components/GeospatialTelemetry"
import { About } from "./components/About"
import { LinkedInShowcase } from "./components/LinkedInShowcase"
import { PresentationDeck } from "./components/PresentationDeck"
import { ResearchSpotlight } from "./components/ResearchSpotlight"
import { AgentWorkflow } from "./components/AgentWorkflow"
import { TrajectoryTimeline } from "./components/Timeline"
import { Projects } from "./components/Projects"
import { ResearchNotes } from "./components/ResearchNotes"
import { ProjectModal } from "./components/ProjectModal"
import { Skills } from "./components/Skills"
import { Certifications } from "./components/Certifications"
import { Resume } from "./components/Resume"
import { LiveFeeds } from "./components/LiveFeeds"
import { Contact } from "./components/Contact"
import { PrivacyAnalytics } from "./components/PrivacyAnalytics"
import { AgentCopilot } from "./components/AgentCopilot"
import { CommandPalette } from "./components/CommandPalette"
import { AdminBar } from "./components/admin/AdminBar"
import { Toast } from "./components/Toast"

function Portfolio() {
  useReveal()
  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <GeospatialTelemetry />
        <About />
        <LinkedInShowcase />
        <PresentationDeck />
        <ResearchSpotlight />
        <AgentWorkflow />
        <TrajectoryTimeline />
        <Projects />
        <ResearchNotes />
        <Skills />
        <Certifications />
        <Resume />
        <LiveFeeds />
        <Contact />
        <PrivacyAnalytics />
      </main>
      <CommandPalette />
      <ProjectModal />
      <AgentCopilot />
      <AdminBar />
      <Toast />
      <BootSequence />
    </div>
  )
}

export default function App() {
  return (
    <PortfolioProvider>
      <Portfolio />
    </PortfolioProvider>
  )
}
