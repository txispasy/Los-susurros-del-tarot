import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface LoaderProps {
  text: string;
  progress?: number;
  total?: number;
}

const Loader: React.FC<LoaderProps> = ({ text, progress, total }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-pink-200">
      <SparklesIcon className="w-16 h-16 animate-pulse text-pink-300" />
      <p className="mt-4 text-xl font-cinzel tracking-wider">
        {text}
        {progress !== undefined && total !== undefined && ` (${progress}/${total})`}
      </p>
    </div>
  );
};

export default Loader;