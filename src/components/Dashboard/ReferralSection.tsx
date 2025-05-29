
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Share2, Gift, Users, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ReferralSection = () => {
  const { toast } = useToast();
  const [referralCode] = useState("VALI-REF-2024-XYZ123");
  const referralLink = `https://valiblox.com/signup?ref=${referralCode}`;
  
  const referralStats = {
    totalReferrals: 8,
    successfulReferrals: 5,
    pendingReferrals: 3,
    rewardsEarned: 1000, // extra pages
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: "Try Valiblox - Engineering Validation Platform",
        text: "Check out Valiblox! It's helped me save hours on file validation and compliance checking.",
        url: referralLink,
      });
    } else {
      copyToClipboard(referralLink);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Refer & Earn</h2>
        <p className="text-gray-600">Share Valiblox with colleagues and earn rewards for every successful referral</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{referralStats.totalReferrals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Gift className="w-4 h-4 mr-2" />
              Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{referralStats.successfulReferrals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{referralStats.pendingReferrals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rewards Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{referralStats.rewardsEarned}</div>
            <p className="text-xs text-gray-500">extra pages</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="bg-gray-50"
            />
            <Button 
              variant="outline" 
              onClick={() => copyToClipboard(referralLink)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              onClick={shareReferral}
              className="bg-green-600 hover:bg-green-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">How Referrals Work</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Share your unique referral link with colleagues</li>
              <li>• Earn 200 extra pages for each successful signup</li>
              <li>• Your referral gets a 14-day free trial extension</li>
              <li>• No limit on the number of referrals</li>
            </ul>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Referral Program Details
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Referral Program Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Rewards Structure</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Per successful referral:</span>
                      <span className="font-medium">200 extra pages</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Referral bonus (for them):</span>
                      <span className="font-medium">14-day trial extension</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment required:</span>
                      <span className="font-medium">Within 30 days of signup</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Terms & Conditions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Referrals must be new users to Valiblox</li>
                    <li>• Referred user must complete payment to qualify</li>
                    <li>• Rewards are added to your account within 7 business days</li>
                    <li>• Self-referrals are not permitted</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};
