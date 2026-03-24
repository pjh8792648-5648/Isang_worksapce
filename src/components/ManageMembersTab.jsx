import { useState } from "react";
import { supabase } from "../supabase"; // 👈 수파베이스 연동
import MemberFormModal from "./MemberFormModal";
import { DEPARTMENTS, DEPT_COLORS, ROLE_COLOR, S } from "../constants/data";

export default function ManageMembersTab({ members, setMembers }) {
  const [memberModal, setMemberModal] = useState(null);
  const [editMember, setEditMember] = useState(null);
  
  const emptyForm = { name:"", dept:"기획부", role:"부원", studentId:"", phone:"", email:"", joinYear:2025 };
  const [form, setForm] = useState(emptyForm);

  // ⭐ 수파베이스 서버에 새 부원 저장하기
  async function saveNew() {
    if (!form.name || !form.studentId) return alert("이름과 학번을 입력해주세요.");
    const newId = Date.now();
    const newMember = { ...form, id: newId };
    
    // 1. 화면에 먼저 바로 추가 (답답하지 않게)
    setMembers(p => [...p, newMember]);
    
    // 2. 수파베이스 서버에 진짜 저장!
    const { error } = await supabase.from('members').insert([newMember]);
    if (error) alert("저장 중 오류가 발생했습니다: " + error.message);

    setForm(emptyForm); setMemberModal(null);
  }

  // ⭐ 수파베이스 서버 데이터 수정하기
  async function saveEdit() {
    setMembers(p => p.map(m => m.id === editMember.id ? editMember : m));
    
    const { error } = await supabase.from('members').update(editMember).eq('id', editMember.id);
    if (error) alert("수정 중 오류: " + error.message);

    setEditMember(null); setMemberModal(null);
  }

  // ⭐ 수파베이스 서버 데이터 삭제하기
  async function del(id) {
    if(window.confirm("정말 이 부원을 삭제하시겠습니까?")) {
      setMembers(p => p.filter(m => m.id !== id));
      
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) alert("삭제 중 오류: " + error.message);

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
