import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export interface QuizOption {
  text: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: QuizOption[];
  imagePlaceholder: ImagePlaceholder;
  answerKey: 'ageRange' | 'fitnessLevel' | 'timePerDay';
}

const smilingFitnessWoman = PlaceHolderImages.find(img => img.id === 'smiling-fitness-woman-1');
if (!smilingFitnessWoman) {
  throw new Error("Placeholder image 'smiling-fitness-woman-1' not found.");
}


export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionText: 'Qual sua idade?',
    answerKey: 'ageRange',
    options: [
      { text: '39-45', value: '39-45' },
      { text: '46-50', value: '46-50' },
      { text: '51-60', value: '51-60' },
      { text: '60+', value: '60+' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q2',
    questionText: 'Qual é o seu nível de condicionamento físico atual?',
    answerKey: 'fitnessLevel',
    options: [
      { text: 'Iniciante', value: 'Beginner' },
      { text: 'Intermediário', value: 'Intermediate' },
      { text: 'Avançado', value: 'Advanced' },
      { text: 'Não faço exercícios', value: 'Not currently exercising' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q3',
    questionText: 'Quanto tempo você pode dedicar aos exercícios por dia?',
    answerKey: 'timePerDay',
    options: [
      { text: 'Menos de 10 minutos', value: 'Less than 10 minutes' },
      { text: '10-20 minutos', value: '10-20 minutes' },
      { text: '20-30 minutos', value: '20-30 minutes' },
      { text: 'Mais de 30 minutos', value: 'More than 30 minutes' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
];
