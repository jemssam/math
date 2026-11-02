/* ---------- 공통: 저장소 연결 (Supabase 또는 체험 모드) ---------- */
const CFG = window.APP_CONFIG || {};
const CLASS = String(CFG.CLASS_CODE || '2-3');
const LIVE = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase);
const sb = LIVE ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;
const DEMO_KEY = 'gbd-demo-store';
function demoLoad(){ try { return JSON.parse(localStorage.getItem(DEMO_KEY) || '{"rounds":{},"uploads":[]}'); } catch(e){ return {rounds:{},uploads:[]}; } }
function demoSave(s){ try { localStorage.setItem(DEMO_KEY, JSON.stringify(s)); return true; } catch(e){ return false; } }
const rk = (c,n,g) => `${c}|${n}|${g}`;

const api = {
  mode: LIVE ? 'live' : 'demo',
  async upsertRound(f){
    const row = {...f, class_code: CLASS, updated_at: new Date().toISOString()};
    if (LIVE){ const {error} = await sb.from('rounds').upsert(row, {onConflict:'class_code,round_no,analyst_group'}); if (error) throw error; return; }
    const s = demoLoad(), k = rk(CLASS,row.round_no,row.analyst_group); s.rounds[k] = {...(s.rounds[k]||{}), ...row}; demoSave(s);
  },
  async getRound(n,g){
    if (LIVE){ const {data,error} = await sb.from('rounds').select('*').eq('class_code',CLASS).eq('round_no',n).eq('analyst_group',g).maybeSingle(); if (error) throw error; return data; }
    return demoLoad().rounds[rk(CLASS,n,g)] || null;
  },
  async listRounds(){
    if (LIVE){ const {data,error} = await sb.from('rounds').select('*').eq('class_code',CLASS); if (error) throw error; return data||[]; }
    return Object.values(demoLoad().rounds).filter(r=>r.class_code===CLASS);
  },
  async upload(blob, meta){
    if (LIVE){
      const path = `${CLASS}/r${meta.round_no}/g${meta.group_no}-${meta.kind}-${Date.now()}.jpg`;
      const up = await sb.storage.from('uploads').upload(path, blob, {contentType:'image/jpeg', upsert:false}); if (up.error) throw up.error;
      const url = sb.storage.from('uploads').getPublicUrl(path).data.publicUrl;
      const {error} = await sb.from('uploads').insert({class_code:CLASS, round_no:meta.round_no, group_no:meta.group_no, kind:meta.kind, url}); if (error) throw error; return url;
    }
    const url = await new Promise(res=>{ const fr = new FileReader(); fr.onload = ()=>res(fr.result); fr.readAsDataURL(blob); });
    const s = demoLoad(); s.uploads.push({class_code:CLASS, round_no:meta.round_no, group_no:meta.group_no, kind:meta.kind, url, created_at:new Date().toISOString()});
    if (!demoSave(s)) throw new Error('체험 모드 저장 공간이 가득 찼어요. 관리 탭에서 기록을 지워 주세요.'); return url;
  },
  async listUploads(){
    if (LIVE){ const {data,error} = await sb.from('uploads').select('*').eq('class_code',CLASS).order('created_at',{ascending:true}); if (error) throw error; return data||[]; }
    return demoLoad().uploads.filter(u=>u.class_code===CLASS);
  },
  async reset(){
    if (LIVE){ const a = await sb.from('rounds').delete().eq('class_code',CLASS); if (a.error) throw a.error; const b = await sb.from('uploads').delete().eq('class_code',CLASS); if (b.error) throw b.error; return; }
    const s = demoLoad(); Object.keys(s.rounds).forEach(k=>{ if (s.rounds[k].class_code===CLASS) delete s.rounds[k]; }); s.uploads = s.uploads.filter(u=>u.class_code!==CLASS); demoSave(s);
  }
};

/* ---------- 공통: 수업 규칙 ---------- */
const partnerOf = g => g % 2 ? g + 1 : g - 1;
const caseById = id => REQ.find(r => r.id === id) || null;
const ROUND = 1;   // 한 판만 해요
const SENT_PTS = {1:20, 2:15, 3:10};
const cardName = (r,id) => { const h = catalogue(r).find(h=>h.id===id) || {short:'?'}; return h.m ? `${h.short} (${h.m})` : h.short; };
const mmss = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const $ = id => document.getElementById(id);
function copyText(t, msgEl){ try { navigator.clipboard.writeText(t).then(()=>{ msgEl.textContent='복사했어요'; }, ()=>{ msgEl.textContent='길게 눌러 직접 복사하세요'; }); } catch(e){ msgEl.textContent='길게 눌러 직접 복사하세요'; } }
function modeBadge(){ return LIVE ? `<span class="badge live">실시간 연결 · 반 ${esc(CLASS)}</span>` : `<span class="badge demo">체험 모드 · 같은 브라우저 안에서만 공유</span>`; }
/* 타이머 끝 알림음 (타이머) */
function beep(times=3){ try { const A = new (window.AudioContext||window.webkitAudioContext)(); for (let i=0;i<times;i++){ const o = A.createOscillator(), g = A.createGain(); o.type='sine'; o.frequency.value = 880; o.connect(g); g.connect(A.destination); const t = A.currentTime + i*0.5; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.5,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+0.4); o.start(t); o.stop(t+0.42); } } catch(e){} }
/* 사진을 줄여서 올리기 (긴 변 1200px, JPEG) */
function shrinkImage(src, max=1200){ return new Promise((res,rej)=>{ const img = new Image(); img.onload = ()=>{ const k = Math.min(1, max/Math.max(img.width,img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width*k); c.height = Math.round(img.height*k); const x = c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,c.width,c.height); x.drawImage(img,0,0,c.width,c.height); c.toBlob(b=>b?res(b):rej(new Error('이미지를 만들 수 없어요')), 'image/jpeg', 0.75); }; img.onerror = ()=>rej(new Error('이미지를 읽을 수 없어요')); img.src = src; }); }
