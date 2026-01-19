
import React from 'react';
import { ScreenType, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  date: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeScreen, setScreen, role, setRole, date }) => {
  const navItems = [
    { id: 'DASHBOARD', label: 'Quadro Giorno', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg> },
    { id: 'CALENDAR', label: 'Calendario', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg> },
    ...(role === 'REDATTORE' ? [
      { id: 'CREAZIONE', label: 'Crea Servizio', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg> },
      { id: 'GENERATORE', label: 'Generatore', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.022.547l-2.387 2.387a2 2 0 000 2.828l.586.586a2 2 0 002.828 0l2.387-2.387a2 2 0 00.547-1.022l.477-2.387a6 6 0 01.517-3.86l.158-.318a6 6 0 00.517-3.86L15.21 6.05a2 2 0 01.547-1.022l2.387-2.387a2 2 0 012.828 0l.586.586a2 2 0 010 2.828l-2.387 2.387z" /></svg> }
    ] : []),
    { id: 'STAFF', label: 'Anagrafica', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
  ];

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9]">
      <aside className="w-20 lg:w-80 flex flex-col bg-[#720000] z-50 transition-all duration-300 shadow-2xl shrink-0">
        <div className="h-28 flex items-center px-6 border-b border-white/10">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
            <img src="https://www.vigilfuoco.it/themes/custom/vvf/logo.png" className="w-10 h-10 object-contain" alt="Logo" />
          </div>
          <div className="ml-4 hidden lg:flex flex-col">
            <span className="text-white font-black text-lg leading-none tracking-tighter">VIGILI DEL FUOCO</span>
            <span className="text-[#C9A40E] text-[10px] font-black uppercase tracking-[0.2em] mt-1">OPERAZIONI MILANO</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-8">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setScreen(item.id as ScreenType)} className={`w-full flex items-center px-5 py-4 rounded-3xl transition-all duration-300 ${activeScreen === item.id ? 'bg-white text-[#720000] shadow-2xl font-black' : 'text-red-100/40 hover:bg-white/5'}`}>
              <div className={activeScreen === item.id ? 'scale-110' : ''}>{item.icon}</div>
              <span className="ml-5 hidden lg:block text-xs font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="p-4 bg-black/20 rounded-[2.5rem] border border-white/5">
             <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-black text-[#720000]">{role.charAt(role.length - 1)}</div>
                <div className="hidden lg:block overflow-hidden">
                   <p className="text-[10px] font-black text-white uppercase truncate tracking-widest">{role.replace('_', ' ')}</p>
                   <span className="text-[8px] font-bold text-red-200/40 uppercase">Sessione Attiva</span>
                </div>
             </div>
             <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-white/10 border-none rounded-xl text-[9px] font-black text-white/80 uppercase tracking-widest focus:ring-0 cursor-pointer py-2"
             >
               <option value="REDATTORE" className="bg-slate-900">REDATTORE</option>
               <option value="APPROVATORE" className="bg-slate-900">APPROVATORE</option>
               <option value="COMPILATORE_A" className="bg-slate-900">COMPILATORE A</option>
               <option value="COMPILATORE_B" className="bg-slate-900">COMPILATORE B</option>
               <option value="COMPILATORE_C" className="bg-slate-900">COMPILATORE C</option>
               <option value="COMPILATORE_D" className="bg-slate-900">COMPILATORE D</option>
             </select>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Comando Provinciale • <span className="text-slate-800">{date}</span></div>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-slate-50/50">{children}</main>
      </div>
    </div>
  );
};
