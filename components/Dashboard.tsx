
import React, { useState, useMemo } from 'react';
import { MOCK_OPERATORS, STATUS_UI } from '../constants';
import { OperationalEvent, EventStatus, UserRole, Operator, PersonnelRequirement } from '../types';
import { getMainDayCode } from '../utils/turnarioLogic';

const UserPlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

interface DashboardProps {
  events: OperationalEvent[];
  setEvents: React.Dispatch<React.SetStateAction<OperationalEvent[]>>;
  role: UserRole;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ events, setEvents, role, selectedDate, setSelectedDate }) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [assignmentModal, setAssignmentModal] = useState<{ eventId: string, roleName: string, reqIndex: number } | null>(null);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const displayEvents = useMemo(() => {
    return [...events]
      .filter(ev => ev.date === selectedDate)
      .sort((a, b) => a.timeWindow.split(' - ')[0].localeCompare(b.timeWindow.split(' - ')[0]));
  }, [events, selectedDate]);

  const todoEvents = useMemo(() => {
    if (!role.startsWith('COMPILATORE')) return [];
    const myGroup = role.split('_')[1]; 
    return events.filter(ev => {
      if (ev.status !== EventStatus.IN_COMPILAZIONE) return false;
      const mainDayGroup = getMainDayCode(new Date(ev.date), new Date('2025-02-17'), 'B1').charAt(0);
      
      return ev.requirements.some(req => {
        const myPendingEntrustments = (req.entrustedGroups?.filter(g => g === myGroup).length || 0);
        const isMaster = myGroup === mainDayGroup;
        const totalEntrusted = req.entrustedGroups?.length || 0;
        const myMasterSlots = isMaster ? (req.qty - totalEntrusted - req.assignedIds.filter(id => MOCK_OPERATORS.find(o => o.id === id)?.group === myGroup).length) : 0;
        
        return myPendingEntrustments > 0 || (isMaster && myMasterSlots > 0);
      });
    }).slice(0, 5);
  }, [events, role]);

  const stats = useMemo(() => {
    const personnel = { DIR: 0, CP: 0, VIG: 0, AUT: 0 };
    displayEvents.forEach(ev => {
      ev.requirements.forEach(req => {
        if (req.role in personnel) personnel[req.role] += req.assignedIds.length;
      });
    });
    return { personnel };
  }, [displayEvents]);

  const updateAssignment = (eventId: string, reqIndex: number, operatorId: string, action: 'add' | 'remove') => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      const newReqs = [...ev.requirements];
      const targetReq = { ...newReqs[reqIndex] };
      
      if (action === 'add') {
        targetReq.assignedIds = [...targetReq.assignedIds, operatorId];
        const opGroup = MOCK_OPERATORS.find(o => o.id === operatorId)?.group;
        if (opGroup && targetReq.entrustedGroups?.includes(opGroup)) {
          const idx = targetReq.entrustedGroups.indexOf(opGroup);
          const newE = [...targetReq.entrustedGroups];
          newE.splice(idx, 1);
          targetReq.entrustedGroups = newE;
        }
      } else {
        targetReq.assignedIds = targetReq.assignedIds.filter(id => id !== operatorId);
      }
      
      newReqs[reqIndex] = targetReq;
      return { ...ev, requirements: newReqs };
    }));
  };

  const entrustSlot = (eventId: string, reqIndex: number) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      const newReqs = [...ev.requirements];
      const targetReq = { ...newReqs[reqIndex] };
      
      const groups = ['A', 'B', 'C', 'D'];
      const myGroup = role.split('_')[1];
      const targetGroup = groups[(groups.indexOf(myGroup) + 1) % 4];

      targetReq.entrustedGroups = [...(targetReq.entrustedGroups || []), targetGroup];
      newReqs[reqIndex] = targetReq;
      return { ...ev, requirements: newReqs };
    }));
  };

  const removeEntrustment = (eventId: string, reqIndex: number, groupToRemove: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      const newReqs = [...ev.requirements];
      const targetReq = { ...newReqs[reqIndex] };
      const idx = targetReq.entrustedGroups?.indexOf(groupToRemove);
      if (idx !== undefined && idx > -1) {
        // Se rimuoviamo un affidamento intermedio, rimuoviamo anche tutti i successivi nella catena
        const newE = (targetReq.entrustedGroups || []).slice(0, idx);
        targetReq.entrustedGroups = newE;
      }
      newReqs[reqIndex] = targetReq;
      return { ...ev, requirements: newReqs };
    }));
  };

  return (
    <div className="max-w-[1900px] mx-auto p-4 lg:p-8 space-y-8 pb-32">
      {role.startsWith('COMPILATORE') && todoEvents.length > 0 && (
        <div className="px-4 animate-in slide-in-from-top duration-500">
          <div className="bg-slate-900 rounded-[2rem] p-6 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#720000]/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-[#720000] rounded-full"></div>
                <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">ELENCO SERVIZI DA COMPILARE</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {todoEvents.map(ev => (
                  <button key={ev.id} onClick={() => { setSelectedDate(ev.date); setExpandedIds([ev.id]); }} className="flex flex-col p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all group">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">{formatDate(ev.date)}</span>
                    <span className="text-sm font-black text-white uppercase mt-1 group-hover:text-amber-400 transition-colors">{ev.code}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-2 truncate">{ev.location}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-4 no-print">
        <div className="flex items-center gap-6">
          <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-[#720000] shadow-sm transition-all active:scale-90">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex items-baseline gap-3 text-[#720000]">
            <span className="text-6xl font-black tracking-tighter leading-none">{formatDate(selectedDate).split('/')[0]}</span>
            <div className="flex flex-col">
              <span className="text-2xl font-black uppercase tracking-widest opacity-90 leading-none">
                {new Date(selectedDate).toLocaleString('it-IT', { month: 'long' }).toUpperCase()}
              </span>
              <span className="text-[11px] font-normal text-slate-400 mt-1">{formatDate(selectedDate).split('/')[2]}</span>
            </div>
          </div>
          <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-[#720000] shadow-sm transition-all active:scale-90">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Capacità Operativa del Giorno</span>
            <div className="flex gap-4 mt-2">
               {Object.entries(stats.personnel).map(([r, q]) => (
                 <div key={r} className="flex flex-col items-center px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                    <span className="text-[7px] font-black text-slate-400 leading-none mb-1">{r}</span>
                    <span className="text-xs font-normal text-slate-900">{q}</span>
                 </div>
               ))}
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200 mx-2"></div>
          <button onClick={() => window.print()} className="px-6 py-3 bg-[#720000] hover:bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-100">
             Esporta Quadro Ordini
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start px-4">
        {displayEvents.length > 0 ? displayEvents.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            role={role}
            isExpanded={expandedIds.includes(event.id)}
            onToggle={() => setExpandedIds(prev => prev.includes(event.id) ? prev.filter(i => i !== event.id) : [...prev, event.id])}
            onOpenAssignment={(roleName, reqIdx) => setAssignmentModal({ eventId: event.id, roleName, reqIndex: reqIdx })}
            onRemoveAssignment={(reqIdx, opId) => updateAssignment(event.id, reqIdx, opId, 'remove')}
            onRemoveEntrustment={(reqIdx, group) => removeEntrustment(event.id, reqIdx, group)}
            onConfirm={() => setEvents(prev => prev.map(ev => ev.id === event.id ? { ...ev, status: EventStatus.ATTESA_APPROVAZIONE } : ev))}
            onApprove={() => setEvents(prev => prev.map(ev => ev.id === event.id ? { ...ev, status: EventStatus.APPROVATO, approvedByAdmin: true } : ev))}
          />
        )) : (
          <div className="col-span-full py-24 text-center">
            <h3 className="text-slate-300 font-black uppercase tracking-[0.3em]">Nessun Servizio Programmato</h3>
          </div>
        )}
      </div>

      {assignmentModal && (
        <AssignmentPopup 
          roleName={assignmentModal.roleName}
          userRole={role}
          onClose={() => setAssignmentModal(null)}
          onAssign={(opId) => { updateAssignment(assignmentModal.eventId, assignmentModal.reqIndex, opId, 'add'); setAssignmentModal(null); }}
          onEntrust={() => { entrustSlot(assignmentModal.eventId, assignmentModal.reqIndex); setAssignmentModal(null); }}
          assignedIds={events.find(e => e.id === assignmentModal.eventId)?.requirements[assignmentModal.reqIndex]?.assignedIds || []}
        />
      )}
    </div>
  );
};

const EventCard: React.FC<{
  event: OperationalEvent;
  role: UserRole;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenAssignment: (role: string, idx: number) => void;
  onRemoveAssignment: (idx: number, opId: string) => void;
  onRemoveEntrustment: (idx: number, group: string) => void;
  onConfirm: () => void;
  onApprove: () => void;
}> = ({ event, role, isExpanded, onToggle, onOpenAssignment, onRemoveAssignment, onRemoveEntrustment, onConfirm, onApprove }) => {
  const statusUi = STATUS_UI[event.status] || STATUS_UI[EventStatus.IN_COMPILAZIONE];
  
  const isToCompileOrWaiting = event.status === EventStatus.IN_COMPILAZIONE || event.status === EventStatus.ATTESA_APPROVAZIONE;
  const isApproved = event.status === EventStatus.APPROVATO;
  
  const currentGroup = role.startsWith('COMPILATORE') ? role.split('_')[1] : null;
  const mainDayGroup = getMainDayCode(new Date(event.date), new Date('2025-02-17'), 'B1').charAt(0);
  
  const totalRequired = event.requirements.reduce((acc, r) => acc + r.qty, 0);
  const totalFilled = event.requirements.reduce((acc, r) => acc + r.assignedIds.length, 0);
  const coveragePercent = Math.round((totalFilled / totalRequired) * 100);
  
  const isFullySatisfied = totalFilled === totalRequired;

  return (
    <div className={`diamond-card transition-all duration-300 border-2 overflow-hidden ${isToCompileOrWaiting ? 'bg-red-50/70 border-red-200 shadow-xl' : isApproved ? 'bg-white border-white hover:border-slate-100 shadow-sm' : 'bg-white border-white'} ${isExpanded ? 'scale-[1.01] z-10' : ''}`}>
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-start">
          <div className="flex gap-5">
            <div className={`w-3 h-14 rounded-full ${event.isOlympic ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-blue-500 shadow-lg'}`}></div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{event.code}</h3>
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                   <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      <span>COPERTURA</span>
                      <span>{coveragePercent}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-900/10 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${coveragePercent === 100 ? 'bg-emerald-500' : 'bg-[#720000]'}`} style={{ width: `${coveragePercent}%` }}></div>
                   </div>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{event.location}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusUi.color} ${statusUi.text} border-current`}>
              {statusUi.label}
            </span>
            <span className="text-xs font-normal text-slate-800 font-mono tracking-tighter bg-slate-50 px-3 py-1 rounded-md">{event.timeWindow}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/20 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.requirements.map((req, reqIdx) => {
              const totalInSlot = req.assignedIds.length + (req.entrustedGroups?.length || 0);
              const isMyAssignment = currentGroup === mainDayGroup || req.entrustedGroups?.includes(currentGroup || '');
              
              return (
                <div key={`${req.role}-${reqIdx}`} className={`p-4 rounded-3xl border bg-white shadow-sm transition-all ${isMyAssignment ? 'ring-2 ring-[#720000]/5 border-red-50' : 'border-slate-100 opacity-90'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{req.role}</span>
                       <span className="text-[7px] font-black uppercase mt-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                          Competenza Gruppo {mainDayGroup}
                       </span>
                    </div>
                    <span className="text-[9px] font-normal text-slate-400">{req.assignedIds.length}/{req.qty}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* Badge di Affidamento: Visibili solo al mittente dell'azione (chi ha passato il compito) */}
                    {req.entrustedGroups?.map((group, gIdx) => {
                      // Il mittente è il gruppo che precede nella catena di affidamento
                      const sender = gIdx === 0 ? mainDayGroup : req.entrustedGroups![gIdx - 1];
                      if (currentGroup !== sender) return null;

                      return (
                        <div key={`entrust-${group}-${gIdx}`} className="flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase shadow-md group">
                          AFFIDATO GRUPPO {group}
                          {event.status === EventStatus.IN_COMPILAZIONE && (
                            <button onClick={() => onRemoveEntrustment(reqIdx, group)} className="w-4 h-4 rounded-full bg-white/20 hover:bg-red-600 flex items-center justify-center transition-colors">
                              <span className="mb-0.5">×</span>
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* Operatori Assegnati */}
                    {req.assignedIds.map((opId) => {
                      const op = MOCK_OPERATORS.find(o => o.id === opId);
                      const isMyOp = op?.group === currentGroup;
                      return (
                        <div key={opId} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase group relative shadow-md ${isMyOp ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}>
                          {op?.name}
                          {role.startsWith('COMPILATORE') && isMyOp && event.status === EventStatus.IN_COMPILAZIONE && (
                            <button onClick={() => onRemoveAssignment(reqIdx, opId)} className="w-4 h-4 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center transition-colors">
                              <span className="mb-0.5">×</span>
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* Slot Vuoti: Se sono io il responsabile principale (Master) e non ho ancora affidato a nessuno lo slot residuo */}
                    {currentGroup === mainDayGroup && event.status === EventStatus.IN_COMPILAZIONE && Array.from({ length: Math.max(0, req.qty - totalInSlot) }).map((_, i) => (
                      <button key={`empty-master-${i}`} onClick={() => onOpenAssignment(req.role, reqIdx)} className="w-10 h-10 rounded-xl bg-red-50 text-[#720000] border border-red-200 flex items-center justify-center transition-all hover:bg-red-100 active:scale-95 shadow-sm">
                        <UserPlusIcon className="w-4 h-4" />
                      </button>
                    ))}

                    {/* Slot Vuoti: Se sono io l'ultimo destinatario della catena di affidamento */}
                    {req.entrustedGroups?.length && req.entrustedGroups[req.entrustedGroups.length - 1] === currentGroup && event.status === EventStatus.IN_COMPILAZIONE && (
                      <button onClick={() => onOpenAssignment(req.role, reqIdx)} className="w-10 h-10 rounded-xl bg-red-50 text-[#720000] border border-red-200 flex items-center justify-center transition-all hover:bg-red-100 active:scale-95 shadow-sm">
                        <UserPlusIcon className="w-4 h-4" />
                      </button>
                    )}

                    {/* Placeholder per slot non di mia competenza o già passati oltre */}
                    {!isMyAssignment && Array.from({ length: Math.max(0, req.qty - req.assignedIds.length) }).map((_, i) => (
                      <div key={`empty-other-${i}`} className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-100">
                        <UserPlusIcon className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 no-print">
            {role === 'APPROVATORE' && event.status === EventStatus.ATTESA_APPROVAZIONE && (
              <button onClick={onApprove} className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-transform active:scale-95">
                <CheckCircleIcon className="w-4 h-4" /> Vistare e Approvare
              </button>
            )}
            
            {role.startsWith('COMPILATORE') && event.status === EventStatus.IN_COMPILAZIONE && isFullySatisfied && (
              <button onClick={onConfirm} className="flex items-center gap-2 px-10 py-4 bg-[#720000] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-red-200/50 hover:bg-slate-900 transition-all transform active:scale-95">
                 CONFERMA COMPILAZIONE
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AssignmentPopup: React.FC<{
  roleName: string;
  userRole: UserRole;
  onClose: () => void;
  onAssign: (id: string) => void;
  onEntrust: () => void;
  assignedIds: string[];
}> = ({ roleName, userRole, onClose, onAssign, onEntrust, assignedIds }) => {
  const [search, setSearch] = useState('');
  const myGroup = userRole.split('_')[1];

  const pool = useMemo(() => {
    let result = MOCK_OPERATORS.filter(op => op.qualification === roleName && !assignedIds.includes(op.id) && op.available);
    if (userRole.startsWith('COMPILATORE')) {
      result = result.filter(op => op.group === myGroup);
    }
    if (search) result = result.filter(op => op.name.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [roleName, userRole, assignedIds, search, myGroup]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="w-full max-w-xl bg-white p-8 relative z-10 shadow-2xl rounded-[3rem] flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
         <div className="mb-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
               <div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Pool Operativo - Gruppo {myGroup}</h3>
                 <p className="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-widest">Risorse disponibili per ruolo {roleName}</p>
               </div>
               <button onClick={onClose} className="text-slate-300 hover:text-slate-500 text-3xl font-light">×</button>
            </div>
            <button onClick={onEntrust} className="w-full py-4 bg-[#720000] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-100">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
               Affida ad altro Gruppo
            </button>
         </div>

         <div className="relative mb-6">
            <input type="text" placeholder="Cerca per nominativo..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pl-12 text-xs font-black uppercase shadow-inner focus:outline-none focus:ring-2 focus:ring-red-100" />
            <svg className="w-4 h-4 text-slate-300 absolute left-5 top-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
         </div>

         <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {pool.map(op => (
              <div key={op.id} onClick={() => onAssign(op.id)} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-900 cursor-pointer group transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-[#720000] group-hover:text-white flex items-center justify-center font-black text-xs transition-colors">{op.name.charAt(0)}</div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase group-hover:text-[#720000]">{op.name}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{op.subgroup} • {op.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-mono font-normal text-slate-900">{op.assignedHours}h</span>
                  <span className="text-[7px] font-bold text-slate-300 uppercase">Mensili</span>
                </div>
              </div>
            ))}
            {pool.length === 0 && (
              <div className="text-center py-10 space-y-3">
                 <p className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Nessun operatore disponibile nel tuo gruppo</p>
              </div>
            )}
         </div>
         <button onClick={onClose} className="mt-6 w-full py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Chiudi Selezione</button>
      </div>
    </div>
  );
};
