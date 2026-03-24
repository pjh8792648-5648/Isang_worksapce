import { BRAND, BRAND_LIGHT } from "../constants/data";

export default function Sidebar({ tab, setTab }) {
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
      <div style={{ padding:"14px 20px", borderTop:"1px solid #EDF2F7" }}>
        <div style={{ fontSize:11, color:"#CBD5E0", textAlign:"center" }}>Beta v0.1</div>
      </div>
    </aside>
  );
}
