import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Copy, Users, History, ArrowUpRight, Gift } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
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

  if (!user) return null;

  return (
    <div className="min-h-screen liquid-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-background/20 backdrop-blur-lg flex items-center justify-center text-xl font-bold">
              {user.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm opacity-90">Hi, {user.fullName} 👋</p>
              <p className="font-semibold">Welcome back!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-background/20"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/auth");
            }}
          >
            <ArrowUpRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-lg border-border/50 p-6 glow-primary">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Your Balance</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="hover:bg-muted"
              >
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </Button>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              {showBalance ? `₦${user.balance?.toLocaleString() || "50,000"}.00` : "****"}
            </h2>
          </div>
        </Card>

        {/* Referral Card */}
        <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Referral Program</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold text-primary">{user.referrals || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Earnings/Referral</p>
                <p className="text-2xl font-bold text-secondary">₦15,000</p>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">Your Referral Code</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-lg font-bold text-foreground">{user.referralCode}</code>
                <Button
                  size="sm"
                  onClick={copyReferralCode}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate("/history")}
            className="bg-card hover:bg-muted border border-border/50 text-foreground h-20 flex-col gap-2"
            variant="outline"
          >
            <History className="w-6 h-6 text-primary" />
            <span>History</span>
          </Button>
          <Button
            onClick={() => navigate("/referrals")}
            className="bg-card hover:bg-muted border border-border/50 text-foreground h-20 flex-col gap-2"
            variant="outline"
          >
            <Gift className="w-6 h-6 text-secondary" />
            <span>Refer & Earn</span>
          </Button>
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 p-4">
          <div className="flex items-start gap-3">
            <Gift className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">Welcome Bonus Active!</p>
              <p className="text-muted-foreground">You received ₦50,000 as a welcome bonus. Share your referral code to earn ₦15,000 per friend!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
