"use client";

import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Send, Mic, Bot, User, AlertCircle, CheckCircle, Loader, X, HelpCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
  type?: 'text' | 'file' | 'progress';
  progress?: number;
  fileName?: string;
};

type ChatbotInterfaceProps = {
  apiEndpoint?: string;
  uploadEndpoint?: string;
  welcomeMessage?: string;
  showHeader?: boolean;
  compact?: boolean;
  botName?: string;
  botAvatar?: string;
  userAvatar?: string;
};

export default function ChatbotInterface({
  apiEndpoint = 'http://20.199.136.163:5001/chat',
  uploadEndpoint = 'http://20.199.136.163:5001/upload-csv',
  welcomeMessage = "Bonjour ! Je suis l'assistant virtuel PensiPay. Je peux répondre à vos questions ou traiter vos fichiers CSV de paiements.",
  showHeader = true,
  compact = false,
  botName = "Assistant PensiPay",
  botAvatar = "/profile.png",
  userAvatar = "/user-avatar.png"
}: ChatbotInterfaceProps) {
  // États pour le chat
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: welcomeMessage, 
      sender: 'bot', 
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

      const response = await fetch(apiEndpoint, {
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

      const response = await fetch(apiEndpoint, {
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

      const response = await fetch(uploadEndpoint, {
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
        
        // Ajouter un message de confirmation
        addMessage(`Le fichier ${file.name} a été traité avec succès. Le rapport a été téléchargé automatiquement.`, 'bot');
      } else {
        const text = await response.text();
        updateProgressMessage(
          progressMessageId, 
          100, 
          `✅ Succès: ${text.substring(0, 100)}...`
        );
        addMessage(`Traitement terminé: ${text.substring(0, 200)}...`, 'bot');
      }
    } catch (error: any) {
      console.error('Erreur upload:', error);
      updateProgressMessage(
        progressMessageId, 
        0, 
        `❌ Erreur: ${error.message || 'Échec du traitement'}`
      );
      addMessage(`Désolé, une erreur s'est produite lors du traitement du fichier: ${error.message}`, 'bot');
    }
  };

  // Fonction pour ouvrir le sélecteur de fichiers
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // Fonction pour effacer l'historique du chat
  const clearChat = () => {
    setMessages([
      { 
        id: 1, 
        text: welcomeMessage, 
        sender: 'bot', 
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  };

  // Scroll automatique vers le bas
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`bg-white rounded-2xl border-2 border-blue-100 shadow-lg ${compact ? 'p-4' : 'p-6'}`}>
      {/* Header du Chatbot */}
      {showHeader && (
        <div className={`flex items-center justify-between mb-6 ${compact ? 'pb-4 border-b border-blue-100' : ''}`}>
          <div className="flex items-center gap-3">
            {/* Avatar de l'assistant - Photo agrandie */}
            <div className={`relative ${compact ? 'w-12 h-12' : 'w-14 h-14'} rounded-full overflow-hidden border-2 border-blue-500 shadow-lg`}>
              {botAvatar ? (
                <Image
                  src={botAvatar}
                  alt={botName}
                  fill
                  className="object-cover"
                  
                  sizes="(max-width: 768px) 89px, 56px"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">{botName}</h2>
              <p className="text-blue-600 text-sm">IA & Traitement CSV</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Effacer la conversation"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={() => addMessage("Je peux vous aider avec :\n• Questions sur les paiements\n• Traitement de fichiers CSV\n• Informations sur les pensions\n\nQue souhaitez-vous faire ?", 'bot')}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Aide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Messages du Chat */}
      <div 
        ref={chatContainerRef}
        className={`mb-6 ${compact ? 'h-64' : 'h-96'} overflow-y-auto p-4 bg-gray-50 rounded-xl border border-blue-100`}
      >
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : message.sender === 'system' ? 'justify-center' : 'justify-start'} gap-3`}
            >
              {/* Avatar pour les messages de l'assistant et de l'utilisateur */}
              {message.sender !== 'system' && (
                <div className={`flex-shrink-0 ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}>
                  {message.sender === 'user' ? (
                    <div className={`relative w-full h-full rounded-full overflow-hidden border-2 border-blue-300 shadow-md`}>
                      {userAvatar ? (
                        <Image
                          src={userAvatar}
                          alt="Vous"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 32px, 40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <User className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} />
                        </div>
                      )}
                    </div>
                  ) : message.sender === 'bot' ? (
                    <div className={`relative w-full h-full rounded-full overflow-hidden border-2 border-blue-500 shadow-lg`}>
                      {botAvatar ? (
                        <Image
                          src={botAvatar}
                          alt={botName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 32px, 40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                          <Bot className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Contenu du message */}
              <div className={`flex-1 max-w-[85%] ${message.sender === 'system' ? 'w-full' : ''}`}>
                <div
                  className={`rounded-2xl p-4 ${compact ? 'p-3' : 'p-4'} ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : message.sender === 'system'
                      ? 'bg-blue-100 border border-blue-200 text-blue-800'
                      : 'bg-white border border-blue-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {/* En-tête du message avec nom et heure */}
                  {message.sender !== 'system' && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">
                        {message.sender === 'user' ? 'Vous' : botName}
                      </span>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                  
                  {/* Contenu spécifique selon le type */}
                  {message.type === 'file' ? (
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                      <div className="max-w-full overflow-hidden">
                        <p className={`font-medium truncate ${compact ? 'text-xs' : 'text-sm md:text-base'}`}>{message.fileName}</p>
                        <p className={`opacity-80 truncate ${compact ? 'text-xs' : 'text-sm'}`}>{message.text}</p>
                      </div>
                    </div>
                  ) : message.type === 'progress' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`truncate max-w-[70%] ${compact ? 'text-xs' : 'text-sm md:text-base'}`}>{message.text}</span>
                        <span className={`font-bold whitespace-nowrap ${compact ? 'text-xs' : 'text-sm'}`}>{message.progress}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-1.5 md:h-2">
                        <div 
                          className="bg-blue-600 h-1.5 md:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${message.progress}%` }}
                        ></div>
                      </div>
                      {message.progress === 100 && (
                        <div className="flex items-center gap-1 text-green-600 mt-1">
                          <CheckCircle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                          <span className={`${compact ? 'text-xs' : 'text-sm'}`}>Terminé! Téléchargement automatique...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className={`whitespace-pre-wrap break-words ${compact ? 'text-xs' : 'text-sm md:text-base'}`}>
                      {message.text}
                    </p>
                  )}
                </div>
              </div>

              {/* Avatar pour les messages système (centré) */}
              {message.sender === 'system' && (
                <div className={`flex-shrink-0 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}>
                  <div className={`relative w-full h-full rounded-full overflow-hidden border-2 border-blue-300 shadow-md`}>
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <Loader className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-blue-600 animate-spin`} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className={`flex-shrink-0 ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}>
                <div className={`relative w-full h-full rounded-full overflow-hidden border-2 border-blue-500 shadow-lg`}>
                  {botAvatar ? (
                    <Image
                      src={botAvatar}
                      alt={botName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 32px, 40px"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                      <Bot className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white border border-blue-100 rounded-2xl rounded-bl-none p-4 max-w-[85%]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full animate-pulse delay-300"></div>
                  <span className="text-xs md:text-sm text-blue-600 ml-2">Assistant réfléchit...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input et Actions */}
      <div className="space-y-4">
        {/* Boutons d'action rapide */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={openFileSelector}
            className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs md:text-sm"
          >
            <FileText className="w-3 h-3 md:w-4 md:h-4" />
            <span>Upload CSV</span>
          </button>
          <button
            onClick={() => addMessage("Questions fréquentes:\n\n1. Comment traiter un fichier CSV ?\n   → Cliquez sur 'Upload CSV'\n\n2. Format CSV requis :\n   type_id,valeur_id,montant,nom_complet\n\n3. Exemple :\n   PERSONAL_ID,5555555555,1500,Asiba", 'bot')}
            className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs md:text-sm"
          >
            <HelpCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span>Aide CSV</span>
          </button>
        </div>

        {/* Input principal */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendTextMessage(inputMessage)}
            placeholder="Posez votre question ou sélectionnez un fichier CSV..."
            className={`flex-1 ${compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'} bg-gray-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-400`}
            disabled={isLoading}
          />
          <button
            onClick={() => sendTextMessage(inputMessage)}
            disabled={isLoading || !inputMessage.trim()}
            className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} rounded-xl flex items-center justify-center ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Mic className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        
        {/* Input fichier caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isRecording && (
          <div className="flex items-center justify-center gap-2 p-2 bg-red-50 rounded-xl">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-red-700 font-medium text-xs md:text-sm">Enregistrement en cours... Cliquez à nouveau pour arrêter</span>
          </div>
        )}

        {/* Barre de progression active */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-blue-700 font-medium">Upload en cours...</span>
              <span className="font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      
      </div>
   
  );
}