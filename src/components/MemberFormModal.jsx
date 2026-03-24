import { DEPARTMENTS, EXEC_ROLES, DEPT_ROLES, S } from "../constants/data";

export default function MemberFormModal({ data, setData, onSave, onClose, onDelete, isEdit }) {
  const isExec = EXEC_ROLES.includes(data.role);
  const availableRoles = data.dept === "집행부" ? EXEC_ROLES : DEPT_ROLES;

  function handleDeptChange(dept) {
    const newRole = dept === "집행부" ? "회장" : "부원";
    setData(p => ({ ...p, dept, role: newRole }));
  }
  function handleRoleChange(role) {
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
