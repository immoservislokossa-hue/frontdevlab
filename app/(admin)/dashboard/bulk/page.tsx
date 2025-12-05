'use client';
import { useState, FormEvent, useRef } from 'react';
import { Upload, FileText, Cloud, Download, AlertCircle, CheckCircle, Server, Cpu, Clock, Shield } from 'lucide-react';

export default function Home() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;
    const file = fileInput.files?.[0];
    
    if (!file) return;

    setStatus('uploading');
    setMessage('Connexion à la VM en cours... Transfert du fichier CSV.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/run-test', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Échec de connexion avec la VM distante');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_paiements_${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      setStatus('success');
      setMessage('✅ Paiements traités avec succès ! Le rapport complet a été téléchargé.');
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setMessage(`❌ Erreur : ${error.message || 'Connexion impossible à la VM de paiement'}`);
    }
  };

  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
           
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Interface de Paiement</h1>
             
            </div>
          </div>
          
 
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Exécuter les Paiements</h2>
                  <p className="text-blue-600">Transférer le fichier CSV vers la VM de traitement</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* File Upload Zone */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-900">
                    Fichier CSV des paiements
                  </label>
                  <div 
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="relative border-3 border-dashed border-blue-200 rounded-xl p-8 bg-blue-50/50 hover:bg-blue-50 transition-all duration-300 group-hover:border-blue-400">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-blue-600 rounded-full">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">
                            {fileName ? fileName : 'Sélectionner un fichier CSV'}
                          </p>
                          <p className="text-blue-600 mt-2">
                            {fileName ? 'Cliquez pour changer de fichier' : 'Glissez-déposez ou cliquez pour parcourir'}
                          </p>
                          <p className="text-sm text-blue-500 mt-1">Format requis: .csv (UTF-8, séparateur virgule)</p>
                        </div>
                        {fileName && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Fichier prêt</span>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="file"
                        accept=".csv"
                        required
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'uploading'}
                  className="w-full group relative overflow-hidden rounded-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300"></div>
                  <div className="relative flex justify-center items-center gap-3 py-4 px-6">
                    {status === 'uploading' ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg font-bold text-white">Traitement en cours...</span>
                      </>
                    ) : (
                      <>
                        <div className="p-1.5 bg-white/20 rounded-lg">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">Lancer le traitement des paiements</span>
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Status Message */}
              {message && (
                <div className={`mt-8 p-5 rounded-xl border-2 transition-all duration-300 ${
                  status === 'error' 
                    ? 'bg-red-50 border-red-200' 
                    : status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {status === 'error' ? (
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : status === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    )}
                    <div>
                      <p className={`font-semibold ${
                        status === 'error' ? 'text-red-700' : 
                        status === 'success' ? 'text-green-700' : 
                        'text-blue-700'
                      }`}>
                        {message}
                      </p>
                      {status === 'uploading' && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <span className="text-sm text-blue-600">Connexion à la VM...</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <span className="text-sm text-blue-600">Transfert du fichier...</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <span className="text-sm text-blue-600">Exécution des paiements...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* VM Details Card */}

            {/* Instructions Card */}
            <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Instructions
              </h3>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-blue-700">Préparez votre fichier CSV avec la liste des paiements</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-blue-700">Téléversez le fichier via la zone de dépôt</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-blue-700">Les paiements sont exécutés automatiquement</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p className="text-blue-700">Téléchargez le rapport de confirmation</p>
                </li>
              </ol>
            </div>

            {/* Requirements Card */}
            <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Format CSV requis
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-600 mb-1">Structure des colonnes</p>
                  <code className="text-xs text-gray-900 block bg-white p-2 rounded border border-blue-100">
                  type_id,valeur_id,montant,nom_complet
                  </code>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-600 mb-1">Exemple de ligne</p>
                  <code className="text-xs text-gray-900 block bg-white p-2 rounded border border-blue-100">
                   PERSONAL_ID,5555555555,1500,Asiba
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

     
      </div>
    </main>
  );
}