import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TypingCursorProps = {
  className?: string;
  isVisible?: boolean;
};

const TypingCursor = ({ className, isVisible = true }: TypingCursorProps) => {
  if (!isVisible) return null;
  
  return (
    <motion.span
      className={cn(
        "inline-block w-0.5 h-4 -mb-0.5 ml-0.5 bg-current",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        repeatType: "loop",
      }}
    />
  );
};

export default TypingCursor;
