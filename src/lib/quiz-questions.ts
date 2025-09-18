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
    | 'stressLevel'
    | 'sleepQuality'
    | 'energyLevel'
    | 'motivationLevel'
    | 'healthConditions'
    | 'commitment';
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
    questionText: '🎯 Qual é o seu maior objetivo hoje?',
    answerKey: 'fitnessLevel',
    options: [
      { text: '🔥 Perder peso', value: 'Lose weight' },
      { text: '💪 Manter o peso e ficar em forma', value: 'Maintain weight and get in shape' },
      { text: '😴 Melhorar o sono e reduzir o estresse', value: 'Improve sleep and reduce stress' },
      { text: '🌟 Ter mais disposição e energia', value: 'Have more disposition and energy' },
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
  {
    id: 'q4',
    questionText: 'Qual é o seu principal objetivo de fitness?',
    answerKey: 'mainGoal',
    options: [
      { text: 'Perder peso', value: 'Lose weight' },
      { text: 'Tonificar o corpo', value: 'Tone body' },
      { text: 'Aumentar a energia', value: 'Increase energy' },
      { text: 'Melhorar a saúde geral', value: 'Improve overall health' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q5',
    questionText: 'Quais áreas do corpo você mais gostaria de focar?',
    answerKey: 'problemAreas',
    options: [
      { text: 'Barriga', value: 'Belly' },
      { text: 'Pernas e glúteos', value: 'Legs and glutes' },
      { text: 'Braços e costas', value: 'Arms and back' },
      { text: 'Corpo inteiro', value: 'Full body' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q6',
    questionText: 'Onde você prefere se exercitar?',
    answerKey: 'workoutLocation',
    options: [
      { text: 'Em casa', value: 'At home' },
      { text: 'Na academia', value: 'At the gym' },
      { text: 'Ao ar livre', value: 'Outdoors' },
      { text: 'Uma mistura', value: 'A mix' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q7',
    questionText: 'Que tipo de exercício você mais gosta?',
    answerKey: 'workoutTypes',
    options: [
      { text: 'Cardio (corrida, dança)', value: 'Cardio' },
      { text: 'Força (musculação, pilates)', value: 'Strength' },
      { text: 'Flexibilidade (yoga, alongamento)', value: 'Flexibility' },
      { text: 'Não tenho certeza', value: 'Not sure' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q8',
    questionText: 'Qual é a sua experiência com dietas?',
    answerKey: 'dietExperience',
    options: [
      { text: 'Nenhuma, preciso de ajuda', value: 'None, I need help' },
      { text: 'Já tentei algumas, sem sucesso', value: 'Tried a few without success' },
      { text: 'Tenho algum conhecimento', value: 'I have some knowledge' },
      { text: 'Sigo uma dieta saudável', value: 'I follow a healthy diet' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q9',
    questionText: 'Você tem alguma restrição alimentar?',
    answerKey: 'dietaryRestrictions',
    options: [
      { text: 'Nenhuma', value: 'None' },
      { text: 'Vegetariana/Vegana', value: 'Vegetarian/Vegan' },
      { text: 'Sem glúten', value: 'Gluten-free' },
      { text: 'Sem lactose', value: 'Lactose-free' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q10',
    questionText: 'Como você descreveria seu nível de estresse diário?',
    answerKey: 'stressLevel',
    options: [
      { text: 'Baixo', value: 'Low' },
      { text: 'Moderado', value: 'Moderate' },
      { text: 'Alto', value: 'High' },
      { text: 'Muito alto', value: 'Very high' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q11',
    questionText: 'Como está a qualidade do seu sono?',
    answerKey: 'sleepQuality',
    options: [
      { text: 'Ótima, durmo bem', value: 'Great, I sleep well' },
      { text: 'Razoável, mas poderia ser melhor', value: 'Fair, but could be better' },
      { text: 'Ruim, tenho dificuldade para dormir', value: 'Poor, I have trouble sleeping' },
      { text: 'Péssima, sofro de insônia', value: 'Terrible, I suffer from insomnia' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q12',
    questionText: 'Qual o seu nível de energia durante o dia?',
    answerKey: 'energyLevel',
    options: [
      { text: 'Alto e constante', value: 'High and constant' },
      { text: 'Varia durante o dia', value: 'Varies during the day' },
      { text: 'Geralmente baixo', value: 'Generally low' },
      { text: 'Muito baixo, sinto cansaço frequente', value: 'Very low, I feel tired frequently' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q13',
    questionText: 'O quão motivada você está para começar?',
    answerKey: 'motivationLevel',
    options: [
      { text: 'Muito motivada!', value: 'Very motivated!' },
      { text: 'Motivada, mas preciso de um empurrão', value: 'Motivated, but need a push' },
      { text: 'Um pouco, mas com dúvidas', value: 'A little, but with doubts' },
      { text: 'Desmotivada, preciso de ajuda', value: 'Unmotivated, I need help' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q14',
    questionText: 'Você tem alguma condição de saúde ou lesão que devemos saber?',
    answerKey: 'healthConditions',
    options: [
      { text: 'Não', value: 'No' },
      { text: 'Sim, problemas nas articulações', value: 'Yes, joint problems' },
      { text: 'Sim, problemas de coluna', value: 'Yes, back problems' },
      { text: 'Sim, outra (especificar se possível)', value: 'Yes, other' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
  {
    id: 'q15',
    questionText: 'Quanto você está disposta a se comprometer com seu novo plano?',
    answerKey: 'commitment',
    options: [
      { text: '100% pronta para mudar!', value: '100% ready to change!' },
      { text: 'Vou dar o meu melhor', value: 'I will do my best' },
      { text: 'Vou tentar seguir o plano', value: 'I will try to follow the plan' },
      { text: 'Não tenho certeza do meu compromisso', value: 'I am not sure about my commitment' },
    ],
    imagePlaceholder: smilingFitnessWoman,
  },
];
