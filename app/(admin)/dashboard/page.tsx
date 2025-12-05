"use client";

import ChatbotInterface from './ChatbotInterfaces';


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8">
      {/* Version 1: Chatbot simple */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Assistant PensiPay</h1>
        <ChatbotInterface />
      </div>

       
    </main>
  );
}