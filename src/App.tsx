import { useState, useEffect } from 'react'
import './App.css'

interface Progetto {
  id: number;
  titolo: string;
  descrizione: string;
}

function CardProgetto({ titolo, descrizione }: { titolo: string; descrizione: string }) {
  return (
    <article style={{
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      padding: '16px',
      borderRadius: '8px',
      margin: '10px 0',
      textAlign: 'left'
    }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#2563eb' }}>{titolo}</h3>
      <p style={{ margin: 0, color: '#4b5563' }}>{descrizione}</p>
    </article>
  );
}

function App() {
  const [saluti, setSaluti] = useState(0);
  const [progetti, setProgetti] = useState<Progetto[]>([]);

  // 👈 Stati per i campi del form controllato!
  const [titolo, setTitolo] = useState('');
  const [descrizione, setDescrizione] = useState('');

  // Funzione per scaricare i progetti dal server
  async function scaricaProgetti() {
    try {
      const risposta = await fetch('http://localhost:3000/api/progetti');
      const dati: Progetto[] = await risposta.json();
      setProgetti(dati);
    } catch (error) {
      console.error("Errore nel collegamento al backend:", error);
    }
  }

  useEffect(() => {
    scaricaProgetti();
  }, []);

  // 👈 Funzione per salvare il nuovo progetto sul server
  async function gestisciInvio(e: React.FormEvent) {
    e.preventDefault(); // Blocca il ricaricamento come sempre!

    try {
      const risposta = await fetch('http://localhost:3000/api/progetti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titolo, descrizione })
      });

      if (risposta.ok) {
        // 1. Ricarichiamo la lista dal database per vedere il nuovo arrivato!
        await scaricaProgetti();
        // 2. Svuotiamo i campi di testo
        setTitolo('');
        setDescrizione('');
      }
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
    }
  }

  return (
    <main style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{padding: "15px"}}>Portfolio React & TypeScript di Cesare</h1>
      <h2>Frontend Moderno collegato al Database</h2>

      <button 
        onClick={() => setSaluti(saluti + 1)}
        style={{
          backgroundColor: '#ea580c',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        👋 Manda un saluto (Ricevuti: {saluti})
      </button>

      {/* 👈 IL NOSTRO FORM IN REACT! */}
      <section style={{ marginTop: '30px', textAlign: 'left', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h3>Aggiungi un nuovo progetto:</h3>
        <form onSubmit={gestisciInvio} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Nome del progetto..." 
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            type="text" 
            placeholder="Descrizione..." 
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit"
            style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Aggiungi al Database
          </button>
        </form>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h3>Progetti salvati permanentemente nel Database:</h3>
        {progetti.length === 0 ? (
          <p>Caricamento progetti dal server in corso...</p>
        ) : (
          progetti.map((p) => (
            <CardProgetto 
              key={p.id} 
              titolo={p.titolo} 
              descrizione={p.descrizione} 
            />
          ))
        )}
      </section>
    </main>
  )
}

export default App