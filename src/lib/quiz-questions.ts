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
  answerKey:
    | 'ageRange'
    | 'fitnessLevel'
    | 'timePerDay'
    | 'mainGoal'
    | 'problemAreas'
    | 'workoutLocation'
    | 'workoutTypes'
    | 'dietExperience'
    | 'dietaryRestrictions'
    | 'menopauseSymptoms';
  type?: 'radio' | 'checkbox' | 'slider';
  questionSubtitle?: string;
}

const smilingFitnessWoman = PlaceHolderImages.find(img => img.id === 'smiling-fitness-woman-1');
if (!smilingFitnessWoman) {
  throw new Error("Placeholder image 'smiling-fitness-woman-1' not found.");
}

const bodyGoalsWoman = PlaceHolderImages.find(img => img.id === 'body-goals-1');
if (!bodyGoalsWoman) {
    throw new Error("Placeholder image 'body-goals-1' not found.");
}


export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionText: 'Qual sua idade?',
    answerKey: 'ageRange',
    type: 'radio',
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
    questionText: '🎯 Qual é o seu maior objetivo hoje?',
    answerKey: 'mainGoal',
    type: 'radio',
    options: [
      { text: '🔥 Perder peso', value: 'Lose weight' },
      { text: '💪 Manter o peso e ficar em forma', value: 'Maintain weight and get in shape' },
      { text: '😴 Melhorar o sono e reduzir o estresse', value: 'Improve sleep and reduce stress' },
      { text: '🌟 Ter mais disposição e energia', value: 'Have more disposition and energy' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q4-multiselect',
    questionText: '🤔 Quais desses sintomas da menopausa você sente?',
    questionSubtitle: 'Selecione as opções que você mais se identifica:',
    answerKey: 'menopauseSymptoms',
    type: 'checkbox',
    options: [
        { text: '🔥 Ondas de calor', value: 'Hot flashes' },
        { text: '😴 Problemas de sono', value: 'Sleep problems' },
        { text: '😩 Falta de energia', value: 'Lack of energy' },
        { text: '😵 Mudanças de humor', value: 'Mood swings' },
        { text: '🤕 Dor nas articulações', value: 'Joint pain' },
        { text: '📈 Ganho de peso', value: 'Weight gain' },
        { text: 'Outros', value: 'Others' }
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q5-multiselect',
    questionText: '😣 O que mais te incomoda no seu corpo?',
    questionSubtitle: 'Selecione as opções que você mais se identifica:',
    answerKey: 'problemAreas',
    type: 'checkbox',
    options: [
        { text: 'Barriga', value: 'Belly' },
        { text: 'Braços flácidos', value: 'Flabby arms' },
        { text: 'Nádegas flácidas', value: 'Sagging buttocks' },
        { text: 'Gordura nos joelhos', value: 'Knee fat' },
        { text: 'Seios caídos', value: 'Sagging breasts' },
        { text: 'Queixo duplo', value: 'Double chin' },
        { text: 'Traseiro de alforje', value: 'Saddlebag butt' },
        { text: 'Nenhuma delas', value: 'None of them' }
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q6',
    questionText: '🤩 Qual desses corpos você mais deseja?',
    answerKey: 'fitnessLevel',
    type: 'radio',
    options: [
      { text: 'Em forma e saudável', value: 'Fit and healthy' },
      { text: 'Curvas bem definidas', value: 'Well-defined curves' },
      { text: 'Magra', value: 'Slim' },
      { text: 'Normal', value: 'Normal' },
      { text: 'Estou bem assim', value: 'I\'m fine like this' }
    ],
    imagePlaceholder: bodyGoalsWoman,
  },
  {
    id: 'q7',
    questionText: '😢 Você sente dores?',
    questionSubtitle: 'Selecione as opções que você mais se identifica:',
    answerKey: 'workoutTypes',
    type: 'checkbox',
    options: [
      { text: 'Costas', value: 'Back' },
      { text: 'Quadril', value: 'Hips' },
      { text: 'Joelhos', value: 'Knees' },
      { text: 'Nenhuma', value: 'None' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q8',
    questionText: 'Quanto você pesa?',
    answerKey: 'dietExperience',
    type: 'slider',
    options: [],
    imagePlaceholder: smilingFitnessWoman,
  },
];

    