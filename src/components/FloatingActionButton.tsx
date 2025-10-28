import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, History, Gift, User, DollarSign, MessageCircle, Radio, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: CheckCircle2, label: "Tasks", path: "/tasks" },
    { icon: History, label: "History", path: "/history" },
    { icon: Gift, label: "Referrals", path: "/referrals" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: DollarSign, label: "Withdraw", path: "/withdraw" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: MessageCircle, label: "Support", path: "/support" },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsOpen(false)}
          style={{ pointerEvents: 'auto' }}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <Card className="absolute bottom-16 right-0 p-2 bg-card/95 backdrop-blur-lg border-border/50 shadow-lg animate-fade-in mb-2" style={{ pointerEvents: 'auto', zIndex: 60 }}>
            <div className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="flex items-center justify-start gap-3 hover:bg-muted px-4 py-2 rounded-md transition-colors touch-manipulation cursor-pointer min-h-[44px]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </Card>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg glow-primary hover:opacity-90 flex items-center justify-center transition-all active:scale-95 touch-manipulation cursor-pointer"
          style={{ WebkitTapHighlightColor: 'transparent', pointerEvents: 'auto', zIndex: 60 }}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </>
  );
};
