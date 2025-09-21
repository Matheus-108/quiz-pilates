'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Loader2, Sparkles, Heart, Gift } from 'lucide-react';
import { Badge } from './ui/badge';

const offers = [
  {
    id: 'pele-sem-flacidez',
    title: 'Pele Sem Flacidez',
    price: 990, // in cents
    fullTitle: 'Zero Flacidez',
    description: 'Assim que você emagrecer você vai ficar incomodada com o excesso de pele solta no corpo. Esse material vai te ajudar!',
    image: 'https://i.imgur.com/uR3kG2g.png',
    recommended: true,
    icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
  },
  {
    id: 'intimidade-sem-dor',
    title: 'Intimidade Sem Dor',
    price: 990,
    fullTitle: 'Intimidade Sem Dor',
    description: 'Volte a sentir prazer, elimine o desconforto e viva sua intimidade com confiança e felicidade.',
    image: 'https://i.imgur.com/9nF4mAB.png',
    recommended: true,
    icon: <Heart className="h-4 w-4 text-red-500" />,
  },
  {
    id: 'super-combo',
    title: 'Super Combo! Pele Sem Flacidez + Intimidade Sem Dor',
    price: 1490,
    fullTitle: 'Super Combo 2 em 1',
    description: 'O combo perfeito para você que vai emagrecer e precisa criar mais intimidade e confiança com seu marido.',
    image: 'https://i.imgur.com/dKYS37b.png',
    special: true,
    icon: <Gift className="h-4 w-4 text-blue-500" />,
  },
];

type OrderBumpPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onGeneratePix: (finalValue: number) => void;
  baseValue: number;
};

export default function OrderBumpPopup({ isOpen, onClose, onGeneratePix, baseValue }: OrderBumpPopupProps) {
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffers((prev) => {
      if (prev.includes(offerId)) {
        // If combo is deselected, also deselect individual items if they were part of it
        if (offerId === 'super-combo') {
          return prev.filter(id => id !== 'super-combo' && id !== 'pele-sem-flacidez' && id !== 'intimidade-sem-dor');
        }
        return prev.filter((id) => id !== offerId);
      } else {
         // If combo is selected, add individual items too for total calculation, but manage selection logic
        if (offerId === 'super-combo') {
            const otherOffers = prev.filter(id => id !== 'pele-sem-flacidez' && id !== 'intimidade-sem-dor');
            return [...otherOffers, 'super-combo', 'pele-sem-flacidez', 'intimidade-sem-dor'];
        }
        // If an individual item is selected and it completes the combo, select the combo instead
        const isPeleSelected = offerId === 'intimidade-sem-dor' && prev.includes('pele-sem-flacidez');
        const isIntimidadeSelected = offerId === 'pele-sem-flacidez' && prev.includes('intimidade-sem-dor');
        if(isPeleSelected || isIntimidadeSelected) {
            const otherOffers = prev.filter(id => id !== 'pele-sem-flacidez' && id !== 'intimidade-sem-dor');
            return [...otherOffers, 'super-combo', 'pele-sem-flacidez', 'intimidade-sem-dor'];
        }
        return [...prev, offerId];
      }
    });
  };

  const handleSelectAll = () => {
    if(selectedOffers.includes('super-combo')) {
        setSelectedOffers([]);
    } else {
        setSelectedOffers(['super-combo', 'pele-sem-flacidez', 'intimidade-sem-dor']);
    }
  };

  const totalValue = useMemo(() => {
    let total = baseValue;
    if (selectedOffers.includes('super-combo')) {
        total += offers.find(o => o.id === 'super-combo')!.price;
    } else {
        if(selectedOffers.includes('pele-sem-flacidez')) {
            total += offers.find(o => o.id === 'pele-sem-flacidez')!.price;
        }
        if(selectedOffers.includes('intimidade-sem-dor')) {
            total += offers.find(o => o.id === 'intimidade-sem-dor')!.price;
        }
    }
    return total;
  }, [selectedOffers, baseValue]);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onGeneratePix(totalValue);
    setIsLoading(false);
  };

  const isOfferSelected = (id: string) => {
    if (id === 'super-combo') return selectedOffers.includes('super-combo');
    // An individual offer is considered selected if it's selected directly or as part of the combo
    return selectedOffers.includes(id);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white text-black p-0">
        <div className="border-b border-dashed p-4">
            <DialogHeader>
            <DialogTitle className="flex justify-between items-center text-lg font-semibold">
                <span>Ofertas limitadas</span>
                <Button variant="link" className="text-sm text-orange-600 p-0 h-auto" onClick={handleSelectAll}>
                    (Adicionar todas)
                </Button>
            </DialogTitle>
            </DialogHeader>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {offers.map((offer) => (
            <div key={offer.id} className={`border rounded-lg p-4 space-y-3 ${isOfferSelected(offer.id) ? 'border-orange-400 bg-orange-50/50' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-3 bg-orange-100 rounded p-2">
                    <Checkbox
                        id={`offer-${offer.id}`}
                        checked={isOfferSelected(offer.id)}
                        onCheckedChange={() => handleSelectOffer(offer.id)}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <label htmlFor={`offer-${offer.id}`} className="text-sm font-medium cursor-pointer">Adicionar oferta</label>
                </div>
                <div className="flex items-center space-x-3 pl-2">
                    <Image src={offer.image} alt={offer.title} width={60} height={60} className="rounded" />
                    <div>
                        <p className="font-semibold">{offer.title}</p>
                        <p className="font-bold text-lg">R$ {(offer.price / 100).toFixed(2).replace('.', ',')}</p>
                    </div>
                </div>
                <div className="border-t border-dashed my-2"></div>
                <div className='pl-2 space-y-2'>
                    <div className="flex items-center gap-2">
                        {offer.icon}
                        <h4 className="font-bold">{offer.fullTitle}</h4>
                        {offer.recommended && <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">Recomendado</Badge>}
                        {offer.special && <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">Preço Especial</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-6 rounded-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : `Gerar PIX (R$ ${(totalValue / 100).toFixed(2).replace('.', ',')})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
