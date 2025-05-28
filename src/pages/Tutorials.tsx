
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlayCircle, Clock, User, BookOpen, Download, CheckCircle } from "lucide-react";

const Tutorials = () => {
  const tutorials = [
    {
      title: "Getting Started with Valiblox",
      description: "Learn the basics of using Valiblox to validate your engineering files",
      duration: "15 min",
      level: "Beginner",
      image: "photo-1488590528505-98d2b5aba04b"
    },
    {
      title: "Setting Up Naming Standards",
      description: "Configure custom naming conventions for your specific project requirements",
      duration: "20 min",
      level: "Intermediate",
      image: "photo-1461749280684-dccba630e2f6"
    },
    {
      title: "Advanced Deliverables Tracking",
      description: "Master the art of tracking complex deliverables across multiple disciplines",
      duration: "30 min",
      level: "Advanced",
      image: "photo-1486312338219-ce68d2c6f44d"
    },
    {
      title: "Generating Professional Reports",
      description: "Create comprehensive validation reports for stakeholders and clients",
      duration: "25 min",
      level: "Intermediate",
      image: "photo-1460925895917-afdab827c52f"
    },
    {
      title: "Batch Processing Large Projects",
      description: "Efficiently handle hundreds of files using batch processing techniques",
      duration: "35 min",
      level: "Advanced",
      image: "photo-1498050108023-c5249f4df085"
    },
    {
      title: "Integration with CAD Software",
      description: "Connect Valiblox with your existing CAD and design tools",
      duration: "40 min",
      level: "Advanced",
      image: "photo-1581091226825-a6a2a5aee158"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Learn Valiblox
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Master our validation tools with step-by-step tutorials, best practices, and expert tips from engineering professionals.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-2xl">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Account</h3>
                <p className="text-gray-600 text-sm">Sign up for free and access all basic features</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-2xl">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Files</h3>
                <p className="text-gray-600 text-sm">Import your engineering documents and drawings</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-2xl">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Results</h3>
                <p className="text-gray-600 text-sm">Receive instant validation and detailed reports</p>
              </div>
            </div>
          </div>

          {/* Tutorial Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Tutorial Categories
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>Basics</CardTitle>
                  <CardDescription>
                    Learn the fundamentals of document validation and naming standards
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle>Best Practices</CardTitle>
                  <CardDescription>
                    Discover proven strategies for maintaining quality and consistency
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle>Advanced Features</CardTitle>
                  <CardDescription>
                    Master complex workflows and automation capabilities
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Featured Tutorials */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Featured Tutorials
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={`https://images.unsplash.com/${tutorial.image}?w=400&h=200&fit=crop`}
                      alt={tutorial.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{tutorial.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{tutorial.level}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Master Valiblox?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of engineers who have streamlined their validation workflows.
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tutorials;
