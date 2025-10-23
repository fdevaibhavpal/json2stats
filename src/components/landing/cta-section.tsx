'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Upload, 
  FileText,
  BarChart3,
  Download,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Users,
  Clock
} from 'lucide-react';

interface CTASectionProps {
  onGetStarted: () => void;
  onViewExamples?: () => void;
}

export function CTASection({ onGetStarted, onViewExamples }: CTASectionProps) {
  const benefits = [
    {
      icon: Clock,
      title: "Instant Results",
      description: "Get your data analyzed in seconds, not hours"
    },
    {
      icon: Shield,
      title: "100% Private",
      description: "Your data never leaves your device"
    },
    {
      icon: Zap,
      title: "No Setup",
      description: "Works immediately, no installation required"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          {/* Header */}
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            <Star className="h-4 w-4 mr-2" />
            Ready to Get Started?
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">JsonDash</span>
            <span className="block text-blue-200">
              Transform Your JSON Data Into Beautiful Dashboards
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join thousands of developers, analysts, and business users who trust our tool 
            to make sense of their JSON data. Start analyzing in seconds.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-blue-100">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              <Upload className="h-5 w-5 mr-2" />
              Start Analyzing Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={onViewExamples}
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
            >
              <FileText className="h-5 w-5 mr-2" />
              View Examples
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-200">Files Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-200">Client-Side</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">0</div>
              <div className="text-blue-200">Registration Required</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
