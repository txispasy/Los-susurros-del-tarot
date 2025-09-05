
import React, { useState, useEffect, useCallback } from 'react';
import type { Card, GameState, Reading, ReadingInterpretations } from './types';
import { TAROT_DECK, QUESTION_PROMPTS } from './constants';
import { getTarotInterpretation, generateCardImage } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionScreen from './components/QuestionScreen';
import ReadingGrid from './components/ReadingGrid';
import Loader from './components/Loader';
import SparklesIcon from './components/icons/SparklesIcon';
import HistoryIcon from './components/icons/HistoryIcon';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('welcome');
    const [questions, setQuestions] = useState<string[]>([]);
    const [drawnCards, setDrawnCards] = useState<Card[]>([]);
    const [flippedStates, setFlippedStates] = useState<boolean[]>(new Array(9).fill(false));
    const [interpretations, setInterpretations] = useState<ReadingInterpretations | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<Reading[]>([]);
    const [dealFinished, setDealFinished] = useState(false);
    const [imageGenerationProgress, setImageGenerationProgress] = useState(0);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('tarotHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
        }
    }, []);

    const saveHistory = useCallback((newReading: Reading) => {
        try {
            const updatedHistory = [newReading, ...history].slice(0, 10); // Keep last 10 readings
            setHistory(updatedHistory);
            localStorage.setItem('tarotHistory', JSON.stringify(updatedHistory));
        } catch (e) {
            console.error("Failed to save history to localStorage", e);
        }
    }, [history]);
    
    const handleStart = () => setGameState('questions');

    const handleQuestionsSubmit = (submittedQuestions: string[]) => {
        setGameState('shuffling');
        setQuestions(submittedQuestions);
        setError(null);
        setInterpretations(null);
        setDrawnCards([]);
        setFlippedStates(new Array(9).fill(false));
        setDealFinished(false);
        setImageGenerationProgress(0);

        setTimeout(() => {
            const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
            setDrawnCards(shuffled.slice(0, 9));
            setGameState('generatingImages');
        }, 1000);
    };

    useEffect(() => {
        const generateImages = async () => {
            if (gameState === 'generatingImages' && drawnCards.length === 9) {
                try {
                    const cardsWithImages: Card[] = [];
                    let index = 0;
                    for (const card of drawnCards) {
                        const base64Image = await generateCardImage(card.name);
                        cardsWithImages.push({
                            ...card,
                            imageUrl: base64Image
                        });
                        index++;
                        setImageGenerationProgress(index);
                    }

                    setDrawnCards(cardsWithImages);
                    setGameState('reading');
                    setTimeout(() => setDealFinished(true), 100);
                } catch (err) {
                     setError(err instanceof Error ? err.message : "An unknown error occurred while generating images.");
                     setGameState('questions'); // Go back to questions if image generation fails
                }
            }
        };
        generateImages();
    }, [gameState, drawnCards]);
    
    const handleCardClick = (index: number) => {
        if (gameState !== 'reading') return;
        setFlippedStates(prev => {
            const newFlipped = [...prev];
            newFlipped[index] = !newFlipped[index];
            return newFlipped;
        });
    };

    const handleGetInterpretation = async () => {
        setGameState('interpreting');
        setError(null);
        try {
            const result = await getTarotInterpretation(drawnCards, questions);
            setInterpretations(result);
            setGameState('results');
            const newReading: Reading = {
                id: new Date().toISOString(),
                date: new Date().toLocaleString(),
                questions,
                cards: drawnCards,
                interpretations: result,
            };
            saveHistory(newReading);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setGameState('reading');
        }
    };
    
    const resetReading = () => {
        setGameState('welcome');
    };

    const allCardsFlipped = flippedStates.every(Boolean);

    const renderGameState = () => {
        switch (gameState) {
            case 'welcome':
                return <WelcomeScreen onStart={handleStart} />;
            case 'questions':
                 return (
                    <div>
                        <QuestionScreen onSubmit={handleQuestionsSubmit} />
                        {error && <p className="text-center text-red-400 mt-4">{error}</p>}
                    </div>
                );
            case 'shuffling':
                return <Loader text="Barajando el destino..." />;
            case 'generatingImages':
                return <Loader text="Canalizando las imágenes..." progress={imageGenerationProgress} total={9} />;
            case 'interpreting':
                return <Loader text="Consultando los arcanos..." />;
            case 'history':
                return (
                     <div className="w-full max-w-4xl mx-auto p-4 text-white animate-fade-in">
                        <h2 className="font-cinzel text-3xl text-center text-pink-300 mb-6">Historial de Lecturas</h2>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {history.length > 0 ? history.map(reading => (
                            <div key={reading.id} className="bg-gray-800/50 border border-fuchsia-500/30 p-4 rounded-lg">
                                <p className="font-bold text-pink-200">{reading.date}</p>
                                <p className="text-sm text-gray-300 mt-2">{reading.interpretations.sintesis_global}</p>
                            </div>
                        )) : <p className="text-center text-gray-400">No hay lecturas guardadas.</p>}
                        </div>
                        <div className="text-center mt-8">
                             <button onClick={() => setGameState('welcome')} className="bg-fuchsia-700 hover:bg-fuchsia-600 text-white font-bold py-2 px-6 rounded-full transition-colors">Volver</button>
                        </div>
                    </div>
                );
            case 'reading':
            case 'results':
                return (
                    <div className="w-full flex-grow flex flex-col justify-center animate-fade-in">
                        <ReadingGrid cards={drawnCards} flippedStates={flippedStates} onCardClick={handleCardClick} dealFinished={dealFinished} />
                        {error && <p className="text-center text-red-400 mt-4">{error}</p>}
                        {gameState === 'reading' && allCardsFlipped && dealFinished && (
                            <div className="text-center mt-8">
                                <button onClick={handleGetInterpretation} className="flex items-center gap-3 mx-auto bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-pink-500/30 transition-all duration-300 transform hover:scale-105">
                                    <SparklesIcon className="w-5 h-5"/>
                                    Revelar Interpretación
                                </button>
                            </div>
                        )}
                        {gameState === 'results' && interpretations && (
                            <div className="w-full max-w-4xl mx-auto p-4 mt-4 text-white animate-fade-in">
                                <div className="bg-black/50 backdrop-blur-sm border border-fuchsia-500/30 rounded-xl p-6 space-y-6">
                                    <div>
                                        <h3 className="font-cinzel text-xl text-pink-300 border-b border-fuchsia-500/50 pb-2 mb-2">{questions[0]}</h3>
                                        <p className="text-pink-100 whitespace-pre-wrap">{interpretations.fila1_interpretacion}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-cinzel text-xl text-pink-300 border-b border-fuchsia-500/50 pb-2 mb-2">{questions[1]}</h3>
                                        <p className="text-pink-100 whitespace-pre-wrap">{interpretations.fila2_interpretacion}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-cinzel text-xl text-pink-300 border-b border-fuchsia-500/50 pb-2 mb-2">{questions[2]}</h3>
                                        <p className="text-pink-100 whitespace-pre-wrap">{interpretations.fila3_interpretacion}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-cinzel text-2xl text-fuchsia-300 border-b-2 border-fuchsia-300/50 pb-2 mb-3">Síntesis Global</h3>
                                        <p className="text-pink-100 whitespace-pre-wrap font-semibold">{interpretations.sintesis_global}</p>
                                    </div>
                                </div>
                                <div className="text-center mt-8">
                                    <button onClick={resetReading} className="bg-fuchsia-700 hover:bg-fuchsia-600 text-white font-bold py-2 px-6 rounded-full transition-colors">
                                        Nueva Lectura
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-black bg-gradient-to-br from-black via-fuchsia-950/50 to-pink-950/50 text-white flex flex-col items-center justify-center p-4 relative">
            <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setGameState(gameState === 'history' ? 'welcome' : 'history')} title="History" className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-pink-200 hover:text-white transition-colors">
                    <HistoryIcon className="w-6 h-6"/>
                </button>
            </div>
            {renderGameState()}
        </div>
    );
};

export default App;