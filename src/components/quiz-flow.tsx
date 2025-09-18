'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { quizQuestions, type QuizQuestion, type QuizOption } from '@/lib/quiz-questions';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { generatePlanAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import MarkdownRenderer from '@/components/markdown-renderer';
import type { PersonalizedFitnessPlanInput } from '@/ai/flows/personalized-fitness-plan';
import { Card, CardContent } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

export default function QuizFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PersonalizedFitnessPlanInput>>({});
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [showTransitionScreen, setShowTransitionScreen] = useState(false);
  const { toast } = useToast();

  const totalQuestions = quizQuestions.length;
  const progressValue = isQuizStarted ? ((currentStep + 1) / totalQuestions) * 100 : 0;
  const currentQuestion = quizQuestions[currentStep];

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleAnswerClick = (question: QuizQuestion, option: QuizOption) => {
    const newAnswers = { ...answers, [question.answerKey]: option.value };
    setAnswers(newAnswers);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last question answered, show transition screen
      setShowTransitionScreen(true);
    }
  };
  
  const handleAnswerSelect = (question: QuizQuestion, value: string) => {
    const option = question.options.find(o => o.value === value);
    if(option) {
      handleAnswerClick(question, option);
    }
  };

  const generatePlan = async () => {
    setShowTransitionScreen(false); // Hide transition screen
    setIsLoading(true);
    const result = await generatePlanAction(answers as PersonalizedFitnessPlanInput);
    setIsLoading(false);

    if (result.success && result.plan) {
      setPlan(result.plan);
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar plano',
        description: result.error || 'Não foi possível gerar seu plano. Por favor, tente novamente.',
      });
      // Reset state to start over
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
    <div key={currentStep} className="w-full animate-in fade-in-50 duration-500 text-center">
        {currentStep === 0 && (
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              🤯 Queime a <span className="text-destructive">gordura</span> da menopausa com apenas <span className="text-destructive">10 minutos por dia...</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              👉 Responda o teste de <span className="font-bold text-foreground">2 minutos</span> e receba um <span className="font-bold text-foreground">plano personalizado!</span>
            </p>
          </div>
        )}
        <div className="relative mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">{currentQuestion.questionText}</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 items-center text-left">
            <div className="flex flex-col space-y-2">
              <RadioGroup
                onValueChange={(value) => handleAnswerSelect(currentQuestion, value)}
                className="space-y-2"
              >
                {currentQuestion.options.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className="flex items-center space-x-2 cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm p-3 hover:bg-accent/50 transition-colors"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <span>{option.text}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-md">
                <Image
                    src={currentQuestion.imagePlaceholder.imageUrl}
                    alt={currentQuestion.imagePlaceholder.description}
                    fill
                    className="object-contain"
                    data-ai-hint={currentQuestion.imagePlaceholder.imageHint}
                    sizes="50vw"
                />
            </div>
        </div>
    </div>
  );

  const renderTransitionScreen = () => (
    <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center">
      <Button variant="destructive" className="mb-4 bg-[#E5398D] hover:bg-[#c22a7a] text-white font-bold">Atenção meninas</Button>
      <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-md mb-4">
        <Image 
          src="https://i.imgur.com/Vv5qIiR.png" 
          alt="Mulheres felizes"
          fill
          className="object-cover"
        />
      </div>
      <p className="text-xl font-semibold text-foreground mb-6">Milhares de mulheres ja eliminaram a gordura da menopausa, agora é sua vez!</p>
      <Button onClick={() => generatePlan()} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
        Eu também consigo!
      </Button>
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
            <Button onClick={() => { setPlan(null); setAnswers({}); setCurrentStep(0); setIsQuizStarted(false); setShowTransitionScreen(false); }} className="mt-8">
                Refazer Quiz
            </Button>
        </CardContent>
    </Card>
  );
  
  const shouldShowProgressBar = (isQuizStarted || plan || showTransitionScreen) && !isLoading;
  const shouldShowBackButton = isQuizStarted && currentStep > 0 && !plan && !isLoading && !showTransitionScreen;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6">
      <div className="relative w-full h-20 flex items-center justify-center">
        {shouldShowBackButton && (
          <Button onClick={handleGoBack} variant="ghost" size="icon" className="absolute left-0">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        <Image src="https://i.imgur.com/7W5p2S8.png" alt="Wase Pilates Logo" width={140} height={140} priority />
      </div>
      
      {shouldShowProgressBar && (
        <div className="w-full px-4 h-2 my-2">
            <Progress value={plan ? 100 : progressValue} className="h-2 w-full [&>div]:bg-primary" />
        </div>
      )}

      <div className="w-full flex-grow flex items-center justify-center mt-4 min-h-[60vh]">
        {!isQuizStarted && !plan && !isLoading && !showTransitionScreen && renderInitialScreen()}
        {isQuizStarted && !plan && !isLoading && !showTransitionScreen && renderQuiz()}
        {showTransitionScreen && !isLoading && renderTransitionScreen()}
        {isLoading && renderLoading()}
        {plan && !isLoading && renderPlan()}
      </div>
    </div>
  );
}
