'use server';

/**
 * @fileOverview Generates a personalized fitness plan based on user quiz answers.
 *
 * - generatePersonalizedFitnessPlan - A function that generates a personalized fitness plan.
 * - PersonalizedFitnessPlanInput - The input type for the generatePersonalizedFitnessPlan function.
 * - PersonalizedFitnessPlanOutput - The return type for the generatePersonalizedFitnessPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFitnessPlanInputSchema = z.object({
  ageRange: z.string().describe('The age range of the user.'),
  fitnessLevel: z.string().describe('The fitness level of the user.'),
  timePerDay: z.string().describe('The amount of time the user can dedicate to exercise per day.'),
});
export type PersonalizedFitnessPlanInput = z.infer<typeof PersonalizedFitnessPlanInputSchema>;

const PersonalizedFitnessPlanOutputSchema = z.object({
  fitnessPlan: z.string().describe('The personalized fitness plan.'),
});
export type PersonalizedFitnessPlanOutput = z.infer<typeof PersonalizedFitnessPlanOutputSchema>;

export async function generatePersonalizedFitnessPlan(
  input: PersonalizedFitnessPlanInput
): Promise<PersonalizedFitnessPlanOutput> {
  return personalizedFitnessPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFitnessPlanPrompt',
  input: {schema: PersonalizedFitnessPlanInputSchema},
  output: {schema: PersonalizedFitnessPlanOutputSchema},
  prompt: `You are a personal trainer who specializes in fitness plans for women over 40. Based on the quiz answers below, generate a personalized fitness plan.

Age Range: {{{ageRange}}}
Fitness Level: {{{fitnessLevel}}}
Time Per Day: {{{timePerDay}}}

Consider that the user wants to lose weight and burn fat during menopause. Include exercises appropriate for this goal, and suggest a diet.

Respond in markdown format.
`,
});

const personalizedFitnessPlanFlow = ai.defineFlow(
  {
    name: 'personalizedFitnessPlanFlow',
    inputSchema: PersonalizedFitnessPlanInputSchema,
    outputSchema: PersonalizedFitnessPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
