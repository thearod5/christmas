import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {Box, Paper, Title} from '@mantine/core';
import {useLetterInteractionStore} from '../stores/letterInteractionStore';

interface EnvelopeAnimationProps {
  children: React.ReactNode;
  title?: string;
  onAnimationComplete?: () => void;
}

export default function EnvelopeAnimation({children, title, onAnimationComplete}: EnvelopeAnimationProps) {
  const [animationState, setAnimationState] = useState<'closed' | 'opening' | 'open'>('closed');
  const [isHovered, setIsHovered] = useState(false);
  const {openEnvelope} = useLetterInteractionStore();

  const handleClick = () => {
    if (animationState === 'closed') {
      setAnimationState('opening');
    }
  };

  useEffect(() => {
    if (animationState === 'opening') {
      // Mark as fully open after animation completes
      const timer = setTimeout(() => {
        setAnimationState('open');
        openEnvelope();
        onAnimationComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [animationState, onAnimationComplete, openEnvelope]);

  return (
    <Box
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        perspective: '1000px',

      }}
    >
      {/* Envelope Container */}
      <Box
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          cursor: animationState === 'closed' ? 'pointer' : 'default',
          transition: 'transform 0.2s ease',
          transform: isHovered && animationState === 'closed' ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        {/* Envelope Back */}
        <Paper
          shadow={isHovered && animationState === 'closed' ? 'xl' : 'md'}
          style={{
            position: 'absolute',
            width: '100%',
            height: 'min(200px, 45vh)',
            backgroundColor: '#d5c5b0',
            borderRadius: '8px',
            zIndex: 1,
            transition: 'box-shadow 0.2s ease',
          }}
        />

        {/* Letter Content - Only render when opening or open */}
        {(animationState === 'opening' || animationState === 'open') && (
          <motion.div
            initial={{y: 0, opacity: 0}}
            animate={{y: -50, opacity: 1}}
            transition={{
              delay: 0.8,
              duration: 1.2,
              ease: 'easeOut',
            }}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
            }}
          >
            <Paper
              shadow="lg"
              style={{
                backgroundColor: '#f9f6f2',
                padding: 'clamp(1rem, 4vw, 2rem)',
                borderRadius: '8px',
                minHeight: 'min(400px, 45vh)',
              }}
            >
              <motion.div
                initial={{opacity: 0}}
                animate={animationState === 'open' ? {opacity: 1} : {opacity: 0}}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                }}
              >
                {children}
              </motion.div>
            </Paper>
          </motion.div>
        )}

        {/* Envelope Flap */}
        <motion.div
          initial={{rotateX: 0}}
          animate={
            animationState === 'opening' || animationState === 'open'
              ? {rotateX: -180}
              : {rotateX: 0}
          }
          transition={{
            duration: 1.0,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 'min(150px, 22vh)',
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            zIndex: 3,
          }}
        >
          <Paper
            shadow="md"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#c9b69c',
              borderRadius: '8px 8px 0 0',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: '5rem',
            }}
          >
            {/* Title on Flap */}
            {title && (
              <Title
                order={2}
                style={{
                  color: '#6e5b45',
                  fontWeight: 500,
                  fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                  textAlign: 'center',
                  maxWidth: '70%',
                  backfaceVisibility: 'hidden',
                }}
              >
                {title}
              </Title>
            )}
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}
