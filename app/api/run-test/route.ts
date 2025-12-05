import { NextRequest, NextResponse } from 'next/server';

// Cette route agit comme un proxy pour contourner les problèmes de CORS
// Le navigateur appelle cette route, et le serveur Next.js appelle la VM
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Préparation de l'envoi vers la VM
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // URL de la VM (IP Publique)
    const backendUrl = 'http://20.199.136.163:5000/transfer-bulk';
    
    console.log(`Proxy: Envoi du fichier vers ${backendUrl}...`);

    const response = await fetch(backendUrl, {
      method: 'POST',
      body: backendFormData,
      // Ne pas définir Content-Type manuellement avec FormData
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Erreur Backend:', text);
      return NextResponse.json(
        { error: `Erreur du serveur de test (${response.status}): ${text}` }, 
        { status: response.status }
      );
    }

    // Récupération du flux ZIP
    const blob = await response.blob();
    
    // Renvoi du ZIP au client
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="rapport_mojaloop.zip"',
      },
    });

  } catch (error: any) {
    console.error('Erreur Proxy:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur proxy: ' + error.message }, 
      { status: 500 }
    );
  }
}
