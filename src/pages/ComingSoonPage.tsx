
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Lightbulb, Plus, Shield, Zap, Wrench, Mail, Bell } from "lucide-react";

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Coming Soon
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're building the next generation of smart tools to automate digital delivery.
              Be the first to know when they launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                <Bell className="w-5 h-5 mr-2" />
                Get Notified
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                <Lightbulb className="w-5 h-5 mr-2" />
                Suggest a Feature
              </Button>
            </div>
          </div>

          {/* Upcoming Tools */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Upcoming Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Quality Checker</CardTitle>
                  <CardDescription>
                    Advanced quality validation for engineering documents with AI-powered insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Automated content review</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Compliance checking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Quality scoring</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                    <Zap className="w-8 h-8 text-yellow-600" />
                  </div>
                  <CardTitle className="text-xl">Auto Formatter</CardTitle>
                  <CardDescription>
                    Automatically format and standardize document layouts across your entire project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Template application</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Style standardization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Batch processing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Wrench className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Batch Processor</CardTitle>
                  <CardDescription>
                    Process hundreds of files simultaneously with custom rules and workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Mass file processing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Custom workflows</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Progress tracking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Roadmap */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Development Roadmap
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg">
                      <span className="text-green-600 font-bold">Q2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Quality Checker Launch</h3>
                      <p className="text-gray-600">Advanced validation with AI-powered quality scoring</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg">
                      <span className="text-blue-600 font-bold">Q3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Auto Formatter Release</h3>
                      <p className="text-gray-600">Automated document formatting and standardization</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg">
                      <span className="text-purple-600 font-bold">Q4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Batch Processor Beta</h3>
                      <p className="text-gray-600">Mass file processing with custom workflows</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <Mail className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-xl mb-8 opacity-90">
              Get notified about new features, updates, and exclusive early access opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComingSoonPage;
