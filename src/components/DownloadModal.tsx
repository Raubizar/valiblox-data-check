import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Mail, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  title?: string;
  description?: string;
}

export const DownloadModal = ({ 
  isOpen, 
  onClose, 
  onDownload, 
  title = "Download Your Report",
  description = "Enter your email to receive your validation report"
}: DownloadModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Sign in with OTP
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        }
      });

      if (authError) {
        throw authError;
      }

      setIsSuccess(true);
      
      // Auto-download after a short delay
      setTimeout(() => {
        onDownload();
        // Close modal after download starts
        setTimeout(() => {
          onClose();
          resetModal();
        }, 1000);
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setEmail('');
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300); // Wait for modal animation
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
        <CardHeader className="relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          
          <CardTitle className="text-xl font-semibold text-gray-900 pr-8">
            {title}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            {description}
          </p>
        </CardHeader>

        <CardContent className="pt-0">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send My Report'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                We'll send you a magic link to access your report
              </p>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Check Your Email
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                We've sent a magic link to <strong>{email}</strong>
              </p>
              
              <p className="text-xs text-gray-500">
                Your download will start automatically...
              </p>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-green-600 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
