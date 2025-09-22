'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Loader2, Scale, BarChart, Star, AlertTriangle, Briefcase, Wand } from 'lucide-react';
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
import { Slider } from '@/components/ui/slider';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function QuizFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PersonalizedFitnessPlanInput>>({});
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(true);
  const [showFinalizingScreen, setShowFinalizingScreen] = useState(false);
  const [showWarningScreen2, setShowWarningScreen2] = useState(false);
  const [showFinalStepScreen, setShowFinalStepScreen] = useState(false);
  const [showSalesPage, setShowSalesPage] = useState(false);
  const { toast } = useToast();

  const [multiSelectAnswers, setMultiSelectAnswers] = useState<string[]>([]);
  const [weight, setWeight] = useState(75);

  const totalQuestions = quizQuestions.length + 4;
  const progressValue = isQuizStarted ? ((currentStep + 1) / totalQuestions) * 100 : 0;
  
  let questionIndex = currentStep;
  if (currentStep > 1) questionIndex--;
  if (currentStep > 3) questionIndex--; 
  if (currentStep > 6) questionIndex--;
  
  const currentQuestion = quizQuestions[questionIndex];
  const isLastQuestion = questionIndex === quizQuestions.length - 1;


  const handleRestart = () => {
    setPlan(null);
    setAnswers({});
    setCurrentStep(0);
    setIsQuizStarted(true);
    setShowFinalizingScreen(false);
    setShowWarningScreen2(false);
    setShowFinalStepScreen(false);
    setShowSalesPage(false);
    setMultiSelectAnswers([]);
    setWeight(75);
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      
      let prevQuestionIndex = currentStep - 1;
      if (currentStep - 1 > 1) prevQuestionIndex--;
      if (currentStep - 1 > 3) prevQuestionIndex--;
      if (currentStep - 1 > 6) prevQuestionIndex--;

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
      
      setShowFinalizingScreen(false);
      setShowWarningScreen2(false);
      setShowFinalStepScreen(false);
    }
  };
  
  const handleAnswerClick = (question: QuizQuestion, option: QuizOption) => {
    const newAnswers = { ...answers, [question.answerKey]: option.value };
    setAnswers(newAnswers);

    if (!isLastQuestion) {
      setCurrentStep(currentStep + 1);
    } else {
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
    setMultiSelectAnswers([]); 
    
    if (!isLastQuestion) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSliderContinue = () => {
    const question = currentQuestion;
    const newAnswers = { ...answers, [question.answerKey]: `${weight}kg` };
    setAnswers(newAnswers);

    if (!isLastQuestion) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInfoScreenContinue = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleWarningContinue = () => {
    setShowFinalizingScreen(true);
  }

  const handleWarning2Continue = () => {
    setShowWarningScreen2(false);
    setShowFinalStepScreen(true);
  };


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
        <p className="text-xl text-foreground mb-6">
          <span className="font-bold">✨ Milhares</span> de mulheres já eliminaram a gordura da menopausa, agora é a sua vez!
        </p>
        <Button onClick={handleInfoScreenContinue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
            Eu também consigo!
        </Button>
    </div>
  );

  const renderStep4InfoScreen = () => {
    const mainGoal = answers.mainGoal;
    let text = 'Começando a Pilates Asiática hoje, você vai queimar a gordura da menopausa!';
    let emoji = '💪';
    if (mainGoal === 'Maintain weight and get in shape') {
      text = 'Com a Pilates Asiática, você começa hoje a evitar o ganho de gordura da menopausa e continua em forma!';
      emoji = '🌸';
    } else if (mainGoal === 'Improve sleep and reduce stress') {
      text = 'Com a Pilates Asiática, você começa hoje a ter noites de sono tranquilas, livres da insônia e da tensão!';
      emoji = '🌙';
    } else if (mainGoal === 'Have more disposition and energy') {
      text = 'Com a Pilates Asiática, você começa hoje a melhorar a circulação, reduzir a fadiga e aumentar sua energia!';
      emoji = '🌟';
    }


    return (
      <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center">
          <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-md mb-4">
              <Image 
                  src="https://i.imgur.com/MQSNdNr.jpeg"
                  alt="Mulher se exercitando"
                  layout="fill"
                  objectFit="cover"
              />
          </div>
          <p className="text-xl text-foreground mb-6">
            <span className="font-bold">🔥 10 minutos por dia...</span>
            <br/><br/>
            <span>{emoji} {text}</span>
          </p>
          <Button onClick={handleInfoScreenContinue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
              Continuar
          </Button>
      </div>
    );
  }

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
      <p className="text-xl font-bold text-foreground mb-2">
        💡 78% das mulheres da sua idade sofrem com isso.
      </p>
      <p className="text-xl text-foreground mb-6">
        Quem age agora começa a ver resultados já nos primeiros dias!
      </p>
      <Button onClick={handleInfoScreenContinue} size="lg" className="w-full bg-[#E5398D] hover_bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
        Continuar
      </Button>
    </div>
  );
  
  const FinalizingScreen = () => {
    const [progress1, setProgress1] = useState(0);
    const [progress2, setProgress2] = useState(0);
    const [progress3, setProgress3] = useState(0);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowFinalizingScreen(false);
        setShowWarningScreen2(true);
      }, 6000);
  
      const interval1 = setInterval(() => setProgress1(100), 500);
      const interval2 = setInterval(() => setProgress2(64), 2500);
      const interval3 = setInterval(() => setProgress3(80), 4500);
  
      return () => {
        clearTimeout(timer);
        clearInterval(interval1);
        clearInterval(interval2);
        clearInterval(interval3);
      };
    }, []);
  
    return (
      <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
          <BarChart className="h-8 w-8" /> Finalizando seu plano...
        </h2>
  
        <div className="w-full space-y-6">
          <div className="text-left">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Analisando suas respostas...</span>
              <span className="text-primary font-bold">{progress1}%</span>
            </div>
            <Progress value={progress1} className="h-4 [&>div]:bg-primary" />
          </div>
          <div className="text-left">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Adicionando os últimos detalhes do seu plano...</span>
              <span className="text-primary font-bold">{progress2 > 0 ? `${progress2}%` : ''}</span>
            </div>
            <Progress value={progress2} className="h-4 [&>div]:bg-primary" />
          </div>
          <div className="text-left">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Montando a melhor estratégia...</span>
              <span className="text-primary font-bold">{progress3 > 0 ? `${progress3}%` : ''}</span>
            </div>
            <Progress value={progress3} className="h-4 [&>div]:bg-primary" />
          </div>
        </div>
  
        <div className="w-full mt-10 space-y-4">
          <Card className="text-left">
            <CardContent className="p-4">
              <div className="flex text-yellow-400 mb-2">
                <Star className="fill-current" /> <Star className="fill-current" /> <Star className="fill-current" /> <Star className="fill-current" /> <Star className="fill-current" />
              </div>
              <p className="font-bold">Juliana Nascimento</p>
              <p className="text-sm text-muted-foreground mb-2">@juliananascimento34</p>
              <p className="text-foreground/90">Adorei o plano personalizado. 2 semanas e meu marido já percebeu a diferença também. O treinamento é bem didático e facil.</p>
            </CardContent>
          </Card>
          <Card className="text-left">
            <CardContent className="p-4">
              <div className="flex text-yellow-400 mb-2">
                <Star className="fill-current" /> <Star className="fill-current" /> <Star className="fill-current" /> <Star className="fill-current" /> <Star className="fill-current" />
              </div>
              <p className="font-bold">Katia Martins</p>
              <p className="text-sm text-muted-foreground mb-2">@kakamartins</p>
              <p className="text-foreground/90">Nunca gostei desse exercícios da internet, mas essa pilates asiática, superou minhas espectativas. Comecei essa semana, mas já estou vendo muito resultado.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderWarningScreen = () => (
    <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center">
        <p className="text-xl font-bold text-foreground mb-2">
            ✨ Seu corpo pode começar a mudar em apenas 3 dias com a Pilates Asiática.
        </p>
        <p className="text-foreground/90 mb-2">
            Se você começar a fazer a Pilates Asiática hoje você ficará mais saudável e jovem!
        </p>
        <div className="relative w-full h-72 rounded-lg overflow-hidden mb-2">
            <Image
                src="https://i.imgur.com/woZ32hI.png"
                alt="Mulher fazendo a escolha certa"
                width={400}
                height={288}
                className="object-contain"
            />
        </div>
        <Button onClick={handleWarningContinue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
            Continuar
        </Button>
    </div>
);

const renderWarningScreen2 = () => (
    <div className="w-full max-w-lg text-center animate-in fade-in duration-500 flex flex-col items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-center">
            <AlertTriangle className="inline-block h-6 w-6 text-yellow-500 mb-1 mr-1" />
            Se você não agir agora, sua saúde e bem-estar podem <span className="text-destructive">piorar rapidamente!</span>
        </h2>

        <p className="text-lg">
            A boa notícia é: ainda dá tempo de escolher o caminho certo.
        </p>

        <div className="relative w-full">
            <Image
                src="https://i.imgur.com/crhVA5P.png"
                alt="Gráfico mostrando as escolhas"
                width={500}
                height={350}
                className="object-contain"
            />
        </div>

        <p className="text-lg font-bold">
            <Briefcase className="inline-block h-5 w-5 text-yellow-600 mb-1 mr-1" />
            O que você decidir agora vai definir como será sua menopausa e <span className="font-bold">seu futuro.</span>
        </p>

        <Button onClick={handleWarning2Continue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
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
            <span className="font-bold">{option.text}</span>
          </Label>
        ))}
      </div>
      <Button onClick={handleMultiSelectContinue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
        Continuar
      </Button>
    </div>
  );
  
  const renderSliderScreen = () => (
    <div className="w-full max-w-xs text-center animate-in fade-in duration-500 flex flex-col items-center">
      <Scale className="h-10 w-10 mb-4 text-gray-700" />
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{currentQuestion.questionText}</h2>
      <p className="text-5xl font-bold text-destructive my-6">{weight} kg</p>
      <Slider
        defaultValue={[75]}
        max={150}
        min={30}
        step={1}
        onValueChange={(value) => setWeight(value[0])}
        className="w-full my-6"
      />
      <p className="text-muted-foreground mb-8">Arraste para ajustar</p>
      <Button onClick={handleSliderContinue} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
        Continuar
      </Button>
    </div>
  );


  const renderQuiz = () => {
    const shouldShowImage = ![1, 4, 5, 6, 7].includes(questionIndex);
    
    return (
        <div key={currentStep} className="w-full animate-in fade-in-50 duration-500 text-center">
            {currentStep === 0 && (
              <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                  🤯 Queime a <span className="text-destructive">gordura</span> da menopausa com <span className="text-destructive">10 minutos</span> por dia
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
                        <span className="font-bold">{option.text}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                {shouldShowImage && currentQuestion.imagePlaceholder && (
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
      <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
        🌸 Seu plano personalizado <br /> já está pronto!
      </h2>
      <p className="text-lg text-foreground mb-4">
        Ele foi desenvolvido a partir das suas respostas e está{' '}
        <span className="font-bold">
          100% adaptado ao seu corpo, à sua rotina e às suas dores.
        </span>
      </p>
      <p className="text-lg text-foreground mb-8">
        👉 Clique no botão abaixo e comece a fazer a Pilates Asiática ainda hoje!
      </p>
      <Button onClick={handleShowSalesPage} size="lg" className="w-full bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
        <span className="mr-2">✅</span> Ver meu plano personalizado!
      </Button>
    </div>
  );

  const FaqAndGuarantee = () => (
    <div className="w-full max-w-3xl text-center flex flex-col items-center gap-8 mt-16">
        <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Wand /> PERGUNTAS FREQUENTES
        </h3>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Em quanto tempo vou ver resultados?</AccordionTrigger>
                <AccordionContent>
                    Muitas alunas relatam sentir mais disposição e bem-estar já nos primeiros dias. Para resultados visíveis de perda de peso e tonificação, a maioria começa a ver diferenças significativas em 2 a 4 semanas.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Preciso de equipamentos ou academia?</AccordionTrigger>
                <AccordionContent>
                    Não! O Pilates Asiático foi pensado para ser feito no conforto da sua casa, usando apenas o peso do seu corpo. Você não precisa de nenhum equipamento.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Funciona para qualquer idade?</AccordionTrigger>
                <AccordionContent>
                    Sim! O método é especialmente eficaz para mulheres acima dos 40 anos, passando pela menopausa, mas pode ser adaptado e beneficiar mulheres de todas as idades.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>E se eu não conseguir fazer sozinha?</AccordionTrigger>
                <AccordionContent>
                    Não se preocupe! As aulas são muito didáticas e fáceis de seguir. Além disso, você terá acesso ao nosso grupo de suporte para tirar dúvidas e receber apoio.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger>Como vou receber o material?</AccordionTrigger>
                <AccordionContent>
                    Assim que seu pagamento for confirmado, você receberá um e-mail com todas as instruções e o link para acessar a plataforma com todo o conteúdo imediatamente.
                </AccordionContent>
            </AccordionItem>
        </Accordion>

        <div className="mt-8 border-t-2 border-dashed w-full pt-8">
            <h3 className="text-2xl md:text-3xl font-bold text-destructive">GARANTIA INCONDICIONAL DE 30 DIAS!</h3>
            <p className="text-lg mt-4 max-w-2xl mx-auto">
                Se após seguir o plano você não sentir diferença no corpo, disposição e sintomas da menopausa, devolvemos 100% do seu investimento. Sem burocracia. Sem letrinhas pequenas. <strong>Você só tem a ganhar.</strong>
            </p>
            <a href="#checkout-section" className="inline-block mt-6">
                <Button size="lg" className="bg-[#E5398D] hover:bg-[#c22a7a] text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
                    Quero começar hoje mesmo!
                </Button>
            </a>
            <div className="flex justify-center items-center gap-4 mt-8">
                <Image src="https://i.imgur.com/EziFGRA.png" alt="Selo de Garantia 30 dias" width={150} height={150} />
                <Image src="https://i.imgur.com/VbvDRPC.jpeg" alt="Logo Wase Pilates" width={150} height={150} className="rounded-2xl" />
            </div>
        </div>
    </div>
);

  const renderSalesPage = () => (
    <div className="w-full max-w-3xl text-center animate-in fade-in duration-500 flex flex-col items-center gap-8">
      <h2 className="text-2xl md:text-4xl font-bold uppercase">
        🔥 10 minutos por dia é o suficiente para <span className="text-destructive">queimar a gordura e recuperar a energia!</span>
      </h2>
      <Image src="https://i.imgur.com/ChtXZZA.png" alt="Comparação antes e depois" width={700} height={759} />
      
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
             <CarouselItem>
              <Image src="https://i.imgur.com/nrVOzqf.png" alt="Depoimento 4" width={700} height={150} className="rounded-lg shadow-md object-contain" />
            </CarouselItem>
             <CarouselItem>
              <Image src="https://i.imgur.com/SPhIXEU.png" alt="Depoimento 5" width={700} height={150} className="rounded-lg shadow-md object-contain" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      <h3 className="text-xl md:text-3xl font-bold pt-8">👩‍⚕️ CONHEÇA A ESPECIALISTA</h3>
      <Image src="https://i.imgur.com/n7Ptqht.png" alt="Especialista" width={700} height={400} className="rounded-lg shadow-md" />

      <p className="text-muted-foreground max-w-2xl">
      Camila Nakamoto é referência quando o assunto é <b>menopausa e emagrecimento feminino</b>. Depois de viver anos na Ásia, onde descobriu como o <b>Pilates Ásiatico</b> transformava a vida das mulheres, ela trouxe essa prática para o Brasil. E hoje ela vai ajudar <b>você!</b>
      </p>

      <h3 className="text-xl md:text-3xl font-bold text-destructive pt-4">🚨 VOCÊ VAI TOMAR A <span className="text-destructive">DECISÃO CERTA?</span></h3>
      
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

      <FaqAndGuarantee />
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
  
  const shouldShowProgressBar = (isQuizStarted || plan || showFinalStepScreen || showSalesPage || showFinalizingScreen || showWarningScreen2) && !isLoading;
  const shouldShowBackButton = isQuizStarted && currentStep > 0 && !plan && !isLoading && !showSalesPage && !showFinalizingScreen && !showWarningScreen2;
  
  const renderContent = () => {
    if (isLoading) return renderLoading();
    if (plan) return renderPlan();
    if (showSalesPage) return renderSalesPage();
    if (showWarningScreen2) return renderWarningScreen2();
    if (showFinalizingScreen) return <FinalizingScreen />;
    if (showFinalStepScreen) return renderFinalStepScreen();

    // The order of these checks is crucial and must match the quiz flow.
    if (currentStep === 1) return renderInfoScreen();
    if (currentStep === 3) return renderStep4InfoScreen();
    if (currentStep === 6) return renderStep7InfoScreen();
    
    // After the last question, show the warning screen
    if (currentStep === quizQuestions.length + 3) return renderWarningScreen();
    
    if (currentQuestion && currentQuestion.type === 'checkbox') return renderMultiSelectScreen();
    if (currentQuestion && currentQuestion.type === 'slider') return renderSliderScreen();
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
        <Image src="https://i.imgur.com/VbvDRPC.jpeg" alt="MenoShape Quiz Logo" width={96} height={96} priority className="rounded-2xl" />
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
