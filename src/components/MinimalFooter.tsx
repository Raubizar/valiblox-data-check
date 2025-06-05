import { Linkedin, Mail } from "lucide-react";

export const MinimalFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/Valiblox_v3.1-icon-removebg-preview.png"
              alt="Valiblox icon"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-gray-900">VALIBLOX</span>
          </div>

          {/* Contact & Social */}
          <div className="flex items-center space-x-6">
            <a 
              href="mailto:contact@valiblox.com" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>contact@valiblox.com</span>
            </a>
            <a 
              href="https://linkedin.com/company/valiblox" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            © {currentYear} Valiblox. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
