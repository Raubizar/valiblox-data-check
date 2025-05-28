
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BarChart3, Upload, FileCheck, AlertTriangle, Download } from "lucide-react";

const DeliverablesTracker = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Deliverables Tracker
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Instantly compare your deliverables list with the files submitted. Spot missing files, duplicates, and naming issues in seconds.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <Upload className="w-5 h-5 mr-2" />
              Start Tracking Deliverables
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Dashboard Preview</h2>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">24</div>
                <div className="text-sm text-green-700">Files Found</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">2</div>
                <div className="text-sm text-red-700">Missing Files</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">1</div>
                <div className="text-sm text-yellow-700">Duplicate</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">92%</div>
                <div className="text-sm text-blue-700">Complete</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Project Drawings Package</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Complete</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">Specifications Document</span>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Missing</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">Quality Control Reports</span>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Duplicate Found</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Monitor deliverable status in real-time with live updates and notifications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <FileCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  Automatically match submitted files with your deliverables list
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Issue Detection</CardTitle>
                <CardDescription>
                  Identify missing files, duplicates, and naming inconsistencies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>
                  Generate detailed reports for stakeholders and project teams
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Upload className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Bulk Upload</CardTitle>
                <CardDescription>
                  Upload and process hundreds of files simultaneously
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <CardTitle>Progress Analytics</CardTitle>
                <CardDescription>
                  Track completion rates and identify bottlenecks in your workflow
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Deliverables?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start tracking your project deliverables with unprecedented accuracy and speed.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Get Started Today
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliverablesTracker;
