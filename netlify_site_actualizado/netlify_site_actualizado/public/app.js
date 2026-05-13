const state = {
  snapshot: null,
  active: "summary",
  credentials: null,
};

const views = {
  summary: "Resumen financiero",
  cuotas: "Registro de cuotas",
  deudas: "Deudas pendientes",
  ingresos: "Otros ingresos",
  egresos: "Egresos",
  historial: "Historial",
  record: "Record por trimestres",
};

const $ = (selector) => document.querySelector(selector);
const money = (value) => `RD$ ${Number(value || 0).toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const text = (value) => String(value ?? "");

function escapeHtml(value) {
  return text(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadStatus() {
  try {
    const res = await fetch("/api/status", { cache: "no-store" });
    const data = await res.json();
    if (data.has_snapshot) {
      $("#statusText").textContent = `Última sincronización: ${data.synced_at}`;
      $("#syncMeta").textContent = `Última sincronización: ${data.synced_at}`;
    } else {
      $("#statusText").textContent = "Aún no hay snapshot sincronizado.";
      $("#syncMeta").textContent = "Aún no hay datos sincronizados.";
    }
  } catch {
    $("#statusText").textContent = "No se pudo verificar el estado.";
  }
}

async function login(event) {
  event.preventDefault();
  $("#loginMessage").textContent = "Cargando datos...";
  const password_1 = $("#password1").value;
  const password_2 = $("#password2").value;

  try {
    const payload = await fetchData({ password_1, password_2 });
    if (!payload.ok) {
      $("#loginMessage").textContent = payload.error || "No se pudo iniciar sesión.";
      return;
    }
    state.snapshot = payload;
    state.credentials = { password_1, password_2 };
    $("#loginView").hidden = true;
    $("#appView").hidden = false;
    $("#nav").hidden = false;
    $("#logoutBtn").hidden = false;
    $("#refreshBtn").hidden = false;
    $("#syncMeta").textContent = `Última sincronización: ${payload.synced_at}`;
    $("#statusText").textContent = `Fuente: ${payload.source || "Programa principal"}`;
    render();
  } catch {
    $("#loginMessage").textContent = "No se pudo conectar con Netlify.";
  }
}

async function fetchData(credentials) {
  const res = await fetch("/api/data", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const payload = await res.json();
  if (!res.ok) payload.ok = false;
  return payload;
}

async function refreshData(silent = false) {
  if (!state.credentials) return;
  if (!silent) $("#syncMeta").textContent = "Actualizando datos...";
  try {
    const payload = await fetchData(state.credentials);
    if (!payload.ok) {
      if (!silent) $("#syncMeta").textContent = payload.error || "No se pudo actualizar.";
      return;
    }
    state.snapshot = payload;
    $("#syncMeta").textContent = `Última sincronización: ${payload.synced_at}`;
    $("#statusText").textContent = `Fuente: ${payload.source || "Programa principal"}`;
    render();
  } catch {
    if (!silent) $("#syncMeta").textContent = "No se pudo conectar con Netlify.";
  }
}

function logout() {
  state.snapshot = null;
  state.credentials = null;
  $("#loginView").hidden = false;
  $("#appView").hidden = true;
  $("#nav").hidden = true;
  $("#logoutBtn").hidden = true;
  $("#refreshBtn").hidden = true;
  $("#password1").value = "";
  $("#password2").value = "";
}

function setView(view) {
  state.active = view;
  document.querySelectorAll("#nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  render();
}

function render() {
  $("#pageTitle").textContent = views[state.active];
  const data = state.snapshot?.data || {};
  const renderers = {
    summary: renderSummary,
    cuotas: renderCuotas,
    deudas: renderDeudas,
    ingresos: () => renderRecords("Otros ingresos", data.ingresos?.records || [], "income_date"),
    egresos: () => renderRecords("Egresos", data.egresos?.records || [], "expense_date"),
    historial: renderHistorial,
    record: renderRecord,
  };
  $("#appView").innerHTML = renderers[state.active]?.(data) || "";
}

function renderSummary(data) {
  const summary = data.summary || {};
  const t = summary.totals || {};
  const monthly = summary.monthly || [];
  return `
    <div class="grid kpis">
      ${card("Balance actual", money(t.balance), "primary")}
      ${card("Total ingresos", money(t.total_income))}
      ${card("Total egresos", money(t.expenses), "danger")}
      ${card("Deuda pendiente", money(t.debt), "danger")}
    </div>
    <div class="grid triple">
      ${card("Saldo inicial", money(t.initial))}
      ${card("Cuotas cobradas", money(t.dues_income))}
      ${card("Otros ingresos", money(t.other_income))}
    </div>
    <div class="table-card">
      <div class="table-title">Resumen por mes</div>
      ${table(["Mes", "Cobrado", "Deuda"], monthly.map((m) => [
        escapeHtml(m.label),
        money(m.paid),
        Number(m.debt || 0) > 0 ? `<span class="status-bad">${money(m.debt)}</span>` : "-"
      ]), [false, true, true])}
    </div>
  `;
}

function renderCuotas(data) {
  const cuotas = data.cuotas || {};
  const months = cuotas.period_months || [];
  const payable = new Set(cuotas.payable_keys || []);
  const headers = ["Residente", ...months.map((m) => `${m.name?.slice(0, 3) || ""} ${m.year}`), "Deuda"];
  const rows = (cuotas.grid || []).map((row) => [
    `<strong>${escapeHtml(row.doctor)}</strong><br><small>${escapeHtml(row.rank)}</small>`,
    ...months.map((m) => {
      if (!payable.has(m.key)) return "Pendiente";
      return row[m.key] ? '<span class="status-ok">Pagada</span>' : '<span class="status-bad">Debe</span>';
    }),
    Number(row.total_due || 0) > 0 ? `<span class="status-bad">${money(row.total_due)}</span>` : "-"
  ]);
  return `<div class="table-card"><div class="table-title">Cuotas</div>${table(headers, rows)}</div>`;
}

function renderDeudas(data) {
  const deudas = data.deudas || {};
  const pending = deudas.pending || [];
  const total = deudas.totals?.debt || 0;
  if (!pending.length) {
    return `${card("Deuda total acumulada", money(total), "primary")}<div class="empty">Sin deudas pendientes.</div>`;
  }
  return `
    <div class="grid kpis">${card("Deuda total acumulada", money(total), "danger")}</div>
    <div class="table-card">
      <div class="table-title">Residentes con pagos pendientes</div>
      ${pending.map((row) => `
        <div class="debt-item">
          <div class="debt-head">
            <span>${escapeHtml(row.doctor)} · ${row.count} cuota${row.count === 1 ? "" : "s"}</span>
            <span class="status-bad">${money(row.total_due)}</span>
          </div>
          <div class="chips">
            ${(row.months || []).map((m) => `<span class="chip">${escapeHtml(m.label)} · ${money(m.amount)}</span>`).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderRecords(title, records, dateField) {
  const rows = records.map((row) => [
    escapeHtml(row[dateField]),
    escapeHtml(row.concept),
    `<span class="${dateField === "expense_date" ? "status-bad" : "status-ok"}">${money(row.amount)}</span>`,
  ]);
  return `<div class="table-card"><div class="table-title">${title}</div>${table(["Fecha", "Concepto", "Monto"], rows, [false, false, true])}</div>`;
}

function renderHistorial(data) {
  const log = data.historial?.log || [];
  const rows = log.map((entry) => [
    escapeHtml(entry.timestamp),
    escapeHtml(entry.user),
    escapeHtml(entry.action_type),
    escapeHtml(entry.detail),
  ]);
  return `<div class="table-card"><div class="table-title">Últimas ${log.length} entradas</div>${table(["Fecha", "Usuario", "Acción", "Detalle"], rows)}</div>`;
}

function renderRecord(data) {
  const trimesters = data.record?.trimesters || [];
  if (!trimesters.length) return `<div class="empty">Sin trimestres registrados.</div>`;
  return trimesters.map((trimester) => {
    const rows = (trimester.rows || []).map((row) => [
      escapeHtml(row.doctor),
      money(row.total_paid),
      money(row.total_due),
      `${row.paid_count || 0}/${row.months?.length || 0}`,
    ]);
    return `<div class="table-card"><div class="table-title">${escapeHtml(trimester.title || trimester.label || "Trimestre")}</div>${table(["Residente", "Pagado", "Deuda", "Cuotas"], rows, [false, true, true, true])}</div>`;
  }).join("");
}

function card(label, value, extra = "") {
  return `<div class="card ${extra}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function table(headers, rows, rightColumns = []) {
  if (!rows.length) return `<div class="empty">Sin datos para mostrar.</div>`;
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${headers.map((h, i) => `<th class="${rightColumns[i] ? "right" : ""}">${escapeHtml(h)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell, i) => `<td class="${rightColumns[i] ? "right" : ""}">${cell}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

$("#loginForm").addEventListener("submit", login);
$("#logoutBtn").addEventListener("click", logout);
$("#refreshBtn").addEventListener("click", () => refreshData(false));
document.querySelectorAll("#nav button").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

loadStatus();
setInterval(() => refreshData(true), 30000);
