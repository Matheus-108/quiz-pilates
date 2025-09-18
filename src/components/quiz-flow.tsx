'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { quizQuestions, type QuizQuestion, type QuizOption } from '@/lib/quiz-questions';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { generatePlanAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import MarkdownRenderer from '@/components/markdown-renderer';
import type { PersonalizedFitnessPlanInput } from '@/ai/flows/personalized-fitness-plan';
import { Card, CardContent } from './ui/card';

export default function QuizFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PersonalizedFitnessPlanInput>>({});
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const { toast } = useToast();

  const totalQuestions = quizQuestions.length;
  const progressValue = isQuizStarted ? ((currentStep) / totalQuestions) * 100 : 0;
  const currentQuestion = quizQuestions[currentStep];

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
  };
  
  const handleAnswerClick = (question: QuizQuestion, option: QuizOption) => {
    const newAnswers = { ...answers, [question.answerKey]: option.value };
    setAnswers(newAnswers);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePlan(newAnswers as PersonalizedFitnessPlanInput);
    }
  };

  const generatePlan = async (finalAnswers: PersonalizedFitnessPlanInput) => {
    setIsLoading(true);
    const result = await generatePlanAction(finalAnswers);
    setIsLoading(false);

    if (result.success && result.plan) {
      setPlan(result.plan);
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar plano',
        description: result.error || 'Não foi possível gerar seu plano. Por favor, tente novamente.',
      });
      setCurrentStep(0);
      setAnswers({});
      setIsQuizStarted(false);
    }
  };

  const renderInitialScreen = () => (
    <div className="text-center animate-in fade-in duration-500 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
        🤯 Queime a <span className="text-destructive">gordura</span> da menopausa com apenas <span className="text-destructive">10 minutos por dia...</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
        👉 Responda o teste de <span className="font-bold text-foreground">2 minutos</span> e receba um <span className="font-bold text-foreground">plano personalizado!</span>
        </p>
        <Button onClick={handleStartQuiz} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
          INICIAR TESTE
        </Button>
    </div>
  );

  const renderQuiz = () => (
    <div key={currentStep} className="w-full animate-in fade-in-50 duration-500">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8">{currentQuestion.questionText}</h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col space-y-4">
                {currentQuestion.options.map((option) => (
                    <Button
                        key={option.value}
                        variant="outline"
                        className="w-full justify-center text-center h-auto py-4 px-6 text-base rounded-full border-border hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-300 shadow-sm"
                        onClick={() => handleAnswerClick(currentQuestion, option)}
                    >
                        {option.text}
                    </Button>
                ))}
            </div>
            <div className="relative h-96 w-full md:h-[600px] rounded-lg overflow-hidden order-first md:order-last shadow-md">
                <Image
                    src={currentQuestion.imagePlaceholder.imageUrl}
                    alt={currentQuestion.imagePlaceholder.description}
                    fill
                    className="object-cover"
                    data-ai-hint={currentQuestion.imagePlaceholder.imageHint}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
        </div>
    </div>
  );

  const renderLoading = () => (
    <div className="text-center flex flex-col items-center justify-center space-y-4 py-20 animate-in fade-in duration-500">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <h2 className="text-2xl font-semibold">Gerando seu plano personalizado...</h2>
      <p className="text-muted-foreground">Isso pode levar alguns segundos.</p>
    </div>
  );

  const renderPlan = () => (
    <Card className="w-full animate-in fade-in duration-500 shadow-xl border-2 border-primary/20">
        <CardContent className="p-6 md:p-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Seu Plano Personalizado está Pronto!</h2>
            <p className="text-muted-foreground mb-6">Aqui está um plano de fitness e dieta feito especialmente para você, com base nas suas respostas.</p>
            <div className='bg-white/50 rounded-lg p-6 border'>
              {plan && <MarkdownRenderer content={plan} />}
            </div>
            <Button onClick={() => { setPlan(null); setAnswers({}); setCurrentStep(0); setIsQuizStarted(false); }} className="mt-8">
                Refazer Quiz
            </Button>
        </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6">
      <div className="h-12 flex items-center">
        <Image src="https://i.imgur.com/HlMARHx.png" alt="MenoShape Logo" width={208} height={50} priority className="h-auto w-auto" />
      </div>

      {(isQuizStarted || plan) && !isLoading && (
        <div className="w-full px-4 h-2 my-4">
            <Progress value={plan ? 100 : progressValue} className="h-2 w-full [&>div]:bg-primary" />
        </div>
      )}

      <div className="w-full flex-grow flex items-center justify-center mt-8 min-h-[60vh]">
        {!isQuizStarted && !isLoading && !plan && renderInitialScreen()}
        {isQuizStarted && !isLoading && !plan && renderQuiz()}
        {isLoading && renderLoading()}
        {plan && !isLoading && renderPlan()}
      </div>
    </div>
  );
}
