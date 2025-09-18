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
  mainGoal: z.string().describe('The user\'s main fitness goal.'),
  problemAreas: z.string().describe('The body areas the user wants to focus on.'),
  workoutLocation: z.string().describe('Where the user prefers to work out.'),
  workoutTypes: z.string().describe('The types of exercise the user enjoys.'),
  dietExperience: z.string().describe('The user\'s experience with diets.'),
  dietaryRestrictions: z.string().describe('Any dietary restrictions the user has.'),
  energyLevel: z.string().describe('The user\'s energy level during the day.'),
  motivationLevel: z.string().describe('The user\'s motivation level to start.'),
  healthConditions: z.string().describe('Any health conditions or injuries the user has.'),
  commitment: z.string().describe('How committed the user is to following the plan.'),
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
  prompt: `You are a personal trainer who specializes in fitness plans for women over 40. Based on the comprehensive quiz answers below, generate a highly personalized and detailed fitness plan.

## User Profile:
- **Age Range:** {{{ageRange}}}
- **Current Fitness Level:** {{{fitnessLevel}}}
- **Time Per Day for Exercise:** {{{timePerDay}}}
- **Main Goal:** {{{mainGoal}}}
- **Problem Areas to Focus On:** {{{problemAreas}}}
- **Workout Location Preference:** {{{workoutLocation}}}
- **Preferred Workout Types:** {{{workoutTypes}}}
- **Experience with Diets:** {{{dietExperience}}}
- **Dietary Restrictions:** {{{dietaryRestrictions}}}
- **Daily Energy Level:** {{{energyLevel}}}
- **Motivation Level:** {{{motivationLevel}}}
- **Health Conditions/Injuries:** {{{healthConditions}}}
- **Commitment Level:** {{{commitment}}}

## Instructions:
1.  **Acknowledge the User's Goal:** Start by acknowledging the user's main goal, especially in the context of menopause (weight loss, fat burning).
2.  **Create a Weekly Workout Schedule:** Provide a structured, day-by-day workout plan for a week. Specify exercises, sets, and reps or duration. The plan must be realistic based on the user's available time ('timePerDay') and fitness level.
3.  **Recommend Diet/Nutrition:** Suggest a diet plan. This should not be a generic diet, but tailored to the user's restrictions and goals. Include meal examples for breakfast, lunch, and dinner. Emphasize foods that help manage menopause symptoms.
4.  **Incorporate Lifestyle Advice:** Based on stress, sleep, and energy levels, provide actionable advice on how to improve these areas as they are crucial for success.
5.  **Motivation and Encouragement:** Use an encouraging and supportive tone. Acknowledge their motivation level and provide tips to stay on track based on their commitment.
6.  **Address Health Conditions:** If any health conditions are mentioned, advise consulting a doctor and suggest modifications or low-impact alternatives for exercises.

Respond in well-structured markdown format. Use headings, subheadings, and bullet points to make the plan easy to read and follow.
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
