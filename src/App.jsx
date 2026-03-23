import { useState, useRef } from "react";

const BRAND = "#4A8CFF";
const BRAND_LIGHT = "#EEF4FF";
const DEPT_COLORS = { "기획부": "#4A8CFF", "홍보부": "#FF6B6B", "복지부": "#38C9A0", "학습부": "#F59E0B" };
const DEPARTMENTS = Object.keys(DEPT_COLORS);
const STATUS_COLOR = { "완료": "#38C9A0", "진행중": "#F59E0B", "예정": "#94A3B8" };

// 직급 체계: 집행부 (회장/부회장/총무) + 부서 (부장/부원)
const EXEC_ROLES = ["회장", "부회장", "총무"];
const DEPT_ROLES = ["부장", "부원"];
const ALL_ROLES = [...EXEC_ROLES, ...DEPT_ROLES];

const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y, m) { return new Date(y, m, 1).getDay(); }
const pad = n => String(n).padStart(2, "0");
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
const todayObj = () => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() }; };

// 집행부(회장/부회장/총무)는 dept를 "집행부"로 표시
const seedMembers = [
  { id:1, name:"김지수", dept:"집행부", role:"회장",  studentId:"20210001", phone:"010-1234-5678", email:"jisu@hongik.ac.kr",    joinYear:2025 },
  { id:2, name:"이민준", dept:"집행부", role:"부회장", studentId:"20210045", phone:"010-2345-6789", email:"minjun@hongik.ac.kr",  joinYear:2025 },
  { id:3, name:"박소연", dept:"집행부", role:"총무",   studentId:"20220012", phone:"010-3456-7890", email:"soyeon@hongik.ac.kr",  joinYear:2025 },
  { id:4, name:"최현우", dept:"기획부", role:"부장",   studentId:"20220067", phone:"010-4567-8901", email:"hyunwoo@hongik.ac.kr", joinYear:2025 },
  { id:5, name:"정다은", dept:"기획부", role:"부원",   studentId:"20230023", phone:"010-5678-9012", email:"daeun@hongik.ac.kr",   joinYear:2025 },
  { id:6, name:"한승민", dept:"홍보부", role:"부장",   studentId:"20230089", phone:"010-6789-0123", email:"seungmin@hongik.ac.kr",joinYear:2025 },
  { id:7, name:"오지현", dept:"홍보부", role:"부원",   studentId:"20240011", phone:"010-7890-1234", email:"jihyun@hongik.ac.kr",  joinYear:2025 },
  { id:8, name:"윤서준", dept:"복지부", role:"부장",   studentId:"20240056", phone:"010-8901-2345", email:"seojun@hongik.ac.kr",  joinYear:2025 },
  { id:9, name:"강나연", dept:"복지부", role:"부원",   studentId:"20240078", phone:"010-9012-3456", email:"nayeon@hongik.ac.kr",  joinYear:2025 },
  { id:10,name:"임도현", dept:"학습부", role:"부장",   studentId:"20230045", phone:"010-0123-4567", email:"dohyun@hongik.ac.kr",  joinYear:2025 },
  { id:11,name:"송유진", dept:"학습부", role:"부원",   studentId:"20240091", phone:"010-1234-5670", email:"yujin@hongik.ac.kr",   joinYear:2025 },
];
const seedMinutes = [
  { id:1, title:"1차 정기회의", date:"2025-03-05", dept:"기획부", author:"최현우", summary:"OT 행사 기획안 논의 및 역할 분배", pdfName:"1차정기회의록.pdf", pdfData:null, secretaryName:"OT_서기록.pdf", secretaryData:null },
  { id:2, title:"SNS 운영 회의", date:"2025-03-12", dept:"홍보부", author:"한승민", summary:"인스타그램 콘텐츠 방향 결정", pdfName:null, pdfData:null, secretaryName:null, secretaryData:null },
  { id:3, title:"복지 예산 회의", date:"2025-03-20", dept:"복지부", author:"윤서준", summary:"1학기 복지 예산 배정 및 간식 행사 계획", pdfName:null, pdfData:null, secretaryName:null, secretaryData:null },
];
const seedEvents = [
  { id:1, title:"신입생 OT",      date:"2025-03-15", dept:"기획부", memberId:null, memberName:"전체",  color:"#4A8CFF", type:"전체" },
  { id:2, title:"인스타 업로드",   date:"2025-03-17", dept:"홍보부", memberId:7,   memberName:"오지현", color:"#FF6B6B", type:"개인" },
  { id:3, title:"스터디 모집 마감",date:"2025-03-20", dept:"학습부", memberId:10,  memberName:"임도현", color:"#F59E0B", type:"개인" },
  { id:4, title:"간식 행사",       date:"2025-03-25", dept:"복지부", memberId:8,   memberName:"윤서준", color:"#38C9A0", type:"개인" },
  { id:5, title:"4월 정기회의",    date:"2025-04-02", dept:"기획부", memberId:null, memberName:"전체",  color:"#4A8CFF", type:"전체" },
  { id:6, title:"기획부 전체회의", date:"2025-03-28", dept:"기획부", memberId:null, memberName:"기획부",color:"#4A8CFF", type:"부서" },
];
const seedLogs = [
  { id:1, date:"2025-03-06", dept:"기획부", memberId:4,  member:"최현우", task:"OT 기획안 초안 작성",    status:"완료"  },
  { id:2, date:"2025-03-06", dept:"홍보부", memberId:6,  member:"한승민", task:"학과 SNS 계정 인수인계", status:"완료"  },
  { id:3, date:"2025-03-10", dept:"복지부", memberId:8,  member:"윤서준", task:"간식 업체 리스트업",      status:"진행중"},
  { id:4, date:"2025-03-12", dept:"학습부", memberId:10, member:"임도현", task:"스터디 모집 공고문 작성", status:"진행중"},
  { id:5, date:"2025-03-18", dept:"기획부", memberId:5,  member:"정다은", task:"OT 진행 대본 완성",       status:"예정"  },
  { id:6, date:"2025-03-22", dept:"홍보부", memberId:7,  member:"오지현", task:"3월 카드뉴스 제작",       status:"진행중"},
];

/* ─── 스타일 ─── */
const S = {
  input: { width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid #E2E8F0", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"'Noto Sans KR', sans-serif", background:"#FAFBFC" },
  label: { fontSize:11, fontWeight:700, color:"#94A3B8", marginBottom:5, display:"block", letterSpacing:".5px", textTransform:"uppercase" },
  card: { background:"#fff", borderRadius:14, padding:22, boxShadow:"0 1px 6px rgba(0,0,0,.05)", border:"1px solid #EDF2F7" },
  btn: (v="primary") => ({ padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:700, fontSize:13,
    background: v==="primary"?BRAND: v==="danger"?"#FEE2E2": v==="ghost"?"transparent":"#EDF2F7",
    color:       v==="primary"?"#fff": v==="danger"?"#E53E3E": v==="ghost"?BRAND:"#4A5568" }),
  tag: (c) => ({ display:"inline-flex", alignItems:"center", padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:700, background:c+"22", color:c }),
  overlay: { position:"fixed", inset:0, background:"rgba(15,23,42,.45)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(2px)" },
  modal: (w=520) => ({ background:"#fff", borderRadius:18, padding:30, width:"100%", maxWidth:w, maxHeight:"88vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.18)" }),
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
  sectionTitle: { fontSize:20, fontWeight:900, marginBottom:18 },
};

const ROLE_COLOR = {
  "회장":"#4A8CFF", "부회장":"#8B5CF6", "총무":"#EC4899",
  "부장":"#F59E0B", "부원":"#94A3B8",
};

/* ═══════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════ */
function Sidebar({ tab, setTab }) {
  const TABS = [
    { id:"home",     label:"홈",       icon:"🏠" },
    { id:"members",  label:"부원 관리", icon:"👥" },
    { id:"minutes",  label:"회의록",    icon:"📋" },
    { id:"logs",     label:"업무 일지", icon:"📝" },
    { id:"calendar", label:"캘린더",    icon:"📅" },
  ];
  return (
    <aside style={{
      width:220, minHeight:"100vh", background:"#fff",
      borderRight:"1px solid #E2E8F0", display:"flex", flexDirection:"column",
      position:"fixed", top:0, left:0, zIndex:50,
      boxShadow:"1px 0 8px rgba(74,140,255,.06)",
    }}>
      {/* Logo */}
      <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid #EDF2F7" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:BRAND, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:16, flexShrink:0 }}>이</div>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:"#1A202C", lineHeight:1.2 }}>이상</div>
            <div style={{ fontSize:10, color:"#94A3B8", marginTop:1 }}>제39대 학생회</div>
          </div>
        </div>
        <div style={{ fontSize:10, color:"#CBD5E0", fontWeight:600, letterSpacing:1 }}>홍익대 수학교육과 · 2025</div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"14px 12px" }}>
        <div style={{ fontSize:10, color:"#CBD5E0", fontWeight:700, letterSpacing:1.2, padding:"0 8px", marginBottom:8, textTransform:"uppercase" }}>메뉴</div>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10, border:"none", cursor:"pointer",
              background: active ? BRAND_LIGHT : "transparent",
              color: active ? BRAND : "#4A5568",
              fontWeight: active ? 800 : 500,
              fontSize:14, marginBottom:2,
              transition:"all .13s",
              fontFamily:"'Noto Sans KR', sans-serif",
            }}>
              <span style={{ fontSize:16 }}>{t.icon}</span>
              <span>{t.label}</span>
              {active && <div style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:BRAND }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding:"14px 20px", borderTop:"1px solid #EDF2F7" }}>
        <div style={{ fontSize:11, color:"#CBD5E0", textAlign:"center" }}>Beta v0.1</div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════
   HOME TAB
═══════════════════════════════════════════════════ */
function HomeTab({ members, minutes, logs, events, calYear, calMonth, setMinuteModal, setTab }) {
  const eventsThisMonth = events.filter(e => {
    const [ey, em] = e.date.split("-").map(Number);
    return ey === calYear && em === calMonth + 1;
  });
  const deptMembers = (dept) => members.filter(m => m.dept === dept);
  const execMembers = members.filter(m => EXEC_ROLES.includes(m.role));

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, color:"#94A3B8", fontWeight:700, letterSpacing:1.5, marginBottom:6 }}>HONGIK UNIV · MATH EDUCATION</div>
        <div style={{ fontSize:26, fontWeight:900 }}>제 39대 학생회 <span style={{ color:BRAND }}>이상</span></div>
        <div style={{ fontSize:13, color:"#94A3B8", marginTop:3 }}>2025년 워크스페이스</div>
      </div>

      {/* 통계 카드 */}
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

      {/* 집행부 */}
      <div style={{ ...S.card, marginBottom:20 }}>
        <div style={{ fontWeight:800, fontSize:14, marginBottom:14 }}>🎖 집행부</div>
        <div style={{ display:"flex", gap:14 }}>
          {execMembers.map(m => (
            <div key={m.id} style={{ flex:1, padding:14, borderRadius:10, background:ROLE_COLOR[m.role]+"10", border:`1.5px solid ${ROLE_COLOR[m.role]}30`, textAlign:"center" }}>
              <div style={{ width:40, height:40, borderRadius:12, background:ROLE_COLOR[m.role]+"25", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:ROLE_COLOR[m.role], margin:"0 auto 8px" }}>{m.name[0]}</div>
              <div style={{ fontWeight:900, fontSize:14 }}>{m.name}</div>
              <div style={{ ...S.tag(ROLE_COLOR[m.role]), marginTop:6, justifyContent:"center" }}>{m.role}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:16, marginBottom:16 }}>
        {/* 부서 현황 */}
        <div style={S.card}>
          <div style={{ fontWeight:800, marginBottom:14, fontSize:14 }}>부서 현황</div>
          {DEPARTMENTS.map(dept => {
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
        {/* 다가오는 일정 */}
        <div style={S.card}>
          <div style={{ fontWeight:800, marginBottom:14, fontSize:14 }}>다가오는 일정</div>
          {events.filter(e=>e.date>=todayStr()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5).map(e => (
            <div key={e.id} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:"1px solid #F7F9FC" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:e.color, flexShrink:0 }} />
              <div style={{ flex:1, fontSize:13, fontWeight:600 }}>{e.title}</div>
              <div style={{ fontSize:11, color:"#94A3B8" }}>{e.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 회의록 */}
      <div style={S.card}>
        <div style={{ fontWeight:800, marginBottom:14, fontSize:14 }}>최근 회의록</div>
        <div style={{ display:"flex", gap:12 }}>
          {minutes.slice(0,3).map(m => (
            <div key={m.id} onClick={() => { setMinuteModal(m); setTab("minutes"); }}
              style={{ flex:1, padding:14, borderRadius:10, background:"#F8FAFC", border:"1px solid #EDF2F7", cursor:"pointer" }}>
              <span style={S.tag(DEPT_COLORS[m.dept])}>{m.dept}</span>
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

/* ═══════════════════════════════════════════════════
   MEMBER FORM MODAL
═══════════════════════════════════════════════════ */
function MemberFormModal({ data, setData, onSave, onClose, onDelete, isEdit }) {
  const isExec = EXEC_ROLES.includes(data.role);
  const availableRoles = data.dept === "집행부" ? EXEC_ROLES : DEPT_ROLES;

  function handleDeptChange(dept) {
    const newRole = dept === "집행부" ? "회장" : "부원";
    setData(p => ({ ...p, dept, role: newRole }));
  }
  function handleRoleChange(role) {
    // 집행부 직책 선택 시 자동으로 dept도 집행부로
    if (EXEC_ROLES.includes(role)) setData(p => ({ ...p, role, dept:"집행부" }));
    else setData(p => ({ ...p, role }));
  }

  const deptOptions = ["집행부", ...DEPARTMENTS];

  return (
    <div style={S.overlay}>
      <div style={S.modal()}>
        <div style={{ fontSize:17, fontWeight:900, marginBottom:20 }}>{isEdit ? "부원 정보 수정" : "새 부원 등록"}</div>
        <div style={S.grid2}>
          <div><label style={S.label}>이름</label><input style={S.input} value={data.name} onChange={e=>setData(p=>({...p,name:e.target.value}))} /></div>
          <div><label style={S.label}>학번</label><input style={S.input} value={data.studentId} onChange={e=>setData(p=>({...p,studentId:e.target.value}))} /></div>
        </div>
        <div style={{ ...S.grid2, marginTop:12 }}>
          <div>
            <label style={S.label}>소속</label>
            <select style={S.input} value={data.dept} onChange={e=>handleDeptChange(e.target.value)}>
              {deptOptions.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>직책</label>
            <select style={S.input} value={data.role} onChange={e=>handleRoleChange(e.target.value)}>
              {availableRoles.map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop:12 }}><label style={S.label}>전화번호</label><input style={S.input} value={data.phone} onChange={e=>setData(p=>({...p,phone:e.target.value}))} placeholder="010-0000-0000" /></div>
        <div style={{ marginTop:12 }}><label style={S.label}>이메일</label><input style={S.input} value={data.email} onChange={e=>setData(p=>({...p,email:e.target.value}))} placeholder="example@hongik.ac.kr" /></div>
        <div style={{ marginTop:12, marginBottom:22 }}><label style={S.label}>가입 연도</label>
          <input style={S.input} type="number" value={data.joinYear} onChange={e=>setData(p=>({...p,joinYear:Number(e.target.value)}))} />
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button style={S.btn("secondary")} onClick={onClose}>취소</button>
          {isEdit && <button style={S.btn("danger")} onClick={onDelete}>삭제</button>}
          <button style={S.btn()} onClick={onSave}>저장</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MEMBERS TAB
═══════════════════════════════════════════════════ */
function MembersTab({ members, setMembers, logs, memberModal, setMemberModal }) {
  const [groupFilter, setGroupFilter] = useState("전체");
  const [editMember, setEditMember] = useState(null);
  const emptyForm = { name:"", dept:"기획부", role:"부원", studentId:"", phone:"", email:"", joinYear:2025 };
  const [form, setForm] = useState(emptyForm);

  const filterOptions = ["전체", "집행부", ...DEPARTMENTS];
  const filtered = groupFilter === "전체" ? members : members.filter(m => m.dept === groupFilter);

  // 표시 순서: 집행부 먼저, 그 다음 부서별
  const sorted = [...filtered].sort((a, b) => {
    const order = ["집행부", ...DEPARTMENTS];
    return order.indexOf(a.dept) - order.indexOf(b.dept);
  });

  function saveNew() {
    if (!form.name || !form.studentId) return;
    setMembers(p => [...p, { ...form, id: Date.now() }]);
    setForm(emptyForm); setMemberModal(null);
  }
  function saveEdit() {
    setMembers(p => p.map(m => m.id === editMember.id ? editMember : m));
    setEditMember(null); setMemberModal(null);
  }
  function del(id) {
    setMembers(p => p.filter(m => m.id !== id));
    setEditMember(null); setMemberModal(null);
  }

  // 그룹별 렌더
  const groups = groupFilter === "전체"
    ? [{ label:"🎖 집행부", key:"집행부", color:"#4A8CFF" }, ...DEPARTMENTS.map(d=>({ label:`${d}`, key:d, color:DEPT_COLORS[d] }))]
    : groupFilter === "집행부"
      ? [{ label:"🎖 집행부", key:"집행부", color:"#4A8CFF" }]
      : [{ label:groupFilter, key:groupFilter, color:DEPT_COLORS[groupFilter] }];

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={S.sectionTitle}>👥 부원 관리</div>
        <button style={S.btn()} onClick={()=>setMemberModal("add")}>+ 부원 등록</button>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {filterOptions.map(d=>(
          <button key={d} style={{ ...S.btn(groupFilter===d?"primary":"secondary"), padding:"5px 13px" }} onClick={()=>setGroupFilter(d)}>{d}</button>
        ))}
      </div>

      {groups.map(g => {
        const gMembers = members.filter(m => m.dept === g.key);
        if (gMembers.length === 0) return null;
        return (
          <div key={g.key} style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:g.color }} />
              <div style={{ fontWeight:800, fontSize:15, color:"#2D3748" }}>{g.label}</div>
              <div style={{ fontSize:12, color:"#94A3B8" }}>{gMembers.length}명</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {gMembers.map(m => {
                const c = ROLE_COLOR[m.role] || "#94A3B8";
                const deptColor = m.dept === "집행부" ? "#4A8CFF" : (DEPT_COLORS[m.dept] || "#94A3B8");
                const mLogs = logs.filter(l=>l.memberId===m.id);
                return (
                  <div key={m.id} style={{ ...S.card, cursor:"pointer", padding:18 }}
                    onClick={()=>{ setEditMember({...m}); setMemberModal("edit"); }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <div style={{ width:42, height:42, borderRadius:12, background:c+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:c }}>{m.name[0]}</div>
                      <div>
                        <div style={{ fontWeight:900, fontSize:15 }}>{m.name}</div>
                        <div style={{ fontSize:11, color:"#94A3B8" }}>{m.studentId}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
                      {m.dept !== "집행부" && <span style={S.tag(deptColor)}>{m.dept}</span>}
                      <span style={S.tag(c)}>{m.role}</span>
                    </div>
                    <div style={{ fontSize:12, color:"#718096" }}>{m.phone}</div>
                    <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{m.email}</div>
                    {m.dept !== "집행부" && (
                      <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid #F0F5FF", display:"flex", justifyContent:"space-between" }}>
                        <span style={{ fontSize:11, color:"#94A3B8" }}>업무 {mLogs.length}건</span>
                        <span style={{ fontSize:11, color:"#38C9A0", fontWeight:700 }}>완료 {mLogs.filter(l=>l.status==="완료").length}건</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {memberModal==="add" && (
        <MemberFormModal data={form} setData={setForm} onSave={saveNew} onClose={()=>setMemberModal(null)} />
      )}
      {memberModal==="edit" && editMember && (
        <MemberFormModal data={editMember} setData={setEditMember} onSave={saveEdit}
          onClose={()=>{ setMemberModal(null); setEditMember(null); }} onDelete={()=>del(editMember.id)} isEdit />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MINUTES TAB
═══════════════════════════════════════════════════ */
function MinutesTab({ minutes, setMinutes, minuteModal, setMinuteModal, minuteFilter, setMinuteFilter }) {
  const pdfRef = useRef(); const secRef = useRef();
  const emptyForm = { title:"", date:"", dept:"기획부", author:"", summary:"", pdfName:null, pdfData:null, secretaryName:null, secretaryData:null };
  const [form, setForm] = useState(emptyForm);

  function handleFile(e, type) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (type==="pdf") setForm(p=>({...p, pdfName:file.name, pdfData:ev.target.result}));
      else setForm(p=>({...p, secretaryName:file.name, secretaryData:ev.target.result}));
    };
    reader.readAsDataURL(file);
  }
  function save() {
    if (!form.title || !form.date) return;
    setMinutes(p => [{ ...form, id:Date.now() }, ...p]);
    setForm(emptyForm); setMinuteModal(null);
  }
  const filtered = minuteFilter==="전체" ? minutes : minutes.filter(m=>m.dept===minuteFilter);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={S.sectionTitle}>📋 회의록</div>
        <button style={S.btn()} onClick={()=>setMinuteModal("add")}>+ 새 회의록</button>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        {["전체",...DEPARTMENTS].map(d=>(
          <button key={d} style={{ ...S.btn(minuteFilter===d?"primary":"secondary"), padding:"5px 13px" }} onClick={()=>setMinuteFilter(d)}>{d}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(m => (
          <div key={m.id} style={{ ...S.card, cursor:"pointer" }} onClick={()=>setMinuteModal(m)}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:DEPT_COLORS[m.dept]+"15", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>📋</div>
                <div>
                  <div style={{ fontWeight:900, fontSize:15 }}>{m.title}</div>
                  <div style={{ fontSize:12, color:"#94A3B8", marginTop:2 }}>{m.date} · {m.author} · <span style={{ color:DEPT_COLORS[m.dept], fontWeight:700 }}>{m.dept}</span></div>
                  <div style={{ fontSize:12, color:"#718096", marginTop:3 }}>{m.summary}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                {m.pdfName && <span style={{ ...S.tag("#8B5CF6"), fontSize:11 }}>📄 PDF</span>}
                {m.secretaryName && <span style={{ ...S.tag("#F59E0B"), fontSize:11 }}>📝 서기록</span>}
                {!m.pdfName && !m.secretaryName && <span style={{ fontSize:12, color:"#CBD5E0" }}>파일 없음</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {minuteModal && typeof minuteModal === "object" && (
        <div style={S.overlay} onClick={()=>setMinuteModal(null)}>
          <div style={S.modal(600)} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <span style={S.tag(DEPT_COLORS[minuteModal.dept])}>{minuteModal.dept}</span>
              <button style={S.btn("ghost")} onClick={()=>setMinuteModal(null)}>✕</button>
            </div>
            <div style={{ fontSize:20, fontWeight:900, marginBottom:6 }}>{minuteModal.title}</div>
            <div style={{ fontSize:13, color:"#94A3B8", marginBottom:16 }}>{minuteModal.date} · 작성자: {minuteModal.author}</div>
            <div style={{ padding:14, background:BRAND_LIGHT, borderRadius:10, fontSize:13, color:"#4A5568", marginBottom:22 }}>{minuteModal.summary}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div style={{ padding:18, borderRadius:12, border:"2px dashed #CBD5E0", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>📄</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#4A5568", marginBottom:4 }}>회의록 (PDF)</div>
                {minuteModal.pdfName && <div style={{ fontSize:11, color:"#94A3B8", marginBottom:10 }}>{minuteModal.pdfName}</div>}
                {minuteModal.pdfData
                  ? <a href={minuteModal.pdfData} download={minuteModal.pdfName}><button style={S.btn()}>다운로드</button></a>
                  : <div style={{ fontSize:12, color:"#CBD5E0" }}>파일 없음</div>}
              </div>
              <div style={{ padding:18, borderRadius:12, border:"2px dashed #CBD5E0", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>📝</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#4A5568", marginBottom:4 }}>서기록</div>
                {minuteModal.secretaryName && <div style={{ fontSize:11, color:"#94A3B8", marginBottom:10 }}>{minuteModal.secretaryName}</div>}
                {minuteModal.secretaryData
                  ? <a href={minuteModal.secretaryData} download={minuteModal.secretaryName}><button style={S.btn()}>다운로드</button></a>
                  : <div style={{ fontSize:12, color:"#CBD5E0" }}>파일 없음</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {minuteModal==="add" && (
        <div style={S.overlay}>
          <div style={S.modal(560)}>
            <div style={{ fontSize:17, fontWeight:900, marginBottom:20 }}>새 회의록 등록</div>
            <div style={S.grid2}>
              <div><label style={S.label}>제목</label><input style={S.input} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} /></div>
              <div><label style={S.label}>날짜</label><input style={S.input} type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} /></div>
            </div>
            <div style={{ ...S.grid2, marginTop:12 }}>
              <div><label style={S.label}>부서</label><select style={S.input} value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))}>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></div>
              <div><label style={S.label}>작성자</label><input style={S.input} value={form.author} onChange={e=>setForm(p=>({...p,author:e.target.value}))} /></div>
            </div>
            <div style={{ marginTop:12 }}><label style={S.label}>요약</label><input style={S.input} value={form.summary} onChange={e=>setForm(p=>({...p,summary:e.target.value}))} /></div>
            <div style={{ ...S.grid2, marginTop:16 }}>
              <div>
                <label style={S.label}>회의록 PDF 업로드</label>
                <div style={{ padding:16, border:"2px dashed #CBD5E0", borderRadius:10, textAlign:"center", cursor:"pointer", background:"#FAFBFC" }} onClick={()=>pdfRef.current?.click()}>
                  <div style={{ fontSize:24 }}>📄</div>
                  <div style={{ fontSize:12, color:form.pdfName?"#4A5568":"#94A3B8", marginTop:4, fontWeight:form.pdfName?700:400 }}>{form.pdfName || "클릭하여 업로드"}</div>
                  <input ref={pdfRef} type="file" accept=".pdf,.doc,.docx" style={{ display:"none" }} onChange={e=>handleFile(e,"pdf")} />
                </div>
              </div>
              <div>
                <label style={S.label}>서기록 업로드</label>
                <div style={{ padding:16, border:"2px dashed #CBD5E0", borderRadius:10, textAlign:"center", cursor:"pointer", background:"#FAFBFC" }} onClick={()=>secRef.current?.click()}>
                  <div style={{ fontSize:24 }}>📝</div>
                  <div style={{ fontSize:12, color:form.secretaryName?"#4A5568":"#94A3B8", marginTop:4, fontWeight:form.secretaryName?700:400 }}>{form.secretaryName || "클릭하여 업로드"}</div>
                  <input ref={secRef} type="file" accept=".pdf,.doc,.docx,.hwp" style={{ display:"none" }} onChange={e=>handleFile(e,"sec")} />
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:22 }}>
              <button style={S.btn("secondary")} onClick={()=>setMinuteModal(null)}>취소</button>
              <button style={S.btn()} onClick={save}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LOGS TAB
═══════════════════════════════════════════════════ */
function LogsTab({ members, logs, setLogs, logModal, setLogModal, logFilter, setLogFilter }) {
  const emptyForm = { date:"", dept:"기획부", memberId:"", member:"", task:"", status:"예정" };
  const [form, setForm] = useState(emptyForm);
  const deptMembers = members.filter(m => m.dept === form.dept);

  function save() {
    if (!form.task || !form.date) return;
    setLogs(p => [{ ...form, id:Date.now() }, ...p]);
    setForm(emptyForm); setLogModal(null);
  }
  const filtered = logFilter==="전체" ? logs : logs.filter(l=>l.dept===logFilter);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={S.sectionTitle}>📝 업무 일지</div>
        <button style={S.btn()} onClick={()=>setLogModal("add")}>+ 업무 추가</button>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        {["전체",...DEPARTMENTS].map(d=>(
          <button key={d} style={{ ...S.btn(logFilter===d?"primary":"secondary"), padding:"5px 13px" }} onClick={()=>setLogFilter(d)}>{d}</button>
        ))}
      </div>
      <div style={S.card}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:"2px solid #EDF2F7" }}>
            {["날짜","부서","담당자","업무 내용","상태"].map(h=>(
              <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontSize:11, color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:".5px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(l=>(
              <tr key={l.id} style={{ borderBottom:"1px solid #F8FAFC" }}>
                <td style={{ padding:"11px 12px", fontSize:13, color:"#94A3B8" }}>{l.date}</td>
                <td style={{ padding:"11px 12px" }}><span style={S.tag(DEPT_COLORS[l.dept])}>{l.dept}</span></td>
                <td style={{ padding:"11px 12px", fontWeight:700, fontSize:13 }}>{l.member}</td>
                <td style={{ padding:"11px 12px", fontSize:13 }}>{l.task}</td>
                <td style={{ padding:"11px 12px" }}><span style={S.tag(STATUS_COLOR[l.status])}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {logModal==="add" && (
        <div style={S.overlay}>
          <div style={S.modal()}>
            <div style={{ fontSize:17, fontWeight:900, marginBottom:20 }}>업무 추가</div>
            <div style={{ ...S.grid2, marginBottom:12 }}>
              <div><label style={S.label}>날짜</label><input style={S.input} type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} /></div>
              <div><label style={S.label}>부서</label>
                <select style={S.input} value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value,memberId:"",member:""}))}>
                  {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:12 }}><label style={S.label}>담당자</label>
              <select style={S.input} value={form.memberId} onChange={e=>{ const m=members.find(m=>m.id===Number(e.target.value)); setForm(p=>({...p,memberId:Number(e.target.value),member:m?.name||""})); }}>
                <option value="">선택</option>
                {deptMembers.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:12 }}><label style={S.label}>업무 내용</label><input style={S.input} value={form.task} onChange={e=>setForm(p=>({...p,task:e.target.value}))} /></div>
            <div style={{ marginBottom:22 }}><label style={S.label}>상태</label>
              <select style={S.input} value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                {["예정","진행중","완료"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button style={S.btn("secondary")} onClick={()=>setLogModal(null)}>취소</button>
              <button style={S.btn()} onClick={save}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CALENDAR TAB
═══════════════════════════════════════════════════ */
function CalendarTab({ members, logs, events, setEvents, calYear, setCalYear, calMonth, setCalMonth, calMode, setCalMode, calDept, setCalDept, calMemberId, setCalMemberId, selectedDay, setSelectedDay, eventModal, setEventModal }) {
  const td = todayObj();
  const days = daysInMonth(calYear, calMonth);
  const startDay = firstDay(calYear, calMonth);
  const emptyEForm = { title:"", date:"", dept:"기획부", memberId:null, memberName:"전체", type:"전체" };
  const [eForm, setEForm] = useState(emptyEForm);
  const eDeptMembers = members.filter(m => m.dept === eForm.dept);
  const calMember = calMemberId ? members.find(m => m.id === calMemberId) : null;
  const membersOfDept = (dept) => members.filter(m => m.dept === dept);

  function getCalendarEvents() {
    if (calMode==="전체") return events;
    if (calMode==="부서") return events.filter(e => e.dept === calDept);
    if (calMode==="개인") return calMemberId ? events.filter(e => e.memberId === calMemberId) : [];
    return events;
  }
  function getEventsForDay(d) {
    const ds = `${calYear}-${pad(calMonth+1)}-${pad(d)}`;
    return getCalendarEvents().filter(e => e.date === ds);
  }
  const dayEvts = selectedDay ? getEventsForDay(selectedDay) : [];

  function saveEvent() {
    if (!eForm.title || !eForm.date) return;
    setEvents(p=>[...p,{ ...eForm, id:Date.now(), color:DEPT_COLORS[eForm.dept] }]);
    setEForm(emptyEForm); setEventModal(null);
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={S.sectionTitle}>📅 캘린더</div>
        <button style={S.btn()} onClick={()=>setEventModal("add")}>+ 일정 추가</button>
      </div>

      {/* 모드 컨트롤 */}
      <div style={{ ...S.card, padding:16, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <div style={{ display:"flex", gap:6 }}>
            {["전체","부서","개인"].map(m=>(
              <button key={m} style={{ ...S.btn(calMode===m?"primary":"secondary"), padding:"6px 14px" }}
                onClick={()=>{ setCalMode(m); setSelectedDay(null); }}>{m} 캘린더</button>
            ))}
          </div>
          {calMode==="부서" && (
            <div style={{ display:"flex", gap:6 }}>
              {DEPARTMENTS.map(d=>(
                <button key={d} style={{ padding:"5px 12px", borderRadius:7, border:`1.5px solid ${DEPT_COLORS[d]}`, background:calDept===d?DEPT_COLORS[d]:DEPT_COLORS[d]+"15", color:calDept===d?"#fff":DEPT_COLORS[d], fontWeight:700, cursor:"pointer", fontSize:12 }}
                  onClick={()=>{ setCalDept(d); setSelectedDay(null); }}>{d}</button>
              ))}
            </div>
          )}
          {calMode==="개인" && (
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <select style={{ ...S.input, width:"auto", padding:"6px 10px" }} value={calDept}
                onChange={e=>{ setCalDept(e.target.value); setCalMemberId(null); }}>
                {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
              </select>
              <select style={{ ...S.input, width:"auto", padding:"6px 10px" }} value={calMemberId||""}
                onChange={e=>setCalMemberId(Number(e.target.value)||null)}>
                <option value="">부원 선택</option>
                {membersOfDept(calDept).map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
              </select>
            </div>
          )}
        </div>
        {calMode==="개인" && calMember && (
          <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:12, padding:"10px 14px", background:DEPT_COLORS[calMember.dept]+"10", borderRadius:10, border:`1px solid ${DEPT_COLORS[calMember.dept]}30` }}>
            <div style={{ width:34, height:34, borderRadius:9, background:ROLE_COLOR[calMember.role]+"25", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, color:ROLE_COLOR[calMember.role] }}>{calMember.name[0]}</div>
            <div>
              <div style={{ fontWeight:900, fontSize:14 }}>{calMember.name}</div>
              <div style={{ fontSize:11, color:"#94A3B8" }}>{calMember.dept} · {calMember.role} · {calMember.studentId}</div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", gap:14 }}>
              <div style={{ textAlign:"center" }}><div style={{ fontWeight:900, fontSize:16, color:DEPT_COLORS[calMember.dept] }}>{events.filter(e=>e.memberId===calMember.id).length}</div><div style={{ fontSize:10, color:"#94A3B8" }}>총 일정</div></div>
              <div style={{ textAlign:"center" }}><div style={{ fontWeight:900, fontSize:16, color:"#38C9A0" }}>{logs.filter(l=>l.memberId===calMember.id&&l.status==="완료").length}</div><div style={{ fontSize:10, color:"#94A3B8" }}>완료</div></div>
              <div style={{ textAlign:"center" }}><div style={{ fontWeight:900, fontSize:16, color:"#F59E0B" }}>{logs.filter(l=>l.memberId===calMember.id&&l.status==="진행중").length}</div><div style={{ fontSize:10, color:"#94A3B8" }}>진행중</div></div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16 }}>
        <div style={S.card}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <button style={S.btn("ghost")} onClick={()=>{ if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); setSelectedDay(null); }}>◀</button>
            <div style={{ fontWeight:900, fontSize:18 }}>{calYear}년 {MONTHS[calMonth]}</div>
            <button style={S.btn("ghost")} onClick={()=>{ if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); setSelectedDay(null); }}>▶</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:6 }}>
            {["일","월","화","수","목","금","토"].map((d,i)=>(
              <div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:800, color:i===0?"#FF6B6B":i===6?BRAND:"#94A3B8", padding:"4px 0" }}>{d}</div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {Array(startDay).fill(null).map((_,i)=><div key={"e"+i} />)}
            {Array(days).fill(null).map((_,i)=>{
              const d=i+1; const evts=getEventsForDay(d);
              const isToday=td.y===calYear&&td.m===calMonth&&td.d===d;
              const isSel=selectedDay===d;
              return (
                <div key={d} onClick={()=>setSelectedDay(isSel?null:d)}
                  style={{ minHeight:72, padding:"4px 3px", borderRadius:8, background:isSel?BRAND_LIGHT:isToday?"#EFF6FF":"#F8FAFC", border:isSel?`2px solid ${BRAND}`:isToday?`1.5px solid ${BRAND}70`:"1.5px solid transparent", cursor:"pointer" }}>
                  <div style={{ fontSize:12, fontWeight:isToday?900:500, color:isToday?BRAND:"#2D3748", marginBottom:2, paddingLeft:2 }}>{d}</div>
                  {evts.slice(0,2).map(e=>(
                    <div key={e.id} style={{ fontSize:10, background:e.color, color:"#fff", borderRadius:3, padding:"1px 4px", marginBottom:2, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{e.title}</div>
                  ))}
                  {evts.length>2&&<div style={{ fontSize:9, color:"#94A3B8", paddingLeft:2 }}>+{evts.length-2}</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={S.card}>
            <div style={{ fontWeight:900, fontSize:14, marginBottom:12, color:BRAND }}>
              {selectedDay ? `${calMonth+1}월 ${selectedDay}일 일정` : "날짜를 선택하세요"}
            </div>
            {selectedDay && dayEvts.length===0 && <div style={{ fontSize:12, color:"#94A3B8", padding:"8px 0" }}>일정 없음</div>}
            {dayEvts.map(e=>(
              <div key={e.id} style={{ padding:12, borderRadius:9, background:e.color+"12", border:`1px solid ${e.color}30`, marginBottom:8 }}>
                <div style={{ fontWeight:800, fontSize:14 }}>{e.title}</div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:5 }}>
                  <span style={S.tag(e.color)}>{e.dept}</span>
                  <span style={{ fontSize:11, color:"#94A3B8" }}>{e.memberName}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={{ fontWeight:700, fontSize:12, marginBottom:10, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".5px" }}>부서 색상</div>
            {DEPARTMENTS.map(d=>(
              <div key={d} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:DEPT_COLORS[d] }} />
                <span style={{ fontSize:13 }}>{d}</span>
                <span style={{ marginLeft:"auto", fontSize:11, color:"#94A3B8" }}>{events.filter(e=>e.dept===d).length}건</span>
              </div>
            ))}
          </div>
          {calMode==="부서" && (
            <div style={S.card}>
              <div style={{ fontWeight:700, fontSize:12, marginBottom:12, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".5px" }}>{calDept} 부원 업무</div>
              {membersOfDept(calDept).map(m=>{
                const mLogs = logs.filter(l=>l.memberId===m.id);
                const c = DEPT_COLORS[m.dept];
                return (
                  <div key={m.id} style={{ padding:"10px 0", borderBottom:"1px solid #F0F5FF" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <div style={{ width:26, height:26, borderRadius:7, background:ROLE_COLOR[m.role]+"25", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:ROLE_COLOR[m.role] }}>{m.name[0]}</div>
                      <span style={{ fontWeight:800, fontSize:13 }}>{m.name}</span>
                      <span style={S.tag(ROLE_COLOR[m.role])}>{m.role}</span>
                      <span style={{ marginLeft:"auto", fontSize:11, color:c, fontWeight:700 }}>{mLogs.length}건</span>
                    </div>
                    {mLogs.slice(0,3).map(l=>(
                      <div key={l.id} style={{ display:"flex", alignItems:"center", gap:6, marginLeft:34, marginBottom:4 }}>
                        <div style={{ width:5, height:5, borderRadius:"50%", background:STATUS_COLOR[l.status], flexShrink:0 }} />
                        <span style={{ fontSize:11, color:"#718096", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.task}</span>
                        <span style={{ ...S.tag(STATUS_COLOR[l.status]), fontSize:9, padding:"1px 6px" }}>{l.status}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          {calMode==="개인" && calMember && (
            <div style={S.card}>
              <div style={{ fontWeight:700, fontSize:12, marginBottom:12, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".5px" }}>{calMember.name}의 업무</div>
              {logs.filter(l=>l.memberId===calMember.id).length===0
                ? <div style={{ fontSize:12, color:"#94A3B8" }}>업무 없음</div>
                : logs.filter(l=>l.memberId===calMember.id).map(l=>(
                  <div key={l.id} style={{ padding:"8px 0", borderBottom:"1px solid #F0F5FF" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={S.tag(STATUS_COLOR[l.status])}>{l.status}</span>
                      <span style={{ fontSize:12, flex:1 }}>{l.task}</span>
                    </div>
                    <div style={{ fontSize:11, color:"#94A3B8", marginTop:3 }}>{l.date}</div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {eventModal==="add" && (
        <div style={S.overlay}>
          <div style={S.modal()}>
            <div style={{ fontSize:17, fontWeight:900, marginBottom:20 }}>일정 추가</div>
            <div style={S.grid2}>
              <div><label style={S.label}>제목</label><input style={S.input} value={eForm.title} onChange={e=>setEForm(p=>({...p,title:e.target.value}))} /></div>
              <div><label style={S.label}>날짜</label><input style={S.input} type="date" value={eForm.date} onChange={e=>setEForm(p=>({...p,date:e.target.value}))} /></div>
            </div>
            <div style={{ ...S.grid2, marginTop:12 }}>
              <div><label style={S.label}>부서</label>
                <select style={S.input} value={eForm.dept} onChange={e=>setEForm(p=>({...p,dept:e.target.value,memberId:null,memberName:"전체"}))}>
                  {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div><label style={S.label}>일정 유형</label>
                <select style={S.input} value={eForm.type} onChange={e=>{ const t=e.target.value; setEForm(p=>({...p,type:t,memberId:null,memberName:t==="부서"?p.dept:t==="개인"?"":"전체"})); }}>
                  {["전체","부서","개인"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {eForm.type==="개인" && (
              <div style={{ marginTop:12 }}><label style={S.label}>담당자</label>
                <select style={S.input} value={eForm.memberId||""} onChange={e=>{ const m=members.find(m=>m.id===Number(e.target.value)); setEForm(p=>({...p,memberId:Number(e.target.value)||null,memberName:m?.name||""})); }}>
                  <option value="">선택</option>
                  {eDeptMembers.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
                </select>
              </div>
            )}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:22 }}>
              <button style={S.btn("secondary")} onClick={()=>setEventModal(null)}>취소</button>
              <button style={S.btn()} onClick={saveEvent}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState("home");
  const [members, setMembers] = useState(seedMembers);
  const [minutes, setMinutes] = useState(seedMinutes);
  const [logs, setLogs] = useState(seedLogs);
  const [events, setEvents] = useState(seedEvents);

  const [calYear, setCalYear] = useState(2025);
  const [calMonth, setCalMonth] = useState(2);
  const [calMode, setCalMode] = useState("전체");
  const [calDept, setCalDept] = useState("기획부");
  const [calMemberId, setCalMemberId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const [memberModal, setMemberModal] = useState(null);
  const [minuteModal, setMinuteModal] = useState(null);
  const [logModal, setLogModal] = useState(null);
  const [eventModal, setEventModal] = useState(null);
  const [minuteFilter, setMinuteFilter] = useState("전체");
  const [logFilter, setLogFilter] = useState("전체");

  return (
    <div style={{ fontFamily:"'Noto Sans KR', sans-serif", display:"flex", minHeight:"100vh", background:"#F0F4FA", color:"#1A202C" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* 좌측 사이드바 */}
      <Sidebar tab={tab} setTab={setTab} />

      {/* 메인 콘텐츠 */}
      <main style={{ marginLeft:220, flex:1, padding:"32px 32px 40px", minHeight:"100vh" }}>
        {tab==="home" && (
          <HomeTab members={members} minutes={minutes} logs={logs} events={events}
            calYear={calYear} calMonth={calMonth} setMinuteModal={setMinuteModal} setTab={setTab} />
        )}
        {tab==="members" && (
          <MembersTab members={members} setMembers={setMembers} logs={logs}
            memberModal={memberModal} setMemberModal={setMemberModal} />
        )}
        {tab==="minutes" && (
          <MinutesTab minutes={minutes} setMinutes={setMinutes}
            minuteModal={minuteModal} setMinuteModal={setMinuteModal}
            minuteFilter={minuteFilter} setMinuteFilter={setMinuteFilter} />
        )}
        {tab==="logs" && (
          <LogsTab members={members} logs={logs} setLogs={setLogs}
            logModal={logModal} setLogModal={setLogModal}
            logFilter={logFilter} setLogFilter={setLogFilter} />
        )}
        {tab==="calendar" && (
          <CalendarTab members={members} logs={logs} events={events} setEvents={setEvents}
            calYear={calYear} setCalYear={setCalYear} calMonth={calMonth} setCalMonth={setCalMonth}
            calMode={calMode} setCalMode={setCalMode} calDept={calDept} setCalDept={setCalDept}
            calMemberId={calMemberId} setCalMemberId={setCalMemberId}
            selectedDay={selectedDay} setSelectedDay={setSelectedDay}
            eventModal={eventModal} setEventModal={setEventModal} />
        )}
      </main>
    </div>
  );
}
