
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import NicknameModal from "./NicknameModal";
import { getCurrentUser } from "@/services/userService";
import { User } from "@/types";

const Header = () => {
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleNicknameSet = (user: User) => {
    setUser(user);
    setIsNicknameModalOpen(false);
  };

  return (
    <header className="border-b bg-white py-3 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-quiet-400 text-white p-2 rounded-full">
            <MapPin size={20} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-quiet-400 to-quiet-500 bg-clip-text text-transparent">
            UBC Quiet Spaces
          </h1>
        </Link>
        
        <nav className="hidden md:flex gap-8 items-center">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-quiet-400 transition-colors"
          >
            Map
          </Link>
          <Link 
            to="/reviews" 
            className="text-gray-600 hover:text-quiet-400 transition-colors"
          >
            Submit Review
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-quiet-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user.nickname.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium hidden md:inline-block">
                {user.nickname}
              </span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsNicknameModalOpen(true)}
              className="border-quiet-400 text-quiet-600 hover:bg-quiet-100"
            >
              Set Nickname
            </Button>
          )}
          
          <Link to="/reviews">
            <Button className="bg-quiet-400 hover:bg-quiet-500 flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="hidden md:inline-block">Review</span>
            </Button>
          </Link>
        </div>
      </div>
      
      <NicknameModal 
        isOpen={isNicknameModalOpen} 
        onClose={() => setIsNicknameModalOpen(false)}
        onNicknameSet={handleNicknameSet}
      />
    </header>
  );
};

export default Header;
