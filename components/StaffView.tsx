
import React, { useState, useMemo } from 'react';
import { MOCK_OPERATORS } from '../constants';
import { Operator } from '../types';
import { SEQ } from '../utils/turnarioLogic';

export const StaffView: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>(MOCK_OPERATORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOp, setSelectedOp] = useState<Operator | null>(null);
  const [unavailabilityData, setUnavailabilityData] = useState({ reason: 'Ferie', note: '' });
  
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('TUTTI');

  const openUnavailabilityModal = (op: Operator) => {
    setSelectedOp(op);
    setIsModalOpen(true);
  };

  const saveUnavailability = () => {
    if (!selectedOp) return;
    const updatedOps = operators.map(op => 
      op.id === selectedOp.id 
        ? { ...op, available: false, assignedHours: 0, statusMessage: unavailabilityData.reason.toUpperCase() + (unavailabilityData.note ? `: ${unavailabilityData.note}` : '') }
        : op
    );
    setOperators(updatedOps);
    setIsModalOpen(false);
    setSelectedOp(null);
  };

  const filteredOperators = useMemo(() => {
    return operators.filter(op => {
      const matchesSearch = op.name.toLowerCase().includes(search.toLowerCase()) || op.id.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = groupFilter === 'TUTTI' || op.subgroup === groupFilter;
      return matchesSearch && matchesGroup;
    });
  }, [operators, search, groupFilter]);

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">Anagrafica Personale</h1>
          <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-[0.2em]">Gestione dipendenti e monitoraggio disponibilità operativa</p>
        </div>
        <div className="flex gap-4">
          <label className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm cursor-pointer flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Carica Excel Dipendenti
            <input type="file" className="hidden" accept=".xlsx,.xls" />
          </label>
        </div>
      </div>

      <div className="diamond-card overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight shrink-0">Registro Operativo Personale</h2>
          
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Filtra Gruppo:</span>
                <select 
                  value={groupFilter}
                  onChange={e => setGroupFilter(e.target.value)}
                  className="bg-transparent text-xs font-black uppercase focus:outline-none cursor-pointer text-[#720000]"
                >
                  <option value="TUTTI">TUTTI I GRUPPI</option>
                  {SEQ.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
             </div>

             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cerca nominativo..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-white border border-slate-200 text-xs font-bold px-4 py-2.5 pl-10 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-red-100 shadow-sm uppercase" 
                />
                <svg className="w-4 h-4 text-slate-300 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100 bg-slate-50/20">
                <th className="px-6 py-4">Nominativo</th>
                <th className="px-6 py-4">Grado / Qualifica</th>
                <th className="px-6 py-4">Specializzazioni</th>
                <th className="px-6 py-4">GRUPPO</th>
                <th className="px-6 py-4 text-center">Ore Assegnate</th>
                <th className="px-6 py-4">Stato Attuale</th>
                <th className="px-6 py-4 text-right pr-10">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {filteredOperators.map(op => (
                <tr key={op.id} className="hover:bg-slate-50 transition-all group border-l-4 border-transparent hover:border-[#720000]">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-black text-sm uppercase group-hover:text-[#720000] transition-colors">{op.name}</span>
                      <span className="text-slate-400 text-[10px] font-mono tracking-tighter">{op.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-slate-600 text-xs font-bold uppercase">{op.rank}</span>
                      <span className="text-slate-400 text-[9px] font-black uppercase tracking-tighter">{op.qualification}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {op.specializations && op.specializations.length > 0 ? (
                        op.specializations.map((spec, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase border border-slate-200 tracking-tighter">
                            {spec}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-200 text-[8px] font-bold uppercase">Nessuna</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black border shadow-sm ${
                      op.group === 'A' ? 'bg-red-50 text-red-700 border-red-100' :
                      op.group === 'B' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      op.group === 'C' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {op.subgroup || op.group}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-sm font-mono font-normal ${op.assignedHours && op.assignedHours > 0 ? 'text-[#720000]' : 'text-slate-300'}`}>
                        {op.assignedHours ? op.assignedHours.toString().padStart(2, '0') : '00'}h
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${op.available ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-[#720000] border border-red-100'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${op.available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[#720000]'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-tight">{op.available ? 'In Servizio' : op.statusMessage || 'Indisponibile'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right pr-10">
                    <button 
                      onClick={() => openUnavailabilityModal(op)}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-tighter rounded-xl hover:bg-[#720000] hover:text-white hover:border-[#720000] transition-all shadow-sm"
                    >
                      Aggiungi Indisponibilità
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOperators.length === 0 && (
          <div className="py-20 text-center bg-white">
             <p className="text-slate-300 text-sm font-black uppercase tracking-[0.2em]">Nessun operatore trovato per i filtri selezionati</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="diamond-card w-full max-md bg-white p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 rounded-[2.5rem]">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Inserimento Assenza</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Operatore: {selectedOp?.name}</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-600 text-2xl font-light">×</button>
            </div>
            
            <div className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Causa Indisponibilità</label>
                  <div className="grid grid-cols-2 gap-2">
                     {['Malattia', 'Ferie', 'Permesso', 'Recupero Ore'].map(reason => (
                        <button 
                          key={reason}
                          onClick={() => setUnavailabilityData({...unavailabilityData, reason})}
                          className={`px-4 py-3 text-[10px] font-black uppercase rounded-xl border transition-all ${unavailabilityData.reason === reason ? 'bg-[#720000] text-white border-[#720000]' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
                        >
                          {reason}
                        </button>
                     ))}
                  </div>
               </div>
               
               <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Note Aggiuntive</label>
                  <textarea 
                    value={unavailabilityData.note}
                    onChange={e => setUnavailabilityData({...unavailabilityData, note: e.target.value})}
                    placeholder="Specificare protocollo o dettagli..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-red-500/10 resize-none h-24"
                  />
               </div>
               
               <div className="pt-4 flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50">
                    Annulla
                  </button>
                  <button onClick={saveUnavailability} className="flex-1 px-4 py-3 bg-[#720000] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-100 hover:bg-[#a5020c]">
                    Salva Stato
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
