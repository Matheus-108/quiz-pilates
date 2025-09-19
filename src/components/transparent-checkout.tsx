'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Lock, Heart, Flame, MessageSquare, User, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';

export default function TransparentCheckout() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pixData && !isPaid) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/pix?id=${pixData.id}`);
          const data = await res.json();
          if (data && data.status === 'paid') {
            setIsPaid(true);
            setPixData(null); // Clear pix data to stop polling
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Error checking payment status:', err);
        }
      }, 5000); // Check every 5 seconds
    }
    return () => clearInterval(interval);
  }, [pixData, isPaid]);

  const handleGeneratePix = async () => {
    if (!email) {
      setError('Por favor, insira seu melhor e-mail.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 2790, email }), // R$27,90 in cents
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao gerar o PIX.');
      }
      setPixData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (isPaid) {
    return (
      <div className="w-full max-w-md mx-auto bg-white text-black rounded-lg shadow-2xl p-8 my-8 text-center">
        <Check className="h-16 w-16 mx-auto text-green-500 bg-green-100 rounded-full p-2" />
        <h2 className="text-2xl font-bold mt-4">Pagamento Aprovado!</h2>
        <p className="text-gray-600 mt-2">
          Você receberá as instruções de acesso no seu e-mail: <span className="font-bold">{email}</span>
        </p>
      </div>
    );
  }

  if (pixData) {
    return (
      <div className="w-full max-w-md mx-auto bg-white text-black rounded-lg shadow-2xl p-8 my-8 text-center">
        <h2 className="text-2xl font-bold">Quase lá!</h2>
        <p className="text-gray-600 mt-2">Escaneie o QR Code ou copie o código para pagar.</p>
        <div className="my-4 flex justify-center">
          <Image src={pixData.qr_code_base64} alt="PIX QR Code" width={250} height={250} />
        </div>
        <div className="relative">
          <Input
            type="text"
            readOnly
            value={pixData.qr_code}
            className="pr-12 text-xs bg-gray-100"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={copyToClipboard}
          >
            {isCopied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4">Aguardando confirmação do pagamento...</p>
        <Loader2 className="h-6 w-6 animate-spin text-gray-500 mx-auto mt-2" />
         <p className="text-xs text-gray-400 mt-6">A PUSHIN PAY atua exclusivamente como processadora de pagamentos e não possui qualquer responsabilidade pela entrega, suporte, conteúdo, qualidade ou cumprimento das obrigações relacionadas aos produtos ou serviços oferecidos pelo vendedor.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white text-black rounded-lg shadow-2xl p-8 my-8">
      <div className="text-center">
        <div className="inline-block bg-pink-100 rounded-full p-3">
          <Lock className="h-8 w-8 text-pink-500" />
        </div>
        <h2 className="text-2xl font-bold mt-4 text-pink-500">Desbloquear Acesso</h2>
        <p className="text-4xl font-bold mt-2">
          R$27,90 <span className="text-2xl text-gray-400 line-through">R$97,00</span>
        </p>
        <p className="text-gray-600">Faça o pagamento PIX para liberar o acesso.</p>
      </div>

      <div className="mt-6 bg-gray-800 text-white rounded-lg p-4">
        <h3 className="font-bold">Após a confirmação você recebe:</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-green-400" />
            <span>WhatsApp pessoal da especialista</span>
          </li>
          <li className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-green-400" />
            <span>Aulas exclusivas</span>
          </li>
          <li className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-green-400" />
            <span>Chat sem limites 24h</span>
          </li>
          <li className="flex items-center gap-2">
            <User className="h-4 w-4 text-green-400" />
            <span>Conteúdo personalizado</span>
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <Input
          type="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-100 border-gray-300 focus:ring-green-500 focus:border-green-500"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <Button
        onClick={handleGeneratePix}
        disabled={isLoading}
        className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-6 rounded-lg"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : 'Gerar PIX'}
      </Button>
      <p className="text-xs text-center text-gray-400 mt-4">A PUSHIN PAY atua exclusivamente como processadora de pagamentos e não possui qualquer responsabilidade pela entrega, suporte, conteúdo, qualidade ou cumprimento das obrigações relacionadas aos produtos ou serviços oferecidos pelo vendedor.</p>
    </div>
  );
}
