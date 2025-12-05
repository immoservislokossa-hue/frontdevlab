// app/dashboard/solo/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  User,
  CreditCard,
  Calendar,
  FileText,
  ShieldCheck,
  Send,
  CheckCircle,
  Search,
  Building,
  Phone,
  Mail
} from 'lucide-react'

export default function SoloPaymentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulation de traitement
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      
      // Redirection après succès
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Paiement effectué avec succès !
            </h1>
            <p className="text-gray-600 mb-8">
              Le paiement a été traité et le retraité a été notifié.
              Vous allez être redirigé vers le tableau de bord.
            </p>
            <div className="animate-pulse">
              <div className="w-48 h-3 bg-green-200 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header avec retour */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au choix de paiement</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Paiement Individuel
              </h1>
              <p className="text-gray-600">
                Effectuez un paiement à un retraité unique
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire de paiement */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Informations du paiement
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Recherche du retraité */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rechercher un retraité
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nom, prénom ou numéro de retraité"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Montant */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant du paiement
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        FCFA
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>

                  {/* Date de paiement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de paiement
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Motif */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motif du paiement
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                      <option value="">Sélectionnez un motif</option>
                      <option value="pension">Pension mensuelle</option>
                      <option value="ajustement">Ajustement de pension</option>
                      <option value="complement">Complément exceptionnel</option>
                      <option value="autre">Autre paiement</option>
                    </select>
                  </div>

                  {/* Commentaire */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commentaire (optionnel)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ajoutez un commentaire pour ce paiement..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Bouton de soumission */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Traitement en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Effectuer le paiement</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Résumé de sécurité */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-900">Paiement sécurisé</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Chiffrement SSL 256-bit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Validation en temps réel</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Archivage automatique</span>
                </li>
              </ul>
            </div>

            {/* Informations */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Informations importantes</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    Un reçu digital sera envoyé au retraité et archivé dans votre espace.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    Le retraité recevra une notification SMS immédiatement après le paiement.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    Un email de confirmation vous sera envoyé avec tous les détails.
                  </p>
                </div>
              </div>
            </div>

            {/* Assistance */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Notre équipe est disponible pour vous accompagner.
              </p>
              <button
                onClick={() => router.push('/dashboard/help')}
                className="w-full py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Building className="w-4 h-4" />
                <span>Contacter le support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}