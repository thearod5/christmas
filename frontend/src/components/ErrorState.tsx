import { Container, Alert } from '@mantine/core';

interface ErrorStateProps {
  message: string;
  title?: string;
}

export default function ErrorState({ message, title = 'Error' }: ErrorStateProps) {
  return (
    <Container size="md" style={{ marginTop: '2rem' }}>
      <Alert color="red" title={title}>
        {message}
      </Alert>
    </Container>
  );
}
