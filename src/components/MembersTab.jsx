import { useState } from "react";
import { supabase } from "../supabase"; 
import MemberFormModal from "./MemberFormModal";
import { DEPARTMENTS, DEPT_COLORS, ROLE_COLOR, S } from "../constants/data";

export default function MembersTab({ members, setMembers, logs, memberModal, setMemberModal }) {
  const [groupFilter, setGroupFilter] = useState("전체");
  const [editMember, setEditMember] = useState(null);
  const emptyForm = { name:"", dept:"기획부", role:"부원", studentId:"", phone:"", email:"", joinYear:2025 };
  const [form, setForm] = useState(emptyForm);

  const filterOptions = ["전체", "회장단", ...DEPARTMENTS.filter(d => d !== "회장단")];
  const filtered = groupFilter === "전체" ? members : members.filter(m => m.dept === groupFilter);

  const sorted = [...filtered].sort((a, b) => {
    const order = ["회장단", ...DEPARTMENTS.filter(d => d !== "회장단")];
    return order.indexOf(a.dept) - order.indexOf(b.dept);
  });

  async function saveNew() {
    if (!form.name || !form.studentId) return;
    const newId = Date.now();
    const newMember = { ...form, id: newId };
    
    setMembers(p => [...p, newMember]);
    await supabase.from('members').insert([newMember]);
    setForm(emptyForm); setMemberModal(null);
  }

  async function saveEdit() {
    setMembers(p => p.map(m => m.id === editMember.id ? editMember : m));
    await supabase.from('members').update(editMember).eq('id', editMember.id);
    setEditMember(null); setMemberModal(null);
  }

  async function del(id) {
    if(window.confirm("정말 이 부원을 삭제하시겠습니까?")) {
      setMembers(p => p.filter(m => m.id !== id));
      await supabase.from('members').delete().eq('id', id);
      setEditMember(null); setMemberModal(null);
    }
  }

  const groups = groupFilter === "전체"
    ? [{ label:"🎖 회장단", key:"회장단", color:"#4A8CFF" }, ...DEPARTMENTS.filter(d => d !== "회장단").map(d=>({ label:`${d}`, key:d, color:DEPT_COLORS[d] }))]
    : groupFilter === "회장단"
      ? [{ label:"🎖 회장단", key:"회장단", color:"#4A8CFF" }]
      : [{ label:groupFilter, key:groupFilter, color:DEPT_COLORS[groupFilter] }];

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={S.sectionTitle}>👥 부원 조직도</div>
        <button style={S.btn()} onClick={()=>setMemberModal("add")}>+ 부원 등록</button>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {filterOptions.map(d=>(
          <button key={d} style={{ ...S.btn(groupFilter===d?"primary":"secondary"), padding:"5px 13px" }} onClick={()=>setGroupFilter(d)}>{d}</button>
        ))}
      </div>

      {groups.map(g => {
        const gMembers = sorted.filter(m => m.dept === g.key);
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
                const deptColor = DEPT_COLORS[m.dept] || "#94A3B8";
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
                      {m.dept !== "회장단" && <span style={S.tag(deptColor)}>{m.dept}</span>}
                      <span style={S.tag(c)}>{m.role}</span>
                    </div>
                    <div style={{ fontSize:12, color:"#718096" }}>{m.phone}</div>
                    <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{m.email}</div>
                    {m.dept !== "회장단" && (
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
