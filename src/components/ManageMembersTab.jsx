import { useState } from "react";
import MemberFormModal from "./MemberFormModal";
import { DEPARTMENTS, DEPT_COLORS, ROLE_COLOR, S } from "../constants/data";

export default function ManageMembersTab({ members, setMembers }) {
  const [memberModal, setMemberModal] = useState(null);
  const [editMember, setEditMember] = useState(null);
  
  const emptyForm = { name:"", dept:"기획부", role:"부원", studentId:"", phone:"", email:"", joinYear:2025 };
  const [form, setForm] = useState(emptyForm);

  function saveNew() {
    if (!form.name || !form.studentId) return alert("이름과 학번을 입력해주세요.");
    setMembers(p => [...p, { ...form, id: Date.now() }]);
    setForm(emptyForm); setMemberModal(null);
  }

  function saveEdit() {
    setMembers(p => p.map(m => m.id === editMember.id ? editMember : m));
    setEditMember(null); setMemberModal(null);
  }

  function del(id) {
    if(window.confirm("정말 이 부원을 삭제하시겠습니까?")) {
      setMembers(p => p.filter(m => m.id !== id));
      setEditMember(null); setMemberModal(null);
    }
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={S.sectionTitle}>⚙️ 부원 관리 (설정)</div>
        <button style={S.btn()} onClick={() => setMemberModal("add")}>+ 새 부원 등록</button>
      </div>

      <div style={S.card}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #EDF2F7" }}>
              {["이름", "소속", "직책", "학번", "연락처", "관리"].map(h => (
                <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontSize:11, color:"#94A3B8", fontWeight:700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(m => {
              const deptColor = DEPT_COLORS[m.dept] || "#94A3B8";
              return (
                <tr key={m.id} style={{ borderBottom:"1px solid #F8FAFC" }}>
                  <td style={{ padding:"11px 12px", fontWeight:700, fontSize:13 }}>{m.name}</td>
                  <td style={{ padding:"11px 12px" }}><span style={S.tag(deptColor)}>{m.dept}</span></td>
                  <td style={{ padding:"11px 12px" }}><span style={S.tag(ROLE_COLOR[m.role] || "#94A3B8")}>{m.role}</span></td>
                  <td style={{ padding:"11px 12px", fontSize:13, color:"#4A5568" }}>{m.studentId}</td>
                  <td style={{ padding:"11px 12px", fontSize:13, color:"#4A5568" }}>{m.phone}</td>
                  <td style={{ padding:"11px 12px", display:"flex", gap:6 }}>
                    <button style={{...S.btn("ghost"), padding:"4px 8px", fontSize:11, border:"1px solid #E2E8F0"}} onClick={()=>{ setEditMember({...m}); setMemberModal("edit"); }}>수정</button>
                    <button style={{...S.btn("danger"), padding:"4px 8px", fontSize:11}} onClick={()=>del(m.id)}>삭제</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 등록 & 수정 모달 */}
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
