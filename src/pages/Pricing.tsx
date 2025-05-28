
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, X, Star, Users, Building, Crown } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for small teams getting started with validation",
      icon: Users,
      popular: false,
      features: [
        { text: "Up to 50 files per month", included: true },
        { text: "Basic naming validation", included: true },
        { text: "Standard report templates", included: true },
        { text: "Email support", included: true },
        { text: "Advanced validation rules", included: false },
        { text: "Custom report branding", included: false },
        { text: "API access", included: false },
        { text: "Priority support", included: false }
      ]
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Ideal for growing teams with higher validation needs",
      icon: Building,
      popular: true,
      features: [
        { text: "Up to 500 files per month", included: true },
        { text: "Advanced naming validation", included: true },
        { text: "Custom report templates", included: true },
        { text: "Priority email support", included: true },
        { text: "Advanced validation rules", included: true },
        { text: "Custom report branding", included: true },
        { text: "Basic API access", included: true },
        { text: "Phone support", included: false }
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with complex requirements",
      icon: Crown,
      popular: false,
      features: [
        { text: "Unlimited files", included: true },
        { text: "Enterprise validation suite", included: true },
        { text: "Fully custom templates", included: true },
        { text: "Dedicated support manager", included: true },
        { text: "Advanced validation rules", included: true },
        { text: "White-label branding", included: true },
        { text: "Full API access", included: true },
        { text: "24/7 phone support", included: true }
      ]
    }
  ];

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer: "Yes, you can change your plan at any time. Changes take effect immediately, and billing is prorated."
    },
    {
      question: "What file formats do you support?",
      answer: "We support all major engineering file formats including DWG, PDF, DOCX, XLSX, and many others."
    },
    {
      question: "Is there a setup fee?",
      answer: "No, there are no setup fees for any of our plans. You only pay the monthly subscription fee."
    },
    {
      question: "Do you offer annual billing discounts?",
      answer: "Yes, annual subscribers receive a 20% discount on Professional and Enterprise plans."
    },
    {
      question: "What happens if I exceed my file limit?",
      answer: "We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional capacity."
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
              Choose the plan that fits your team's needs. All plans include our core validation tools with no hidden fees.
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
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-0 shadow-xl transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'ring-2 ring-green-500 transform scale-105' 
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
                
                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    plan.popular 
                      ? 'bg-green-100' 
                      : 'bg-gray-100'
                  }`}>
                    <plan.icon className={`w-8 h-8 ${
                      plan.popular 
                        ? 'text-green-600' 
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
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    size="lg"
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
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
            <h2 className="text-3xl font-bold mb-4">Need Something Custom?</h2>
            <p className="text-xl mb-8 opacity-90">
              Large organizations have unique needs. Let's discuss a custom solution for your team.
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
              Join thousands of engineers who have streamlined their validation processes.
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
