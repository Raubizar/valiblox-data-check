import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Zap, TrendingUp } from "lucide-react";

interface ComingSoonTabProps {
  title: string;
  description: string;
  features: string[];
  icon?: React.ReactNode;
}

export const ComingSoonTab = ({ title, description, features, icon }: ComingSoonTabProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            {icon || <Clock className="w-12 h-12 text-blue-500" />}
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Coming Soon
            </Badge>
          </div>
          <CardDescription className="text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 text-left">
            <h4 className="font-medium text-gray-900 text-center mb-3">Planned Features:</h4>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              We're building Valiblox following the "Start Small, Stay Small" approach. 
              This feature will be available in future waves.
            </p>
            <Button variant="outline" className="w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              Notify Me When Available
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
