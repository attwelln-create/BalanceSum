'use server';
/**
 * @fileOverview A Genkit flow for generating math problems for a children's game.
 *
 * - generateMathProblem - A function that generates a math problem (target number and ball values).
 * - GenerateMathProblemInput - The input type for the generateMathProblem function.
 * - GenerateMathProblemOutput - The return type for the generateMathProblem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMathProblemInputSchema = z.object({
  difficultyLevel: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]).describe('The difficulty level of the math problem (1, 2, or 3).'),
});
export type GenerateMathProblemInput = z.infer<typeof GenerateMathProblemInputSchema>;

const GenerateMathProblemOutputSchema = z.object({
  targetNumber: z.number().int().positive().describe('The target number the player needs to achieve.'),
  ballValues: z.array(z.number().int().positive()).describe('An array of numbers representing the available balls for the player to use.'),
});
export type GenerateMathProblemOutput = z.infer<typeof GenerateMathProblemOutputSchema>;

// Función de respaldo local si la IA falla
function generateLocalProblem(difficulty: number): GenerateMathProblemOutput {
  const configs = {
    1: { targetMax: 20, balls: [1, 5, 10] },
    2: { targetMax: 50, balls: [1, 5, 10, 20] },
    3: { targetMax: 100, balls: [1, 5, 10, 20, 50] },
  };

  const config = configs[difficulty as keyof typeof configs];
  
  // Generar un número objetivo que sea suma de algunas bolas
  let target = 0;
  const numSteps = Math.floor(Math.random() * 3) + 2; // 2 a 4 bolas
  for (let i = 0; i < numSteps; i++) {
    const randomBall = config.balls[Math.floor(Math.random() * config.balls.length)];
    if (target + randomBall <= config.targetMax) {
      target += randomBall;
    }
  }

  // Si el target quedó muy bajo o en 0, forzamos uno válido
  if (target === 0) target = config.balls[0] * 3;

  return {
    targetNumber: target,
    ballValues: config.balls,
  };
}

export async function generateMathProblem(
  input: GenerateMathProblemInput
): Promise<GenerateMathProblemOutput> {
  return generateMathProblemFlow(input);
}

const generateMathProblemPrompt = ai.definePrompt({
  name: 'generateMathProblemPrompt',
  input: { schema: GenerateMathProblemInputSchema },
  output: { schema: GenerateMathProblemOutputSchema },
  config: {
    temperature: 0.7,
  },
  prompt: `You are an expert math problem generator for an educational Android game for children (around 7 years old).
Your task is to generate a single addition problem, consisting of a target number and a selection of ball values.

Difficulty Level 1: Target 1-20, Balls [1, 5, 10]
Difficulty Level 2: Target 1-50, Balls [1, 5, 10, 20]
Difficulty Level 3: Target 1-100, Balls [1, 5, 10, 20, 50]

Input Difficulty Level: {{{difficultyLevel}}}`,
});

const generateMathProblemFlow = ai.defineFlow(
  {
    name: 'generateMathProblemFlow',
    inputSchema: GenerateMathProblemInputSchema,
    outputSchema: GenerateMathProblemOutputSchema,
  },
  async (input) => {
    try {
      // Intentamos con la IA
      const { output } = await generateMathProblemPrompt(input);
      if (output) return output;
      throw new Error('AI returned empty output');
    } catch (err) {
      console.warn('AI failed, using local fallback generator:', err);
      // Si la IA falla, usamos el generador local
      return generateLocalProblem(input.difficultyLevel);
    }
  }
);
