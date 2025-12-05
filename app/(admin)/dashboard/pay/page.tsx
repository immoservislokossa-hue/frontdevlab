"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, User, ArrowRight, CheckCircle, FileText, BarChart3, Download, Upload, Clock } from 'lucide-react';

type PaymentOption = 'bulk' | 'solo' | null;

interface PaymentCardProps {
  type: 'bulk' | 'solo';
  selectedOption: PaymentOption;
  isLoading: boolean;
  onSelect: (option: 'bulk' | 'solo') => void;
}

interface FeatureRow {
  icon: React.ReactNode;
  label: string;
  soloValue: React.ReactNode;
  bulkValue: React.ReactNode;
}

const PaymentCard = ({ type, selectedOption, isLoading, onSelect }: PaymentCardProps) => {
  const isSelected = selectedOption === type;
  const config = {
    solo: { title: 'Paiement Individuel', description: 'Pour un retraité unique', longDescription: 'Effectuez des paiements ponctuels à un seul retraité. Parfait pour les ajustements, compléments ou paiements exceptionnels.', color: 'blue', icon: User },
    bulk: { title: 'Paiement en Masse', description: 'Pour plusieurs retraités', longDescription: 'Effectuez des paiements simultanés à plusieurs retraités. Idéal pour les versements mensuels réguliers ou les paiements de groupe.', color: 'green', icon: Users }
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;
  const color = currentConfig.color;

  return (
    <div className={`relative group cursor-pointer transition-all duration-300 ${isSelected ? 'scale-105' : ''}`} onClick={() => onSelect(type)}>
      <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 p-8 transition-all duration-300 ${isSelected ? `border-${color}-600 shadow-2xl` : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isSelected ? `bg-gradient-to-br from-${color}-500 to-${color}-600` : `bg-${color}-50`}`}>
                <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : `text-${color}-600`}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentConfig.title}</h3>
                <p className="text-gray-500">{currentConfig.description}</p>
              </div>
            </div>
            {isSelected && <div className={`flex items-center gap-2 px-3 py-1 bg-${color}-100 text-${color}-700 rounded-full text-sm font-semibold`}><CheckCircle className="w-4 h-4" /><span>Sélectionné</span></div>}
          </div>
          <p className="text-gray-700 mb-8 flex-grow">{currentConfig.longDescription}</p>
          <button className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${isSelected ? `bg-gradient-to-r from-${color}-600 to-${color}-700 text-white` : `bg-${color}-50 text-${color}-600 hover:bg-${color}-100`}`} disabled={isLoading}>
            {isLoading && isSelected ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Redirection...</span></> : <><span>Choisir ce mode</span><ArrowRight className="w-5 h-5" /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PaymentSelectionPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<PaymentOption>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedOption) {
      setIsLoading(true);
      const timer = setTimeout(() => router.push(`/dashboard/${selectedOption}`), 500);
      return () => clearTimeout(timer);
    }
  }, [selectedOption, router]);

  const handleSelection = (option: 'bulk' | 'solo') => {
    setSelectedOption(option);
  };

  const featureRows: FeatureRow[] = [
    { icon: <Clock className="w-5 h-5 text-blue-500" />, label: 'Temps de traitement', soloValue: <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Immédiat</span>, bulkValue: <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">1-2 minutes</span> },
    { icon: <Upload className="w-5 h-5 text-blue-500" />, label: 'Import de données', soloValue: <span className="text-gray-500">Manuel</span>, bulkValue: <span className="inline-flex items-center gap-1"><FileText className="w-4 h-4 text-emerald-600" /><span>Fichier Excel/CSV</span></span> },
    { icon: <BarChart3 className="w-5 h-5 text-blue-500" />, label: 'Rapport automatique', soloValue: <span className="text-gray-500">Basique</span>, bulkValue: <span className="inline-flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-600" /><span>Détaillé</span></span> },
    { icon: <Download className="w-5 h-5 text-blue-500" />, label: 'Export des données', soloValue: <span className="text-gray-500">Simple reçu</span>, bulkValue: <span className="inline-flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-600" /><span>Rapport complet</span></span> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Comment souhaitez-vous effectuer vos paiements ?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">PensiPay offre deux modes de paiement optimisés pour répondre à tous vos besoins</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <PaymentCard type="solo" selectedOption={selectedOption} isLoading={isLoading} onSelect={handleSelection} />
          <PaymentCard type="bulk" selectedOption={selectedOption} isLoading={isLoading} onSelect={handleSelection} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Comparatif des modes de paiement</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Fonctionnalité</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Paiement Individuel</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Paiement en Masse</th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, index) => (
                  <tr key={index} className={`${index < featureRows.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50`}>
                    <td className="py-4 px-6 flex items-center gap-3">{row.icon}<span>{row.label}</span></td>
                    <td className="text-center py-4 px-6">{row.soloValue}</td>
                    <td className="text-center py-4 px-6">{row.bulkValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}