'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Code, 
  Table, 
  BarChart3, 
  FileText,
  Copy,
  Check,
  ArrowRight
} from 'lucide-react';

interface DemoSectionProps {
  onTryDemo: () => void;
}

export function DemoSection({ onTryDemo }: DemoSectionProps) {
  const [copied, setCopied] = useState(false);

  const sampleData = {
    users: [
      { id: 1, name: "John Doe", email: "john@example.com", age: 28, city: "New York", role: "Developer", salary: 75000, joinDate: "2023-01-15", active: true },
      { id: 2, name: "Jane Smith", email: "jane@example.com", age: 32, city: "San Francisco", role: "Designer", salary: 68000, joinDate: "2022-11-20", active: true },
      { id: 3, name: "Mike Johnson", email: "mike@example.com", age: 45, city: "Chicago", role: "Manager", salary: 95000, joinDate: "2021-03-10", active: false },
      { id: 4, name: "Sarah Wilson", email: "sarah@example.com", age: 29, city: "Seattle", role: "Developer", salary: 82000, joinDate: "2023-06-05", active: true },
      { id: 5, name: "David Brown", email: "david@example.com", age: 38, city: "Austin", role: "Analyst", salary: 72000, joinDate: "2022-09-12", active: true }
    ],
    sales: [
      { month: "January", revenue: 45000, customers: 120, region: "North", product: "Software" },
      { month: "February", revenue: 52000, customers: 135, region: "North", product: "Software" },
      { month: "March", revenue: 48000, customers: 110, region: "South", product: "Hardware" },
      { month: "April", revenue: 61000, customers: 150, region: "East", product: "Software" },
      { month: "May", revenue: 55000, customers: 140, region: "West", product: "Services" }
    ],
    products: [
      { id: "P001", name: "Laptop Pro", category: "Electronics", price: 1299, stock: 45, rating: 4.8, featured: true },
      { id: "P002", name: "Wireless Mouse", category: "Accessories", price: 29, stock: 120, rating: 4.5, featured: false },
      { id: "P003", name: "Mechanical Keyboard", category: "Accessories", price: 149, stock: 30, rating: 4.9, featured: true },
      { id: "P004", name: "Monitor 4K", category: "Electronics", price: 399, stock: 15, rating: 4.7, featured: false }
    ]
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            Try It Now
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Try our tool with sample data or upload your own JSON. No registration required!
          </p>
        </div>

        {/* Demo Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              User Data
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Sales Data
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Employee Database
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Sample employee data with personal information, roles, and salaries
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-300">
                    <code>{JSON.stringify(sampleData.users, null, 2)}</code>
                  </pre>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    onClick={() => copyToClipboard(JSON.stringify(sampleData.users, null, 2))}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onTryDemo}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Try This Data
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Analytics
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Monthly sales data perfect for creating charts and analytics
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-300">
                    <code>{JSON.stringify(sampleData.sales, null, 2)}</code>
                  </pre>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    onClick={() => copyToClipboard(JSON.stringify(sampleData.sales, null, 2))}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onTryDemo}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Try This Data
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Product Catalog
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  E-commerce product data with categories, pricing, and inventory
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-300">
                    <code>{JSON.stringify(sampleData.products, null, 2)}</code>
                  </pre>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    onClick={() => copyToClipboard(JSON.stringify(sampleData.products, null, 2))}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onTryDemo}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Try This Data
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Ready to Transform Your Data?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Upload your JSON file or paste your data to get started instantly. 
                No registration, no limits, no hassle.
              </p>
              <Button 
                size="lg" 
                onClick={onTryDemo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Analyzing Your Data
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
