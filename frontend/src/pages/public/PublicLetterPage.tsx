import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Box, Container, Stack} from '@mantine/core';
import {useLetterStore} from '../../stores/letterStore';
import {useLetterInteractionStore} from '../../stores/letterInteractionStore';
import EnvelopeAnimation from '../../components/EnvelopeAnimation';
import LetterHeader from '../../components/LetterHeader';
import LetterContent from '../../components/LetterContent';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';


export default function PublicLetterPage() {
  const {slug} = useParams<{ slug: string }>();
  const {currentLetter, isLoading, error, fetchPublicLetter} = useLetterStore();
  const {reset} = useLetterInteractionStore();
  const [envelopeKey, setEnvelopeKey] = useState(0);

  useEffect(() => {
    if (slug) {
      // Reset interaction state and envelope when navigating to a letter
      reset();
      setEnvelopeKey((prev) => prev + 1);
      fetchPublicLetter(slug);
    }

    // Cleanup: reset state when component unmounts
    return () => {
      reset();
    };
  }, [slug, fetchPublicLetter, reset]);


  if (isLoading) return <LoadingState/>;
  if (error) return <ErrorState message={error}/>;
  if (!currentLetter) return <ErrorState message="Letter not found" title="Not Found"/>;

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: "2rem",
        width: '85%',
      }}
    >
      <Container size="lg" style={{width: '100%', maxWidth: '500px'}}>
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
        </Stack>
      </Container>
    </Box>
  );
}
