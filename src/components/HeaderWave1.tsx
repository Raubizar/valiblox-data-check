// filepath: c:\Users\ruben\Documents\GitHub\valiblox-data-check\src\components\Header.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/Valiblox_v3.1-icon-removebg-preview.png"
              alt="Valiblox icon"
              className="h-8 w-8 object-contain"
              style={{ display: 'block' }}
            />
            <span className="text-xl font-bold text-gray-900">VALIBLOX</span>
          </Link>

          {/* Desktop Navigation - Wave-1: Home, Naming Demo, Drawing Demo, Dashboard */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/naming-validator" className="text-gray-600 hover:text-gray-900 transition-colors">
              Naming Demo
            </Link>
            <Link to="/deliverables-tracker" className="text-gray-600 hover:text-gray-900 transition-colors">
              Drawing Demo
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

        {/* Mobile Menu - Wave-1: Simplified navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="py-4 space-y-4">
              <Link to="/" className="block text-gray-600 hover:text-gray-900 py-2">
                Home
              </Link>
              <Link to="/naming-validator" className="block text-gray-600 hover:text-gray-900 py-2">
                Naming Demo
              </Link>
              <Link to="/deliverables-tracker" className="block text-gray-600 hover:text-gray-900 py-2">
                Drawing Demo
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
