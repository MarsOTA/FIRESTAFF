
import { EventStatus, OperationalEvent, Operator } from './types';

export const MOCK_OPERATORS: Operator[] = [
  // GRUPPO A
  { id: 'DIR-A1', name: 'VALENTI ROBERTO', rank: 'Dirigente', group: 'A', subgroup: 'A1', qualification: 'DIR', available: true, assignedHours: 8, specializations: ['DIRETTORE OPER. SPEGNIMENTO'] },
  { id: 'CP-A1', name: 'ROSSI MARIO', rank: 'Capo Reparto', group: 'A', subgroup: 'A1', qualification: 'CP', available: true, assignedHours: 24, specializations: ['TAS2', 'SAF 2A'] },
  { id: 'CP-A2', name: 'BIANCHI STEFANO', rank: 'Capo Squadra', group: 'A', subgroup: 'A2', qualification: 'CP', available: true, assignedHours: 16, specializations: ['PREVENZIONE INCENDI'] },
  { id: 'VIG-A1', name: 'LUCA BIANCHI', rank: 'Vigile Coord.', group: 'A', subgroup: 'A1', qualification: 'VIG', available: true, assignedHours: 36, specializations: ['SAF FLUVIALE'] },
  { id: 'VIG-A2', name: 'ANDREA NERI', rank: 'Vigile Esperto', group: 'A', subgroup: 'A2', qualification: 'VIG', available: true, assignedHours: 8, specializations: ['NBCR'] },
  { id: 'VIG-A3', name: 'MARCO ROCCHI', rank: 'Vigile del Fuoco', group: 'A', subgroup: 'A3', qualification: 'VIG', available: true, assignedHours: 12, specializations: ['SAF 1A'] },
  { id: 'VIG-A4', name: 'PAOLO VERDI', rank: 'Vigile del Fuoco', group: 'A', subgroup: 'A4', qualification: 'VIG', available: true, assignedHours: 4, specializations: ['TPS'] },
  { id: 'VIG-A5', name: 'GIOVANNI RIZZO', rank: 'Vigile del Fuoco', group: 'A', subgroup: 'A1', qualification: 'VIG', available: true, assignedHours: 0, specializations: ['TAS1'] },
  { id: 'AUT-A1', name: 'MORANDI STEFANO', rank: 'Vigile Autista', group: 'A', subgroup: 'A1', qualification: 'AUT', available: true, assignedHours: 20, specializations: ['4^ GRADO'] },
  { id: 'AUT-A2', name: 'BRUNO SERRA', rank: 'Vigile Autista', group: 'A', subgroup: 'A2', qualification: 'AUT', available: true, assignedHours: 8, specializations: ['3^ GRADO'] },

  // GRUPPO B
  { id: 'DIR-B1', name: 'ALFONSO REA', rank: 'Dirigente', group: 'B', subgroup: 'B1', qualification: 'DIR', available: true, assignedHours: 10, specializations: ['POLIZIA GIUDIZIARIA'] },
  { id: 'CP-B1', name: 'FERRI ALESSANDRO', rank: 'Capo Squadra', group: 'B', subgroup: 'B1', qualification: 'CP', available: true, assignedHours: 12, specializations: ['USAR MEDIUM'] },
  { id: 'CP-B2', name: 'GUIDO VOLPI', rank: 'Capo Reparto', group: 'B', subgroup: 'B2', qualification: 'CP', available: true, assignedHours: 0, specializations: ['SAF 2B'] },
  { id: 'VIG-B1', name: 'GIALLI PAOLO', rank: 'Vigile del Fuoco', group: 'B', subgroup: 'B1', qualification: 'VIG', available: true, assignedHours: 12, specializations: ['USAR LIGHT'] },
  { id: 'VIG-B2', name: 'SERRA RICCARDO', rank: 'Vigile del Fuoco', group: 'B', subgroup: 'B2', qualification: 'VIG', available: true, assignedHours: 0, specializations: ['AEROPORTUALE'] },
  { id: 'VIG-B3', name: 'LORENZO COSTA', rank: 'Vigile del Fuoco', group: 'B', subgroup: 'B3', qualification: 'VIG', available: true, assignedHours: 8, specializations: ['NBCR 1'] },
  { id: 'VIG-B4', name: 'SIMONE RIVA', rank: 'Vigile del Fuoco', group: 'B', subgroup: 'B4', qualification: 'VIG', available: true, assignedHours: 24, specializations: ['SAF 1A'] },
  { id: 'VIG-B5', name: 'MATTEO BRUNI', rank: 'Vigile del Fuoco', group: 'B', subgroup: 'B1', qualification: 'VIG', available: true, assignedHours: 12, specializations: ['ANTINCENDIO BOSCHIVO'] },
  { id: 'AUT-B1', name: 'RIVA GIUSEPPE', rank: 'Vigile Autista', group: 'B', subgroup: 'B1', qualification: 'AUT', available: true, assignedHours: 8, specializations: ['1^ GRADO'] },
  { id: 'AUT-B2', name: 'FABIO LONGO', rank: 'Vigile Autista', group: 'B', subgroup: 'B2', qualification: 'AUT', available: true, assignedHours: 32, specializations: ['4^ GRADO'] },

  // GRUPPO C
  { id: 'DIR-C1', name: 'MARTINA COLLI', rank: 'Dirigente', group: 'C', subgroup: 'C1', qualification: 'DIR', available: true, assignedHours: 0, specializations: ['DIRETTORE OPERAZIONI'] },
  { id: 'CP-C1', name: 'GALLI FABRIZIO', rank: 'Capo Squadra', group: 'C', subgroup: 'C1', qualification: 'CP', available: true, assignedHours: 8, specializations: ['ISTRUTTORE SAF'] },
  { id: 'CP-C2', name: 'CARLO PONTI', rank: 'Capo Reparto', group: 'C', subgroup: 'C2', qualification: 'CP', available: true, assignedHours: 12, specializations: ['NBCR 3'] },
  { id: 'VIG-C1', name: 'DANI COSTA', rank: 'Vigile del Fuoco', group: 'C', subgroup: 'C1', qualification: 'VIG', available: true, assignedHours: 16, specializations: ['PUNTELLAMENTI'] },
  { id: 'VIG-C2', name: 'LOMBARDI LUIGI', rank: 'Vigile Coord.', group: 'C', subgroup: 'C2', qualification: 'VIG', available: true, assignedHours: 12, specializations: ['COEM ROSSO'] },
  { id: 'VIG-C3', name: 'ALEX PARISI', rank: 'Vigile del Fuoco', group: 'C', subgroup: 'C3', qualification: 'VIG', available: true, assignedHours: 4, specializations: ['TPS'] },
  { id: 'VIG-C4', name: 'UMBERTO REA', rank: 'Vigile del Fuoco', group: 'C', subgroup: 'C4', qualification: 'VIG', available: true, assignedHours: 0, specializations: ['TAS1'] },
  { id: 'VIG-C5', name: 'NICOLA FERRI', rank: 'Vigile del Fuoco', group: 'C', subgroup: 'C5', qualification: 'VIG', available: true, assignedHours: 8, specializations: ['SAF 1A'] },
  { id: 'AUT-C1', name: 'GATTI SIMONE', rank: 'Vigile Autista', group: 'C', subgroup: 'C1', qualification: 'AUT', available: true, assignedHours: 8, specializations: ['2^ GRADO'] },
  { id: 'AUT-C2', name: 'LUIGI VERNA', rank: 'Vigile Autista', group: 'C', subgroup: 'C2', qualification: 'AUT', available: true, assignedHours: 20, specializations: ['4^ GRADO'] },

  // GRUPPO D
  { id: 'DIR-D1', name: 'ENZO FERRARI', rank: 'Dirigente', group: 'D', subgroup: 'D1', qualification: 'DIR', available: true, assignedHours: 12, specializations: ['DIRIGENTE'] },
  { id: 'CP-D1', name: 'SERGIO RAMOS', rank: 'Capo Reparto', group: 'D', subgroup: 'D1', qualification: 'CP', available: true, assignedHours: 0, specializations: ['USAR'] },
  { id: 'CP-D2', name: 'MARIO DRAGHI', rank: 'Capo Squadra', group: 'D', subgroup: 'D2', qualification: 'CP', available: true, assignedHours: 24, specializations: ['POLIZIA GIUDIZIARIA'] },
  { id: 'VIG-D1', name: 'MANCINI PIETRO', rank: 'Vigile del Fuoco', group: 'D', subgroup: 'D1', qualification: 'VIG', available: true, assignedHours: 0, specializations: ['SOSTANZE PERICOLOSE'] },
  { id: 'VIG-D2', name: 'COSTA DANIELE', rank: 'Vigile del Fuoco', group: 'D', subgroup: 'D2', qualification: 'VIG', available: true, assignedHours: 16, specializations: ['PUNTELLAMENTI'] },
  { id: 'VIG-D3', name: 'ROBERTO BOLLE', rank: 'Vigile del Fuoco', group: 'D', subgroup: 'D3', qualification: 'VIG', available: true, assignedHours: 8, specializations: ['SAF 1A'] },
  { id: 'VIG-D4', name: 'VALERIO STAFF', rank: 'Vigile del Fuoco', group: 'D', subgroup: 'D4', qualification: 'VIG', available: true, assignedHours: 12, specializations: ['TAS1'] },
  { id: 'VIG-D5', name: 'KIM ROSSI', rank: 'Vigile del Fuoco', group: 'D', subgroup: 'D5', qualification: 'VIG', available: true, assignedHours: 4, specializations: ['TPS'] },
  { id: 'AUT-D1', name: 'STEFANO ACCORSI', rank: 'Vigile Autista', group: 'D', subgroup: 'D1', qualification: 'AUT', available: true, assignedHours: 24, specializations: ['4^ GRADO'] },
  { id: 'AUT-D2', name: 'ALDO BAGLIO', rank: 'Vigile Autista', group: 'D', subgroup: 'D2', qualification: 'AUT', available: true, assignedHours: 0, specializations: ['3^ GRADO'] },
];

export const MOCK_EVENTS: OperationalEvent[] = [
  { 
    id: 'EV-RHO-01', 
    code: 'RHO HOKEY', 
    location: 'FIERA MILANO, RHO', 
    date: '2025-02-17',
    timeWindow: '08:00 - 20:00', 
    status: EventStatus.IN_COMPILAZIONE,
    vehicles: { APS: 2, AS: 1, AUTO: 1 },
    requirements: [
      { role: 'DIR', qty: 1, assignedIds: [] },
      { role: 'CP', qty: 2, assignedIds: [] },
      { role: 'VIG', qty: 6, assignedIds: [] },
      { role: 'AUT', qty: 1, assignedIds: [] }
    ],
    approvedByAdmin: false,
    isOlympic: true
  }
];

export const STATUS_UI: Record<string, { color: string, text: string, label: string }> = {
  [EventStatus.IN_COMPILAZIONE]: { color: 'bg-orange-50 border-orange-200', text: 'text-orange-600', label: 'IN COMPILAZIONE' },
  [EventStatus.ATTESA_APPROVAZIONE]: { color: 'bg-blue-50 border-blue-200', text: 'text-blue-600', label: 'ATTESA APPROVAZIONE' },
  [EventStatus.APPROVATO]: { color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600', label: 'APPROVATO' },
  [EventStatus.CRITICO]: { color: 'bg-red-50 border-red-200', text: 'text-red-600', label: 'CRITICO' },
  [EventStatus.COMPLETATO]: { color: 'bg-slate-50 border-slate-200', text: 'text-slate-600', label: 'COMPLETATO' },
};
