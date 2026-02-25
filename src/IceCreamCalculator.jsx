import { useState } from "react";

const s = {
  app:       { maxWidth: 600, margin: "0 auto", padding: 16, display: "flex", flexDirection: "column", gap: 14, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif", background: "#f3f4f6", minHeight: "100vh" },
  h1:        { textAlign: "center", fontSize: "1.25rem", fontWeight: 700, padding: "10px 0" },
  card:      { background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.1)", padding: 16 },
  cardBlue:  { background: "#eff6ff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.1)", padding: 16, border: "2px solid #bfdbfe" },
  h2:        { fontSize: "0.95rem", fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: 8, marginBottom: 12 },
  grid2:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  span2:     { gridColumn: "1 / -1" },
  label:     { display: "block", fontSize: "0.78rem", color: "#374151", marginBottom: 3, fontWeight: 500 },
  input:     { width: "100%", border: "1px solid #d1d5db", borderRadius: 7, padding: "8px 10px", fontSize: "0.9rem", background: "#f9fafb", boxSizing: "border-box" },
  hint:      { fontSize: "0.78rem", color: "#6b7280", marginTop: 6 },
  divider:   { borderTop: "1px solid #e5e7eb", paddingTop: 12, marginTop: 10 },
  subTitle:  { fontSize: "0.85rem", fontWeight: 600, marginBottom: 8 },
  btnLink:   { background: "none", border: "none", color: "#3b82f6", fontSize: "0.82rem", cursor: "pointer", textDecoration: "underline", padding: 0, fontFamily: "inherit" },
  rowBetween:{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  resultRow: { display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e5e7eb", fontSize: "0.85rem" },
  lbl:       { color: "#6b7280" },
  val:       { fontFamily: "monospace", fontWeight: 500 },
  boldVal:   { fontFamily: "monospace", fontWeight: 700, color: "#111" },
  boldLbl:   { color: "#111", fontWeight: 700 },
  btnSave:   { width: "100%", marginTop: 14, padding: 13, background: "#16a34a", color: "#fff", border: "none", borderRadius: 9, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  salaryRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 },
  totalExp:  { marginTop: 10, fontSize: "0.85rem", fontWeight: 600 },
};

const Field = ({ label, name, value, onChange, type = "number" }) => (
  <div>
    <label style={s.label}>{label}</label>
    <input style={s.input} type={type} name={name} value={value} onChange={onChange} />
  </div>
);

const ResultRow = ({ label, value, bold }) => (
  <div style={s.resultRow}>
    <span style={bold ? s.boldLbl : s.lbl}>{label}</span>
    <span style={bold ? s.boldVal : s.val}>{value}</span>
  </div>
);

const INIT = {
  lastNightClosing: "", todayNightClosing: "",
  tubMeltUnits: "", miniMeltUnits: "",
  bulkUnitsYesterday: "", bulkUnitsToday: "",
  tubUnitsYesterday: "", tubUnitsToday: "",
  miniUnitsYesterday: "", miniUnitsToday: "",
  premixUsed: "",
  sachinSir: "", sl: "", bank: "", tea: "", misc: "",
  todayOpeningBalance: "", additionalMoney: "",
  swiggy: "", zomato: "", paytm: "", cash: "", tomorrowOpeningBalance: "",
};

export default function IceCreamCalculator() {
  const [data, setData] = useState(INIT);
  const [containers, setContainers] = useState(Array(30).fill(""));
  const [salaryEmployees, setSalaryEmployees] = useState([{ name: "", amount: "" }]);

  const handleChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const n = (v) => parseFloat(v) || 0;

  const handleContainerChange = (i, val) => {
    const updated = [...containers];
    updated[i] = val;
    setContainers(updated);
    const sum = updated.reduce((s, v) => s + (parseFloat(v) || 0), 0);
    setData(prev => ({ ...prev, todayNightClosing: String(sum) }));
  };
  const addContainer = () => setContainers(prev => [...prev, ""]);
  const containerSum = containers.reduce((s, v) => s + (parseFloat(v) || 0), 0);

  const handleSalaryChange = (i, field, val) => {
    const updated = [...salaryEmployees];
    updated[i] = { ...updated[i], [field]: val };
    setSalaryEmployees(updated);
  };
  const addSalaryEmployee = () => setSalaryEmployees(prev => [...prev, { name: "", amount: "" }]);
  const totalSalary = salaryEmployees.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

  // Calculations
  const tubMeltGrams       = n(data.tubMeltUnits) * 500;
  const miniMeltGrams      = n(data.miniMeltUnits) * 300;
  const bulkMeltGrams      = Math.abs(n(data.bulkUnitsYesterday) - n(data.bulkUnitsToday)) * 1500;
  const totalMeltGrams     = tubMeltGrams + miniMeltGrams + bulkMeltGrams;
  const iceCreamSoldGrams  = totalMeltGrams + n(data.lastNightClosing) - n(data.todayNightClosing);

  const tubRevenue   = (Math.abs(n(data.tubUnitsYesterday) - n(data.tubUnitsToday)) - n(data.tubMeltUnits)) * 356;
  const miniRevenue  = (Math.abs(n(data.miniUnitsYesterday) - n(data.miniUnitsToday)) - n(data.miniMeltUnits)) * 267;
  const coneCount    = n(data.premixUsed) * 50;
  const coneRevenue  = coneCount * 9;
  const totalRevenue = tubRevenue + miniRevenue + coneRevenue;

  const expenses = n(data.sachinSir) + n(data.sl) + n(data.bank) + n(data.tea) + n(data.misc) + totalSalary;
  const takeHome = n(data.cash) + n(data.tomorrowOpeningBalance) + expenses
                 + n(data.swiggy) + n(data.zomato) + n(data.paytm)
                 - (n(data.todayOpeningBalance) + n(data.additionalMoney));
  const scoopCount     = Math.abs((totalRevenue - takeHome) / 72);
  const avgScoopWeight = scoopCount > 0 ? iceCreamSoldGrams / scoopCount : 0;
  const totalOnline    = n(data.swiggy) + n(data.zomato) + n(data.paytm);

  const saveReport = () => {
    const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const salaryLines = salaryEmployees.filter(e => e.name || e.amount)
      .map(e => `    ${e.name || "Unknown"}: Rs.${parseFloat(e.amount) || 0}`).join("\n") || "    None";
    const report =
`==========================================
       ICE CREAM DAILY REPORT
       Date: ${date}
==========================================

-- CLOSING WEIGHTS ------------------------
  Last Night Closing : ${n(data.lastNightClosing)} g
  Tonight Closing    : ${containerSum.toFixed(0)} g

-- MELT -----------------------------------
  Tub Melt    : ${tubMeltGrams.toFixed(0)} g
  Mini Melt   : ${miniMeltGrams.toFixed(0)} g
  Bulk Melt   : ${bulkMeltGrams.toFixed(0)} g
  Total Melt  : ${totalMeltGrams.toFixed(0)} g

-- ICE CREAM SOLD -------------------------
  Total Sold  : ${iceCreamSoldGrams.toFixed(0)} g

-- PACKAGED REVENUE -----------------------
  Tub Revenue  : Rs.${tubRevenue.toFixed(0)}
  Mini Revenue : Rs.${miniRevenue.toFixed(0)}
  Cone Revenue : Rs.${coneRevenue.toFixed(0)}
  Total Revenue: Rs.${totalRevenue.toFixed(0)}

-- SCOOP ANALYSIS -------------------------
  Scoop Count      : ${scoopCount.toFixed(1)}
  Avg Scoop Weight : ${avgScoopWeight.toFixed(1)} g

-- ONLINE SALES ---------------------------
  Swiggy : Rs.${n(data.swiggy)}
  Zomato : Rs.${n(data.zomato)}
  Paytm  : Rs.${n(data.paytm)}
  Total  : Rs.${totalOnline.toFixed(0)}

-- EXPENSES --------------------------------
  Sachin Sir : Rs.${n(data.sachinSir)}
  SL         : Rs.${n(data.sl)}
  Bank       : Rs.${n(data.bank)}
  Tea        : Rs.${n(data.tea)}
  Misc       : Rs.${n(data.misc)}
  Salary Paid:
${salaryLines}
  Total Salary   : Rs.${totalSalary.toFixed(0)}
  Total Expenses : Rs.${expenses.toFixed(0)}

-- CASH SUMMARY ----------------------------
  Opening Balance  : Rs.${n(data.todayOpeningBalance)}
  Additional Money : Rs.${n(data.additionalMoney)}
  Cash in Hand     : Rs.${n(data.cash)}
  Tomorrow Opening : Rs.${n(data.tomorrowOpeningBalance)}
  Take Home        : Rs.${takeHome.toFixed(0)}

-- SUMMARY ----------------------------------
  Total Melt       : ${totalMeltGrams.toFixed(0)} g
  Ice Cream Sold   : ${iceCreamSoldGrams.toFixed(0)} g
  Tub Revenue      : Rs.${tubRevenue.toFixed(0)}
  Mini Revenue     : Rs.${miniRevenue.toFixed(0)}
  Cone Revenue     : Rs.${coneRevenue.toFixed(0)}
  Total Revenue    : Rs.${totalRevenue.toFixed(0)}
  Take Home        : Rs.${takeHome.toFixed(0)}
  Scoop Count      : ${scoopCount.toFixed(1)}
  Avg Scoop Weight : ${avgScoopWeight.toFixed(1)} g
  Total Online     : Rs.${totalOnline.toFixed(0)}
  Total Expenses   : Rs.${expenses.toFixed(0)}

==========================================`;
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `IceCream_Report_${date.replace(/ /g, "_")}.txt`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <div style={s.app}>
      <h1 style={s.h1}>🍦 Daily Ice Cream Report</h1>

      {/* CONTAINERS */}
      <div style={s.card}>
        <h2 style={s.h2}>⚖️ Tonight's Containers (grams)</h2>
        <div style={s.grid2}>
          {containers.map((val, i) => (
            <div key={i}>
              <label style={s.label}>Container {i + 1}</label>
              <input style={s.input} type="number" value={val} onChange={e => handleContainerChange(i, e.target.value)} />
            </div>
          ))}
        </div>
        <div style={s.rowBetween}>
          <button style={s.btnLink} onClick={addContainer}>+ Add Container</button>
          <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Sum: {containerSum.toFixed(0)} g</span>
        </div>
      </div>

      {/* CLOSING WEIGHTS */}
      <div style={s.card}>
        <h2 style={s.h2}>📦 Closing Weights (grams)</h2>
        <div style={s.grid2}>
          <Field label="Last Night Closing Weight (g)" name="lastNightClosing" value={data.lastNightClosing} onChange={handleChange} />
          <Field label="Today Night Closing Weight (g)" name="todayNightClosing" value={data.todayNightClosing} onChange={handleChange} />
        </div>
      </div>

      {/* MELT */}
      <div style={s.card}>
        <h2 style={s.h2}>💧 Melt (units)</h2>
        <div style={s.grid2}>
          <Field label="Tub Melt (units)" name="tubMeltUnits" value={data.tubMeltUnits} onChange={handleChange} />
          <Field label="Mini Melt (units)" name="miniMeltUnits" value={data.miniMeltUnits} onChange={handleChange} />
          <Field label="Bulk Units Yesterday" name="bulkUnitsYesterday" value={data.bulkUnitsYesterday} onChange={handleChange} />
          <Field label="Bulk Units Today" name="bulkUnitsToday" value={data.bulkUnitsToday} onChange={handleChange} />
          <div style={{ ...s.hint, ...s.span2 }}>
            Tub: {tubMeltGrams.toFixed(0)}g | Mini: {miniMeltGrams.toFixed(0)}g | Bulk: {bulkMeltGrams.toFixed(0)}g | <strong>Total Melt: {totalMeltGrams.toFixed(0)}g</strong>
          </div>
        </div>
      </div>

      {/* PACKAGED SALES */}
      <div style={s.card}>
        <h2 style={s.h2}>🧊 Packaged Sales (units)</h2>
        <div style={s.grid2}>
          <Field label="Tub Units — Last Night" name="tubUnitsYesterday" value={data.tubUnitsYesterday} onChange={handleChange} />
          <Field label="Tub Units — Tonight" name="tubUnitsToday" value={data.tubUnitsToday} onChange={handleChange} />
          <Field label="Mini Units — Last Night" name="miniUnitsYesterday" value={data.miniUnitsYesterday} onChange={handleChange} />
          <Field label="Mini Units — Tonight" name="miniUnitsToday" value={data.miniUnitsToday} onChange={handleChange} />
          <div style={{ ...s.hint, ...s.span2 }}>
            Tub Revenue: ₹{tubRevenue.toFixed(0)} (sold − melted × ₹356) | Mini Revenue: ₹{miniRevenue.toFixed(0)} (sold − melted × ₹267)
          </div>
        </div>
      </div>

      {/* CONE / PREMIX */}
      <div style={s.card}>
        <h2 style={s.h2}>🍦 Cone / Premix</h2>
        <div style={s.grid2}>
          <Field label="Premix Used (units)" name="premixUsed" value={data.premixUsed} onChange={handleChange} />
          <div style={{ ...s.hint, ...s.span2 }}>Cones: {coneCount.toFixed(0)} | Cone Revenue: ₹{coneRevenue.toFixed(0)}</div>
        </div>
      </div>

      {/* EXPENSES */}
      <div style={s.card}>
        <h2 style={s.h2}>💸 Expenses</h2>
        <div style={s.grid2}>
          <Field label="Sachin Sir" name="sachinSir" value={data.sachinSir} onChange={handleChange} />
          <Field label="SL" name="sl" value={data.sl} onChange={handleChange} />
          <Field label="Bank" name="bank" value={data.bank} onChange={handleChange} />
          <Field label="Tea" name="tea" value={data.tea} onChange={handleChange} />
          <Field label="Misc" name="misc" value={data.misc} onChange={handleChange} />
        </div>
        <div style={s.divider}>
          <div style={s.subTitle}>👤 Salary Paid</div>
          {salaryEmployees.map((emp, i) => (
            <div key={i} style={s.salaryRow}>
              <div>
                <label style={s.label}>Employee Name</label>
                <input style={s.input} type="text" value={emp.name} placeholder="Name" onChange={e => handleSalaryChange(i, "name", e.target.value)} />
              </div>
              <div>
                <label style={s.label}>Amount (₹)</label>
                <input style={s.input} type="number" value={emp.amount} placeholder="0" onChange={e => handleSalaryChange(i, "amount", e.target.value)} />
              </div>
            </div>
          ))}
          <div style={s.rowBetween}>
            <button style={s.btnLink} onClick={addSalaryEmployee}>+ Add Salary Employee</button>
            <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Total Salary: ₹{totalSalary.toFixed(0)}</span>
          </div>
        </div>
        <div style={s.totalExp}>Total Expenses: ₹{expenses.toFixed(0)}</div>
      </div>

      {/* CASH & ONLINE */}
      <div style={s.card}>
        <h2 style={s.h2}>💰 Cash &amp; Online Sales</h2>
        <div style={s.grid2}>
          <Field label="Today Opening Balance" name="todayOpeningBalance" value={data.todayOpeningBalance} onChange={handleChange} />
          <Field label="Additional Money Added" name="additionalMoney" value={data.additionalMoney} onChange={handleChange} />
          <Field label="Swiggy" name="swiggy" value={data.swiggy} onChange={handleChange} />
          <Field label="Zomato" name="zomato" value={data.zomato} onChange={handleChange} />
          <Field label="Paytm" name="paytm" value={data.paytm} onChange={handleChange} />
          <Field label="Cash (in hand)" name="cash" value={data.cash} onChange={handleChange} />
          <Field label="Tomorrow Opening Balance" name="tomorrowOpeningBalance" value={data.tomorrowOpeningBalance} onChange={handleChange} />
        </div>
      </div>

      {/* SUMMARY */}
      <div style={s.cardBlue}>
        <h2 style={s.h2}>📊 Summary</h2>
        <ResultRow label="Total Melt" value={`${totalMeltGrams.toFixed(0)} g`} />
        <ResultRow label="Ice Cream Sold" value={`${iceCreamSoldGrams.toFixed(0)} g`} bold />
        <ResultRow label="Tub Revenue" value={`₹${tubRevenue.toFixed(0)}`} />
        <ResultRow label="Mini Revenue" value={`₹${miniRevenue.toFixed(0)}`} />
        <ResultRow label="Cone Revenue" value={`₹${coneRevenue.toFixed(0)}`} />
        <ResultRow label="Total Revenue" value={`₹${totalRevenue.toFixed(0)}`} bold />
        <ResultRow label="Take Home" value={`₹${takeHome.toFixed(0)}`} bold />
        <ResultRow label="Scoop Count" value={scoopCount.toFixed(1)} />
        <ResultRow label="Avg Scoop Weight" value={`${avgScoopWeight.toFixed(1)} g`} bold />
        <ResultRow label="Total Online" value={`₹${totalOnline.toFixed(0)}`} />
        <ResultRow label="Total Expenses" value={`₹${expenses.toFixed(0)}`} />
        <button style={s.btnSave} onClick={saveReport}>💾 Save Report to Device</button>
      </div>

    </div>
  );
}
