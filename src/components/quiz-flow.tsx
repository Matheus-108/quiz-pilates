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
import { Checkbox } from './ui/checkbox';
import TransparentCheckout from './transparent-checkout';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


export default function QuizFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PersonalizedFitnessPlanInput>>({});
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(true);
  const [showFinalStepScreen, setShowFinalStepScreen] = useState(false);
  const [showSalesPage, setShowSalesPage] = useState(false);
  const { toast } = useToast();

  const [multiSelectAnswers, setMultiSelectAnswers] = useState<string[]>([]);

  // We add 3 to totalQuestions to account for the new informational screens and the final warning screen.
  const totalQuestions = quizQuestions.length + 3;
  const progressValue = isQuizStarted ? ((currentStep + 1) / totalQuestions) * 100 : 0;
  
  // Adjust question index to account for the informational screens
  let questionIndex = currentStep;
  if (currentStep > 0) questionIndex--; // Account for step 2 info screen
  if (currentStep > 2) questionIndex--; // Account for step 4 info screen
  if (currentStep > 5) questionIndex--; // Account for step 7 info screen
  

  const currentQuestion = quizQuestions[questionIndex];
  const isLastQuestion = questionIndex === quizQuestions.length - 1;


  const handleRestart = () => {
    setPlan(null);
    setAnswers({});
    setCurrentStep(0);
    setIsQuizStarted(true);
    setShowFinalStepScreen(false);
    setShowSalesPage(false);
    setMultiSelectAnswers([]);
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      
      // Pre-populate multi-select answers when going back
      let prevQuestionIndex = currentStep - 1;
      if (currentStep - 1 > 0) prevQuestionIndex--;
      if (currentStep - 1 > 2) prevQuestionIndex--;
      if (currentStep - 1 > 5) prevQuestionIndex--;

      const prevQuestion = quizQuestions[prevQuestionIndex];
      if (prevQuestion && prevQuestion.type === 'checkbox') {
        const answerKey = prevQuestion.answerKey;
        const existingAnswer = answers[answerKey];
        if (typeof existingAnswer === 'string' && existingAnswer) {
          setMultiSelectAnswers(existingAnswer.split(', '));
        } else {
          setMultiSelectAnswers([]);
        }
      } else {
        setMultiSelectAnswers([]);
      }
      
      setShowFinalStepScreen(false);
    }
  };
  
  const handleAnswerClick = (question: QuizQuestion, option: QuizOption) => {
    const newAnswers = { ...answers, [question.answerKey]: option.value };
    setAnswers(newAnswers);

    if (!isLastQuestion) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last question answered, show warning screen
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleAnswerSelect = (question: QuizQuestion, value: string) => {
    const option = question.options.find(o => o.value === value);
    if(option) {
      handleAnswerClick(question, option);
    }
  };

  const handleMultiSelectAnswer = (value: string) => {
    setMultiSelectAnswers(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const handleMultiSelectContinue = () => {
    const question = currentQuestion;
    const newAnswers = { ...answers, [question.answerKey]: multiSelectAnswers.join(', ') };
    setAnswers(newAnswers);
    setMultiSelectAnswers([]); // Reset for next multi-select question
    
    if (!isLastQuestion) {
      setCurrentStep(currentStep + 1);
    } else {
       // Last question answered, show warning screen
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInfoScreenContinue = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleWarningContinue = () => {
    setShowFinalStepScreen(true);
  }

  const handleShowSalesPage = () => {
    setShowFinalStepScreen(false);
    setShowSalesPage(true);
  };

  const generatePlan = async () => {
    setShowFinalStepScreen(false);
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
      handleRestart();
    }
  };

  const renderInfoScreen = () => (
    <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center">
        <Button size="lg" className="w-full mb-4 bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
        ⚠️ Atenção meninas!
        </Button>
        <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-md mb-4">
            <Image 
                src="https://i.imgur.com/oJv0xYn.jpeg" 
                alt="Mulher feliz se exercitando"
                layout="fill"
                objectFit="cover"
            />
        </div>
        <p className="text-xl font-semibold text-foreground mb-6">
        ✨ Milhares de mulheres já eliminaram a gordura da menopausa, agora é a sua vez!
        </p>
        <Button onClick={handleInfoScreenContinue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
            Eu também consigo!
        </Button>
    </div>
  );

  const renderStep4InfoScreen = () => (
    <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center">
        <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-md mb-4">
            <Image 
                src="https://i.imgur.com/MQSNdNr.jpeg"
                alt="Mulher se exercitando"
                layout="fill"
                objectFit="cover"
            />
        </div>
        <p className="text-xl font-semibold text-foreground mb-6">
        🔥 10 minutos por dia...
        <br/><br/>
        💪 Começando a Pilates Asiática hoje, você vai queimar a gordura da menopausa!
        </p>
        <Button onClick={handleInfoScreenContinue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
            Continuar
        </Button>
    </div>
  );

  const renderStep7InfoScreen = () => (
    <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center">
      <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-md mb-4">
        <Image
          src="https://i.imgur.com/DmrMK1f.png"
          alt="Mulher pensando nos resultados"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p className="text-xl font-semibold text-foreground mb-6">
        💡 78% das mulheres da sua idade sofrem com isso.
        <br/><br/>
        Quem age agora começa a ver resultados já nos primeiros dias!
      </p>
      <Button onClick={handleInfoScreenContinue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
        Continuar
      </Button>
    </div>
  );

  const renderWarningScreen = () => (
    <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center">
      <p className="text-xl font-semibold text-foreground mb-6">
        ⚠️ Se você não agir agora, sua saúde e bem-estar podem piorar rapidamente!
        <br/><br/>
        A boa notícia é: ainda dá tempo de escolher o caminho certo.
      </p>
      <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-md mb-4">
        <Image 
          src="https://i.imgur.com/cGbt7Ct.png" 
          alt="Mulher fazendo a escolha certa"
          width={400}
          height={288}
          className="object-cover"
        />
      </div>
      <Button onClick={handleWarningContinue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
        Continuar
      </Button>
    </div>
  );
  

  const renderMultiSelectScreen = () => (
    <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentQuestion.questionText}</h2>
      <p className="text-muted-foreground mb-6">{currentQuestion.questionSubtitle}</p>
      <div className="flex flex-col space-y-2 w-full text-left mb-6">
        {currentQuestion.options.map(option => (
          <Label
            key={option.value}
            htmlFor={option.value}
            className="flex items-center space-x-3 cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm p-4 hover:bg-accent/50 transition-colors"
          >
            <Checkbox
              id={option.value}
              checked={multiSelectAnswers.includes(option.value)}
              onCheckedChange={() => handleMultiSelectAnswer(option.value)}
            />
            <span>{option.text}</span>
          </Label>
        ))}
      </div>
      <Button onClick={handleMultiSelectContinue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
        Continuar
      </Button>
    </div>
  );


  const renderQuiz = () => {
    // We don't want an image for questionIndex 1, 5, 6, 7, 8
    const shouldShowImage = ![1, 4, 5, 6, 7].includes(questionIndex);
    
    return (
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
            <div className={`grid ${shouldShowImage ? 'grid-cols-2' : 'grid-cols-1'} gap-2 items-center text-left max-w-2xl mx-auto`}>
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
                {shouldShowImage && (
                    <div className="relative h-64 w-full rounded-lg overflow-hidden">
                        <Image
                            src={currentQuestion.imagePlaceholder.imageUrl}
                            alt={currentQuestion.imagePlaceholder.description}
                            fill
                            className="object-contain"
                            data-ai-hint={currentQuestion.imagePlaceholder.imageHint}
                            sizes="50vw"
                        />
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderFinalStepScreen = () => (
    <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">🌸 Seu plano personalizado já está pronto!</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Ele foi desenvolvido a partir das suas respostas e está 100% adaptado ao seu corpo, à sua rotina e às suas dores.
        <br/><br/>
        👉 Clique no botão abaixo e comece a fazer a Pilates Asiática ainda hoje!
      </p>
      <Button onClick={handleShowSalesPage} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
      ✅ Ver meu plano personalizado!
      </Button>
    </div>
  );

  const renderSalesPage = () => (
    <div className="w-full max-w-3xl text-center animate-in fade-in duration-500 flex flex-col items-center gap-8">
      <h2 className="text-2xl md:text-4xl font-bold">🔥 10 MINUTOS POR DIA É O SUFICIENTE PARA QUEIMAR A GORDURA E RECUPERAR A ENERGIA!</h2>
      <Image src="https://i.imgur.com/ChtXZZA.png" alt="Mulher se exercitando" width={700} height={400} className="rounded-lg shadow-md" />
      
      <h3 className="text-xl md:text-3xl font-bold">👇 VEJA ALGUNS DOS MATERIAIS QUE VOCÊ VAI RECEBER NA PRÁTICA</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <Image src="https://i.imgur.com/y8FKCJw.png" alt="Material 1" width={340} height={340} className="rounded-lg shadow-md" />
        <Image src="https://i.imgur.com/ZZQzyy1.png" alt="Material 2" width={340} height={340} className="rounded-lg shadow-md" />
      </div>

      <h3 className="text-xl md:text-3xl font-bold">🎁 VOCÊ AINDA VAI RECEBER 4 PRESENTES DE GRAÇA...</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <Image src="https://i.imgur.com/CPR4yiz.png" alt="Presente 1" width={340} height={340} className="rounded-lg shadow-md" />
        <Image src="https://i.imgur.com/OHLq4Mu.png" alt="Presente 2" width={340} height={340} className="rounded-lg shadow-md" />
      </div>

      <h2 className="text-2xl md:text-4xl font-bold">😱 TRANSFORME SEU CORPO HOJE COM APENAS 10 MINUTOS POR DIA!</h2>
      <Image src="https://i.imgur.com/uQuqLc8.png" alt="Transformação corporal" width={700} height={400} className="rounded-lg shadow-md" />
      
      <a href="#checkout-section" className="w-full">
        <Button asChild size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
          <span>Quero transformar meu corpo hoje!</span>
        </Button>
      </a>

      <h3 className="text-xl md:text-3xl font-bold pt-8">🗣️ VEJA O QUE NOSSAS ALUNAS ESTÃO DIZENDO:</h3>
        <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <CarouselContent>
            <CarouselItem>
              <Image src="https://i.imgur.com/xJqzrdl.png" alt="Depoimento 1" width={700} height={150} className="rounded-lg shadow-md object-contain" />
            </CarouselItem>
            <CarouselItem>
              <Image src="https://i.imgur.com/fkBMvJy.png" alt="Depoimento 2" width={700} height={150} className="rounded-lg shadow-md object-contain" />
            </CarouselItem>
            <CarouselItem>
              <Image src="https://i.imgur.com/7c8oe8U.png" alt="Depoimento 3" width={700} height={150} className="rounded-lg shadow-md object-contain" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      <h3 className="text-xl md:text-3xl font-bold pt-8">Conheça a especialista</h3>
      <Image src="https://i.imgur.com/n7Ptqht.png" alt="Especialista" width={700} height={400} className="rounded-lg shadow-md" />

      <p className="text-muted-foreground max-w-2xl">
        Camila Nakamoto é referência quando o assunto é menopausa e emagrecimento feminino. Depois de viver anos na Ásia, onde descobriu como o Pilates Ásiatico transformava a vida das mulheres, ela trouxe essa prática para o Brasil. E hoje ela vai ajudar você!
      </p>

      <h3 className="text-xl md:text-3xl font-bold text-destructive pt-4">🚨 VOCÊ VAI TOMAR A DECISÃO CERTA?</h3>
      
      <p className="text-lg font-semibold max-w-2xl">
        O tempo não perdoa. Cada semana parada é mais gordura acumulada na barriga da menopausa, mais sintomas te consumindo e mais autoestima indo pro chão.
      </p>
      <p className="text-lg font-semibold max-w-2xl">
      👉 Ou você age agora, ou aceita continuar perdendo sua energia e juventude. A escolha é sua!
      </p>

      <Image src="https://i.imgur.com/uQuqLc8.png" alt="Transformação corporal" width={700} height={400} className="rounded-lg shadow-md" />
      
      <a href="#checkout-section" className="w-full">
        <Button asChild size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
          <span>Quero tomar a decisão certa!</span>
        </Button>
      </a>
      
      <div id="checkout-section">
        <TransparentCheckout />
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
            <Button onClick={handleRestart} className="mt-8">
                Refazer Quiz
            </Button>
        </CardContent>
    </Card>
  );
  
  const shouldShowProgressBar = (isQuizStarted || plan || showFinalStepScreen || showSalesPage) && !isLoading;
  const shouldShowBackButton = isQuizStarted && currentStep > 0 && !plan && !isLoading && !showSalesPage;
  
  const renderContent = () => {
    if (isLoading) return renderLoading();
    if (plan) return renderPlan();
    if (showSalesPage) return renderSalesPage();
    if (showFinalStepScreen) return renderFinalStepScreen();

    // The order of these checks is crucial and must match the quiz flow.
    if (currentStep === 1) return renderInfoScreen();
    if (currentStep === 3) return renderStep4InfoScreen();
    if (currentStep === 6) return renderStep7InfoScreen();
    
    // After the last question, show the warning screen
    if (currentStep === quizQuestions.length + 3) return renderWarningScreen();
    
    if (currentQuestion && currentQuestion.type === 'checkbox') return renderMultiSelectScreen();
    if (currentQuestion) return renderQuiz();

    // Fallback or should not happen state
    return null;
  }


  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6">
      <div className="relative w-full h-24 flex items-center justify-center mt-12">
        {shouldShowBackButton && (
          <Button onClick={handleGoBack} variant="ghost" size="icon" className="absolute left-0">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        <Image src="https://i.imgur.com/VbvDRPC.jpeg" alt="MenoShape Quiz Logo" width={96} height={96} priority />
      </div>
      
      {shouldShowProgressBar && (
        <div className="w-full px-4 h-2 my-2">
            <Progress value={plan ? 100 : progressValue} className="h-2 w-full [&>div]:bg-primary" />
        </div>
      )}

      <div className="w-full flex-grow flex items-center justify-center mt-4 min-h-[60vh] px-4">
        {renderContent()}
      </div>
    </div>
  );
}

    