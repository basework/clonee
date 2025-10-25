import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, Share2, Users } from "lucide-react";
import { toast } from "sonner";

const Referrals = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast.success("Referral code copied!");
    }
  };

  const shareReferral = async () => {
    const referralText = `Join Chixx9ja and earn money! Use my referral code: ${user?.referralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Chixx9ja",
          text: referralText,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(referralText);
      toast.success("Referral message copied!");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen liquid-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-background/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Refer & Earn</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-lg border-border/50 p-6 glow-secondary">
          <div className="text-center space-y-4">
            <Users className="w-16 h-16 mx-auto text-primary animate-pulse-glow" />
            <div>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
              <p className="text-5xl font-bold gradient-text">{user.referrals || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings from Referrals</p>
              <p className="text-3xl font-bold text-secondary">
                ₦{((user.referrals || 0) * 15000).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Referral Code Card */}
        <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Your Referral Code</h3>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg text-center">
              <code className="text-3xl font-bold gradient-text">{user.referralCode}</code>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={copyReferralCode}
                className="bg-card hover:bg-muted border border-border/50 text-foreground"
                variant="outline"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button
                onClick={shareReferral}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>

        {/* How it Works */}
        <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-6">
          <h3 className="font-semibold text-lg mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium text-foreground">Share Your Code</h4>
                <p className="text-sm text-muted-foreground">Copy or share your unique referral code with friends</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium text-foreground">They Sign Up</h4>
                <p className="text-sm text-muted-foreground">Your friend registers using your referral code</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium text-foreground">Earn ₦15,000</h4>
                <p className="text-sm text-muted-foreground">Get ₦15,000 instantly credited to your account!</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Referrals;
