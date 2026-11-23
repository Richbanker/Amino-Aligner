import React from 'react';
import { aminoColors } from './aminoColors';

interface AlignmentViewProps {
  seq1: string;
  seq2: string;
  chunkSize?: number; // для адаптивного переноса
  onCopy?: () => void;
}

export const AlignmentView: React.FC<AlignmentViewProps> = ({ seq1, seq2, chunkSize, onCopy }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [adaptiveChunk, setAdaptiveChunk] = React.useState(Math.max(1, chunkSize || 40));

  React.useEffect(() => {
    function handleResize() {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      // Ширина одного символа с padding и margin — примерно 30px.
      const fit = Math.max(1, Math.floor(width / 30));
      setAdaptiveChunk(Math.max(1, Math.min(chunkSize || 40, fit)));
    }
    handleResize();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    if (containerRef.current) observer?.observe(containerRef.current);
    window.addEventListener('resize', handleResize);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [chunkSize]);

  if (!seq1 || !seq2 || seq1.length !== seq2.length) return null;

  // разбиваем на чанки для переноса
  const chunks = Array.from({ length: Math.ceil(seq1.length / adaptiveChunk) }, (_, i) => i * adaptiveChunk);

  // Копирование выделенного текста
  const handleCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (onCopy) onCopy();
  };

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', fontFamily: 'monospace', fontSize: 18, overflowX: 'auto', userSelect: 'text' }}
      onCopy={handleCopy}
      aria-label="alignment-view"
    >
      {chunks.map((start, idx) => (
        <div key={idx} style={{ marginBottom: 4 }}>
          {/* Верхняя строка: для поиска и выделения */}
          <div style={{ display: 'flex', flexWrap: 'nowrap' }} data-align-row="1">
            {seq1.slice(start, start + adaptiveChunk).split('').map((char, i) => (
              <span
                key={i}
                style={{
                  background: aminoColors[char.toUpperCase()] || '#eee',
                  padding: '2px 4px',
                  borderRadius: 4,
                  margin: 1,
                  minWidth: 18,
                  textAlign: 'center',
                  userSelect: 'text',
                }}
                data-align-char={char}
              >
                {char}
              </span>
            ))}
          </div>
          {/* Нижняя строка: для поиска и выделения */}
          <div style={{ display: 'flex', flexWrap: 'nowrap' }} data-align-row="2">
            {seq2.slice(start, start + adaptiveChunk).split('').map((char, i) => {
              const idxGlobal = start + i;
              const isDiff = seq1[idxGlobal].toUpperCase() !== seq2[idxGlobal].toUpperCase();
              return (
                <span
                  key={i}
                  style={{
                    background: isDiff ? '#FFD6D6' : 'transparent',
                    padding: '2px 4px',
                    borderRadius: 4,
                    margin: 1,
                    minWidth: 18,
                    textAlign: 'center',
                    userSelect: 'text',
                  }}
                  data-align-char={char}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}; 