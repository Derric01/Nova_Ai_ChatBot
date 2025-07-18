'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { SendIcon, User2Icon, BrainCircuitIcon, Sparkles } from 'lucide-react';
import { ChatMessage, getDummyConversation } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';
import { useTypingEffect, useFadeIn } from '@/lib/animation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';

// Helper component for message bubbles with animation
const MessageBubble = ({ message, index }: { message: ChatMessage; index: number }) => {
  const isUser = message.role === 'user';
  const fadeProps = useFadeIn(index * 100);
  
  const messageBubbleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      x: isUser ? 20 : -20 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      x: 0
    }
  };

  // Define the transition separately to avoid type errors
  const messageBubbleTransition = { 
    type: "spring" as const, 
    stiffness: 300, 
    damping: 30,
    delay: index * 0.1 
  };
  
  return (
    <motion.div 
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
      initial="hidden"
      animate="visible"
      variants={messageBubbleVariants}
      transition={messageBubbleTransition}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-400/30"
          />
          <BrainCircuitIcon size={20} className="text-white relative z-10" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : 'order-last'}`}>
        <Card className={`${
          isUser 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg border-none' 
            : 'shadow-md border border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm'
          } overflow-hidden relative`}>
          {!isUser && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-pink-500/5"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            />
          )}
          <CardContent className={`p-4 ${isUser ? '' : 'relative'}`}>
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="text-sm prose dark:prose-invert max-w-none relative z-10">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
                <motion.div 
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <div className="text-purple-300">
                    <Sparkles size={14} />
                  </div>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 relative overflow-hidden">
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
          <User2Icon size={20} className="text-white relative z-10" />
        </div>
      )}
    </motion.div>
  );
};

// Loading animation component
const TypingIndicator = () => (
  <motion.div 
    className="flex justify-start my-4 ml-12"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 px-4 py-3 rounded-lg flex gap-2 border border-purple-500/20 shadow-inner backdrop-blur-sm">
      <motion.div 
        className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" 
        animate={{ 
          y: [0, -5, 0],
          boxShadow: ['0 0 0px rgba(168, 85, 247, 0.5)', '0 0 8px rgba(168, 85, 247, 0.8)', '0 0 0px rgba(168, 85, 247, 0.5)']
        }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0 }}
      />
      <motion.div 
        className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" 
        animate={{ 
          y: [0, -5, 0],
          boxShadow: ['0 0 0px rgba(129, 140, 248, 0.5)', '0 0 8px rgba(129, 140, 248, 0.8)', '0 0 0px rgba(129, 140, 248, 0.5)']
        }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.div 
        className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400" 
        animate={{ 
          y: [0, -5, 0],
          boxShadow: ['0 0 0px rgba(236, 72, 153, 0.5)', '0 0 8px rgba(236, 72, 153, 0.8)', '0 0 0px rgba(236, 72, 153, 0.5)']
        }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.4 }}
      />
    </div>
  </motion.div>
);

// Welcome Screen Animation
const WelcomeScreen = () => {
  return (
    <motion.div 
      className="h-full flex items-center justify-center text-center p-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Cosmic background elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
      
      <div className="max-w-md z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse-glow relative">
            {/* Cosmic rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-400/30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-1 rounded-full border-b-2 border-l-2 border-pink-400/40"
            />
            <BrainCircuitIcon size={50} className="text-white relative z-10" />
          </div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Welcome to Nova Dimension
        </motion.h2>
        
        <motion.p 
          className="text-purple-100/90 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          I'm your mystical AI companion — ready to unlock knowledge, explore ideas, and guide you through the cosmic ocean of information ✨
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="text-sm text-purple-300/80 bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 shadow-inner backdrop-blur-sm">
            <p className="mb-2">Try asking about:</p>
            <div className="space-y-2">
              <div className="flex items-center"><span className="mr-2 text-indigo-400">🌌</span>"Tell me an interesting fact about space"</div>
              <div className="flex items-center"><span className="mr-2 text-indigo-400">💫</span>"What are some creative ways to solve problems?"</div>
              <div className="flex items-center"><span className="mr-2 text-indigo-400">✨</span>"How can I improve my productivity?"</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Load demo conversation to start
  useEffect(() => {
    const demoChat = getDummyConversation('demo-1');
    if (demoChat) {
      setMessages(demoChat.messages);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Make API call to our endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          chatHistory: messages,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok && !data.response) {
        throw new Error('Failed to get response');
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || "I'm sorry, I'm having trouble generating a response right now. Please try again later.",
        timestamp: new Date(data.timestamp || new Date())
      };
      
      // Add a slight delay for a more natural conversation feel
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-purple-950/50 to-indigo-950/50 overflow-hidden relative">
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-1/4 -right-20 w-60 h-60 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 -left-20 w-60 h-60 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 rounded-full blur-3xl pointer-events-none"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
      <motion.div 
        className="absolute top-3/4 left-1/2 w-40 h-40 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      <motion.div 
        className="border-b p-4 bg-gradient-to-r from-purple-900/20 to-indigo-900/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-400/30"
              />
              <BrainCircuitIcon size={22} className="text-primary relative z-10" />
            </div>
            <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Nova AI Assistant</h1>
          </div>
          <ThemeToggle />
        </div>
        <p className="text-sm text-purple-300/70">Your mystical AI companion across dimensions</p>
      </motion.div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div className="space-y-4 pb-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <MessageBubble key={index} message={message} index={index} />
                ))}
                {isLoading && <TypingIndicator />}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>
      
      <motion.div 
        className="border-t p-4 bg-gradient-to-r from-purple-900/20 to-indigo-900/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="max-w-3xl mx-auto flex gap-2 relative">
          {/* Floating symbols */}
          <motion.div 
            className="absolute -top-8 left-6 text-purple-400/20 text-xl"
            animate={{ 
              y: [0, -5, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          >
            ✨
          </motion.div>
          <motion.div 
            className="absolute -top-10 right-12 text-indigo-400/20 text-xl"
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          >
            🔮
          </motion.div>
          
          <Input
            placeholder="Ask Nova anything..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 shadow-md focus-within:ring-2 focus-within:ring-purple-500/30 transition-all border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-indigo-900/30"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 text-white"
          >
            <SendIcon size={18} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}