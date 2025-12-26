import { Box, Container, Title, Text, Button, Stack, Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
      }}
    >
      <Container size="md">
        <Center>
          <Stack gap="xl" align="center" style={{ textAlign: 'center' }}>
            <Box>
              <Title
                order={1}
                size="3.5rem"
                style={{
                  color: 'white',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Letter Delivery
              </Title>
              <Text
                size="xl"
                style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  maxWidth: '600px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                Create and share beautifully presented letters with your loved ones.
                A personal way to express your thoughts and feelings.
              </Text>
            </Box>

            <Stack gap="md" style={{ marginTop: '2rem' }}>
              <Button
                size="lg"
                variant="white"
                color="dark"
                style={{
                  fontSize: '1.1rem',
                  padding: '1rem 2.5rem',
                  fontWeight: 600,
                }}
                onClick={() => navigate('/admin/login')}
              >
                Admin Login
              </Button>
              <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Have a letter to read? Use the link provided to you.
              </Text>
            </Stack>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
}