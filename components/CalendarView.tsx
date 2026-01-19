
import React, { useMemo } from 'react';
import { OperationalEvent } from '../types';

interface CalendarViewProps {
  events: OperationalEvent[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, selectedDate, setSelectedDate }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dateInfo = useMemo(() => {
    const d = new Date(selectedDate);
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: d.toLocaleString('it-IT', { month: 'long' }).toUpperCase(),
      year: d.getFullYear()
    };
  }, [selectedDate]);

  const displayEvents = useMemo(() => {
    return events.filter(ev => ev.date === selectedDate);
  }, [events, selectedDate]);

  const changeDay = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-700 bg-[#f8fafc] h-full flex flex-col max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Programmazione Giornaliera Servizi</h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Visualizzazione sinottica impiego risorse 24h</p>
        </div>

        <div className="flex items-center gap-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => changeDay(-1)} 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#720000] transition-all active:scale-90"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-2xl font-black text-[#720000] leading-none">{dateInfo.day}</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{dateInfo.month} {dateInfo.year}</span>
          </div>

          <button 
            onClick={() => changeDay(1)} 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#720000] transition-all active:scale-90"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <button onClick={() => window.print()} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl rounded-2xl hover:bg-slate-700 transition-all">
          Stampa Ordine PDF
        </button>
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden print:overflow-visible">
        <div className="flex-1 bg-white border border-slate-200 overflow-auto relative shadow-xl rounded-2xl">
          <div className="flex min-h-full">
            <div className="w-20 border-r border-slate-100 sticky left-0 z-20 bg-slate-50 shrink-0">
              <div className="h-10 border-b border-slate-200 bg-slate-100 flex items-center justify-center">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">ORA</span>
              </div>
              {hours.map(h => (
                <div key={h} className="h-10 border-b border-slate-100 flex items-center justify-center">
                  <span className="text-[11px] font-mono font-normal text-slate-400">{h.toString().padStart(2, '0')}:00</span>
                </div>
              ))}
            </div>

            <div className="flex-1 min-w-[800px] relative">
               <div className="h-10 border-b border-slate-200 bg-slate-100 flex items-center px-6">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Istogramma Servizi Attivi</span>
               </div>
               
               <div className="p-2 flex flex-col gap-2 relative z-10 min-h-[1000px]">
                 {displayEvents.length > 0 ? displayEvents.map((ev, idx) => {
                   const parts = ev.timeWindow.split(' - ');
                   const startParts = parts[0].split(':');
                   const endParts = parts[1].split(':');
                   const startHour = parseInt(startParts[0]);
                   const startMin = parseInt(startParts[1]);
                   const endHour = parseInt(endParts[0]);
                   const endMin = parseInt(endParts[1]);
                   const topOffset = (startHour * 40) + (startMin / 60 * 40);
                   const height = ((endHour * 40) + (endMin / 60 * 40)) - topOffset;
                   const teamRequired = ev.requirements.reduce((acc, r) => acc + r.qty, 0);
                   const teamAssigned = ev.requirements.reduce((acc, r) => acc + r.assignedIds.length, 0);

                   return (
                     <div key={ev.id} className="absolute bg-red-50/90 border border-red-200 px-3 py-1 shadow-sm rounded-lg overflow-hidden transition-all hover:z-50 hover:bg-white hover:shadow-xl group" style={{
                         top: `${topOffset + 40}px`,
                         height: `${Math.max(40, height)}px`,
                         left: `${idx * 160 + 20}px`,
                         width: '150px',
                         borderLeft: '4px solid #720000'
                       }}>
                       <div className="font-black text-[#720000] text-[10px] uppercase truncate">{ev.code}</div>
                       <div className="text-[9px] text-slate-500 font-bold uppercase truncate">{ev.location}</div>
                       <div className="mt-1 text-[8px] font-normal text-slate-400 uppercase">{ev.timeWindow}</div>
                       <div className="mt-2 text-[8px] font-normal text-slate-600 uppercase border-t border-red-100 pt-1">
                          Squadra: {teamAssigned}/{teamRequired}
                       </div>
                     </div>
                   );
                 }) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-300 opacity-50 pt-20">
                      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-xs font-black uppercase tracking-[0.3em]">Nessun Servizio Attivo</span>
                   </div>
                 )}
                 {hours.map(h => (
                   <div key={h} className="absolute w-full border-b border-slate-50" style={{ top: `${(h + 1) * 40}px`, height: '1px' }}></div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
