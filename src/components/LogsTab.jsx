import { useState } from "react";
import { DEPARTMENTS, DEPT_COLORS, STATUS_COLOR, S } from "../constants/data";

export default function LogsTab({ members, logs, setLogs, logModal, setLogModal, logFilter, setLogFilter }) {
  const emptyForm = { date:"", dept:"기획부", memberId:"", member:"", task:"", status:"예정" };
  const [form, setForm] = useState(emptyForm);
  const deptMembers = members.filter(m => m.dept === form.dept);

  function save() {
    if (!form.task || !form.date) return alert("날짜와 업무 내용을 입력해주세요.");
    
    if (form.id) {
      setLogs(p => p.map(l => l.id === form.id ? form : l));
    } else {
      setLogs(p => [{ ...form, id:Date.now() }, ...p]);
    }
    setForm(emptyForm); setLogModal(null);
  }

  function del(id) {
    if(window.confirm("정말 이 업무 일지를 삭제하시겠습니까?")) {
      setLogs(p => p.filter(l => l.id !== id));
    }
  }

  const filtered = logFilter==="전체" ? logs : logs.filter(l=>l.dept===logFilter);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={S.sectionTitle}>📝 업무 일지</div>
        <button style={S.btn()} onClick={()=>{ setForm(emptyForm); setLogModal("add"); }}>+ 업무 추가</button>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        {["전체",...DEPARTMENTS].map(d=>(
          <button key={d} style={{ ...S.btn(logFilter===d?"primary":"secondary"), padding:"5px 13px" }} onClick={()=>setLogFilter(d)}>{d}</button>
        ))}
      </div>
      <div style={S.card}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:"2px solid #EDF2F7" }}>
            {["날짜","부서","담당자","업무 내용","상태","관리"].map(h=>(
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
                <td style={{ padding:"11px 12px", display:"flex", gap:6 }}>
                  <button style={{...S.btn("ghost"), padding:"4px 8px", fontSize:11, border:"1px solid #E2E8F0"}} onClick={()=>{ setForm(l); setLogModal("add"); }}>수정</button>
                  <button style={{...S.btn("danger"), padding:"4px 8px", fontSize:11}} onClick={()=>del(l.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {logModal==="add" && (
        <div style={S.overlay}>
          <div style={S.modal()}>
            <div style={{ fontSize:17, fontWeight:900, marginBottom:20 }}>{form.id ? "업무 수정" : "업무 추가"}</div>
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
