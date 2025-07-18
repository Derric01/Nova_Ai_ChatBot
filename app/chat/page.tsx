'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const handleNewChat = () => {
    setActiveSessionId(null);
  };
  
  const handleSelectChat = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };
  
  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar 
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
      <ChatInterface />
    </main>
  );
}
