'use client';

import { useRouter } from 'next/navigation';
import { HeroSection } from './hero-section';
import { FeaturesSection } from './features-section';
import { DemoSection } from './demo-section';
import { CTASection } from './cta-section';
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
    // Scroll to demo section
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewExamples = () => {
    // Scroll to demo section
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <HeroSection onGetStarted={handleGetStarted} onViewDemo={handleViewDemo} />
      <FeaturesSection />
      <div id="demo-section">
        <DemoSection onTryDemo={handleTryDemo} />
      </div>
      <CTASection onGetStarted={handleGetStarted} onViewExamples={handleViewExamples} />
      
      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">JsonDash</h3>
          <p className="text-slate-400 mb-6">
            Transform your JSON data into beautiful, actionable insights.
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-slate-500">
              <span>© 2024 JsonDash. All rights reserved.</span>
              <span>•</span>
              <span>Built with Next.js, React, and TypeScript</span>
              <span>•</span>
              <span>100% Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
