import { useState, useRef } from "react";
import { DEPARTMENTS, DEPT_COLORS, BRAND_LIGHT, S } from "../constants/data";

export default function MinutesTab({ minutes, setMinutes, minuteModal, setMinuteModal, minuteFilter, setMinuteFilter }) {
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
    if (!form.title || !form.date) return alert("제목과 날짜를 입력해주세요.");
    
    if (form.id) {
      // 수정 모드
      setMinutes(p => p.map(m => m.id === form.id ? form : m));
    } else {
      // 새 등록 모드
      setMinutes(p => [{ ...form, id:Date.now() }, ...p]);
    }
    setForm(emptyForm); setMinuteModal(null);
  }

  function del(id) {
    if(window.confirm("정말 이 회의록을 삭제하시겠습니까?")) {
      setMinutes(p => p.filter(m => m.id !== id));
      setMinuteModal(null);
    }
  }

  const filtered = minuteFilter==="전체" ? minutes : minutes.filter(m=>m.dept===minuteFilter);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={S.sectionTitle}>📋 회의록</div>
        <button style={S.btn()} onClick={() => { setForm(emptyForm); setMinuteModal("add"); }}>+ 새 회의록</button>
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

      {/* 회의록 상세 보기 모달 */}
      {minuteModal && typeof minuteModal === "object" && (
        <div style={S.overlay} onClick={()=>setMinuteModal(null)}>
          <div style={S.modal(600)} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <span style={S.tag(DEPT_COLORS[minuteModal.dept])}>{minuteModal.dept}</span>
              <div style={{ display:"flex", gap: 8 }}>
                <button style={{...S.btn("secondary"), padding:"6px 12px", fontSize:12}} onClick={() => { setForm(minuteModal); setMinuteModal("add"); }}>수정</button>
                <button style={{...S.btn("danger"), padding:"6px 12px", fontSize:12}} onClick={() => del(minuteModal.id)}>삭제</button>
                <button style={{...S.btn("ghost"), padding:"6px 12px"}} onClick={()=>setMinuteModal(null)}>✕</button>
              </div>
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

      {/* 회의록 등록/수정 모달 */}
      {minuteModal==="add" && (
        <div style={S.overlay}>
          <div style={S.modal(560)}>
            <div style={{ fontSize:17, fontWeight:900, marginBottom:20 }}>{form.id ? "회의록 수정" : "새 회의록 등록"}</div>
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
