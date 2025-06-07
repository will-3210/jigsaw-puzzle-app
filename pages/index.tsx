import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleSubmit = async () => {
    if (!image) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      const id = Date.now().toString();
      localStorage.setItem(id, JSON.stringify({ imageData, difficulty }));
      router.push(`/puzzle/${id}`);
    };
    reader.readAsDataURL(image);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload an Image to Create a Puzzle</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.size < 5 * 1024 * 1024) {
            setImage(file);
          } else {
            alert("Image must be smaller than 5MB");
          }
        }}
      />
      <div>
        <label>Difficulty:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button onClick={handleSubmit}>Create Puzzle</button>
    </div>
  );
}