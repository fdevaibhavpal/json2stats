'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
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
    <div className="border-b border-border px-6 sm:px-8 lg:px-16 xl:px-24 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            Try it now
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            See it in action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Try the tool with sample data or upload your own JSON. No registration required.
          </p>
        </div>

        {/* Demo Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
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
          </div>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Employee Database
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sample employee data with personal information, roles, and salaries
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-muted border border-border rounded-md p-4 max-h-80 overflow-auto">
                  <pre className="text-sm text-muted-foreground font-mono">
                    <code>{JSON.stringify(sampleData.users, null, 2)}</code>
                  </pre>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(sampleData.users, null, 2))}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </Button>
                  <Button
                    size="sm"
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
                <p className="text-sm text-muted-foreground">
                  Monthly sales data perfect for creating charts and analytics
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-muted border border-border rounded-md p-4 max-h-80 overflow-auto">
                  <pre className="text-sm text-muted-foreground font-mono">
                    <code>{JSON.stringify(sampleData.sales, null, 2)}</code>
                  </pre>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(sampleData.sales, null, 2))}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </Button>
                  <Button
                    size="sm"
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
                <p className="text-sm text-muted-foreground">
                  E-commerce product data with categories, pricing, and inventory
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-muted border border-border rounded-md p-4 max-h-80 overflow-auto">
                  <pre className="text-sm text-muted-foreground font-mono">
                    <code>{JSON.stringify(sampleData.products, null, 2)}</code>
                  </pre>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(sampleData.products, null, 2))}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </Button>
                  <Button
                    size="sm"
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
      </div>
    </div>
  );
}
