import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { WorldsSection } from '@/components/landing/WorldsSection'
import { AvatarSection } from '@/components/landing/AvatarSection'
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
        <AvatarSection />
        <ParentsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
