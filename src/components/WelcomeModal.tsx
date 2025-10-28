import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("chixx9ja_welcome_seen");
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("chixx9ja_welcome_seen", "true");
    setIsOpen(false);
  };

  const handleJoinTelegram = () => {
    window.open("https://t.me/officialbluepay2025", "_blank", "noopener,noreferrer");
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to Chixx9ja! 🎉
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-center text-lg">
            Join our Telegram channel for exclusive updates, tips, and support! 🚀✨
          </p>
          <p className="text-center text-muted-foreground">
            Get instant notifications about new features and earn extra rewards! 💰🔥
          </p>
          <div className="space-y-2">
            <button
              onClick={handleJoinTelegram}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all touch-manipulation min-h-[44px]"
            >
              Join Telegram Channel 📢
            </button>
            <button
              onClick={handleClose}
              className="w-full bg-muted hover:bg-muted/80 text-foreground font-medium py-2 px-4 rounded-lg transition-all touch-manipulation min-h-[44px]"
            >
              <X className="w-4 h-4 inline mr-2" />
              Maybe Later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
