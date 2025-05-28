
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, TrendingUp } from "lucide-react";

export const Impact = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            We turn days of manual work into seconds of automation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Valiblox creates <strong>beautiful, easy-to-understand reports</strong> ready to share across teams.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Save Hours</h3>
            <p className="text-gray-600">
              Reduce validation time from hours to minutes with automated checks
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Team Ready</h3>
            <p className="text-gray-600">
              Generate clear reports that everyone can understand and act on
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Improve Quality</h3>
            <p className="text-gray-600">
              Catch errors early and maintain consistent standards across projects
            </p>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Validation Summary Report</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Project Overview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Files Checked:</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Files Passed:</span>
                      <span className="font-medium text-green-600">147</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issues Found:</span>
                      <span className="font-medium text-red-600">9</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-medium text-green-600">94.2%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Common Issues</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Naming violations:</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Missing deliverables:</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duplicate files:</span>
                      <span className="font-medium">1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
