
import React from 'react';
import TarotCard from './TarotCard';
import type { Card } from '../types';

interface ReadingGridProps {
  cards: Card[];
  flippedStates: boolean[];
  onCardClick: (index: number) => void;
  dealFinished: boolean;
}

const ReadingGrid: React.FC<ReadingGridProps> = ({ cards, flippedStates, onCardClick, dealFinished }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-3 gap-4 md:gap-8 [perspective:1200px]">
        {cards.map((card, index) => (
          <div key={card.id} className="aspect-[2/3]">
             <TarotCard
                card={card}
                isFlipped={flippedStates[index]}
                onClick={() => onCardClick(index)}
                style={{
                    transition: `transform 1s ${index * 0.1}s, opacity 0.5s ${index * 0.1}s`,
                    transform: dealFinished ? 'translateZ(0px)' : 'translateZ(-1000px)',
                    opacity: dealFinished ? 1 : 0,
                }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingGrid;
