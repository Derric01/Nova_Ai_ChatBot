'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BrainCircuitIcon, SparklesIcon, ZapIcon } from 'lucide-react';
import Link from 'next/link';

// Particle component with enhanced effects
const Particle = ({ 
  index, 
  initialX, 
  initialY 
}: { 
  index: number;
  initialX: number;
  initialY: number;
}) => {
  const size = Math.random() * 5 + 2;
  const duration = Math.random() * 15 + 10;
  const delay = index * 0.1;
  
  // Generate a mystical color palette
  const colors = [
    "rgba(139, 92, 246, 0.7)",  // Purple
    "rgba(167, 139, 250, 0.7)",  // Lavender
    "rgba(236, 72, 153, 0.7)",   // Pink
    "rgba(79, 70, 229, 0.7)",    // Indigo
    "rgba(6, 182, 212, 0.7)",    // Cyan
    "rgba(20, 184, 166, 0.7)",   // Teal
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const glowColor = randomColor.replace("0.7", "0.5");
  
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        x: initialX,
        y: initialY,
        background: randomColor,
        boxShadow: `0 0 ${size * 2}px ${glowColor}`
      }}
      animate={{
        x: initialX + (Math.random() * 200 - 100),
        y: initialY + (Math.random() * 200 - 100),
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.5, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        delay,
        ease: "easeInOut"
      }}
    />
  );
};

// Mystical text effect with enhanced animation
const MysticalText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [glowEffect, setGlowEffect] = useState(false);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80); // Slightly faster typing
      
      return () => clearTimeout(timeout);
    } else {
      // Add glow effect after text is fully displayed
      const glowTimeout = setTimeout(() => {
        setGlowEffect(true);
      }, 500);
      
      return () => clearTimeout(glowTimeout);
    }
  }, [currentIndex, text]);
  
  return (
    <div className="relative">
      <h1 
        className={`text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 ${
          glowEffect ? 'animate-text-glow' : ''
        }`}
      >
        {displayText.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.04,
              ease: "easeOut" 
            }}
            className="inline-block"
            whileHover={{ 
              scale: 1.2, 
              color: '#fff',
              textShadow: '0 0 8px rgba(167, 139, 250, 0.8)' 
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: currentIndex < text.length ? Infinity : 0 }}
          className="inline-block ml-1"
        >
          |
        </motion.span>
      </h1>
      {glowEffect && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-indigo-500/10 to-pink-500/0 blur-xl -z-10"
        />
      )}
    </div>
  );
};

export default function LandingPage() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Generate particles based on screen size
    const handleResize = () => {
      const particleCount = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 10000));
      const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      }));
      setParticles(newParticles);
    };
    
    // Track mouse movement for cosmic orb
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-950 to-indigo-950 flex items-center justify-center">
      {/* Particle background */}
      {particles.map(particle => (
        <Particle 
          key={particle.id} 
          index={particle.id} 
          initialX={particle.x} 
          initialY={particle.y} 
        />
      ))}
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6 py-16">
        {/* Cosmic orb that follows mouse movement */}
        <motion.div
          className="fixed w-32 h-32 rounded-full pointer-events-none"
          style={{
            x: mousePosition.x - 64,
            y: mousePosition.y - 64,
            background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(245,208,254,0.2) 50%, rgba(0,0,0,0) 70%)",
            zIndex: 50,
            filter: "blur(8px)"
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse-glow relative">
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
            
            {/* Outer cosmic ring */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ 
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -inset-4 rounded-full border-2 border-indigo-400/20"
              style={{ borderStyle: 'dashed' }}
            />
            
            {/* Small orbiting moons */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute w-4 h-4 rounded-full bg-cyan-400/40 blur-sm"
              style={{ top: '-5%', left: '50%' }}
            />
            
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute w-3 h-3 rounded-full bg-pink-400/40 blur-sm"
              style={{ bottom: '-5%', right: '50%' }}
            />
            
            <BrainCircuitIcon size={50} className="text-white relative z-10" />
          </div>
          <MysticalText text="Enter the Nova Dimension 🔮" />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-purple-100/90 mb-10 leading-relaxed"
        >
          <span className="block mb-2">
            Unlock the mysteries of knowledge with an AI assistant that transcends ordinary boundaries.
          </span>
          <span className="inline-block px-2 py-1 bg-purple-900/30 rounded-md backdrop-blur-sm text-purple-200 my-2 animate-float">
            ✨ Dive into the cosmic ocean of information ✨
          </span>
          <span className="block mt-2">
            and emerge enlightened with insights from the digital cosmos.
          </span>
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/chat">
            <Button 
              size="lg" 
              className="relative w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 px-8 rounded-full group transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 overflow-hidden"
            >
              {/* Animated background effect */}
              <motion.div 
                className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20"
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
              
              {/* Button content */}
              <div className="flex items-center justify-center">
                <SparklesIcon className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                <span className="text-lg">Begin Your Journey</span>
                <ZapIcon className="ml-2 h-5 w-5 group-hover:animate-pulse" />
              </div>
              
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 -z-5 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%]"
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
            </Button>
          </Link>
        </motion.div>
        
        {/* Floating elements for mystical vibe */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 -right-10 w-60 h-60 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        
        {/* Runes and mystical symbols */}
        <div className="absolute top-20 left-10 text-purple-400/30 text-4xl animate-pulse">⚡</div>
        <div className="absolute bottom-20 right-10 text-indigo-400/30 text-4xl animate-pulse delay-300">⚜️</div>
        <div className="absolute top-1/2 left-5 text-pink-400/30 text-4xl animate-pulse delay-700">✧</div>
        <div className="absolute bottom-10 left-1/2 text-blue-400/30 text-4xl animate-pulse delay-500">⚝</div>
        <div className="absolute top-10 right-20 text-emerald-400/30 text-4xl animate-pulse delay-200">🔮</div>
        <div className="absolute bottom-32 left-20 text-amber-400/30 text-4xl animate-pulse delay-400">✨</div>
        <div className="absolute top-32 right-40 text-violet-400/30 text-4xl animate-pulse delay-600">🌌</div>
        <div className="absolute top-1/4 left-1/3 text-cyan-400/30 text-4xl animate-pulse delay-300">🪄</div>
      </div>
    </div>
  );
}
