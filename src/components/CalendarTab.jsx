import { useState } from "react";
import { BRAND, BRAND_LIGHT, DEPARTMENTS, DEPT_COLORS, ROLE_COLOR, STATUS_COLOR, MONTHS, S, daysInMonth, firstDay, pad, todayObj } from "../constants/data";

export default function CalendarTab({ members, logs, events, setEvents, calYear, setCalYear, calMonth, setCalMonth, calMode, setCalMode, calDept, setCalDept, calMemberId, setCalMemberId, selectedDay, setSelectedDay, eventModal, setEventModal }) {
  const td = todayObj();
  const days = daysInMonth(calYear, calMonth);
  const startDay = firstDay(calYear, calMonth);
  
  // 시작일(startDate)과 마감일(endDate)로 구조 변경
  const emptyEForm = { title:"", startDate:"", endDate:"", dept:"기획부", memberId:null, memberName:"전체", type:"전체" };
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
    return getCalendarEvents().filter(e => {
      return ds >= e.startDate && ds <= e.endDate; // 시작일과 마감일 사이면 화면에 표시
    });
  }
  const dayEvts = selectedDay ? getEventsForDay(selectedDay) : [];

  function saveEvent() {
    if (!eForm.title || !eForm.startDate || !eForm.endDate) return alert("제목과 시작/마감일을 모두 입력해주세요.");
    if (eForm.startDate > eForm.endDate) return alert("마감일이 시작일보다 빠를 수 없습니다.");

    if (eForm.id) {
      setEvents(p => p.map(e => e.id === eForm.id ? { ...eForm, color:DEPT_COLORS[eForm.dept] } : e));
    } else {
      setEvents(p => [...p, { ...eForm, id:Date.now(), color:DEPT_COLORS[eForm.dept] }]);
    }
    setEForm(emptyEForm); setEventModal(null);
  }

  function delEvent(id) {
    if(window.confirm("정말 이 일정을 삭제하시겠습니까?")) {
      setEvents(p => p.filter(e => e.id !== id));
      setSelectedDay(null); // 삭제 후 날짜 선택 해제
    }
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={S.sectionTitle}>📅 캘린더</div>
        <button style={S.btn()} onClick={()=>{ setEForm(emptyEForm); setEventModal("add"); }}>+ 일정 추가</button>
      </div>

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
            
            {/* 일정 목록 표시 부분 (수정, 삭제 버튼 추가됨) */}
            {dayEvts.map(e=>(
              <div key={e.id} style={{ padding:12, borderRadius:9, background:e.color+"12", border:`1px solid ${e.color}30`, marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ fontWeight:800, fontSize:14 }}>{e.title}</div>
                  <div style={{ display:"flex", gap:4 }}>
                    <button style={{...S.btn("ghost"), padding:"2px 6px", fontSize:10, border:"1px solid #E2E8F0"}} onClick={()=>{ setEForm({ ...e }); setEventModal("add"); }}>수정</button>
                    <button style={{...S.btn("danger"), padding:"2px 6px", fontSize:10}} onClick={()=>delEvent(e.id)}>삭제</button>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:5 }}>
                  <span style={S.tag(e.color)}>{e.dept}</span>
                  <span style={{ fontSize:11, color:"#94A3B8" }}>{e.memberName}</span>
                </div>
                {/* 다중 일자일 경우 기간 표시 */}
                {(e.startDate !== e.endDate) && (
                  <div style={{ fontSize:10, color:"#718096", marginTop:4 }}>기간: {e.startDate} ~ {e.endDate}</div>
                )}
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
          {/* 부서 및 개인 모드 하단 내역은 기존과 동일하게 유지 */}
        </div>
      </div>

      {eventModal==="add" && (
        <div style={S.overlay}>
          <div style={S.modal()}>
            <div style={{ fontSize:17, fontWeight:900, marginBottom:20 }}>{eForm.id ? "일정 수정" : "일정 추가"}</div>
            
            <div style={{ marginBottom: 12 }}>
              <label style={S.label}>제목</label>
              <input style={S.input} value={eForm.title} onChange={e=>setEForm(p=>({...p,title:e.target.value}))} />
            </div>
            
            <div style={{ ...S.grid2, marginBottom: 12 }}>
              <div><label style={S.label}>시작일</label><input style={S.input} type="date" value={eForm.startDate} onChange={e=>setEForm(p=>({...p,startDate:e.target.value}))} /></div>
              <div><label style={S.label}>마감일</label><input style={S.input} type="date" value={eForm.endDate} onChange={e=>setEForm(p=>({...p,endDate:e.target.value}))} /></div>
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
