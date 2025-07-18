'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleNewChat = () => {
    setActiveSessionId(null);
    if (isMobile) {
      setSidebarVisible(false);
    }
  };
  
  const handleSelectChat = (sessionId: string) => {
    setActiveSessionId(sessionId);
    if (isMobile) {
      setSidebarVisible(false);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  return (
    <main className="flex h-screen overflow-hidden relative">
      <AnimatePresence>
        {sidebarVisible && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`${isMobile ? 'absolute z-20 h-full' : 'relative'}`}
          >
            <Sidebar 
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
              onClose={isMobile ? toggleSidebar : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isMobile && !sidebarVisible && (
        <Button 
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full p-2 shadow-md"
          size="icon"
        >
          <Menu size={20} className="text-white" />
        </Button>
      )}
      
      <ChatInterface className="flex-1 w-full" />
    </main>
  );
}
