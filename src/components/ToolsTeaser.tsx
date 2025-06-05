import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

export const ToolsTeaser = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Available Tools
          </h2>
          <p className="text-xl text-gray-600">
            Try our validation tools instantly—no signup required
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Naming Standard Validator */}
          <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Naming Standard Validator
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg mt-2">
                Instantly check if your files follow naming conventions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/naming-demo">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 w-full">
                  Try Demo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Deliverables Tracker */}
          <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Deliverables Tracker
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg mt-2">
                Verify your deliverables list against actual files
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/drawinglist-demo">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full">
                  Try Demo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
