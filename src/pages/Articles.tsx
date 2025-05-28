
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, User, Tag, ArrowRight, Search } from "lucide-react";

const Articles = () => {
  const articles = [
    {
      title: "Best Practices for Document Naming in Engineering Projects",
      excerpt: "Learn how to establish and maintain consistent naming conventions that scale with your project size.",
      author: "Sarah Chen",
      date: "March 15, 2024",
      category: "Best Practices",
      readTime: "8 min read",
      image: "photo-1488590528505-98d2b5aba04b",
      featured: true
    },
    {
      title: "The Hidden Costs of Manual Deliverables Tracking",
      excerpt: "Discover how manual validation processes are costing your engineering team more than you think.",
      author: "Marcus Rodriguez",
      date: "March 10, 2024",
      category: "Industry Insights",
      readTime: "6 min read",
      image: "photo-1461749280684-dccba630e2f6"
    },
    {
      title: "Automating Quality Control in Digital Engineering",
      excerpt: "Explore the latest trends in automated quality assurance for engineering deliverables.",
      author: "Dr. Emily Watson",
      date: "March 5, 2024",
      category: "Technology",
      readTime: "10 min read",
      image: "photo-1486312338219-ce68d2c6f44d"
    },
    {
      title: "Case Study: How TechCorp Reduced Validation Time by 90%",
      excerpt: "A detailed look at how one engineering firm transformed their validation workflow with automation.",
      author: "Sarah Chen",
      date: "February 28, 2024",
      category: "Case Studies",
      readTime: "12 min read",
      image: "photo-1460925895917-afdab827c52f"
    },
    {
      title: "Common File Naming Mistakes That Cost Projects",
      excerpt: "Avoid these frequent pitfalls that can derail project timelines and quality standards.",
      author: "Marcus Rodriguez",
      date: "February 20, 2024",
      category: "Best Practices",
      readTime: "7 min read",
      image: "photo-1498050108023-c5249f4df085"
    },
    {
      title: "The Future of Engineering Document Management",
      excerpt: "What's next for digital engineering workflows and document validation technologies.",
      author: "Dr. Emily Watson",
      date: "February 15, 2024",
      category: "Future Trends",
      readTime: "9 min read",
      image: "photo-1581091226825-a6a2a5aee158"
    }
  ];

  const categories = ["All", "Best Practices", "Technology", "Case Studies", "Industry Insights", "Future Trends"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Engineering Insights
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Expert insights, best practices, and industry trends for engineering teams who want to streamline their validation workflows.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Article */}
          {articles.filter(article => article.featured).map((article, index) => (
            <Card key={index} className="mb-16 overflow-hidden border-0 shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={`https://images.unsplash.com/${article.image}?w=600&h=400&fit=crop`}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span>{article.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h2>
                  <p className="text-gray-600 mb-6 text-lg">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Article Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.filter(article => !article.featured).map((article, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
                <div className="relative">
                  <img
                    src={`https://images.unsplash.com/${article.image}?w=400&h=240&fit=crop`}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-colors">
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest engineering insights and best practices delivered to your inbox.
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

export default Articles;
