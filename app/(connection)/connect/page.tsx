'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RetraitesPage() {
  const router = useRouter()
  const [form, setForm] = useState({ type: 'MSISDN', identifiant: '', numero: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const { error } = await supabase.from('retraites').insert([{
      user_id: user.id,
      type_identifiant: form.type,
      identifiant_partie: form.identifiant,
      numero: form.numero,
      Valide: true
    }])

    if (error) setMessage('Erreur: ' + error.message)
    else {
      setMessage('✅ Profil créé !')
      setTimeout(() => router.push('/historique'), 1500)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center  bg-white  justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Compléter profil</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
          <select 
            value={form.type} 
            onChange={e => setForm({...form, type: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="MSISDN">Téléphone</option>
            <option value="EMAIL">Email</option>
            <option value="IBAN">IBAN</option>
             <option value="ACCOUNT_ID">ACCOUNT_ID</option>
               <option value="PERSONAL_ID">PERSONAL_ID</option>
          
          </select>
          
          <input
            type="text"
            placeholder="Identifiant"
            value={form.identifiant}
            onChange={e => setForm({...form, identifiant: e.target.value})}
            className="w-full p-2 border rounded text-gray-500"
            required
          />
          
          <input
            type="tel"
            placeholder="Numéro (ex: +229612345678)"
            value={form.numero}
            onChange={e => setForm({...form, numero: e.target.value})}
            className="w-full p-2 border rounded text-gray-500"
            required
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'En cours...' : 'Enregistrer'}
          </button>
        </form>
        
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  )
}