"use client";

import { useMemo, useRef, useState } from "react";
import { Circle, Group, Layer, Rect, Stage, Text } from "react-konva";

function seatedName(seat, people) {
  if (!seat.guestId && !seat.companionId) return "";
  return people.find((person) => person.value === (seat.guestId || seat.companionId))?.label || "Invitado";
}

function seatsAroundTable(table) {
  return table.seats.map((seat, index) => {
    const angle = ((index / table.seats.length) * Math.PI * 2) - Math.PI / 2;
    const radiusX = table.width / 2 + 24;
    const radiusY = table.height / 2 + 24;
    return { ...seat, x: Math.cos(angle) * radiusX, y: Math.sin(angle) * radiusY };
  });
}

function TableShape({ table, selected, onSelect, onDragEnd }) {
  const seats = seatsAroundTable(table);
  return <Group x={table.x + table.width / 2} y={table.y + table.height / 2} rotation={table.rotation} draggable onClick={onSelect} onTap={onSelect} onDragEnd={onDragEnd}>
    {table.shape === "round" ? <Circle radius={table.width / 2} fill="#e4d0a8" stroke={selected ? "#76563f" : "#8d846a"} strokeWidth={selected ? 4 : 2} /> : <Rect x={-table.width / 2} y={-table.height / 2} width={table.width} height={table.height} cornerRadius={18} fill="#e4d0a8" stroke={selected ? "#76563f" : "#8d846a"} strokeWidth={selected ? 4 : 2} />}
    <Text text={table.label} width={table.width} x={-table.width / 2} y={-10} align="center" fontFamily="Georgia" fontSize={18} fill="#314837" />
    {seats.map((seat) => <Group key={seat.id} x={seat.x} y={seat.y}><Circle radius={14} fill={seat.guestId || seat.companionId ? "#697651" : "#faf7ef"} stroke="#76563f" strokeWidth={1} /><Text text={String(seat.seatNumber)} x={-8} y={-6} width={16} align="center" fontSize={10} fill={seat.guestId || seat.companionId ? "#faf7ef" : "#76563f"} /></Group>)}
  </Group>;
}

export default function SeatingPlanner({ plans, guests, callApi, onRefresh }) {
  const stageRef = useRef(null);
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || "");
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [planName, setPlanName] = useState("");
  const [tableShape, setTableShape] = useState("round");
  const [exporting, setExporting] = useState(false);
  const plan = plans.find((item) => item.id === selectedPlanId) || plans[0];
  const selectedTable = plan?.tables.find((item) => item.id === selectedTableId);
  const people = useMemo(() => guests.flatMap((guest) => [{ value: guest.id, kind: "guest", label: guest.fullName }, ...(guest.companions || []).map((companion) => ({ value: companion.id, kind: "companion", label: companion.fullName || "Acompañante" }))]), [guests]);

  async function createPlan(event) {
    event.preventDefault();
    if (!planName.trim()) return;
    const payload = await callApi("/v1/admin/seating", { method: "POST", body: JSON.stringify({ name: planName.trim() }) });
    setPlanName(""); setSelectedPlanId(payload.plan.id); setSelectedTableId(null); await onRefresh();
  }

  async function addTable() {
    if (!plan) return;
    const number = plan.tables.length + 1;
    const side = tableShape === "round" ? 150 : 200;
    const payload = await callApi("/v1/admin/seating/tables", { method: "POST", body: JSON.stringify({ planId: plan.id, label: `Mesa ${number}`, shape: tableShape, x: 120 + ((number - 1) % 4) * 220, y: 120 + Math.floor((number - 1) / 4) * 210, width: side, height: tableShape === "round" ? side : 110, seatCount: 8 }) });
    setSelectedTableId(payload.table.id); await onRefresh();
  }

  async function moveTable(table, event) {
    const node = event.target;
    await callApi(`/v1/admin/seating/tables/${table.id}`, { method: "PATCH", body: JSON.stringify({ x: Math.max(0, node.x() - table.width / 2), y: Math.max(0, node.y() - table.height / 2) }) });
    await onRefresh();
  }

  async function assignSeat(seat, value) {
    const person = people.find((item) => item.value === value);
    const body = person ? (person.kind === "guest" ? { guestId: person.value } : { companionId: person.value }) : { guestId: null };
    await callApi(`/v1/admin/seating/seats/${seat.id}`, { method: "PATCH", body: JSON.stringify(body) });
    await onRefresh();
  }

  function exportImage() {
    const dataUrl = stageRef.current?.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
    if (!dataUrl) return;
    const link = document.createElement("a"); link.download = `${plan.name.toLowerCase().replace(/\s+/g, "-")}-mesas.png`; link.href = dataUrl; link.click();
  }

  async function exportWorkbook() {
    if (!plan) return;
    setExporting(true);
    try {
      const { default: writeExcelFile } = await import("write-excel-file/browser");
      const tableRows = [[{ value: "Mesa", fontWeight: "bold" }, { value: "Forma", fontWeight: "bold" }, { value: "Asientos", fontWeight: "bold" }, { value: "Posición X", fontWeight: "bold" }, { value: "Posición Y", fontWeight: "bold" }], ...plan.tables.map((table) => [{ value: table.label }, { value: table.shape === "round" ? "Redonda" : "Rectangular" }, { value: table.seatCount }, { value: table.x }, { value: table.y }])];
      const seatRows = [[{ value: "Mesa", fontWeight: "bold" }, { value: "Asiento", fontWeight: "bold" }, { value: "Asignado a", fontWeight: "bold" }], ...plan.tables.flatMap((table) => table.seats.map((seat) => [{ value: table.label }, { value: seat.seatNumber }, { value: seatedName(seat, people) || "Sin asignar" }]))];
      await writeExcelFile([{ data: tableRows, sheet: "Mesas" }, { data: seatRows, sheet: "Asignaciones" }]).toFile(`${plan.name.toLowerCase().replace(/\s+/g, "-")}-mesas.xlsx`);
    } finally { setExporting(false); }
  }

  return <section className="planner"><div className="admin-title"><div><p className="admin-kicker">Plano de mesas</p><h1>Diseña la recepción a tu manera.</h1><p>Arrastra las mesas en el lienzo y asigna cada asiento desde el panel.</p></div></div>
    <div className="planner-toolbar"><div>{plans.length ? <label>Plano<select value={plan?.id || ""} onChange={(event) => { setSelectedPlanId(event.target.value); setSelectedTableId(null); }}>{plans.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label> : <p>Aún no hay un plano.</p>}</div><form onSubmit={createPlan}><input value={planName} onChange={(event) => setPlanName(event.target.value)} placeholder="Ej. Recepción" aria-label="Nombre del nuevo plano" /><button type="submit">Nuevo plano</button></form></div>
    {plan && <div className="planner-layout"><section className="planner-canvas-panel"><div className="planner-actions"><label>Tipo de mesa<select value={tableShape} onChange={(event) => setTableShape(event.target.value)}><option value="round">Redonda</option><option value="rectangle">Rectangular</option></select></label><button type="button" onClick={addTable}>Añadir mesa</button><button type="button" className="admin-secondary" onClick={exportImage}>Descargar imagen</button><button type="button" className="admin-secondary" onClick={exportWorkbook} disabled={exporting}>{exporting ? "Generando…" : "Descargar Excel"}</button></div><div className="planner-stage-wrap"><Stage ref={stageRef} width={plan.canvasWidth} height={plan.canvasHeight} className="planner-stage"><Layer><Rect width={plan.canvasWidth} height={plan.canvasHeight} fill="#faf7ef" /><Text text={plan.name} x={32} y={28} fontFamily="Georgia" fontSize={24} fill="#314837" />{plan.tables.map((table) => <TableShape key={table.id} table={table} selected={selectedTableId === table.id} onSelect={() => setSelectedTableId(table.id)} onDragEnd={(event) => moveTable(table, event)} />)}</Layer></Stage></div></section><aside className="planner-inspector">{selectedTable ? <><p className="admin-kicker">{selectedTable.label}</p><h2>{selectedTable.shape === "round" ? "Mesa redonda" : "Mesa rectangular"}</h2><p>{selectedTable.seatCount} lugares disponibles. Selecciona a quién corresponde cada asiento.</p><ol className="planner-seat-list">{selectedTable.seats.map((seat) => <li key={seat.id}><span>Asiento {seat.seatNumber}</span><select value={seat.guestId || seat.companionId || ""} onChange={(event) => assignSeat(seat, event.target.value)}><option value="">Sin asignar</option>{people.map((person) => <option value={person.value} key={person.value}>{person.label}</option>)}</select></li>)}</ol></> : <><p className="admin-kicker">Tu lienzo</p><h2>Selecciona una mesa</h2><p>Después podrás ver y organizar sus asientos aquí. El panel funciona también en celular y con teclado.</p></>}</aside></div>}
  </section>;
}
