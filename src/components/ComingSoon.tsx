
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Lightbulb, Wrench, Shield, Zap } from "lucide-react";

export const ComingSoon = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Coming Soon
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            We're building more smart tools to automate digital delivery.
            <br />
            Got an idea? We'd love to hear it.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
            Suggest a Tool
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 border-dashed border-2 border-gray-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <Shield className="w-6 h-6 text-gray-500" />
              </div>
              <CardTitle className="text-lg text-gray-700">
                Quality Checker
              </CardTitle>
              <CardDescription className="text-sm">
                Advanced quality validation for engineering documents
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-dashed border-2 border-gray-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <Zap className="w-6 h-6 text-gray-500" />
              </div>
              <CardTitle className="text-lg text-gray-700">
                Auto Formatter
              </CardTitle>
              <CardDescription className="text-sm">
                Automatically format and standardize document layouts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-dashed border-2 border-gray-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <Wrench className="w-6 h-6 text-gray-500" />
              </div>
              <CardTitle className="text-lg text-gray-700">
                Batch Processor
              </CardTitle>
              <CardDescription className="text-sm">
                Process hundreds of files simultaneously with custom rules
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-dashed border-2 border-gray-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-md transition-all">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg text-blue-600">
                Your Idea
              </CardTitle>
              <CardDescription className="text-sm">
                What tool would make your workflow even better?
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
          <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Have a Feature Request?
          </h3>
          <p className="text-gray-600 mb-6">
            We're always looking for ways to improve our tools. Share your ideas and help shape the future of Valiblox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="px-6 py-2">
              Join Our Community
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 px-6 py-2">
              Send Feedback
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
