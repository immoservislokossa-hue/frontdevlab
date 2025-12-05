import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Crée un client Supabase (pas d'auth nécessaire)
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 1️⃣ Insérer dans la table Supabase
    const { error: supabaseError } = await supabase
      .from('paiements')
      .insert([{
        type_id: body.type_id,
        valeur_id: body.valeur_id,
        nom_complet: body.nom_complet,
        devise: body.devise || 'FCFA',
        montant: body.montant,
        date_paiement: body.date_paiement || new Date().toISOString()
      }])

    if (supabaseError) {
      console.error('Erreur Supabase:', supabaseError)
      return NextResponse.json({ error: 'Impossible de sauvegarder le paiement' }, { status: 500 })
    }

    // 2️⃣ Envoyer au backend Python
    const PYTHON_API_URL = 'http://20.199.136.163:5000/transfer-single'

    const res = await fetch(PYTHON_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: body.valeur_id,        // ID du bénéficiaire
        montant: body.montant      // Montant
      })
    })

    const data = await res.json()

    // 3️⃣ Retourner la réponse du backend Python
    return NextResponse.json(data, { status: res.status })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erreur de communication avec le serveur de paiement' },
      { status: 500 }
    )
  }
}
