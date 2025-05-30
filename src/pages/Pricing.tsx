
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, X, Star, Users, Building, Crown, Zap } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: " for 30 days",
      description: "+30 days for every 2 referrals signed up",
      icon: Users,
      popular: false,
      flexible: false,
      features: [
        { text: "Up to 100 files/month", included: true },
        { text: "1 project", included: true },
        { text: "Up to 2 disciplines per project", included: true },
        { text: "Essentials dashboard", included: true },
        { text: "1 downloadable report (Valiblox branding)", included: true },
        { text: "Email-only report delivery", included: true },
        { text: "Saved report presets", included: false },
        { text: "Email notifications", included: false },
        { text: "Scheduling", included: false },
        { text: "Team access", included: false },
        { text: "Compliance insights", included: false }
      ]
    },
    {
      name: "Pay per Project",
      price: "€9",
      period: "/project/month",
      description: "Perfect for project-based validation needs",
      icon: Zap,
      popular: false,
      flexible: true,
      features: [
        { text: "Up to 10,000 files per project", included: true },
        { text: "Full dashboard (Projects & Reports)", included: true },
        { text: "Up to 10 disciplines per project", included: true },
        { text: "PDF, Excel, Email exports with custom branding", included: true },
        { text: "Up to 10 saved presets", included: true },
        { text: "Discipline-specific email reports", included: true },
        { text: "Manual scheduling", included: true },
        { text: "Team access", included: false },
        { text: "Compliance insights", included: false }
      ]
    },
    {
      name: "Pro",
      price: "€49",
      period: "/month",
      description: "Ideal for teams with multiple ongoing projects",
      icon: Building,
      popular: true,
      flexible: false,
      features: [
        { text: "Up to 10,000 files/month", included: true },
        { text: "10 projects", included: true },
        { text: "10 disciplines", included: true },
        { text: "Custom branded reports (PDF, Excel, Email)", included: true },
        { text: "10 report presets", included: true },
        { text: "Discipline-specific emails", included: true },
        { text: "Manual schedule per discipline", included: true },
        { text: "Team access", included: false },
        { text: "Compliance insights", included: false }
      ]
    },
    {
      name: "Enterprise",
      price: "€299",
      period: "/month",
      description: "For large organizations with complex requirements",
      icon: Crown,
      popular: false,
      flexible: false,
      features: [
        { text: "Unlimited files, projects, and disciplines", included: true },
        { text: "Full dashboard with insights and team sharing", included: true },
        { text: "10 users", included: true },
        { text: "Unlimited report presets", included: true },
        { text: "Discipline + Project Manager emails", included: true },
        { text: "Auto-scheduled reviews + deadline reminders", included: true },
        { text: "Visual compliance dashboard with project trends", included: true }
      ]
    }
  ];

  const faqs = [
    {
      question: "How does the Pay per Project plan work?",
      answer: "You're charged €9 for each active project per month. If you have 3 projects running, you pay €27/month. Pause or complete projects anytime to adjust your billing."
    },
    {
      question: "What counts as a 'file' in the limits?",
      answer: "Each document upload counts as one file, regardless of format (DWG, PDF, DOCX, XLSX, etc.). The count resets monthly."
    },
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer: "Yes, you can change your plan at any time. Changes take effect immediately, and billing is prorated."
    },
    {
      question: "How do referrals extend my free trial?",
      answer: "For every 2 people who sign up using your referral link, you get an additional 30 days added to your Starter plan."
    },
    {
      question: "What happens if I exceed my file or project limits?",
      answer: "We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional capacity as needed."
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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your validation needs. Start free for 30 days with no credit card required.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-gray-600">Monthly</span>
              <div className="relative">
                <input type="checkbox" className="sr-only" />
                <div className="w-12 h-6 bg-gray-300 rounded-full cursor-pointer"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
              </div>
              <span className="text-gray-600">Annual</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                Save 20%
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-0 shadow-xl transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'ring-2 ring-green-500 transform scale-105' 
                    : plan.flexible
                    ? 'ring-2 ring-blue-500'
                    : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}
                
                {plan.flexible && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>Flexible</span>
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    plan.popular 
                      ? 'bg-green-100' 
                      : plan.flexible
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}>
                    <plan.icon className={`w-8 h-8 ${
                      plan.popular 
                        ? 'text-green-600' 
                        : plan.flexible
                        ? 'text-blue-600'
                        : 'text-gray-600'
                    }`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="text-gray-600">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Button 
                    className={`w-full mb-6 ${
                      plan.popular 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : plan.flexible
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    size="lg"
                  >
                    {plan.name === "Starter" ? "Start Free Trial" : 
                     plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>

                  {plan.name === "Enterprise" && (
                    <div className="text-center mb-4">
                      <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                        Need more? Let's talk →
                      </span>
                    </div>
                  )}

                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enterprise CTA */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white text-center mb-20">
            <h2 className="text-3xl font-bold mb-4">Need Custom Solutions?</h2>
            <p className="text-xl mb-8 opacity-90">
              Large organizations with unique compliance requirements deserve tailored solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg">
                Contact Sales
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg">
                Schedule Demo
              </Button>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start with our free 30-day trial. No credit card required.
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

export default Pricing;
