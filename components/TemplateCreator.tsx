
import React, { useState, useMemo } from 'react';
import { OperationalEvent, EventStatus, PersonnelRequirement } from '../types';

const ALL_SPECIALIZATIONS = [
  "AUTISTA DI 1^ GRADO", "OPERATORE AVANZATO TAS (TAS2)", "AUTISTA DI 4^ GRADO", "OPERATORE BASE TAS (TAS1)",
  "SAF FLUVIALE", "SAF 1B", "SAF 2A", "SALVAMENTO A NUOTO", "TECNICHE PRIMO SOCCORSO",
  "URBAN SEARCH & RESCUE LIGHT", "AUTISTA DI 2^ GRADO", "(NBCR) NUCLEO BATTERIOLOGICO",
  "AUTISTA DI 3^ GRADO", "NUCLEO BATTERIOLOGICO LIV. 2", "PATENTE NAUTICA 1^ CAT.",
  "URBAN SEARCH & RESCUE MEDIUM", "NBCR TRAVASI LPG", "NUCLEO BATTERIOLOGICO LIV. 3",
  "SAF BASICO", "ESTENSIONE AS/PIATT. AEREA", "POLIZIA GIUDIZIARIA", "PUNTELLAMENTI E COSTRUZIONI",
  "SOCCORRITORE AEROPORTUALE", "AUTOPROT. AMBIENTE ACQUATICO", "CORSO AEROPORTUALE",
  "AUTISTA DI 1^ GRADO LIM.", "OPERAT. CENTRALE OPERATIVA 115", "PREVENZIONE INCENDI MODULO 1-2",
  "SOCCORSO ACQUATICO", "NBCR ISTRUTTORE PRATICA NBCR", "NBCR SQUADRE AVANZATE NR",
  "NUCLEI INVESTIG. ANTINCENDIO", "ESTENSIONE AUTOGRU", "GUIDA SU TERRENO NON PREPARATO",
  "PREVENZIONE INCENDI MODULI 5-8", "PREVENZIONE INCENDI MODULO 3-4", "PREVENZIONE INCENDI MODULO 5-6",
  "SAF 1A", "CONDUTTORE MOTO D'ACQUA (PWC)", "DIRETTORE OPER. SPEGNIMENTO", "PATENTE NAUTICA 2^ CAT.",
  "ADD. SERVIZIO PREV. E PROT.", "SOMMOZZATORE", "AUTISTA DI 3^ GRADO LIM.", "MOVIMENTO TERRA",
  "PAT. NAUTICA 1^CAT.+ANFIBI", "PAT. NAUTICA 2^CAT.+ANFIBI", "DIRETTIVO TAS", "RADIOMETRIA E RADIOATTIVITA'",
  "NBCR LIVELLO 0", "AUTISTA DI 2^ GRADO LIM.", "SPELEO ALPINO FLUVIALI", "ESTENSIONE MEZZI AEROPORTUALI",
  "ATTREZZATURE DI SOCCORSO", "NBCR LIVELLO 1", "TEORIA AEROPORTUALE", "ISTRUTTORE GINNICO",
  "ACQUATICITA'", "ANTINCENDIO BOSCHIVO", "BLS BASE", "AUTISTA ANFIBI", "ISTRUTTORE ATP",
  "COEM ROSSO ADDETTO MONTAGGIO", "PREVENZIONE INCENDI", "NBCR LIVELLO 2)", "ISTRUTTORE SAF BASICO",
  "ADDETTO SO MODULO INFORMATICO", "ISTRUTTORE T.P.S.S.", "ANTINCENDIO NAVALE", "ADDETTO SO MODULO TLC",
  "CONDUTTORE NATANTI FINO HP 80", "INFORMATICA APPLICATA", "CINOFILO", "NIA 2 LIVELLO",
  "PRATICA AEROPORTUALE", "SOSTANZE PERICOLOSE"
];

interface TemplateCreatorProps {
  onSave: (event: OperationalEvent) => void;
  defaultDate: string;
}

export const TemplateCreator: React.FC<TemplateCreatorProps> = ({ onSave, defaultDate }) => {
  const [formData, setFormData] = useState({
    code: '',
    location: '',
    date: defaultDate,
    start: '08:00',
    end: '16:00',
    isOlympic: false
  });

  const [reqs, setReqs] = useState<{role: 'DIR' | 'CP' | 'VIG' | 'AUT', qty: number}[]>([
    { role: 'DIR', qty: 1 },
    { role: 'CP', qty: 1 },
    { role: 'VIG', qty: 2 },
    { role: 'AUT', qty: 1 }
  ]);

  const [vehicles, setVehicles] = useState({
    APS: 1,
    AS: 0,
    AUTO: 1
  });

  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [specSearch, setSpecSearch] = useState('');
  const [isSpecMenuOpen, setIsSpecMenuOpen] = useState(false);

  const filteredSpecs = useMemo(() => {
    return ALL_SPECIALIZATIONS.filter(s => 
      s.toLowerCase().includes(specSearch.toLowerCase()) && !selectedSpecs.includes(s)
    ).slice(0, 8);
  }, [specSearch, selectedSpecs]);

  const addReq = () => setReqs([...reqs, { role: 'VIG', qty: 1 }]);
  const removeReq = (index: number) => setReqs(reqs.filter((_, i) => i !== index));
  const updateReq = (index: number, key: 'role' | 'qty', val: any) => {
    const newReqs = [...reqs];
    newReqs[index] = { ...newReqs[index], [key]: val };
    setReqs(newReqs);
  };

  const toggleSpec = (spec: string) => {
    setSelectedSpecs(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
    setSpecSearch('');
  };

  const handleSave = () => {
    if (!formData.code || !formData.location || !formData.date) {
      alert("Completare Codice, Luogo e Data prima di procedere.");
      return;
    }

    const newEvent: OperationalEvent = {
      id: `EV-${Math.floor(Math.random() * 9000) + 1000}`,
      code: formData.code.toUpperCase(),
      location: formData.location.toUpperCase(),
      date: formData.date,
      timeWindow: `${formData.start} - ${formData.end}`,
      status: EventStatus.IN_COMPILAZIONE, 
      vehicles: { ...vehicles },
      isOlympic: formData.isOlympic,
      requiredSpecializations: selectedSpecs,
      requirements: reqs.map(r => ({
        role: r.role,
        qty: r.qty,
        assignedIds: []
      })) as PersonnelRequirement[]
    };

    onSave(newEvent);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1700px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom duration-700 pb-32">
      <div className="flex justify-between items-center border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">Pianificazione Nuovo Servizio</h1>
          <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-[0.2em]">Configurazione operativa e assegnazione assetti iniziali</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocollo</span>
                <span className="text-xs font-mono font-bold text-slate-800">MOD-OP-VVF-2025</span>
            </div>
            <div className="w-14 h-14 bg-[#720000] rounded-2xl flex items-center justify-center text-amber-400 font-black text-xl shadow-xl border border-white/20">
                P1
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLONNA 1: ANAGRAFICA */}
        <div className="diamond-card p-8 bg-blue-50/40 border border-blue-100 flex flex-col h-full rounded-3xl">
          <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-black text-xs">1</div>
              <h3 className="text-xs font-black text-blue-800 tracking-widest uppercase">Anagrafica Intervento</h3>
          </div>
          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between bg-white/50 p-4 rounded-2xl border border-blue-100 mb-2 shadow-sm">
                <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Contesto Olimpiadi</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.isOlympic} onChange={e => setFormData({...formData, isOlympic: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A40E]"></div>
                </label>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Data del Servizio</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-white border border-blue-200 rounded-2xl px-5 py-4 text-sm font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm appearance-none cursor-pointer uppercase" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Nome Protocollo / Servizio</label>
              <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="ES: INCENDIO-B" className="w-full bg-white/80 border border-blue-200 rounded-2xl px-5 py-4 text-lg font-black uppercase placeholder:text-slate-200 shadow-sm" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Ubicazione Dettagliata</label>
              <textarea value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Indirizzo o riferimento territoriale" className="w-full bg-white/80 border border-blue-200 rounded-2xl px-5 py-4 text-sm font-bold uppercase resize-none h-24 shadow-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Ora Inizio</label>
                <input type="time" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} className="w-full bg-white/80 border border-blue-200 rounded-2xl p-4 text-sm font-mono font-medium shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Ora Fine</label>
                <input type="time" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} className="w-full bg-white/80 border border-blue-200 rounded-2xl p-4 text-sm font-mono font-medium shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* COLONNA 2: PERSONALE E SPECIALIZZAZIONI */}
        <div className="diamond-card p-8 bg-red-50/40 border border-red-100 flex flex-col h-full rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-black text-xs">2</div>
                <h3 className="text-xs font-black text-red-800 tracking-widest uppercase">Fabbisogno Personale</h3>
            </div>
            <button onClick={addReq} className="text-[9px] font-black bg-[#720000] text-white px-3 py-1.5 rounded-lg uppercase transition-transform active:scale-95 shadow-md">+ Aggiungi Ruolo</button>
          </div>
          
          <div className="space-y-4 mb-8">
            {reqs.map((r, i) => (
              <div key={i} className="flex gap-3 items-center bg-white/80 p-3 rounded-2xl border border-red-100 shadow-sm transition-all hover:shadow-md">
                <select value={r.role} onChange={e => updateReq(i, 'role', e.target.value as any)} className="flex-1 bg-transparent border-none text-[11px] font-black uppercase focus:outline-none text-slate-700 cursor-pointer">
                    <option value="DIR">DIR</option>
                    <option value="CP">CP</option>
                    <option value="VIG">VIG</option>
                    <option value="AUT">AUT</option>
                </select>
                <div className="flex items-center gap-2 border-l border-red-50 pl-3">
                   <span className="text-[8px] font-black text-slate-400">QTY</span>
                   <input type="number" min="1" value={r.qty} onChange={e => updateReq(i, 'qty', parseInt(e.target.value) || 0)} className="w-12 bg-slate-50 border border-slate-200 rounded-xl py-1.5 text-center font-mono font-black text-sm" />
                </div>
                <button onClick={() => removeReq(i)} className="text-slate-300 hover:text-red-600 p-2 text-lg">×</button>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-red-100/50">
             <label className="block text-[10px] font-black text-[#720000] uppercase mb-3 tracking-widest">Specializzazioni Richieste (Combo Multipla)</label>
             <div className="relative">
                <div 
                  className="min-h-[50px] w-full bg-white border border-red-200 rounded-2xl p-2 flex flex-wrap gap-1.5 shadow-sm cursor-text"
                  onClick={() => setIsSpecMenuOpen(true)}
                >
                  {selectedSpecs.map(s => (
                    <span key={s} className="bg-[#720000] text-white text-[8px] font-black px-2 py-1 rounded-lg flex items-center gap-2 uppercase tracking-tighter shadow-sm animate-in zoom-in-95">
                      {s}
                      <button onClick={(e) => { e.stopPropagation(); toggleSpec(s); }} className="hover:text-amber-400 transition-colors">×</button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    placeholder={selectedSpecs.length === 0 ? "Seleziona competenze..." : ""}
                    value={specSearch}
                    onChange={e => { setSpecSearch(e.target.value); setIsSpecMenuOpen(true); }}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-bold min-w-[80px]"
                  />
                </div>

                {isSpecMenuOpen && filteredSpecs.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSpecMenuOpen(false)}></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      {filteredSpecs.map(spec => (
                        <button 
                          key={spec}
                          onClick={() => toggleSpec(spec)}
                          className="w-full text-left px-5 py-3 text-[10px] font-black uppercase text-slate-600 hover:bg-red-50 hover:text-[#720000] border-b border-slate-50 transition-colors flex items-center justify-between group"
                        >
                          {spec}
                          <span className="opacity-0 group-hover:opacity-100 text-slate-300 text-[14px]">+</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
             </div>
             <p className="text-[8px] text-slate-400 font-bold uppercase mt-2 tracking-widest">L'algoritmo suggerirà operatori con queste qualifiche.</p>
          </div>
        </div>

        {/* COLONNA 3: MEZZI */}
        <div className="diamond-card p-8 bg-amber-50/40 border border-amber-100 flex flex-col h-full rounded-3xl">
          <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-black text-xs">3</div>
              <h3 className="text-xs font-black text-amber-800 tracking-widest uppercase">Mezzi Necessari</h3>
          </div>
          <div className="space-y-4 flex-1">
            {[
              { label: 'APS (Auto-Pompa Serbatoio)', key: 'APS' as keyof typeof vehicles },
              { label: 'AS (Auto-Scala)', key: 'AS' as keyof typeof vehicles },
              { label: 'AUTO (Vettura Comando)', key: 'AUTO' as keyof typeof vehicles }
            ].map((v) => (
              <div key={v.key} className="flex justify-between items-center bg-white/80 border border-amber-200 rounded-2xl p-5 shadow-sm transition-all hover:bg-white">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest">{v.label.split(' ')[0]}</span>
                   <span className="text-[7px] font-bold text-amber-600 uppercase tracking-tighter">{v.label.split('(')[1]?.replace(')', '') || ''}</span>
                </div>
                <input type="number" min="0" value={vehicles[v.key]} onChange={e => setVehicles({...vehicles, [v.key]: parseInt(e.target.value) || 0})} className="w-16 bg-amber-100/30 border border-amber-200 rounded-xl py-2 text-amber-900 text-center font-mono font-black text-lg focus:ring-2 focus:ring-amber-500/20 focus:outline-none" />
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-amber-100/20 rounded-2xl border border-amber-200/40">
             <div className="flex items-center gap-2 mb-2">
                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <span className="text-[8px] font-black text-amber-700 uppercase tracking-widest">Riepilogo Risorse</span>
             </div>
             <p className="text-[9px] text-amber-600/80 font-bold uppercase leading-tight italic">
                {/* Fixed TypeScript error where reduce parameters were inferred as 'unknown' when summing resource totals. */}
                Totale {reqs.reduce((a: number, b) => a + b.qty, 0)} unità assegnate a {(Object.values(vehicles) as number[]).reduce((a: number, b: number) => a + b, 0)} vetture operative.
             </p>
          </div>
        </div>
      </div>

      {/* FOOTER AZIONI */}
      <div className="flex flex-col sm:flex-row justify-end gap-6 pt-10 border-t border-slate-100">
        <button className="px-10 py-4 bg-white border border-slate-200 rounded-2xl text-slate-600 text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-50">Annulla</button>
        <button 
          onClick={handleSave} 
          className="px-12 py-4 bg-[#720000] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 shadow-red-100/50"
        >
          Pubblica Servizio Operativo
        </button>
      </div>
    </div>
  );
};
