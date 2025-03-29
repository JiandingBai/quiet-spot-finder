
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { setNickname } from "@/services/userService";
import { User } from "@/types";
import { toast } from "sonner";

interface NicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNicknameSet: (user: User) => void;
}

const NicknameModal = ({ isOpen, onClose, onNicknameSet }: NicknameModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a nickname");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const user = setNickname(inputValue.trim());
      onNicknameSet(user);
      toast.success("Nickname set successfully!");
    } catch (error) {
      toast.error("Failed to set nickname");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Your Nickname</DialogTitle>
          <DialogDescription>
            Enter a nickname to use when submitting reviews. This will help others identify your contributions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="StudyMaster"
              className="focus-visible:ring-quiet-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-quiet-400 hover:bg-quiet-500"
          >
            {isSubmitting ? "Setting..." : "Set Nickname"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NicknameModal;
