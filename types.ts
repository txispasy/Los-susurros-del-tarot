
export interface Card {
  id: number;
  name: string;
  imageUrl?: string;
}

export type GameState = 'welcome' | 'questions' | 'shuffling' | 'generatingImages' | 'reading' | 'interpreting' | 'results' | 'history';

export interface Reading {
  id: string;
  date: string;
  questions: string[];
  cards: Card[];
  interpretations: ReadingInterpretations;
}

export interface ReadingInterpretations {
  fila1_interpretacion: string;
  fila2_interpretacion: string;
  fila3_interpretacion: string;
  sintesis_global: string;
}