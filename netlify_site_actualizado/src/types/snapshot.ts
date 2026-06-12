// Exact snapshot contract returned by /api/data. Do not invent fields.

export interface Totals {
  initial: number;
  dues_income: number;
  other_income: number;
  total_income: number;
  expenses: number;
  balance: number;
  debt: number;
  legacy_paid?: number;
  legacy_pending?: number;
}

export interface MonthlyPoint {
  label: string;
  paid: number;
  debt: number;
}

export interface Summary {
  totals: Totals;
  monthly: MonthlyPoint[]; // 13 months
}

export interface CuotaRow {
  doctor: string;
  rank: string; // "R4" | "R3" | "R2" | "R1"
  total_due: number;
  // dynamic month keys, e.g. "2026-07": true
  [monthKey: string]: boolean | string | number;
}

export interface PeriodMonth {
  key: string; // "2026-07"
  label: string; // "Julio 2026"
  name: string; // "julio"
  month: number; // 7
  year: number; // 2026
  due_date: string; // "2026-07-31"
}

export interface Cuotas {
  grid: CuotaRow[];
  period_months: PeriodMonth[];
  payable_keys: string[];
}

export interface DeudaMonth {
  label: string;
  amount: number;
}

export interface PendingDebtor {
  doctor: string;
  months: DeudaMonth[];
  count: number;
  total_due: number;
}

export interface LegacyDebt {
  id: number;
  doctor_name: string;
  concept: string;
  amount: number;
  paid: number; // 0 | 1
  created_date: string;
  paid_date: string | null;
}

export interface Deudas {
  pending: PendingDebtor[];
  totals?: Record<string, unknown>;
  legacy?: LegacyDebt[];
}

export interface MovementRecord {
  id?: number;
  income_date?: string;
  expense_date?: string;
  concept: string;
  amount: number;
  note: string | null;
}

export interface IncomeRecord extends MovementRecord {
  income_date: string;
}

export interface ExpenseRecord extends MovementRecord {
  expense_date: string;
}

export interface Ingresos {
  records: IncomeRecord[];
}

export interface Egresos {
  records: ExpenseRecord[];
}

export interface HistoryEntry {
  timestamp: string;
  user: string;
  action_type: string;
  detail: string;
}

export interface Historial {
  log: HistoryEntry[];
}

export interface RecordCell {
  key: string;
  label: string;
  paid: boolean;
  amount: number;
}

export interface RecordRow {
  doctor: string;
  rank: string;
  cells: RecordCell[];
  paid: number;
  pending: number;
}

export interface Trimester {
  num: number;
  label: string; // "Trimestre 1"
  period: string; // "Julio 2026 – Septiembre 2026"
  months: Array<{ key: string; label: string }>;
  rows: RecordRow[];
  total_paid: number;
  total_pending: number;
}

export interface RecordData {
  trimesters: Trimester[];
}

export interface SnapshotData {
  summary: Summary;
  cuotas: Cuotas;
  deudas: Deudas;
  ingresos: Ingresos;
  egresos: Egresos;
  historial: Historial;
  record: RecordData;
}

export interface Snapshot {
  ok: boolean;
  synced_at: string;
  received_at?: string;
  source: string;
  data: SnapshotData;
}

export interface StatusResponse {
  ok: boolean;
  has_snapshot: boolean;
  synced_at: string | null;
  received_at?: string | null;
  source: string | null;
}

export interface Credentials {
  password_1: string;
  password_2: string;
}
