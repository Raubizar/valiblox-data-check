import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useFakeAuth } from "@/hooks/useFakeAuth";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isFakeLoggedIn, toggleFakeAuth } = useFakeAuth();

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
          </Link>          {/* Desktop Navigation - Wave-1: Home, Naming Checker, Deliverables Tracker, Dashboard */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/naming-demo" className="text-gray-600 hover:text-gray-900 transition-colors">
              Naming Checker
            </Link>
            <Link to="/drawinglist-demo" className="text-gray-600 hover:text-gray-900 transition-colors">
              Deliverables Tracker
            </Link>
          </nav>          {/* Sign In Button and Dashboard Link */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Button>
            </Link>            {isFakeLoggedIn ? (
              <Button 
                variant="outline" 
                className="border-gray-300"
                onClick={toggleFakeAuth}
              >
                Sign Out
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="border-gray-300"
                onClick={toggleFakeAuth}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>        {/* Mobile Menu - Wave-1: Simplified navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="py-4 space-y-4">
              <Link to="/" className="block text-gray-600 hover:text-gray-900 py-2">
                Home
              </Link>
              <Link to="/naming-demo" className="block text-gray-600 hover:text-gray-900 py-2">
                Naming Checker
              </Link>
              <Link to="/drawinglist-demo" className="block text-gray-600 hover:text-gray-900 py-2">
                Deliverables Tracker
              </Link>              <Link to="/dashboard" className="block text-gray-600 hover:text-gray-900 py-2">
                Dashboard
              </Link>              {isFakeLoggedIn ? (
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={toggleFakeAuth}
                >
                  Sign Out
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={toggleFakeAuth}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};