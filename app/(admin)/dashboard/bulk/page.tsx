"use client";

import { useState, FormEvent, useRef, useEffect } from 'react';
import { Upload, FileText, Send, Mic, HelpCircle, MessageSquare, Bot, User, AlertCircle, CheckCircle, Download, Clock, Shield, Cpu, Server, Headphones, X, FileUp, Loader } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
  type?: 'text' | 'file' | 'progress';
  progress?: number;
  fileName?: string;
};

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function ChatbotInterface() {
  // États pour le chat
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Bonjour ! Je suis l'assistant virtuel PensiPay. Je peux répondre à vos questions ou traiter vos fichiers CSV de paiements.", 
      sender: 'bot', 
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  
  // États pour l'upload CSV
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fonction pour ajouter un message au chat
  const addMessage = (text: string, sender: 'user' | 'bot' | 'system', type: 'text' | 'file' | 'progress' = 'text', extra = {}) => {
    const message: Message = {
      id: messages.length + 1,
      text,
      sender,
      timestamp: new Date(),
      type,
      ...extra
    };
    
    setMessages(prev => [...prev, message]);
  };

  // Fonction pour mettre à jour un message de progression
  const updateProgressMessage = (messageId: number, progress: number, text: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, progress, text, type: 'progress' as const }
        : msg
    ));
  };

  // Fonction pour envoyer un message texte
  const sendTextMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage(text, 'user');
    setInputMessage('');
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('message', text);

      const response = await fetch('http://20.199.136.163:5001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText || response.statusText}`);
      }

      const responseText = await response.text();
      let botResponse = responseText;
      
      try {
        const parsed = JSON.parse(responseText);
        botResponse = parsed.response || JSON.stringify(parsed);
      } catch (jsonError) {
        botResponse = responseText;
      }
      
      addMessage(botResponse, 'bot');
    } catch (error: any) {
      console.error('Erreur:', error);
      addMessage(`Désolé, une erreur s'est produite: ${error.message}. Veuillez réessayer.`, 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour enregistrer l'audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendAudioMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      addMessage("🎤 Enregistrement audio en cours...", 'user', 'text');
    } catch (error) {
      console.error('Erreur d\'accès au microphone:', error);
      alert('Impossible d\'accéder au microphone. Veuillez vérifier les permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Fonction pour envoyer un message audio
  const sendAudioMessage = async (audioBlob: Blob) => {
    setIsLoading(true);
    addMessage("[Message audio envoyé]", 'user', 'text');

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');

      const response = await fetch('http://20.199.136.163:5001/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText || response.statusText}`);
      }

      const responseText = await response.text();
      let botResponse = responseText;
      
      try {
        const parsed = JSON.parse(responseText);
        botResponse = parsed.response || JSON.stringify(parsed);
      } catch (jsonError) {
        botResponse = responseText;
      }
      
      addMessage(botResponse, 'bot');
    } catch (error: any) {
      console.error('Erreur:', error);
      addMessage(`Erreur de traitement audio: ${error.message}`, 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour gérer la sélection de fichier
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      addMessage(`📁 Fichier sélectionné: ${file.name}`, 'user', 'file', { fileName: file.name });
      handleFileUpload(file);
    }
  };

  // Fonction pour uploader le fichier CSV
  const handleFileUpload = async (file: File) => {
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Message de progression initial
    const progressMessageId = messages.length + 1;
    addMessage(`📤 Préparation de l'upload: ${file.name}...`, 'system', 'progress', { progress: 0, fileName: file.name });

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulation de progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min(prev + 10, 90);
          updateProgressMessage(
            progressMessageId, 
            newProgress, 
            `📤 Upload en cours: ${file.name}... ${newProgress}%`
          );
          return newProgress;
        });
      }, 500);

      const response = await fetch('http://20.199.136.163:5001/upload-csv', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      updateProgressMessage(
        progressMessageId, 
        100, 
        `✅ Upload terminé! Traitement en cours...`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText || response.statusText}`);
      }

      // Vérifier le type de contenu
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/zip') || 
          contentType?.includes('application/octet-stream') ||
          response.headers.get('content-disposition')?.includes('attachment')) {
        
        // Télécharger le fichier ZIP
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `rapport_paiements_${new Date().getTime()}.zip`;
        
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        updateProgressMessage(
          progressMessageId, 
          100, 
          `✅ Traitement réussi! Fichier téléchargé: ${filename}`
        );
        setUploadStatus('success');
        setUploadMessage(`✅ Fichier traité avec succès ! ${filename} a été téléchargé.`);
        
        // Ajouter un message de confirmation
        addMessage(`Le fichier ${file.name} a été traité avec succès. Le rapport a été téléchargé automatiquement.`, 'bot');
      } else {
        const text = await response.text();
        updateProgressMessage(
          progressMessageId, 
          100, 
          `✅ Succès: ${text.substring(0, 100)}...`
        );
        setUploadStatus('success');
        setUploadMessage(`✅ Succès: ${text.substring(0, 200)}...`);
        addMessage(`Traitement terminé: ${text.substring(0, 200)}...`, 'bot');
      }
    } catch (error: any) {
      console.error('Erreur upload:', error);
      updateProgressMessage(
        progressMessageId, 
        0, 
        `❌ Erreur: ${error.message || 'Échec du traitement'}`
      );
      setUploadStatus('error');
      setUploadMessage(`❌ Erreur: ${error.message || 'Connexion impossible au serveur'}`);
      addMessage(`Désolé, une erreur s'est produite lors du traitement du fichier: ${error.message}`, 'bot');
    }
  };

  // Fonction pour déclencher l'upload manuellement
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;
    const file = fileInput.files?.[0];
    
    if (!file) {
      addMessage("Veuillez sélectionner un fichier CSV d'abord.", 'bot');
      return;
    }

    await handleFileUpload(file);
  };

  // Fonction pour ouvrir le sélecteur de fichiers
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // Scroll automatique vers le bas
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">PensiPay Assistant</h1>
              <p className="text-blue-600 text-lg mt-2">Assistant IA & Traitement CSV en temps réel</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section Chat */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Chat Assistant</h2>
                    <p className="text-blue-600">Discutez ou traitez des fichiers CSV</p>
                  </div>
                </div>
                
                {/* Bouton Upload dans le header du chat */}
                <button
                  onClick={openFileSelector}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload CSV</span>
                </button>
              </div>

              {/* Zone de drop de fichier */}
              {showFileUpload && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200">
                  <div className="text-center">
                    <FileUp className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <p className="text-blue-700 font-medium mb-2">Déposez votre fichier CSV ici</p>
                    <p className="text-blue-600 text-sm mb-4">ou cliquez pour sélectionner</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={openFileSelector}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Parcourir les fichiers
                    </button>
                  </div>
                </div>
              )}

                  

              {/* Chat Input et Actions */}
              <div className="space-y-4">
                {/* Boutons d'action rapide */}
                 
                
                {/* Input fichier caché */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {isRecording && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-red-50 rounded-xl">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-red-700 font-medium">Enregistrement en cours... Cliquez à nouveau pour arrêter</span>
                  </div>
                )}
              </div>
            </div>

           
          </div>

          {/* Section Upload CSV détaillée */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Traitement CSV Avancé</h2>
                  <p className="text-blue-600">Interface détaillée pour les fichiers CSV</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Zone */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-900">
                    Fichier CSV des paiements
                  </label>
                  <div 
                    className="relative group cursor-pointer"
                    onClick={openFileSelector}
                  >
                    <div className="relative border-3 border-dashed border-blue-200 rounded-xl p-8 bg-blue-50/50 hover:bg-blue-50 transition-all duration-300 group-hover:border-blue-400">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-blue-600 rounded-full">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900 truncate max-w-xs">
                            {fileName ? fileName : 'Sélectionner un fichier CSV'}
                          </p>
                          <p className="text-blue-600 mt-2 text-sm">
                            {fileName ? 'Cliquez pour changer de fichier' : 'Cliquez pour parcourir'}
                          </p>
                        </div>
                        {fileName && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Fichier prêt</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  {uploadStatus === 'uploading' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 font-medium">Upload en cours...</span>
                        <span className="font-bold">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-blue-600 flex justify-between">
                        <span>Transfert...</span>
                        <span>Traitement...</span>
                        <span>Téléchargement...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={uploadStatus === 'uploading' || !fileName}
                  className="w-full group relative overflow-hidden rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300"></div>
                  <div className="relative flex justify-center items-center gap-3 py-4 px-6">
                    {uploadStatus === 'uploading' ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg font-bold text-white">Traitement en cours...</span>
                      </>
                    ) : (
                      <>
                        <div className="p-1.5 bg-white/20 rounded-lg">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">Traiter le fichier CSV</span>
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Status Message */}
              {uploadMessage && (
                <div className={`mt-6 p-5 rounded-xl border-2 transition-all duration-300 ${
                  uploadStatus === 'error' 
                    ? 'bg-red-50 border-red-200' 
                    : uploadStatus === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {uploadStatus === 'error' ? (
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : uploadStatus === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    )}
                    <div>
                      <p className={`font-semibold break-words ${
                        uploadStatus === 'error' ? 'text-red-700' : 
                        uploadStatus === 'success' ? 'text-green-700' : 
                        'text-blue-700'
                      }`}>
                        {uploadMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Instructions */}
            <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-blue-600" />
                Instructions Rapides
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>1.</strong> Cliquez sur "Upload CSV" dans le chat</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>2.</strong> Sélectionnez votre fichier CSV</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>3.</strong> Suivez la progression en temps réel</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>4.</strong> Le rapport se télécharge automatiquement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}