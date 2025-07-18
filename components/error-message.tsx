'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';

type ErrorMessageProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorMessage({ 
  message = "I'm experiencing technical difficulties. Please try again.",
  onRetry 
}: ErrorMessageProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AlertTriangleIcon className="text-red-500 mb-3 h-10 w-10" />
      
      <h3 className="text-lg font-medium mb-2">Oops!</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCwIcon size={14} />
          Try Again
        </Button>
      )}
    </motion.div>
  );
}
