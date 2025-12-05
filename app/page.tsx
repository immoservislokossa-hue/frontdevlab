import React from "react";
import { 
  ShieldCheck, 
  FileText,
  Smartphone, 
  Banknote,
  Bell,
  Clock,
  Shield,
  MessageCircle,
  CheckCircle,
  Banknote as BanknoteIcon,
  HelpCircle
} from "lucide-react";
import Header from "./components/layout/Header";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#fafafa]">
      <Header />

      {/* Hero Section avec image */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            {/* Texte à gauche */}
            <div className="lg:w-1/2 w-full">
              
              
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 mb-4 md:mb-6 leading-tight">
                PensiPay
                <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-600 mt-2 sm:mt-3 md:mt-4">
                  Votre pension, simplifiée et sécurisée
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-gray-700 max-w-2xl mb-6 md:mb-10 leading-relaxed">
                La plateforme gouvernementale qui révolutionne le versement des pensions au Bénin. 
                Plus de files d'attente, plus de paperasse. Recevez votre pension directement 
                sur votre compte avec une transparence totale.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <a
                  href="/signup"
                  className="group px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-md flex items-center justify-center gap-2 md:gap-3 text-base md:text-lg"
                >
                  <span>Accéder à mon espace</span>
                </a>
                <a
                  href="#help"
                  className="px-6 py-3 md:px-8 md:py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 border-2 border-blue-600 flex items-center justify-center gap-2 md:gap-3 text-base md:text-lg"
                >
                  <span>Découvrir comment ça marche</span>
                </a>
              </div>
            </div>

            {/* Image à droite */}
            <div className="lg:w-1/2 w-full relative mt-8 lg:mt-0">
              <div className="relative">
                <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl md:rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl border border-blue-100">
                  <img 
                    src="/hero.png" 
                    alt="Retraité béninois utilisant PensionPay" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-block px-4 py-1.5 md:px-6 md:py-2 bg-blue-50 text-blue-700 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
              SIMPLE ET EFFICACE
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              Comment <span className="text-blue-600">ça marche</span> ?
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Trois étapes simples pour recevoir votre pension en toute tranquillité
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-0">
            {[
              {
                step: "01",
                icon: <FileText className="w-6 h-6 md:w-8 md:h-8" />,
                title: "Inscription",
                description: "Créez votre compte en ligne ou dans un centre agréé avec vos documents d'identité.",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "02",
                icon: <Smartphone className="w-6 h-6 md:w-8 md:h-8" />,
                title: "Validation",
                description: "Notre équipe valide votre dossier sous 48h et active votre compte.",
                color: "from-blue-600 to-blue-700"
              },
              {
                step: "03",
                icon: <Banknote className="w-6 h-6 md:w-8 md:h-8" />,
                title: "Reception",
                description: "Recevez votre pension chaque mois avec notification immédiate.",
                color: "from-blue-700 to-blue-800"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute -top-5 md:-top-6 left-1/2 transform -translate-x-1/2">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-lg`}>
                    {step.step}
                  </div>
                </div>
                <div className="pt-8 md:pt-10 p-6 md:p-8 bg-white rounded-xl md:rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-gradient-to-br ${step.color} text-white mb-4 md:mb-6`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">{step.title}</h3>
                  <p className="text-sm md:text-base text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              Pourquoi choisir <span className="text-blue-600">PensiPay</span> ?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 sm:px-0">
            {[
              {
                icon: <Clock className="w-5 h-5 md:w-6 md:h-6" />,
                title: "Gain de temps",
                description: "Fini les attentes interminables aux guichets"
              },
              {
                icon: <Shield className="w-5 h-5 md:w-6 md:h-6" />,
                title: "Sécurité garantie",
                description: "Service gouvernemental certifié et sécurisé"
              },
              {
                icon: <Bell className="w-5 h-5 md:w-6 md:h-6" />,
                title: "Notifications",
                description: "Alertes instantanées à chaque versement"
              },
              {
                icon: <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />,
                title: "Support 7j/7",
                description: "Assistance dédiée aux retraités"
              }
            ].map((advantage, index) => (
              <div 
                key={index}
                className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-3 md:mb-4">
                  <div className="text-blue-600">
                    {advantage.icon}
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">{advantage.title}</h3>
                <p className="text-xs md:text-sm text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Espace Personnel */}
      <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            <div className="lg:w-1/2 w-full">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                Votre espace <span className="text-blue-600">personnalisé</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
                Gérez votre pension en toute simplicité depuis votre tableau de bord personnel
              </p>
              
              <div className="space-y-4 md:space-y-6">
                {[
                  {
                    title: "Solde en temps réel",
                    description: "Consultez votre solde disponible à tout moment"
                  },
                  {
                    title: "Historique détaillé",
                    description: "Tous vos versements depuis le début"
                  },
                  {
                    title: "Documents en ligne",
                    description: "Téléchargez vos attestations et reçus"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 md:gap-4">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mt-0.5 md:mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm md:text-base text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 md:mt-8">
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm md:text-base"
                >
                  <Smartphone className="w-3 h-3 md:w-4 md:h-4" />
                  Découvrir le projet PensiPay
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-blue-100 shadow-lg">
                <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm mb-4 md:mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 md:mb-4 gap-2">
                    <div>
                      <div className="text-xs md:text-sm text-gray-500">Solde disponible</div>
                      <div className="text-xl md:text-2xl font-bold text-gray-900">450 000 FCFA</div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xs md:text-sm text-gray-500">Prochain versement</div>
                      <div className="font-bold text-green-600 text-sm md:text-base">30 Nov 2025</div>
                    </div>
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-3/4"></div>
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <h4 className="font-bold text-gray-900 text-base md:text-lg">Derniers versements</h4>
                  {[
                    { month: "Octobre 2025", amount: "450 000 FCFA", status: "Payé" },
                    { month: "Septembre 2025", amount: "450 000 FCFA", status: "Payé" },
                    { month: "Août 2025", amount: "450 000 FCFA", status: "Payé" }
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <BanknoteIcon className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm md:text-base">{payment.month}</div>
                          <div className="text-xs text-gray-500">Pension de retraite</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-sm md:text-base">{payment.amount}</div>
                        <div className="text-xs text-green-600">{payment.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              Questions <span className="text-blue-600">fréquentes</span>
            </h2>
          </div>
          
          <div className="space-y-3 md:space-y-4 px-4 sm:px-0">
            {[
              {
                q: "Comment m'inscrire à PensionPay ?",
                a: "Rendez-vous sur notre site internet ou dans l'un de nos centres agréés avec votre carte d'identité nationale et votre numéro de retraité. Notre équipe vous accompagnera dans toute la démarche."
              },
              {
                q: "Le service est-il vraiment gratuit ?",
                a: "Oui, PensionPay est un service entièrement gratuit offert par le Gouvernement Béninois à tous les retraités. Aucun frais n'est prélevé sur vos versements."
              },
              {
                q: "Puis-je utiliser PensionPay si je ne suis pas à l'aise avec la technologie ?",
                a: "Absolument ! Nos centres d'accueil sont là pour vous accompagner. De plus, l'interface a été spécialement conçue pour être simple et intuitive."
              },
              {
                q: "Comment être sûr de la sécurité de mes données ?",
                a: "PensionPay utilise les mêmes standards de sécurité que les banques et institutions gouvernementales. Vos données sont cryptées et protégées conformément aux lois béninoises."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg md:rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden"
              >
                <div className="p-4 md:p-6">
                  <h3 className="font-bold text-gray-900 mb-2 md:mb-3 flex items-start md:items-center gap-2 md:gap-3 text-sm md:text-base">
                    <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 md:mt-0 flex-shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 pl-6 md:pl-8 text-sm md:text-base">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="  justify-between items-center gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="flex items-center text-center gap-3">
              
              <div>
                <h3 className="text-xl md:text-2xl font-bold   text-gray-900">PensiPay</h3>
          
              </div>
            </div>
            
            
          </div>
          
          <div className="pt-6 md:pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm md:text-base">© 2025 PensionPay - République du Bénin. Tous droits réservés.</p>
            <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2">Service gratuit pour tous les retraités béninois</p>
          </div>
        </div>
      </footer>
    </main>
  );
}