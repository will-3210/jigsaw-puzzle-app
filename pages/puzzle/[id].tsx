import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const PuzzleEngine = dynamic(() => import('../../components/PuzzleEngine'), { ssr: false });

export default function PuzzlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [puzzleData, setPuzzleData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const data = localStorage.getItem(id as string);
      if (data) {
        setPuzzleData(JSON.parse(data));
      }
    }
  }, [id]);

  if (!puzzleData) return <div>Loading puzzle...</div>;

  return (
    <div>
      <h1>Puzzle - {puzzleData.difficulty}</h1>
      <PuzzleEngine imageData={puzzleData.imageData} difficulty={puzzleData.difficulty} />
    </div>
  );
}