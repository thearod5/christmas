import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLetterStore } from '../../stores/letterStore';
import { useLetterTypeStore } from '../../stores/letterTypeStore';

export default function LetterFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentLetter, fetchLetter, createLetter, updateLetter, isLoading, error } = useLetterStore();
  const { letterTypes, fetchLetterTypes } = useLetterTypeStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [letterTypeId, setLetterTypeId] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [contentBlocks, setContentBlocks] = useState<Array<{ block_type: 'text'; order: number; content: { text: string } }>>([]);

  useEffect(() => {
    fetchLetterTypes();
    if (id) {
      fetchLetter(id);
    }
  }, [id, fetchLetter, fetchLetterTypes]);

  useEffect(() => {
    if (currentLetter && 'letter_type' in currentLetter) {
      setTitle(currentLetter.title);
      setDescription(currentLetter.description);
      setRecipientName(currentLetter.recipient_name);
      setLetterTypeId(currentLetter.letter_type.id);
      setIsPublished(currentLetter.is_published);
      setContentBlocks(
        currentLetter.content_blocks.map((block, index) => ({
          block_type: 'text',
          order: index,
          content: block.content as { text: string },
        }))
      );
    }
  }, [currentLetter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title,
        description,
        recipient_name: recipientName,
        letter_type_id: letterTypeId,
        is_published: isPublished,
        content_blocks: contentBlocks,
      };

      if (id) {
        await updateLetter(id, data);
      } else {
        await createLetter(data);
      }
      navigate('/admin/letters');
    } catch (err) {
      // Error handled by store
    }
  };

  const addTextBlock = () => {
    setContentBlocks([...contentBlocks, { block_type: 'text', order: contentBlocks.length, content: { text: '' } }]);
  };

  const updateBlock = (index: number, text: string) => {
    const updated = [...contentBlocks];
    updated[index].content.text = text;
    setContentBlocks(updated);
  };

  const removeBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>{id ? 'Edit Letter' : 'Create New Letter'}</h1>
      <Link to="/admin/letters">
        <button style={{ marginBottom: '20px' }}>Back to Letters</button>
      </Link>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Recipient Name:
            <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Letter Type:
            <select value={letterTypeId} onChange={(e) => setLetterTypeId(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
              <option value="">Select a type</option>
              {letterTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Published
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>Content Blocks</h3>
          {contentBlocks.map((block, index) => (
            <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
              <textarea value={block.content.text} onChange={(e) => updateBlock(index, e.target.value)} placeholder="Enter text..." style={{ width: '100%', minHeight: '60px', marginBottom: '5px' }} />
              <button type="button" onClick={() => removeBlock(index)}>
                Remove Block
              </button>
            </div>
          ))}
          <button type="button" onClick={addTextBlock}>
            Add Text Block
          </button>
        </div>

        <button type="submit" disabled={isLoading} style={{ padding: '10px 20px' }}>
          {isLoading ? 'Saving...' : id ? 'Update Letter' : 'Create Letter'}
        </button>
      </form>
    </div>
  );
}
