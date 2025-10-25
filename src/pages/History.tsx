import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, Gift } from "lucide-react";

const History = () => {
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

  // Mock transaction history
  const transactions = [
    {
      id: 1,
      type: "credit",
      amount: 50000,
      description: "Welcome Bonus",
      date: new Date().toLocaleDateString(),
      icon: Gift,
    },
  ];

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
          <h1 className="text-2xl font-bold">Transaction History</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {transactions.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-8 text-center">
            <p className="text-muted-foreground">No transactions yet</p>
          </Card>
        ) : (
          transactions.map((transaction) => {
            const Icon = transaction.icon;
            return (
              <Card
                key={transaction.id}
                className="bg-card/80 backdrop-blur-lg border-border/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === "credit" 
                      ? "bg-secondary/20 text-secondary" 
                      : "bg-destructive/20 text-destructive"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{transaction.description}</h3>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className={`text-lg font-bold ${
                    transaction.type === "credit" ? "text-secondary" : "text-destructive"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
