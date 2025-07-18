'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusIcon, Code2Icon, BrainCircuitIcon, LayoutDashboardIcon, X } from 'lucide-react';
import { dummyConversations, ChatSession } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

type SidebarProps = {
  onNewChat?: () => void;
  onSelectChat?: (sessionId: string) => void;
  onClose?: () => void;
};

export function Sidebar({ onNewChat, onSelectChat, onClose }: SidebarProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(dummyConversations);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNewChat = () => {
    onNewChat?.();
    setActiveSessionId(null);
  };

  const handleSelectChat = (sessionId: string) => {
    setActiveSessionId(sessionId);
    onSelectChat?.(sessionId);
  };

  // For small screens, collapse sidebar automatically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div 
      className={`h-full bg-gradient-to-b from-purple-950 to-indigo-950 border-r border-purple-500/20 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} relative overflow-hidden`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-1/4 -left-10 w-40 h-40 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 -right-10 w-40 h-40 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="p-4 border-b border-purple-500/20 flex justify-between items-center relative z-10">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              <Button 
                onClick={handleNewChat} 
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all relative overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20" 
                  animate={{ 
                    x: ['-100%', '100%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "linear" 
                  }}
                />
                <PlusIcon size={16} className="relative z-10" />
                <span className="relative z-10">New Chat</span>
              </Button>
            </motion.div>
          )}
          
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mx-auto"
            >
              <Button 
                onClick={handleNewChat} 
                size="icon"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                <PlusIcon size={18} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center">
          {onClose && (
            <motion.button
              className="p-2 rounded-md hover:bg-purple-800/30 ml-2 text-purple-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={16} />
            </motion.button>
          )}
          
          <motion.button
            className="p-2 rounded-md hover:bg-purple-800/30 ml-2 text-purple-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <LayoutDashboardIcon size={16} />
          </motion.button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2 relative z-10">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium text-purple-300/80 mb-2 px-2 tracking-wider"
              >
                ✧ RECENT CHATS ✧
              </motion.h3>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {chatSessions.map((session, idx) => {
              const firstMessage = session.messages[0];
              const previewText = firstMessage?.content.slice(0, 40) + '...';
              
              return (
                <motion.div
                  key={session.sessionId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card 
                    className={`${isCollapsed ? 'p-2 mx-auto w-14' : 'p-3'} cursor-pointer transition-all shadow-sm hover:shadow-md backdrop-blur-sm relative overflow-hidden border-purple-500/20
                      ${activeSessionId === session.sessionId 
                        ? 'bg-gradient-to-r from-purple-800/40 to-indigo-800/40 shadow-md shadow-purple-500/20' 
                        : 'hover:bg-purple-900/30 bg-purple-950/40'}
                    `}
                    onClick={() => handleSelectChat(session.sessionId)}
                  >
                    {activeSessionId === session.sessionId && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10"
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        style={{
                          backgroundSize: "200% 200%",
                        }}
                      />
                    )}
                    
                    {isCollapsed ? (
                      <div className="flex justify-center">
                        <motion.div
                          animate={{ 
                            rotate: activeSessionId === session.sessionId ? 360 : 0,
                          }}
                          transition={{ 
                            duration: activeSessionId === session.sessionId ? 10 : 0, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                        >
                          <Code2Icon size={20} className="text-purple-300" />
                        </motion.div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 relative z-10">
                        <motion.div
                          animate={{ 
                            rotate: activeSessionId === session.sessionId ? 360 : 0,
                          }}
                          transition={{ 
                            duration: activeSessionId === session.sessionId ? 10 : 0, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                          className="mt-1"
                        >
                          <Code2Icon size={16} className="text-purple-300" />
                        </motion.div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-1 text-purple-200">
                            {firstMessage?.content.split('?')[0]?.slice(0, 20)}?
                          </h4>
                          <p className="text-xs text-purple-300/70 line-clamp-1">
                            {previewText}
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      <div className={`p-4 border-t mt-auto ${isCollapsed ? 'text-center' : ''}`}>
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-t-[1px] border-r-[1px] border-purple-400/30"
                    />
                    <BrainCircuitIcon size={16} className="text-purple-400 relative z-10" />
                  </div>
                  <div className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Nova</div>
                </div>
                <div className="text-xs text-purple-300/50">v1.0.0</div>
              </div>
              <p className="text-xs text-purple-300/70 mt-1">
                Mystical AI companion using Gemini
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex justify-center"
            >
              <BrainCircuitIcon size={20} className="text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}