import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import csv from 'csv-parser'
import { Readable } from 'stream'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!)

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })

    const text = await file.text()
    const rows: any[] = []
    const stream = Readable.from([text])
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', row => rows.push(row))
        .on('end', resolve)
        .on('error', reject)
    })

    for (const row of rows) {
      const { type_id, valeur_id, nom_complet, montant, devise } = row

      // 1️⃣ Insérer dans Supabase
      const { error: supaError } = await supabase.from('paiements').insert([{
        type_id, valeur_id, nom_complet, montant, devise
      }])
      if (supaError) throw supaError

      // 2️⃣ Transfert vers backend Python
      const res = await fetch('http://20.199.136.163:5000/transfer-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: valeur_id, amount: montant })
      })
      if (!res.ok) throw new Error('Erreur backend Python')
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
