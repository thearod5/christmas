import { Box, Container, Title, Text, Button, Stack, Center, Paper } from '@mantine/core';
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
        backgroundColor: '#f4ede4', // Very light beige background
        padding: '2rem',
      }}
    >
      <Container size="md">
        <Center>
          <Paper
            shadow="md"
            style={{
              backgroundColor: '#f9f6f2', // Lightest beige
              padding: '3rem 2rem',
              borderRadius: '12px',
              maxWidth: '700px',
            }}
          >
            <Stack gap="xl" align="center" style={{ textAlign: 'center' }}>
              <Box>
                <Title
                  order={1}
                  size="3.5rem"
                  style={{
                    color: '#6e5b45', // Dark beige
                    fontWeight: 600,
                    marginBottom: '1.5rem',
                  }}
                >
                  Letter Delivery
                </Title>
                <Text
                  size="xl"
                  style={{
                    color: '#8e7559', // Medium-dark beige
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: 1.8,
                  }}
                >
                  Create and share beautifully presented letters with your loved ones.
                  A personal way to express your thoughts and feelings.
                </Text>
              </Box>

              <Stack gap="md" style={{ marginTop: '2rem' }}>
                <Button
                  size="lg"
                  style={{
                    backgroundColor: '#d5c5b0', // Medium beige
                    color: '#6e5b45', // Dark beige text
                    fontSize: '1.1rem',
                    padding: '1rem 2.5rem',
                    fontWeight: 600,
                    border: 'none',
                  }}
                  onClick={() => navigate('/admin/login')}
                  styles={{
                    root: {
                      '&:hover': {
                        backgroundColor: '#c9b69c', // Warm beige on hover
                      },
                    },
                  }}
                >
                  Admin Login
                </Button>
                <Text size="sm" style={{ color: '#a88f6f' }}>
                  Have a letter to read? Use the link provided to you.
                </Text>
              </Stack>
            </Stack>
          </Paper>
        </Center>
      </Container>
    </Box>
  );
}