import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Paper, Box, Text, Title } from '@mantine/core';
import { useLetterInteractionStore } from '../stores/letterInteractionStore';

interface EnvelopeAnimationProps {
  children: React.ReactNode;
  title?: string;
  onAnimationComplete?: () => void;
}

export default function EnvelopeAnimation({ children, title, onAnimationComplete }: EnvelopeAnimationProps) {
  const [animationState, setAnimationState] = useState<'closed' | 'opening' | 'open'>('closed');
  const [isHovered, setIsHovered] = useState(false);
  const { openEnvelope } = useLetterInteractionStore();

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
          minHeight: 'min(400px, 45vh)',
          cursor: animationState === 'closed' ? 'pointer' : 'default',
          transition: 'transform 0.2s ease',
          transform: isHovered && animationState === 'closed' ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        {/* Envelope Back */}
        <Paper
          shadow={isHovered && animationState === 'closed' ? 'xl' : 'md'}
          style={{
            position: 'absolute',
            width: '100%',
            height: 'min(400px, 45vh)',
            backgroundColor: '#d5c5b0',
            borderRadius: '8px',
            zIndex: 1,
            transition: 'box-shadow 0.2s ease',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 'clamp(1.5rem, 8%, 3rem)',
            padding: '1rem',
          }}
        >
          {/* Title on Envelope */}
          {title && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={
                animationState === 'opening' || animationState === 'open'
                  ? { opacity: 0 }
                  : { opacity: 1 }
              }
              transition={{ duration: 0.3 }}
              style={{
                textAlign: 'center',
                maxWidth: '80%',
              }}
            >
              <Title
                order={2}
                style={{
                  color: '#6e5b45',
                  fontWeight: 500,
                  fontSize: 'clamp(1.25rem, 5vw, 2rem)',
                }}
              >
                {title}
              </Title>
            </motion.div>
          )}
        </Paper>

        {/* Letter Content */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={
            animationState === 'opening' || animationState === 'open'
              ? { y: -50, opacity: 1 }
              : { y: 0, opacity: 0 }
          }
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
              initial={{ opacity: 0 }}
              animate={
                animationState === 'open' ? { opacity: 1 } : { opacity: 0 }
              }
              transition={{
                delay: 0.5,
                duration: 0.8,
              }}
            >
              {children}
            </motion.div>
          </Paper>
        </motion.div>

        {/* Envelope Flap */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={
            animationState === 'opening' || animationState === 'open'
              ? { rotateX: -180 }
              : { rotateX: 0 }
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
            }}
          />
        </motion.div>

        {/* Click Hint */}
        {animationState === 'closed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '-3rem',
              width: '100%',
              textAlign: 'center',
              zIndex: 4,
            }}
          >
            <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
              Click to open your letter
            </Text>
          </motion.div>
        )}
      </Box>
    </Box>
  );
}
