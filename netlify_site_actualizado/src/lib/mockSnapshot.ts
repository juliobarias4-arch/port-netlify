import type {
  CuotaRow,
  PeriodMonth,
  Snapshot,
  Trimester,
  RecordRow,
} from "@/types/snapshot";

// ---------------------------------------------------------------------------
// Realistic development fixture. Matches the exact Snapshot contract.
// 14 residents (R4×7, R3×4, R2×3), 13 months Jul 2026 → Jul 2027.
// In DEV this is served instead of the Netlify Functions.
// ---------------------------------------------------------------------------

const DUE = 500; // monthly due per resident (RD$)

const RESIDENTS: Array<{ doctor: string; rank: string }> = [
  { doctor: "ALEJO", rank: "R4" },
  { doctor: "BENCOSME", rank: "R4" },
  { doctor: "CABRERA", rank: "R4" },
  { doctor: "DURÁN", rank: "R4" },
  { doctor: "ESPINAL", rank: "R4" },
  { doctor: "FELIZ", rank: "R4" },
  { doctor: "GUZMÁN", rank: "R4" },
  { doctor: "HERRERA", rank: "R3" },
  { doctor: "INOA", rank: "R3" },
  { doctor: "JIMÉNEZ", rank: "R3" },
  { doctor: "KEItín", rank: "R3" },
  { doctor: "LANTIGUA", rank: "R2" },
  { doctor: "MEJÍA", rank: "R2" },
  { doctor: "NÚÑEZ", rank: "R2" },
];

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function lastDay(year: number, month: number): string {
  const d = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// Build 13 months: Jul 2026 (m=7,y=2026) ... Jul 2027.
const period_months: PeriodMonth[] = [];
{
  let year = 2026;
  let month = 7;
  for (let i = 0; i < 13; i++) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    const name = MONTH_NAMES[month - 1];
    period_months.push({
      key,
      label: `${cap(name)} ${year}`,
      name,
      month,
      year,
      due_date: lastDay(year, month),
    });
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
}

// Today (fixture reference): 2026-06-11 per environment. We treat the first
// 4 months as "active/payable" with mixed payments, the rest as future.
const TODAY = new Date("2026-06-11T00:00:00");
const payable_keys = period_months
  .filter((m) => new Date(`${m.due_date}T00:00:00`) <= addMonths(TODAY, 4))
  .map((m) => m.key);

function addMonths(d: Date, n: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

// Deterministic pseudo-random so the fixture is stable across reloads.
function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// ---- Cuotas grid -----------------------------------------------------------
const grid: CuotaRow[] = RESIDENTS.map((r, ri) => {
  const row: CuotaRow = { doctor: r.doctor, rank: r.rank, total_due: 0 };
  let unpaid = 0;
  period_months.forEach((m, mi) => {
    const isPayable = payable_keys.includes(m.key);
    if (!isPayable) {
      row[m.key] = false; // future month — not yet payable
      return;
    }
    // ~72% paid among payable months, deterministic.
    const paid = seeded(ri * 31 + mi * 7) > 0.28;
    row[m.key] = paid;
    if (!paid) unpaid++;
  });
  row.total_due = unpaid * DUE;
  return row;
});

// ---- Deudas (pending) ------------------------------------------------------
const pending = grid
  .map((row) => {
    const months = period_months
      .filter((m) => payable_keys.includes(m.key) && row[m.key] === false)
      .map((m) => ({ label: m.label, amount: DUE }));
    return {
      doctor: row.doctor,
      months,
      count: months.length,
      total_due: months.length * DUE,
    };
  })
  .filter((d) => d.count > 0)
  .sort((a, b) => b.total_due - a.total_due);

// ---- Summary totals --------------------------------------------------------
const initial = 37354;
let dues_income = 0;
grid.forEach((row) =>
  period_months.forEach((m) => {
    if (payable_keys.includes(m.key) && row[m.key] === true) dues_income += DUE;
  }),
);

const ingresosRecords = [
  { id: 1, income_date: "2026-07-05", concept: "Aporte sociedad médica", amount: 12000, note: "Donación trimestral" },
  { id: 2, income_date: "2026-08-12", concept: "Rifa actividad académica", amount: 8450, note: null },
  { id: 3, income_date: "2026-09-03", concept: "Venta de camisetas", amount: 5600, note: "Stock R1" },
  { id: 4, income_date: "2026-10-20", concept: "Patrocinio congreso", amount: 15000, note: "Laboratorio asociado" },
];
const other_income = ingresosRecords.reduce((s, r) => s + r.amount, 0);

const egresosRecords = [
  { id: 1, expense_date: "2026-07-18", concept: "Material didáctico", amount: 6200, note: "Simuladores" },
  { id: 2, expense_date: "2026-08-09", concept: "Refrigerio jornada", amount: 3100, note: null },
  { id: 3, expense_date: "2026-09-15", concept: "Inscripción congreso", amount: 9800, note: "3 residentes" },
  { id: 4, expense_date: "2026-10-02", concept: "Impresión de afiches", amount: 1450, note: null },
  { id: 5, expense_date: "2026-11-11", concept: "Mantenimiento equipo", amount: 4300, note: "Ventilador docente" },
];
const expenses = egresosRecords.reduce((s, r) => s + r.amount, 0);

const total_income = dues_income + other_income;
const balance = initial + total_income - expenses;
const debt = pending.reduce((s, d) => s + d.total_due, 0);

// ---- Monthly series (13 points) -------------------------------------------
const monthly = period_months.map((m) => {
  let paid = 0;
  let mdebt = 0;
  grid.forEach((row) => {
    if (!payable_keys.includes(m.key)) return;
    if (row[m.key] === true) paid += DUE;
    else mdebt += DUE;
  });
  return { label: cap(m.name).slice(0, 3), paid, debt: mdebt };
});

// ---- Historial -------------------------------------------------------------
const historialLog = [
  { timestamp: "2026-06-11T09:14:22", user: "tesorería", action_type: "pagado", detail: "ALEJO pagó cuota de Septiembre 2026" },
  { timestamp: "2026-06-11T08:51:03", user: "tesorería", action_type: "ingreso", detail: "Registró ingreso: Patrocinio congreso (RD$ 15,000.00)" },
  { timestamp: "2026-06-10T16:42:10", user: "admin", action_type: "egreso", detail: "Registró egreso: Mantenimiento equipo (RD$ 4,300.00)" },
  { timestamp: "2026-06-10T11:20:45", user: "tesorería", action_type: "pagado", detail: "HERRERA pagó cuota de Agosto 2026" },
  { timestamp: "2026-06-09T15:05:31", user: "tesorería", action_type: "pagado", detail: "MEJÍA pagó cuota de Julio 2026" },
  { timestamp: "2026-06-09T10:33:19", user: "admin", action_type: "eliminación", detail: "Eliminó registro duplicado de ingreso" },
  { timestamp: "2026-06-08T14:27:08", user: "tesorería", action_type: "ingreso", detail: "Registró ingreso: Venta de camisetas (RD$ 5,600.00)" },
  { timestamp: "2026-06-08T09:02:54", user: "tesorería", action_type: "pagado", detail: "CABRERA pagó cuota de Septiembre 2026" },
  { timestamp: "2026-06-07T17:48:12", user: "admin", action_type: "egreso", detail: "Registró egreso: Inscripción congreso (RD$ 9,800.00)" },
  { timestamp: "2026-06-07T08:15:40", user: "tesorería", action_type: "pagado", detail: "INOA pagó cuota de Julio 2026" },
];

// ---- Record (trimesters) ---------------------------------------------------
function buildTrimester(num: number, startIdx: number): Trimester {
  const months = period_months.slice(startIdx, startIdx + 3);
  const rows: RecordRow[] = grid.map((row) => {
    const cells = months.map((m) => {
      const paidBool = row[m.key] === true;
      return { key: m.key, label: m.label, paid: paidBool, amount: paidBool ? DUE : 0 };
    });
    const paidCount = cells.filter((c) => c.paid).length;
    const payableCount = months.filter((m) => payable_keys.includes(m.key)).length;
    return {
      doctor: row.doctor,
      rank: row.rank,
      cells,
      paid: paidCount * DUE,
      pending: Math.max(0, (payableCount - paidCount)) * DUE,
    };
  });
  const total_paid = rows.reduce((s, r) => s + r.paid, 0);
  const total_pending = rows.reduce((s, r) => s + r.pending, 0);
  const first = months[0];
  const last = months[months.length - 1];
  return {
    num,
    label: `Trimestre ${num}`,
    period: `${first.label} – ${last.label}`,
    months: months.map((m) => ({ key: m.key, label: m.label })),
    rows,
    total_paid,
    total_pending,
  };
}

const trimesters: Trimester[] = [
  buildTrimester(1, 0),
  buildTrimester(2, 3),
  buildTrimester(3, 6),
  buildTrimester(4, 9),
];

export const mockSnapshot: Snapshot = {
  ok: true,
  synced_at: "2026-06-11T07:54:44",
  received_at: "2026-06-11T07:55:02",
  source: "Contabilidad - Departamento de Anestesiologia",
  data: {
    summary: {
      totals: {
        initial,
        dues_income,
        other_income,
        total_income,
        expenses,
        balance,
        debt,
      },
      monthly,
    },
    cuotas: { grid, period_months, payable_keys },
    deudas: { pending },
    ingresos: { records: ingresosRecords },
    egresos: { records: egresosRecords },
    historial: { log: historialLog },
    record: { trimesters },
  },
};
