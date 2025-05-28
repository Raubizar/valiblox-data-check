
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Users, Target, Award, MapPin, Mail, Linkedin } from "lucide-react";

const AboutUs = () => {
  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former lead engineer at major consulting firm with 15+ years in digital delivery",
      image: "photo-1721322800607-8c38375eef04"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder", 
      bio: "Software architect specializing in engineering automation and validation systems",
      image: "photo-1721322800607-8c38375eef04"
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of Product",
      bio: "PhD in Engineering Management, expert in quality assurance and process optimization",
      image: "photo-1721322800607-8c38375eef04"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "We believe in getting it right the first time, every time"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Engineering is a team sport, and our tools reflect that philosophy"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We set the highest standards for ourselves and our products"
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
              About Valiblox
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a team of engineers and technologists on a mission to eliminate the manual overhead 
              in digital engineering delivery through intelligent automation.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Valiblox was born from a simple frustration: why do engineering teams spend countless 
                  hours manually checking file names, hunting for missing deliverables, and creating 
                  validation reports when technology could do this instantly?
                </p>
                <p>
                  Founded in 2023 by veteran engineers who understood this pain firsthand, we set out 
                  to build the tools we wished we'd had throughout our careers. Our founders spent 
                  years in the trenches of large engineering projects, experiencing the inefficiencies 
                  of manual validation processes.
                </p>
                <p>
                  Today, Valiblox serves engineering teams worldwide, helping them save thousands of 
                  hours while maintaining the highest quality standards. We're just getting started.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardHeader>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center border-0 shadow-lg overflow-hidden">
                  <div className="p-6">
                    <img
                      src={`https://images.unsplash.com/${member.image}?w=200&h=200&fit=crop&crop=face`}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-green-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                    <div className="flex justify-center space-x-3 mt-4">
                      <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-20">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Valiblox by the Numbers
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
                <div className="text-gray-600">Files Validated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Hours Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Engineering Teams</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">99.9%</div>
                <div className="text-gray-600">Accuracy Rate</div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Where We're Based
            </h2>
            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
              <MapPin className="w-5 h-5" />
              <span>San Francisco, CA & Remote Worldwide</span>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              While our headquarters are in San Francisco, our team is distributed globally, 
              allowing us to serve engineering teams around the clock.
            </p>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl mb-8 opacity-90">
              Help us transform how engineering teams validate and deliver their work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Start Using Valiblox
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
