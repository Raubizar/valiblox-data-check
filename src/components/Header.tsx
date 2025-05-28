
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center relative">
                <div className="w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center relative -ml-2">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">VALIBLOX</span>
          </div>

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
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Naming Standard Validator
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Deliverables Tracker
                  </a>
                </div>
              )}
            </div>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Tutorials
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              About Us
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
          </nav>

          {/* Sign In Button */}
          <div className="hidden md:flex items-center space-x-4">
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
                  <a href="#" className="block text-gray-500 hover:text-gray-700">
                    Naming Standard Validator
                  </a>
                  <a href="#" className="block text-gray-500 hover:text-gray-700">
                    Deliverables Tracker
                  </a>
                </div>
              </div>
              <a href="#" className="block text-gray-600 hover:text-gray-900 py-2">
                Tutorials
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900 py-2">
                About Us
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900 py-2">
                Pricing
              </a>
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
