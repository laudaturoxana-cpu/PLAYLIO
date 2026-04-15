import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { WorldsSection } from '@/components/landing/WorldsSection'
import { LioSection } from '@/components/landing/LioSection'
import { ParentsSection } from '@/components/landing/ParentsSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WorldsSection />
        <LioSection />
        <ParentsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
