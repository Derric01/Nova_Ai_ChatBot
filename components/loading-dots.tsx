import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LoadingDotsProps = {
  className?: string;
  color?: string;
  size?: "small" | "medium" | "large";
};

const LoadingDots = ({ 
  className, 
  color = "text-primary", 
  size = "medium" 
}: LoadingDotsProps) => {
  const dotSize = {
    small: "w-1 h-1",
    medium: "w-2 h-2",
    large: "w-3 h-3"
  };
  
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [0, -8, 0] }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {[1, 2, 3].map((dot) => (
        <motion.span
          key={dot}
          className={cn(
            "rounded-full bg-current", 
            color, 
            dotSize[size]
          )}
          initial="initial"
          animate="animate"
          variants={dotVariants}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop",
            delay: dot * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default LoadingDots;
