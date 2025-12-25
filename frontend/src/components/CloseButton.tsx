import { Box, Text } from '@mantine/core';
import { useLetterInteractionStore } from '../stores/letterInteractionStore';

interface CloseButtonProps {
  onClose: () => void;
}

export default function CloseButton({ onClose }: CloseButtonProps) {
  const { isEnvelopeOpen } = useLetterInteractionStore();

  if (!isEnvelopeOpen) return null;

  return (
    <Box style={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}>
      <Text
        onClick={onClose}
        style={{
          color: '#6e5b45',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          textDecoration: 'underline',
          transition: 'opacity 0.2s ease',
          display: 'inline-block',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Close letter
      </Text>
    </Box>
  );
}
