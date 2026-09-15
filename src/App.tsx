import { useReveal } from "./hooks/useReveal"
import { PortfolioProvider } from "./content/PortfolioContext"
import { Atmosphere } from "./components/Atmosphere"
import { BootSequence } from "./components/BootSequence"
import { Navbar } from "./components/Navbar"
import { Hero } from "./components/Hero"
import { Marquee } from "./components/Marquee"
import { About } from "./components/About"
import { Education, Experience } from "./components/Timeline"
import { Projects } from "./components/Projects"
import { Skills } from "./components/Skills"
import { Certifications } from "./components/Certifications"
import { Resume } from "./components/Resume"
import { LiveFeeds } from "./components/LiveFeeds"
import { Contact } from "./components/Contact"
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
        <Education />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Resume />
        <LiveFeeds />
        <Contact />
      </main>
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
