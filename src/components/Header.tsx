
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { ComingSoonTools } from "@/components/ComingSoonTools";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center relative">
                <div className="w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center relative -ml-2">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">VALIBLOX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>Tools</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isToolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  <Link to="/naming-validator" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Naming Standard Validator
                  </Link>
                  <Link to="/deliverables-tracker" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Deliverables Tracker
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Coming Soon Tools
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Coming Soon Tools</DialogTitle>
                      </DialogHeader>
                      <ComingSoonTools />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
            <Link to="/tutorials" className="text-gray-600 hover:text-gray-900 transition-colors">
              Tutorials
            </Link>
            <Link to="/articles" className="text-gray-600 hover:text-gray-900 transition-colors">
              Articles
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About Us
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Sign In Button and Dashboard Link */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="border-gray-300">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="py-4 space-y-4">
              <div>
                <button className="flex items-center w-full text-left text-gray-600 hover:text-gray-900 py-2">
                  Tools <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                <div className="ml-4 space-y-2 mt-2">
                  <Link to="/naming-validator" className="block text-gray-500 hover:text-gray-700">
                    Naming Standard Validator
                  </Link>
                  <Link to="/deliverables-tracker" className="block text-gray-500 hover:text-gray-700">
                    Deliverables Tracker
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="block text-gray-500 hover:text-gray-700">
                        Coming Soon Tools
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Coming Soon Tools</DialogTitle>
                      </DialogHeader>
                      <ComingSoonTools />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Link to="/tutorials" className="block text-gray-600 hover:text-gray-900 py-2">
                Tutorials
              </Link>
              <Link to="/articles" className="block text-gray-600 hover:text-gray-900 py-2">
                Articles
              </Link>
              <Link to="/about" className="block text-gray-600 hover:text-gray-900 py-2">
                About Us
              </Link>
              <Link to="/pricing" className="block text-gray-600 hover:text-gray-900 py-2">
                Pricing
              </Link>
              <Link to="/dashboard" className="block text-gray-600 hover:text-gray-900 py-2">
                Dashboard
              </Link>
              <Button variant="outline" className="w-full mt-4">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
