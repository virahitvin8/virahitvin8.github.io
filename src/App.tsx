import { useReveal } from "./hooks/useReveal"
import { PortfolioProvider } from "./content/PortfolioContext"
import { Atmosphere } from "./components/Atmosphere"
import { BootSequence } from "./components/BootSequence"
import { Navbar } from "./components/Navbar"
import { Hero } from "./components/Hero"
import { Marquee } from "./components/Marquee"
import { About } from "./components/About"
import { LinkedInShowcase } from "./components/LinkedInShowcase"
import { PresentationDeck } from "./components/PresentationDeck"
import { ResearchSpotlight } from "./components/ResearchSpotlight"
import { TrajectoryTimeline } from "./components/Timeline"
import { Projects } from "./components/Projects"
import { ProjectModal } from "./components/ProjectModal"
import { Skills } from "./components/Skills"
import { Certifications } from "./components/Certifications"
import { Resume } from "./components/Resume"
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
        <About />
        <LinkedInShowcase />
        <PresentationDeck />
        <ResearchSpotlight />
        <TrajectoryTimeline />
        <Projects />
        <Skills />
        <Certifications />
        <Resume />
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
