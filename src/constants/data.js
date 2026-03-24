export const BRAND = "#4A8CFF";
export const BRAND_LIGHT = "#EEF4FF";

// 👇 "집행부"를 "회장단"으로 변경하고 색상 할당
export const DEPT_COLORS = { 
  "회장단": "#4A8CFF", // 회장단 전용 색상
  "기획부": "#8B5CF6", 
  "홍보부": "#FF6B6B", 
  "복지부": "#38C9A0", 
  "학습부": "#F59E0B" 
};
export const DEPARTMENTS = Object.keys(DEPT_COLORS);
export const STATUS_COLOR = { "완료": "#38C9A0", "진행중": "#F59E0B", "예정": "#94A3B8" };

// 👇 역할도 회장단과 부서원으로 깔끔하게 분리
export const ALL_ROLES = ["회장", "부회장", "총무", "부장", "부원"];

export const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

export function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
export function firstDay(y, m) { return new Date(y, m, 1).getDay(); }
export const pad = n => String(n).padStart(2, "0");
export const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
export const todayObj = () => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() }; };

// 👇 초기 데이터 부서 및 역할 업데이트
export const seedMembers = [
  { id:1, name:"김지수", dept:"회장단", role:"회장",  studentId:"20210001", phone:"010-1234-5678", email:"jisu@hongik.ac.kr",    joinYear:2025 },
  { id:2, name:"이민준", dept:"회장단", role:"부회장", studentId:"20210045", phone:"010-2345-6789", email:"minjun@hongik.ac.kr",  joinYear:2025 },
  { id:3, name:"박소연", dept:"회장단", role:"총무",   studentId:"20220012", phone:"010-3456-7890", email:"soyeon@hongik.ac.kr",  joinYear:2025 },
  { id:4, name:"최현우", dept:"기획부", role:"부장",   studentId:"20220067", phone:"010-4567-8901", email:"hyunwoo@hongik.ac.kr", joinYear:2025 },
  { id:5, name:"정다은", dept:"기획부", role:"부원",   studentId:"20230023", phone:"010-5678-9012", email:"daeun@hongik.ac.kr",   joinYear:2025 },
  { id:6, name:"한승민", dept:"홍보부", role:"부장",   studentId:"20230089", phone:"010-6789-0123", email:"seungmin@hongik.ac.kr",joinYear:2025 },
  { id:7, name:"오지현", dept:"홍보부", role:"부원",   studentId:"20240011", phone:"010-7890-1234", email:"jihyun@hongik.ac.kr",  joinYear:2025 },
  { id:8, name:"윤서준", dept:"복지부", role:"부장",   studentId:"20240056", phone:"010-8901-2345", email:"seojun@hongik.ac.kr",  joinYear:2025 },
  { id:9, name:"강나연", dept:"복지부", role:"부원",   studentId:"20240078", phone:"010-9012-3456", email:"nayeon@hongik.ac.kr",  joinYear:2025 },
  { id:10,name:"임도현", dept:"학습부", role:"부장",   studentId:"20230045", phone:"010-0123-4567", email:"dohyun@hongik.ac.kr",  joinYear:2025 },
  { id:11,name:"송유진", dept:"학습부", role:"부원",   studentId:"20240091", phone:"010-1234-5670", email:"yujin@hongik.ac.kr",   joinYear:2025 },
];

export const seedMinutes = [
  { id:1, title:"1차 정기회의", date:"2025-03-05", dept:"회장단", author:"김지수", summary:"OT 행사 기획안 논의 및 역할 분배", pdfName:"1차정기회의록.pdf", pdfData:null, secretaryName:"OT_서기록.pdf", secretaryData:null },
  { id:2, title:"SNS 운영 회의", date:"2025-03-12", dept:"홍보부", author:"한승민", summary:"인스타그램 콘텐츠 방향 결정", pdfName:null, pdfData:null, secretaryName:null, secretaryData:null },
];

export const seedEvents = [
  { id:1, title:"신입생 OT",      startDate:"2025-03-15", endDate:"2025-03-16", dept:"기획부", memberId:null, memberName:"전체",  color:"#8B5CF6", type:"전체" },
  { id:2, title:"인스타 업로드",   startDate:"2025-03-17", endDate:"2025-03-17", dept:"홍보부", memberId:7,   memberName:"오지현", color:"#FF6B6B", type:"개인" },
  { id:3, title:"스터디 모집 마감",startDate:"2025-03-20", endDate:"2025-03-20", dept:"학습부", memberId:10,  memberName:"임도현", color:"#F59E0B", type:"개인" },
  { id:4, title:"중간고사",       startDate:"2025-04-20", endDate:"2025-04-26", dept:"회장단", memberId:null, memberName:"전체",  color:"#4A8CFF", type:"전체" },
];

export const seedLogs = [
  { id:1, date:"2025-03-06", dept:"기획부", memberId:4,  member:"최현우", task:"OT 기획안 초안 작성",    status:"완료"  },
  { id:2, date:"2025-03-06", dept:"홍보부", memberId:6,  member:"한승민", task:"학과 SNS 계정 인수인계", status:"완료"  },
  { id:3, date:"2025-03-10", dept:"복지부", memberId:8,  member:"윤서준", task:"간식 업체 리스트업",      status:"진행중"},
];

export const ROLE_COLOR = {
  "회장":"#4A8CFF", "부회장":"#8B5CF6", "총무":"#EC4899",
  "부장":"#F59E0B", "부원":"#94A3B8",
};

export const S = {
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
