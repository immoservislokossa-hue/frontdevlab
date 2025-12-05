'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle, AlertCircle, Loader2, Wallet, RefreshCcw } from 'lucide-react';

export default function TransferPage() {
  const [formData, setFormData] = useState({ id: '', amount: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResult(null);

    try {
      const response = await fetch('http://20.199.136.163:5000/transfer-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
          id: formData.id,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await response.json();

      if (response.ok && (data.status === 'PROCESSED' || data.status === 'SUCCESS')) {
        setStatus('success');
        setResult(data);
      } else {
        setStatus('error');
        setResult(data);
      }
    } catch (error) {
      setStatus('error');
      setResult({ error: "Impossible de contacter le serveur intermédiaire." });
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setFormData({ id: '', amount: '' });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-[#1E40AF] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
              <span className="bg-[#3B82F6] w-2 h-8 rounded-full block"></span>
              MOJALOOP TRANSFER
            </h1>
            <p className="text-slate-300 text-sm mt-2 ml-4">
              Paiement unitaire via moteur Bulk
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="p-6 space-y-6">
          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Identifiant Bénéficiaire
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none transition bg-slate-50 focus:bg-white"
                  placeholder="Ex: 22912345678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Montant à envoyer
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none transition bg-slate-50 focus:bg-white font-mono text-lg font-bold text-[#1E40AF]"
                    placeholder="5000"
                    required
                    min="1"
                  />
                  <span className="absolute right-4 top-3.5 text-slate-400 font-bold text-sm bg-slate-100 px-2 py-0.5 rounded">
                    XOF
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Traitement en cours...
                  </>
                ) : (
                  <>
                    Confirmer le transfert <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#DBEAFE] border border-[#3B82F6] rounded-xl p-6 text-center mb-6">
                <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1E40AF] mb-1">Transfert Réussi !</h2>
                <p className="text-[#3B82F6] font-medium">Les fonds ont été envoyés.</p>
              </div>

              {result?.details && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-500 text-sm">Montant</span>
                    <span className="text-xl font-bold text-[#1E40AF]">{result.details.amount} XOF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Bénéficiaire</span>
                    <span className="font-medium text-slate-800">{result.details.id_value}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">ID Transfert</span>
                    <span className="font-mono text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                      {result.details.transfer_id?.substring(0, 18)}...
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Nom</span>
                    <span className="font-medium text-slate-800">{result.details.name}</span>
                  </div>
                </div>
              )}

              <button
                onClick={resetForm}
                className="w-full bg-white text-[#1E40AF] border-2 border-[#1E40AF] font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" /> Nouveau Transfert
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-in shake">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-800">Échec de la transaction</h3>
                  <p className="text-sm text-red-700 mt-1">
                    {result?.error || "Le serveur Mojaloop n'a pas répondu favorablement."}
                  </p>
                  {result?.details && (
                     <p className="text-xs font-mono text-red-600 mt-2 bg-red-100 p-2 rounded">
                       {JSON.stringify(result.details)}
                     </p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
