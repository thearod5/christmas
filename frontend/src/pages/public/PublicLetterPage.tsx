import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack, Box } from '@mantine/core';
import { useLetterStore } from '../../stores/letterStore';
import { useLetterInteractionStore } from '../../stores/letterInteractionStore';
import EnvelopeAnimation from '../../components/EnvelopeAnimation';
import LetterHeader from '../../components/LetterHeader';
import LetterContent from '../../components/LetterContent';
import CloseButton from '../../components/CloseButton';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';

export default function PublicLetterPage() {
  const { slug } = useParams<{ slug: string }>();
  const { currentLetter, isLoading, error, fetchPublicLetter } = useLetterStore();
  const { reset } = useLetterInteractionStore();
  const [envelopeKey, setEnvelopeKey] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchPublicLetter(slug);
    }
  }, [slug, fetchPublicLetter]);

  const handleCloseLetter = () => {
    reset();
    setEnvelopeKey((prev) => prev + 1);
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!currentLetter) return <ErrorState message="Letter not found" title="Not Found" />;

  return (
    <Box
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(0.5rem, 3vw, 2rem)',
      }}
    >
      <Container size="lg" style={{ width: '100%', maxWidth: '900px' }}>
        <Stack gap="xl" align="center">
          <EnvelopeAnimation key={envelopeKey} title={currentLetter.title}>
            <Stack gap="lg">
              <LetterHeader
                recipientName={currentLetter.recipient_name}
                description={currentLetter.description}
              />
              <LetterContent
                contentBlocks={currentLetter.content_blocks}
                envelopeKey={envelopeKey}
              />
            </Stack>
          </EnvelopeAnimation>

          <CloseButton onClose={handleCloseLetter} />
        </Stack>
      </Container>
    </Box>
  );
}
