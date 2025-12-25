import { Stack, Text } from '@mantine/core';

interface LetterHeaderProps {
  recipientName: string;
  description?: string;
}

export default function LetterHeader({ recipientName, description }: LetterHeaderProps) {
  return (
    <Stack gap="md">
      <Text size="lg" style={{ color: '#6e5b45', fontWeight: 500 }}>
        To: {recipientName}
      </Text>
      {description && (
        <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
          {description}
        </Text>
      )}
    </Stack>
  );
}
