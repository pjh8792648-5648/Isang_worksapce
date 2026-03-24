import { useState } from "react";
import { supabase } from "../supabase"; 
import MemberFormModal from "./MemberFormModal";
import { DEPARTMENTS, DEPT_COLORS, ROLE_COLOR, S } from "../constants/data";

export default function ManageMembersTab({ members, setMembers }) {
  const [memberModal, setMemberModal] = useState(null);
  const [editMember, setEditMember] = useState(null);
  
  const emptyForm = { name:"", dept:"기획부", role:"부원", studentId:"", phone:"", email:"", joinYear:2025 };
  const [form, setForm] = useState(emptyForm);

  async function saveNew() {
    if (!form.name || !form.studentId) return alert("이름과 학번을 입력해주세요.");
    const newId = Date.now();
    const newMember = { ...form, id: newId };
    setMembers(p => [...p, newMember]);
    const { error } = await supabase.from('members').insert([newMember]);
    if (error) alert("저장 중 오류: " + error.message);
    setForm(emptyForm); setMemberModal(null);
  }

  async function saveEdit() {
    setMembers(p => p.map(m => m.id === editMember.id ? editMember : m));
    const { error } = await supabase.from('members').update(editMember).eq('id', editMember.id);
    if (error) alert("수정 중 오류: " + error.message);
    setEditMember(null); setMemberModal(null);
  }

  async function del(id) {
    if(window.confirm("정말 삭제하시겠습니까?")) {
      setMembers(p => p.filter(m => m.id !== id));
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) alert("삭제 중 오류: " + error.message);
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
              {["이름", "소속", "직책", "학번", "관리"].map(h => (
                <th key={h} style={{ padding:10, textAlign:"left", fontSize:11, color:"#94A3B8" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} style={{ borderBottom:"1px solid #F8FAFC" }}>
                <td style={{ padding:11, fontWeight:700 }}>{m.name}</td>
                <td><span style={S.tag(DEPT_COLORS[m.dept])}>{m.dept}</span></td>
                <td><span style={S.tag(ROLE_COLOR[m.role])}>{m.role}</span></td>
                <td style={{ color:"#4A5568" }}>{m.studentId}</td>
                <td>
                  <button style={{...S.btn("ghost"), padding:"4px 8px"}} onClick={()=>{ setEditMember({...m}); setMemberModal("edit"); }}>수정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {memberModal==="add" && <MemberFormModal data={form} setData={setForm} onSave={saveNew} onClose={()=>setMemberModal(null)} />}
      {memberModal==="edit" && editMember && <MemberFormModal data={editMember} setData={setEditMember} onSave={saveEdit} onClose={()=>setMemberModal(null)} onDelete={()=>del(editMember.id)} isEdit />}
    </div>
  );
}
