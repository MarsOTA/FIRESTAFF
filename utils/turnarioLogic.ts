
/**
 * Logica Turnario Olimpico VVF
 * Algoritmo deterministico basato su ciclo di 32 step
 */

export const buildOlympicSequence = (): string[] => {
  const seq: string[] = [];
  for (let n = 1; n <= 8; n++) {
    seq.push(`A${n}`, `B${n}`, `C${n}`, `D${n}`);
  }
  return seq;
};

export const SEQ = buildOlympicSequence();
const NEXT: Record<string, string> = { A: 'B', B: 'C', C: 'D', D: 'A' };

export function toMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function daysDiff(date: Date, seedDate: Date): number {
  return Math.round((toMidnight(date).getTime() - toMidnight(seedDate).getTime()) / 86400000);
}

export function getMainDayCode(date: Date, seedDate: Date, seedCode: string): string {
  const seedIndex = SEQ.indexOf(seedCode);
  if (seedIndex === -1) throw new Error('Seed code non valido per la sequenza olimpica');
  const diff = daysDiff(date, seedDate);
  const i = ((seedIndex + diff) % SEQ.length + SEQ.length) % SEQ.length;
  return SEQ[i];
}

/**
 * Ritorna il codice del notturno.
 * REQUISITO: Il NOTTURNO di un giorno D corrisponde al DIURNO del giorno precedente (D-1).
 */
export function getMainNightCode(date: Date, seedDate: Date, seedCode: string): string {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return getMainDayCode(prev, seedDate, seedCode);
}

function prevNum(n: number): number {
  // 1..8 -> 8..7
  return ((n - 2 + 8) % 8) + 1;
}

export function selectableForVigilanza(mainDayCode: string) {
  const letter = mainDayCode[0];
  const num = parseInt(mainDayCode.slice(1), 10);
  const next = NEXT[letter];

  // Standard: tutti e 8 i sottogruppi della lettera successiva
  const standard = Array.from({ length: 8 }, (_, i) => `${next}${i + 1}`);

  // Rientri (extra): SEMPRE considerati, come da file Excel
  // Bn -> [Bn, D(n-1), An]
  // Cn -> [Cn, An, Bn]
  // Dn -> [Dn, Bn, Cn]
  // An -> [An, C(n-1), D(n-1)]
  let extra: string[] = [];
  if (letter === 'B') extra = [`B${num}`, `D${prevNum(num)}`, `A${num}`];
  if (letter === 'C') extra = [`C${num}`, `A${num}`, `B${num}`];
  if (letter === 'D') extra = [`D${num}`, `B${num}`, `C${num}`];
  if (letter === 'A') extra = [`A${num}`, `C${prevNum(num)}`, `D${prevNum(num)}`];

  return { standard, extra, all: [...standard, ...extra] };
}
