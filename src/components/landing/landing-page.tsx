'use client';

import { useRouter } from 'next/navigation';
import { LandingNav } from './landing-nav';
import { HeroSection } from './hero-section';
import { FeaturesSection } from './features-section';
import { HowItWorksSection } from './how-it-works-section';
import { DemoSection } from './demo-section';
import { CTASection } from './cta-section';
import { Logo } from './logo';
import { useTableStore } from '@/store/table-store';

export function LandingPage() {
  const router = useRouter();
  const { loadJsonData } = useTableStore();

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  const handleTryDemo = () => {
    // Load sample data
    const sampleData = [
      { id: 1, name: "John Doe", email: "john@example.com", age: 28, city: "New York", role: "Developer", salary: 75000, joinDate: "2023-01-15", active: true },
      { id: 2, name: "Jane Smith", email: "jane@example.com", age: 32, city: "San Francisco", role: "Designer", salary: 68000, joinDate: "2022-11-20", active: true },
      { id: 3, name: "Mike Johnson", email: "mike@example.com", age: 45, city: "Chicago", role: "Manager", salary: 95000, joinDate: "2021-03-10", active: false },
      { id: 4, name: "Sarah Wilson", email: "sarah@example.com", age: 29, city: "Seattle", role: "Developer", salary: 82000, joinDate: "2023-06-05", active: true },
      { id: 5, name: "David Brown", email: "david@example.com", age: 38, city: "Austin", role: "Analyst", salary: 72000, joinDate: "2022-09-12", active: true }
    ];

    loadJsonData(JSON.stringify(sampleData, null, 2));
    router.push('/dashboard');
  };

  const handleViewDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection onGetStarted={handleGetStarted} onViewDemo={handleViewDemo} />
      <FeaturesSection />
      <HowItWorksSection />
      <div id="demo-section">
        <DemoSection onTryDemo={handleTryDemo} />
      </div>
      <CTASection onGetStarted={handleGetStarted} onViewExamples={handleViewDemo} />

      {/* Footer */}
      <footer className="px-6 sm:px-8 lg:px-16 xl:px-24 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground font-mono text-center">
            <span>© 2026 Json2Stats</span>
            <span className="hidden sm:inline">·</span>
            <span>Paste JSON. Get a table, charts, filters, and exports. Nothing leaves your browser.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
