import { BRAND, DEPARTMENTS, DEPT_COLORS, ROLE_COLOR, S, todayStr } from "../constants/data";

export default function HomeTab({ members, minutes, logs, events, calYear, calMonth, setMinuteModal, setTab }) {
  const eventsThisMonth = events.filter(e => {
    const targetDate = e.startDate || e.date;
    if(!targetDate) return false;
    const [ey, em] = targetDate.split("-").map(Number);
    return ey === calYear && em === calMonth + 1;
  });
  const deptMembers = (dept) => members.filter(m => m.dept === dept);
  
  // 집행부 -> 회장단으로 조건 변경
  const execMembers = members.filter(m => m.dept === "회장단");

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, color:"#94A3B8", fontWeight:700, letterSpacing:1.5, marginBottom:6 }}>HONGIK UNIV · MATH EDUCATION</div>
        <div style={{ fontSize:26, fontWeight:900 }}>제 39대 학생회 <span style={{ color:BRAND }}>이상</span></div>
        <div style={{ fontSize:13, color:"#94A3B8", marginTop:3 }}>2025년 워크스페이스</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"총 부원",   value:members.length,                             icon:"👥", c:"#4A8CFF" },
          { label:"회의록",    value:minutes.length,                             icon:"📋", c:"#8B5CF6" },
          { label:"업무 일지", value:logs.length,                                icon:"📝", c:"#FF6B6B" },
          { label:"이달 일정", value:eventsThisMonth.length,                     icon:"📅", c:"#38C9A0" },
          { label:"완료 업무", value:logs.filter(l=>l.status==="완료").length,   icon:"✅", c:"#F59E0B" },
        ].map(s => (
          <div key={s.label} style={{ ...S.card, textAlign:"center", padding:18 }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:24, fontWeight:900, color:s.c }}>{s.value}</div>
            <div style={{ fontSize:11, color:"#94A3B8", fontWeight:600, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...S.card, marginBottom:20 }}>
        <div style={{ fontWeight:800, fontSize:14, marginBottom:14 }}>🎖 회장단</div>
        <div style={{ display:"flex", gap:14 }}>
          {execMembers.map(m => (
            <div key={m.id} style={{ flex:1, padding:14, borderRadius:10, background:(ROLE_COLOR[m.role]||"#94A3B8")+"10", border:`1.5px solid ${ROLE_COLOR[m.role]||"#94A3B8"}30`, textAlign:"center" }}>
              <div style={{ width:40, height:40, borderRadius:12, background:(ROLE_COLOR[m.role]||"#94A3B8")+"25", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:ROLE_COLOR[m.role]||"#94A3B8", margin:"0 auto 8px" }}>{m.name[0]}</div>
              <div style={{ fontWeight:900, fontSize:14 }}>{m.name}</div>
              <div style={{ ...S.tag(ROLE_COLOR[m.role]||"#94A3B8"), marginTop:6, justifyContent:"center" }}>{m.role}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:16, marginBottom:16 }}>
        <div style={S.card}>
          <div style={{ fontWeight:800, marginBottom:14, fontSize:14 }}>부서 현황</div>
          {DEPARTMENTS.filter(d=>d!=="회장단").map(dept => {
            const c = DEPT_COLORS[dept];
            const dm = deptMembers(dept);
            const dl = logs.filter(l => l.dept === dept);
            const pct = dl.length ? (dl.filter(l=>l.status==="완료").length / dl.length) * 100 : 0;
            return (
              <div key={dept} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #F7F9FC" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:c, flexShrink:0 }} />
                <div style={{ fontWeight:700, width:56, fontSize:14 }}>{dept}</div>
                <div style={{ flex:1, height:5, background:"#EDF2F7", borderRadius:3 }}>
                  <div style={{ height:"100%", borderRadius:3, background:c, width:`${pct}%`, transition:"width .3s" }} />
                </div>
                <div style={{ fontSize:11, color:"#94A3B8", width:68, textAlign:"right" }}>{dm.length}명 · {dl.length}건</div>
              </div>
            );
          })}
        </div>
        <div style={S.card}>
          <div style={{ fontWeight:800, marginBottom:14, fontSize:14 }}>다가오는 일정</div>
          {events.filter(e=>(e.startDate||e.date)>=todayStr()).sort((a,b)=>(a.startDate||a.date).localeCompare(b.startDate||b.date)).slice(0,5).map(e => (
            <div key={e.id} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:"1px solid #F7F9FC" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:e.color, flexShrink:0 }} />
              <div style={{ flex:1, fontSize:13, fontWeight:600 }}>{e.title}</div>
              <div style={{ fontSize:11, color:"#94A3B8" }}>{(e.startDate||e.date).slice(5)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <div style={{ fontWeight:800, marginBottom:14, fontSize:14 }}>최근 회의록</div>
        <div style={{ display:"flex", gap:12 }}>
          {minutes.slice(0,3).map(m => (
            <div key={m.id} onClick={() => { setMinuteModal(m); setTab("minutes"); }}
              style={{ flex:1, padding:14, borderRadius:10, background:"#F8FAFC", border:"1px solid #EDF2F7", cursor:"pointer" }}>
              <span style={S.tag(DEPT_COLORS[m.dept]||"#94A3B8")}>{m.dept}</span>
              <div style={{ fontWeight:800, marginTop:8, marginBottom:3, fontSize:14 }}>{m.title}</div>
              <div style={{ fontSize:11, color:"#94A3B8" }}>{m.date}</div>
              <div style={{ fontSize:12, color:"#718096", marginTop:4 }}>{m.summary}</div>
              <div style={{ display:"flex", gap:6, marginTop:8 }}>
                {m.pdfName && <span style={{ ...S.tag("#8B5CF6"), fontSize:10 }}>📄 PDF</span>}
                {m.secretaryName && <span style={{ ...S.tag("#F59E0B"), fontSize:10 }}>📝 서기록</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
