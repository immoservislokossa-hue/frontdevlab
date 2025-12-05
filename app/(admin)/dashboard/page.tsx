'use client';
import { useState, FormEvent } from 'react';

export default function Home() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;
    const file = fileInput.files?.[0];
    
    if (!file) return;

    setStatus('uploading');
    setMessage('Envoi du fichier en cours vers la VM (20.199.136.163)...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // On passe par notre API route locale pour éviter les problèmes de CORS
      const response = await fetch('/api/run-test', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors du transfert');
      }

      // Téléchargement du ZIP
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_mojaloop_${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      setStatus('success');
      setMessage('✅ Test terminé avec succès ! Le rapport a été téléchargé.');
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setMessage('❌ Erreur: ' + error.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Mojaloop Load Test</h1>
          <p className="text-gray-500">Interface de contrôle VM (20.199.136.163)</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fichier CSV de transactions
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="text-sm text-gray-500"><span className="font-semibold">Cliquez pour upload</span> ou glissez le fichier</p>
                  <p className="text-xs text-gray-500">CSV uniquement</p>
                </div>
                <input type="file" name="file" accept=".csv" required className="hidden" />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'uploading'}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all
              ${status === 'uploading' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-95'}`}
          >
            {status === 'uploading' ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </span>
            ) : 'Lancer le Test'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg border ${
            status === 'error' 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : status === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            <p className="text-center font-medium">{message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
