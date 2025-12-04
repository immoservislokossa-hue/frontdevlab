"use client";

import { useState } from "react";

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loadingZip, setLoadingZip] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Sélectionne un fichier CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Erreur côté backend Python");
      return;
    }

    const data = await res.json();
    console.log("Réponse backend :", data);
    alert("Upload réussi !");
  };

  const handleDownloadZip = async () => {
    try {
      setLoadingZip(true);

      const res = await fetch("http://localhost:8000/download-zip", {
        method: "GET",
      });

      if (!res.ok) {
        alert("Erreur lors de la récupération du ZIP.");
        setLoadingZip(false);
        return;
      }

      const blob = await res.blob();

      // Création d’un lien temporaire pour déclencher le téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "data.zip"; // Nom du fichier qui sera téléchargé
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      setLoadingZip(false);
    } catch (err) {
      console.error(err);
      alert("Impossible de télécharger le ZIP.");
      setLoadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200">
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Upload & Download
        </h1>

        <label
          htmlFor="csvFile"
          className="block mb-3 text-gray-700 font-medium"
        >
          Sélectionne ton fichier CSV :
        </label>

        <input
          id="csvFile"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-6"
        />

        <button
          onClick={handleUpload}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm mb-4"
        >
          Envoyer le fichier
        </button>

        <button
          onClick={handleDownloadZip}
          className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-sm"
        >
          {loadingZip ? "Téléchargement..." : "Télécharger le ZIP"}
        </button>

        {file && (
          <p className="text-sm text-gray-600 mt-4 text-center">
            Fichier sélectionné : <span className="font-medium">{file.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}
