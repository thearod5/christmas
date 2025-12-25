import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Text } from '@mantine/core';
import { useLetterInteractionStore } from '../stores/letterInteractionStore';

interface TextBlockProps {
  content: string;
  blockId: string;
}

export default function TextBlock({ content, blockId }: TextBlockProps) {
  const { unlockBlock, isBlockUnlocked } = useLetterInteractionStore();
  const isUnlocked = isBlockUnlocked(blockId);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isUnlocked) {
      unlockBlock(blockId);
    }
  };

  return (
    <Box
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#e0d4c4',
        padding: '1.5rem',
        borderRadius: '8px',
        cursor: isUnlocked ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        transform: isHovered && !isUnlocked ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered && !isUnlocked
          ? '0 4px 12px rgba(0, 0, 0, 0.15)'
          : '0 2px 4px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Locked Overlay */}
      {!isUnlocked && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isHovered ? 0.8 : 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#d5c5b0',
            zIndex: 2,
          }}
        >
          <Text
            size="sm"
            style={{
              color: '#6e5b45',
              fontStyle: 'italic',
              fontWeight: 500,
            }}
          >
            🔒 Click to reveal
          </Text>
        </motion.div>
      )}

      {/* Text Content with Left-to-Right Reveal */}
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={
          isUnlocked
            ? { clipPath: 'inset(0 0% 0 0)' }
            : { clipPath: 'inset(0 100% 0 0)' }
        }
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
        }}
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Text
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.8,
            color: '#6e5b45',
          }}
        >
          {content}
        </Text>
      </motion.div>
    </Box>
  );
}
