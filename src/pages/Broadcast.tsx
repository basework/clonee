import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Broadcast = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen liquid-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 text-primary-foreground">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-background/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Broadcast</h1>
        </div>
      </div>

      <div className="p-4 flex items-center justify-center min-h-[60vh]">
        <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold gradient-text mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            You'll soon be able to share your link widely from here.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Broadcast;
