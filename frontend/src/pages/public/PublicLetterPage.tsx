import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLetterStore } from '../../stores/letterStore';

export default function PublicLetterPage() {
  const { slug } = useParams<{ slug: string }>();
  const { currentLetter, isLoading, error, fetchPublicLetter } = useLetterStore();

  useEffect(() => {
    if (slug) {
      fetchPublicLetter(slug);
    }
  }, [slug, fetchPublicLetter]);

  if (isLoading) {
    return <div>Loading letter...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentLetter) {
    return <div>Letter not found</div>;
  }

  return (
    <div>
      <h1>{currentLetter.title}</h1>
      <p>To: {currentLetter.recipient_name}</p>
      <p>{currentLetter.description}</p>
      <div>
        {currentLetter.content_blocks.map((block) => (
          <div key={block.id}>
            {block.block_type === 'text' && <p>{block.content.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
