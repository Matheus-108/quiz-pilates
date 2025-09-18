'use server';

import {
  generatePersonalizedFitnessPlan,
  type PersonalizedFitnessPlanInput,
} from '@/ai/flows/personalized-fitness-plan';
import { z } from 'zod';

const AnswersSchema = z.object({
  ageRange: z.string(),
  fitnessLevel: z.string(),
  timePerDay: z.string(),
});

export async function generatePlanAction(answers: PersonalizedFitnessPlanInput) {
  try {
    const validatedAnswers = AnswersSchema.parse(answers);
    const result = await generatePersonalizedFitnessPlan(validatedAnswers);
    if (!result || !result.fitnessPlan) {
      throw new Error('Falha ao gerar o plano. O resultado está vazio.');
    }
    return { success: true, plan: result.fitnessPlan };
  } catch (error) {
    console.error('Error generating fitness plan:', error);
    let errorMessage = 'Ocorreu um erro inesperado ao gerar seu plano. Tente novamente mais tarde.';
    if (error instanceof z.ZodError) {
      errorMessage = 'As respostas fornecidas são inválidas. Por favor, reinicie o questionário.';
    } else if (error instanceof Error) {
      // Don't expose internal error messages to the client
      errorMessage = 'Falha ao se comunicar com o serviço de IA. Verifique sua conexão e tente novamente.';
    }
    return { success: false, error: errorMessage };
  }
}
