import TextBlock from './TextBlock';
import type { ContentBlock } from '../types/index';

interface LetterContentProps {
  contentBlocks: ContentBlock[];
  envelopeKey: number;
}

export default function LetterContent({ contentBlocks, envelopeKey }: LetterContentProps) {
  return (
    <>
      {contentBlocks.map((block, index) => (
        <div key={`${envelopeKey}-${block.id}-${index}`}>
          {block.block_type === 'text' && (
            <TextBlock
              key={`textblock-${envelopeKey}-${block.id}`}
              content={block.content.text}
              blockId={block.id.toString()}
            />
          )}
        </div>
      ))}
    </>
  );
}
