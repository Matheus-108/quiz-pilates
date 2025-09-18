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
  mainGoal: z.string(),
  problemAreas: z.string(),
  workoutLocation: z.string(),
  workoutTypes: z.string(),
  dietExperience: z.string(),
  dietaryRestrictions: z.string(),
  energyLevel: z.string(),
  motivationLevel: z.string(),
  healthConditions: z.string(),
  commitment: z.string(),
});

export async function generatePlanAction(answers: PersonalizedFitnessPlanInput) {
  try {
    // We are not validating the input anymore as some questions are now optional
    // and are replaced by intermediate screens.
    // const validatedAnswers = AnswersSchema.parse(answers);
    const result = await generatePersonalizedFitnessPlan(answers);
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
