import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AddBalanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const FEE_PERCENT = 2;
const BANK_DETAILS = {
  bankName: "Sterling Bank",
  accountName: "CHINEMEREM LIBERTY",
  accountNumber: "0108835271",
};

export const AddBalanceModal = ({ open, onOpenChange, onSuccess }: AddBalanceModalProps) => {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountNum = Number(amount) || 0;
  const fee = (amountNum * FEE_PERCENT) / 100;
  const totalToPay = amountNum + fee;

  const handleSubmit = async () => {
    if (amountNum < 1000) {
      toast.error("Minimum amount is ₦1,000");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("instant_activation_payments")
        .insert({
          user_id: session.user.id,
          amount: totalToPay,
          status: "pending",
        });

      if (error) throw error;

      toast.success("Top-up request submitted! Processing...");
      onOpenChange(false);
      setAmount("");
      
      // In a real app, this would be updated when admin approves
      // For now, we'll just notify the user
      setTimeout(() => {
        toast.info("Your deposit is being verified. Please wait...");
      }, 1000);
      
    } catch (error: any) {
      toast.error("Failed to submit top-up request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Add Balance</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bank Details */}
          <div className="bg-muted/50 p-3 rounded-lg space-y-2 text-sm">
            <p className="font-semibold">Bank Details:</p>
            <div className="space-y-1">
              <p><span className="text-muted-foreground">Bank:</span> {BANK_DETAILS.bankName}</p>
              <p><span className="text-muted-foreground">Name:</span> {BANK_DETAILS.accountName}</p>
              <p><span className="text-muted-foreground">Account:</span> {BANK_DETAILS.accountNumber}</p>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1000"
            />
          </div>

          {/* Fee Breakdown */}
          {amountNum > 0 && (
            <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">₦{amountNum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee ({FEE_PERCENT}%):</span>
                <span className="font-semibold">₦{fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1 mt-1">
                <span className="font-semibold">Total to Pay:</span>
                <span className="font-bold text-primary">₦{totalToPay.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-sm text-yellow-500">
            <p className="font-semibold">Note:</p>
            <p>A {FEE_PERCENT}% fee is added to all top-ups. Please transfer the total amount shown above.</p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || amountNum < 1000}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {isSubmitting ? "Processing..." : "I've Paid"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
