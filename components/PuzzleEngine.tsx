import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import confetti from 'canvas-confetti';

interface PuzzleEngineProps {
  imageData: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const DIFFICULTY_MAP = {
  easy: 3,
  medium: 6,
  hard: 10,
};

export default function PuzzleEngine({ imageData, difficulty }: PuzzleEngineProps) {
  const [img] = useImage(imageData);
  const stageRef = useRef<any>(null);
  const [pieces, setPieces] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);

  const rowsCols = DIFFICULTY_MAP[difficulty];

  useEffect(() => {
    if (!img) return;

    const width = 800;
    const height = 800;
    const pieceW = width / rowsCols;
    const pieceH = height / rowsCols;

    const newPieces = [];

    for (let row = 0; row < rowsCols; row++) {
      for (let col = 0; col < rowsCols; col++) {
        const x = col * pieceW;
        const y = row * pieceH;

        newPieces.push({
          id: `${row}-${col}`,
          srcX: x,
          srcY: y,
          x: Math.random() * (width - pieceW),
          y: Math.random() * (height - pieceH),
          correctX: x,
          correctY: y,
          width: pieceW,
          height: pieceH,
          matched: false,
        });
      }
    }

    setPieces(newPieces);
  }, [img, rowsCols]);

  const handleDragEnd = (e: any, id: string) => {
    const newPieces = pieces.map((p) => {
      if (p.id !== id) return p;

      const threshold = 20;
      const isClose =
        Math.abs(e.target.x() - p.correctX) < threshold &&
        Math.abs(e.target.y() - p.correctY) < threshold;

      if (isClose) {
        e.target.position({ x: p.correctX, y: p.correctY });
        e.target.draggable(false);
        return { ...p, matched: true };
      }

      return { ...p, x: e.target.x(), y: e.target.y() };
    });

    setPieces(newPieces);

    if (newPieces.every((p) => p.matched) && !completed) {
      setCompleted(true);
      confetti({ particleCount: 100, spread: 70 });
      alert("🎉 Puzzle completed!");
    }
  };

  return (
    <div>
      <Stage width={800} height={800} ref={stageRef}>
        <Layer>
          {pieces.map((piece, i) => (
            <KonvaImage
              key={i}
              image={img}
              x={piece.x}
              y={piece.y}
              width={piece.width}
              height={piece.height}
              draggable={!piece.matched}
              crop={{
                x: piece.srcX,
                y: piece.srcY,
                width: piece.width,
                height: piece.height,
              }}
              onDragEnd={(e) => handleDragEnd(e, piece.id)}
              shadowColor="black"
              shadowBlur={piece.matched ? 0 : 10}
              shadowOffset={{ x: 3, y: 3 }}
              shadowOpacity={0.4}
            />
          ))}
        </Layer>
      </Stage>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => window.location.reload()}>🔁 Reset Puzzle</button>
      </div>
    </div>
  );
}