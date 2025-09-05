
import React from 'react';
import type { Card } from '../types';

interface TarotCardProps {
  card: Card;
  isFlipped: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

const TarotCard: React.FC<TarotCardProps> = ({ card, isFlipped, onClick, style }) => {
  const cardBack = (
    <div className="absolute inset-0 w-full h-full bg-black rounded-xl shadow-lg shadow-black/50 border-2 border-fuchsia-500/50 flex items-center justify-center p-2 [backface-visibility:hidden]">
      <div className="w-full h-full border-2 border-fuchsia-500/50 rounded-lg flex items-center justify-center">
        <svg width="60%" height="60%" viewBox="0 0 100 100" className="text-pink-500/50">
          <path d="M50 0 L61.8 38.2 L100 38.2 L69.1 61.8 L80.9 100 L50 76.4 L19.1 100 L30.9 61.8 L0 38.2 L38.2 38.2 Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );

  const cardFront = (
    <div className="absolute inset-0 w-full h-full bg-black rounded-xl shadow-lg shadow-black/50 border-2 border-pink-400/50 [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden">
      {card.imageUrl ? (
        <div className="relative w-full h-full">
            <img 
                src={`data:image/jpeg;base64,${card.imageUrl}`} 
                alt={card.name} 
                className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 backdrop-blur-sm">
                <p className="font-cinzel text-white text-center text-sm leading-tight tracking-wider">{card.name}</p>
            </div>
        </div>
      ) : (
        <div className="relative w-full h-full border-2 border-pink-400/50 rounded-lg flex flex-col justify-center items-center text-center p-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/60 via-pink-900/10 to-transparent opacity-70"></div>
          <p className="font-cinzel text-pink-100 text-sm leading-tight z-10 animate-pulse">Generando visión...</p>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="w-full h-full cursor-pointer [perspective:1000px]"
      onClick={onClick}
      style={style}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {cardBack}
        {cardFront}
      </div>
    </div>
  );
};

export default TarotCard;