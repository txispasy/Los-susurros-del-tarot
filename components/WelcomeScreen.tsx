import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-white p-8">
      <h1 className="font-cinzel text-5xl md:text-7xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-500 to-rose-500">
        Los Susurros del Tarot
      </h1>
      <p className="mt-4 text-lg md:text-xl text-pink-200 max-w-2xl">
        Cierra los ojos, respira profundo y concentra tu energía. El universo tiene un mensaje para ti.
      </p>
      <button
        onClick={onStart}
        className="mt-12 flex items-center gap-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-pink-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        <SparklesIcon className="w-5 h-5" />
        Comenzar Lectura
      </button>
    </div>
  );
};

export default WelcomeScreen;