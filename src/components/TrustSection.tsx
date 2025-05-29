
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export const TrustSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager",
      company: "Engineering Solutions Ltd",
      quote: "Valiblox reduced our file validation time by 90%. What used to take hours now takes minutes.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "CAD Manager",
      company: "Infrastructure Corp",
      quote: "The naming standard validator caught errors we never would have found manually. It's a game-changer.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Quality Assurance Lead",
      company: "Construction Dynamics",
      quote: "Our compliance scores improved dramatically after implementing Valiblox. Highly recommended.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10,000+", label: "Files Validated Daily" },
    { number: "98%", label: "Accuracy Rate" },
    { number: "500+", label: "Engineering Teams" },
    { number: "47hrs", label: "Average Time Saved/Month" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Trusted by Engineering Teams Worldwide
          </h2>
          
          <Card className="relative">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6 italic">
                  "{testimonials[currentSlide].quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonials[currentSlide].name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonials[currentSlide].role} at {testimonials[currentSlide].company}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8">
                <Button variant="ghost" size="sm" onClick={prevSlide}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
                <Button variant="ghost" size="sm" onClick={nextSlide}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
