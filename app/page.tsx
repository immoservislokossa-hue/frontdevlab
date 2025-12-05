import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Lock, 
  Smartphone, 
  Bell, 
  CreditCard, 
  BarChart3, 
  Users, 
  Building, 
  CheckCircle, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  Calendar,
  FileText,
  HelpCircle,
  Banknote,
  Clock,
  Shield,
  MessageCircle
} from "lucide-react";
import Header from "./components/layout/Header";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#fafafa]">
      <Header />

      {/* Hero Section avec image */}
      <section className="relative overflow-hidden py-16 md:py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Texte à gauche */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-8">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-semibold">Service Officiel du Gouvernement Béninois</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600  mb-6 leading-tight">
                PensiPay
                <span className="block text-xl md:text-2xl lg:text-3xl font-normal text-gray-600 mt-4">
                  Votre pension, simplifiée et sécurisée
                </span>
              </h1>
              
              <p className="text-lg text-gray-700 max-w-2xl mb-10 leading-relaxed">
                La plateforme gouvernementale qui révolutionne le versement des pensions au Bénin. 
                Plus de files d'attente, plus de paperasse. Recevez votre pension directement 
                sur votre compte avec une transparence totale.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/signup"
                  className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-md flex items-center justify-center gap-3 text-lg"
                >
                 
                  <span>Accéder à mon espace</span>
                 
                </a>
                <a
                  href="#help"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 border-2 border-blue-600 flex items-center justify-center gap-3"
                >
                 
                  <span>Découvrir comment ça marche</span>
                </a>
              </div>

           
            </div>

            {/* Image à droite */}
            <div className="lg:w-1/2 relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-blue-100">
                  <img 
                    src="/hero.png" 
                    alt="Retraité béninois utilisant PensionPay" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600/90 to-transparent p-6">
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
              SIMPLE ET EFFICACE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Comment <span className="text-blue-600">ça marche</span> ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trois étapes simples pour recevoir votre pension en toute tranquillité
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <FileText className="w-8 h-8" />,
                title: "Inscription",
                description: "Créez votre compte en ligne ou dans un centre agréé avec vos documents d'identité.",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "02",
                icon: <Smartphone className="w-8 h-8" />,
                title: "Validation",
                description: "Notre équipe valide votre dossier sous 48h et active votre compte.",
                color: "from-blue-600 to-blue-700"
              },
              {
                step: "03",
                icon: <Banknote className="w-8 h-8" />,
                title: "Reception",
                description: "Recevez votre pension chaque mois avec notification immédiate.",
                color: "from-blue-700 to-blue-800"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold text-xl shadow-lg`}>
                    {step.step}
                  </div>
                </div>
                <div className="pt-10 p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} text-white mb-6`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 px-6 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pourquoi choisir <span className="text-blue-600">PensiPay</span> ?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Gain de temps",
                description: "Fini les attentes interminables aux guichets"
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Sécurité garantie",
                description: "Service gouvernemental certifié et sécurisé"
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: "Notifications",
                description: "Alertes instantanées à chaque versement"
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "Support 7j/7",
                description: "Assistance dédiée aux retraités"
              }
            ].map((advantage, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <div className="text-blue-600">
                    {advantage.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{advantage.title}</h3>
                <p className="text-gray-600 text-sm">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Espace Personnel */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Votre espace <span className="text-blue-600">personnalisé</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Gérez votre pension en toute simplicité depuis votre tableau de bord personnel
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Solde en temps réel</h4>
                    <p className="text-gray-600">Consultez votre solde disponible à tout moment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Historique détaillé</h4>
                    <p className="text-gray-600">Tous vos versements depuis le début</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Documents en ligne</h4>
                    <p className="text-gray-600">Téléchargez vos attestations et reçus</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <a
                  href="#connect"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  Découvrir l'application mobile
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 shadow-lg">
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Solde disponible</div>
                      <div className="text-2xl font-bold text-gray-900">450 000 FCFA</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Prochain versement</div>
                      <div className="font-bold text-green-600">30 Nov 2024</div>
                    </div>
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-3/4"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900">Derniers versements</h4>
                  {[
                    { month: "Octobre 2024", amount: "450 000 FCFA", status: "Payé" },
                    { month: "Septembre 2024", amount: "450 000 FCFA", status: "Payé" },
                    { month: "Août 2024", amount: "450 000 FCFA", status: "Payé" }
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <Banknote className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{payment.month}</div>
                          <div className="text-sm text-gray-500">Pension de retraite</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{payment.amount}</div>
                        <div className="text-sm text-green-600">{payment.status}</div>
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
      <section className="py-20 px-6 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Questions <span className="text-blue-600">fréquentes</span>
            </h2>
          </div>
          
          <div className="space-y-4">
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
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 pl-8">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">PensionPay</h3>
                <p className="text-gray-600">Service Gouvernemental</p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-blue-600">Mentions légales</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Confidentialité</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Accessibilité</a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">© 2025 PensionPay - République du Bénin. Tous droits réservés.</p>
            <p className="text-gray-500 text-sm mt-2">Service gratuit pour tous les retraités béninois</p>
          </div>
        </div>
      </footer>
    </main>
  );
}