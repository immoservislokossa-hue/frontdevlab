'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle,
  FileText,
  BarChart3,
  Download,
  Upload,
  Building,
  CreditCard
} from 'lucide-react'

export default function PaymentSelectionPage() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<'bulk' | 'solo' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelection = (option: 'bulk' | 'solo') => {
    setSelectedOption(option)
    setIsLoading(true)
    
    // Simulation d'un délai pour l'animation
    setTimeout(() => {
      if (option === 'bulk') {
        router.push('/dashboard/bulk')
      } else {
        router.push('/dashboard/solo')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
       

        {/* Section de sélection */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Comment souhaitez-vous effectuer vos paiements ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            PensiPay offre deux modes de paiement optimisés pour répondre à tous vos besoins
          </p>
        </div>

        {/* Options de paiement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Option Paiement Individuel */}
          <div 
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedOption === 'solo' ? 'scale-105' : ''
            }`}
            onClick={() => handleSelection('solo')}
          >
            {/* Image de fond pour paiement individuel */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Paiement individuel"
                className="w-full h-full object-cover opacity-25 group-hover:opacity-30 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5"></div>
            </div>
            
            <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 p-8 transition-all duration-300 ${
              selectedOption === 'solo' 
                ? 'border-blue-600 shadow-2xl' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
            }`}>
              <div className="flex flex-col h-full">
                {/* En-tête de la carte */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      selectedOption === 'solo' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                        : 'bg-blue-50'
                    }`}>
                      <User className={`w-8 h-8 ${
                        selectedOption === 'solo' ? 'text-white' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Paiement Individuel</h3>
                      <p className="text-gray-500">Pour un retraité unique</p>
                    </div>
                  </div>
                  
                  {selectedOption === 'solo' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Sélectionné</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-8 flex-grow">
                  Effectuez des paiements ponctuels à un seul retraité. 
                  Parfait pour les ajustements, compléments ou paiements exceptionnels.
                </p>

                {/* Bouton d'action */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${
                    selectedOption === 'solo'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                  onClick={() => handleSelection('solo')}
                  disabled={isLoading}
                >
                  {isLoading && selectedOption === 'solo' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Redirection...</span>
                    </>
                  ) : (
                    <>
                      <span>Choisir ce mode</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Option Paiement en Masse */}
          <div 
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedOption === 'bulk' ? 'scale-105' : ''
            }`}
            onClick={() => handleSelection('bulk')}
          >
            {/* Image de fond pour paiement en masse */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Paiement en masse"
                className="w-full h-full object-cover opacity-25 group-hover:opacity-30 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-600/5"></div>
            </div>
            
            <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 p-8 transition-all duration-300 ${
              selectedOption === 'bulk' 
                ? 'border-emerald-600 shadow-2xl' 
                : 'border-gray-200 hover:border-emerald-300 hover:shadow-xl'
            }`}>
              <div className="flex flex-col h-full">
                {/* En-tête de la carte */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      selectedOption === 'bulk' 
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                        : 'bg-emerald-50'
                    }`}>
                      <Users className={`w-8 h-8 ${
                        selectedOption === 'bulk' ? 'text-white' : 'text-emerald-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Paiement en Masse</h3>
                      <p className="text-gray-500">Pour plusieurs retraités</p>
                    </div>
                  </div>
                  
                  {selectedOption === 'bulk' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Sélectionné</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-8 flex-grow">
                  Effectuez des paiements simultanés à plusieurs retraités. 
                  Idéal pour les versements mensuels réguliers ou les paiements de groupe.
                </p>

                {/* Bouton d'action */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${
                    selectedOption === 'bulk'
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                  onClick={() => handleSelection('bulk')}
                  disabled={isLoading}
                >
                  {isLoading && selectedOption === 'bulk' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Redirection...</span>
                    </>
                  ) : (
                    <>
                      <span>Choisir ce mode</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau comparatif */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Comparatif des modes de paiement
          </h3>
          
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
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span>Temps de traitement</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Immédiat
                    </span>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                      1-2 minutes
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5 text-blue-500" />
                      <span>Import de données</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="text-gray-500">Manuel</span>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Fichier Excel/CSV</span>
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      <span>Rapport automatique</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="text-gray-500">Basique</span>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Détaillé</span>
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-blue-500" />
                      <span>Export des données</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="text-gray-500">Simple reçu</span>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Rapport complet</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}