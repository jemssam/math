/* ---------- 사건 데이터: 정수 계수 삼차함수에서 만든 가상 데이터 ---------- */
const DATA={
 demo:{name:'운동장 이용 학생 수',unit:'명',place:'점심 이후 운동장 시간대별 이용 학생 수',cen:15,co:[-1,-9,21,150]},
 co2:{name:'교실 이산화탄소 농도',unit:'ppm',place:'2학년 교실 어느 평일 이산화탄소 농도',cen:12,co:[20,30,-120,1000]},
 study:{name:'야간 자습실 학생 수',unit:'명',place:'야간 자습실 시간대별 학생 수',cen:19,co:[-1,-6,15,60]},
 library:{name:'도서실 이용 학생 수',unit:'명',place:'도서실 시간대별 이용 학생 수',cen:16,co:[-2,-3,12,60]},
 power:{name:'학교 전력 사용량',unit:'kWh',place:'학교 전체 시간당 전력 사용량',cen:12,co:[10,15,-60,300]},
 store:{name:'교실 미세먼지 농도',unit:'㎍/㎥',place:'2학년 교실 시간대별 미세먼지 농도',cen:12,co:[-1,0,27,60]},
 wifi:{name:'와이파이 접속자 수',unit:'명',place:'학교 와이파이 시간대별 접속자 수',cen:12,co:[10,0,-120,300]},
 bus:{name:'정류장 대기 학생 수',unit:'명',place:'학교 앞 버스 정류장 대기 학생 수',cen:17,co:[-1,-6,0,40]},
 cross:{name:'횡단보도 보행자 수',unit:'명',place:'학교 앞 횡단보도 시간당 보행자 수',cen:14,co:[-2,0,54,200]}
};
const poly=(co,t)=>((co[0]*t+co[1])*t+co[2])*t+co[3];
const dpoly=(co,t)=>(3*co[0]*t+2*co[1])*t+co[2];
const TYPES={max:'가장 많은 때',min:'가장 적은 때',rate:'가장 빠르게 늘어나는 때',iv:'기준 이상인 시간'};
const REQ=[
 {id:'demo',data:'demo',num:0,groups:'교사 시범',who:'체육부',what:'공 대여 도우미 배치',text:'12시부터 18시 중 운동장 이용 학생이 가장 많은 때에 공 대여 도우미를 두려고 해요. 몇 시인가요?',dom:[12,18],kind:'max',
  key:'극댓값 단서 한 장(16시 161명)이면 하나만 남아요. f′(x)=0의 해 8시는 정의역 밖이라 지워요.'},
 {id:'co2',data:'co2',num:1,who:'담임 선생님',what:'환기 알림 시각',text:'8시부터 16시 중 교실 이산화탄소 농도가 가장 높은 때에 환기 알림을 보내려고 해요. 몇 시인가요?',dom:[8,16],kind:'max',
  key:'극댓값 단서(10시 1200ppm)만 보내면 후보가 2개 남아요. 마지막 값(16시 2280ppm)까지 보내야 하나만 남아요. 끝값 2280ppm이 극댓값 1200ppm보다 커요.'},
 {id:'study',data:'study',num:2,who:'야간 자습 감독 선생님',what:'감독 두 명 배치 시각',text:'17시부터 22시 중 자습실 학생이 가장 많은 때에 감독 선생님을 두 명 두려고 해요. 몇 시인가요?',dom:[17,22],kind:'max',
  key:'극댓값 단서(20시 68명)가 결정적이에요. 증가 구간만으로는 극댓값과 끝값을 비교할 수 없어요.'},
 {id:'library',data:'library',num:3,who:'사서 선생님',what:'책 정리 시각',text:'13시부터 19시 중 도서실 이용 학생이 가장 적은 때에 책을 정리하려고 해요. 몇 시인가요?',dom:[13,19],kind:'min',
  key:'극솟값 단서(14시 40명)만 보내면 후보가 2개 남아요. 마지막 값(19시 15명)까지 보내야 하나만 남아요. 끝값 15명이 극솟값 40명보다 작아요.'},
 {id:'power',data:'power',num:4,who:'행정실',what:'전기 설비 점검 시각',text:'9시부터 16시 중 학교가 전력을 가장 적게 쓰는 때에 전기 설비를 점검하려고 해요. 몇 시인가요?',dom:[9,16],kind:'min',
  key:'극솟값 단서(13시 265kWh)만으로는 처음 값이 더 낮은 그래프와 구별할 수 없어요. 극솟값 + 처음 값(9시 345kWh)이면 하나만 남아요.'},
 {id:'store',data:'store',num:5,who:'보건 선생님',what:'공기청정기 · 창문 닫기 알림',text:'8시부터 17시 중 교실 미세먼지 농도가 가장 빠르게 늘어나는 때에 공기청정기를 강하게 틀고 창문 닫기 알림을 보내려고 해요. 몇 시인가요?',dom:[8,17],kind:'rate',
  key:'극댓값·극솟값 단서로는 후보가 3개 남아요. 가장 높은 때(15시)가 아니라 가장 빠르게 늘어나는 때, 곧 f′(x)가 최대인 x를 묻기 때문에 가장 빠른 증가 단서(12시)가 결정적이에요.'},
 {id:'wifi',data:'wifi',num:6,who:'정보 선생님',what:'공유기 점검 시각',text:'8시부터 17시 중 와이파이 접속자가 가장 빠르게 늘어나는 때에 맞춰 공유기를 점검하려고 해요. 몇 시인가요?',dom:[8,17],kind:'rate',
  key:'가장 빠른 증가 단서(17시)가 결정적이에요. 이 그래프는 오른쪽 끝에서 가장 가파르게 올라가요. 극댓값·극솟값 단서만으로는 후보가 여러 개 남아요.'},
 {id:'bus',data:'bus',num:7,who:'버스 회사',what:'증차 시간',text:'15시부터 19시 중 정류장 대기 학생이 30명 이상인 동안 버스를 늘리려고 해요. 몇 시부터 몇 시까지인가요?',dom:[15,19],kind:'iv',c:30,
  key:'30명과 만나는 시각 단서(15시 31분, 18시 11분)가 결정적이에요. 극댓값 단서만으로는 30명 이상인 구간이 넓은지 좁은지 알 수 없어요.'},
 {id:'cross',data:'cross',num:8,who:'교통 봉사 동아리',what:'교통 지도 시간',text:'9시부터 19시 중 횡단보도 보행자가 200명 이상인 동안 교통 지도를 하려고 해요. 몇 시부터 몇 시까지인가요?',dom:[9,19],kind:'iv',c:200,
  key:'200명과 만나는 시각 단서가 결정적이에요. f(x)=200의 해 3개 중 정의역 안에는 14시 하나뿐이라, 14시부터 19시까지 계속 200명 이상이에요.'}
];
REQ.forEach(r=>{if(!r.groups)r.groups=`문제 ${r.num} · ${TYPES[r.kind]}`;});
REQ.forEach(r=>{const d=DATA[r.data];r.xs=[];r.ys=[];for(let x=r.dom[0];x<=r.dom[1];x++){r.xs.push(x);r.ys.push(poly(d.co,x-d.cen));}});
const rtList=d=>{const [a,b,c]=d.co,A=3*a,B=2*b,D=Math.sqrt(B*B-4*A*c);return [(-B-D)/(2*A),(-B+D)/(2*A)].sort((p,q)=>p-q).map(v=>Math.round((v+d.cen)*1000)/1000);};
const xco=d=>{const [a,b,c,e]=d.co,h=d.cen;return [a,-3*a*h+b,3*a*h*h-2*b*h+c,-a*h**3+b*h*h-c*h+e];};
const tl=x=>{let H=Math.floor(x+1e-9),M=Math.round((x-H)*60);if(M===60){H++;M=0;}return M?`${H}시 ${M}분`:`${H}시`;};
const jo=w=>{const c=String(w).trim().slice(-1).charCodeAt(0);return (c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28)?'이에요':'예요';};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtPoly=co=>{const p=[[co[0],'x³'],[co[1],'x²'],[co[2],'x'],[co[3],'']];let s='';p.forEach(([c,v],i)=>{if(!c)return;const a=Math.abs(c),sign=c<0?'−':'+';const body=(a===1&&v?'':a)+v;s+=s?` ${sign} ${body}`:(c<0?'−':'')+body;});return 'f(x) = '+s;};
function roots(g,a,b){const r=[];const N=6000,h=(b-a)/N;for(let i=0;i<N;i++){const x0=a+i*h,x1=x0+h,g0=g(x0),g1=g(x1);if(g0===0)r.push(x0);else if(g0*g1<0){let lo=x0,hi=x1;for(let k=0;k<50;k++){const m=(lo+hi)/2;if(g(lo)*g(m)<=0)hi=m;else lo=m;}r.push((lo+hi)/2);}}return r.filter((v,i)=>i===0||Math.abs(v-r[i-1])>1e-3);}
function analysis(r,co){const d=DATA[r.data];co=co||d.co;const f=x=>poly(co,x-d.cen),df=x=>dpoly(co,x-d.cen),[a,b]=r.dom;
  const critAll=roots(df,a-40,b+40),crit=critAll.filter(x=>x>a+1e-6&&x<b-1e-6);
  const ext=crit.map(x=>({x,v:f(x),type:df(x-0.01)>0?'max':'min'}));
  const pts=[a,...crit,b],ivs=pts.slice(0,-1).map((p,i)=>({l:p,r:pts[i+1],up:df((p+pts[i+1])/2)>0}));
  let rmax=a,rmin=a;for(let x=a;x<=b;x+=0.002){if(df(x)>df(rmax))rmax=x;if(df(x)<df(rmin))rmin=x;}
  return {f,df,critAll,ext,ivs,rmax,rmin,fa:f(a),fb:f(b),f0:f(d.cen)};}
function keyAns(r){const A=analysis(r),[a,b]=r.dom;
  if(r.kind==='iv'){const ro=roots(x=>A.f(x)-r.c,a,b);return {iv:[A.f(a)>=r.c?a:ro[0],ro.length>1?ro[1]:b]};}
  if(r.kind==='rate')return {pt:A.rmax};
  let best=a;for(let x=a;x<=b+1e-9;x+=0.002){if(r.kind==='max'?A.f(x)>A.f(best):A.f(x)<A.f(best))best=x;}return {pt:best};}
const keyText=r=>{const k=keyAns(r);return r.kind==='iv'?`${tl(k.iv[0])} ~ ${tl(k.iv[1])}`:tl(k.pt);};
function num(u){u=String(u??'').trim();if(!u)return NaN;const m=u.match(/^(\d+(?:\.\d+)?)\s*시(?:\s*(\d+)\s*분)?(\s*반)?/);if(m)return +m[1]+(m[2]?+m[2]/60:0)+(m[3]?0.5:0);const n=parseFloat(u);return isFinite(n)?n:NaN;}
function ansOk(r,a){const k=keyAns(r),t=r.kind==='rate'?1:0.5;if(r.kind==='iv')return Math.abs(num(a.a)-k.iv[0])<=t&&Math.abs(num(a.b)-k.iv[1])<=t;return Math.abs(num(a.a)-k.pt)<=t;}

/* ---------- 단서 (자동 계산) ---------- */
const CGROUP=[['dif','미분 단서'],['val','값 단서'],['all','전체 단서']];
function catalogue(r){const d=DATA[r.data],A=analysis(r),u=d.unit,mx=A.ext.filter(e=>e.type==='max'),mn=A.ext.filter(e=>e.type==='min'),up=A.ivs.find(v=>v.up),dn=A.ivs.find(v=>!v.up);
  const M={1:'',2:'f′(x) > 0',3:'f′(x) < 0',4:'',5:'',6:'',7:'f′(x)가 최대인 x',8:'f′(x)가 최소인 x',9:'f(a)',10:'f(b)',11:'',13:'f(x) = c의 해'};
  const GR={1:'dif',2:'dif',3:'dif',4:'dif',5:'dif',6:'dif',7:'dif',8:'dif',9:'val',10:'val',11:'all',13:'val'};
  const H=(id,g,short,prompt,answer)=>({id,g:GR[id],short,m:M[id],prompt,answer});
  const list=[
   H(1,'dif','극값 개수','정의역 안에서 극대·극소는 몇 개인가요?',`정의역 안에서 극대 ${mx.length}개, 극소 ${mn.length}개예요.`),
   H(2,'dif','증가 구간','늘어나는 구간 하나를 알려 주세요.',up?`${tl(up.l)}~${tl(up.r)}에는 늘어나요.`:'정의역 안에서 늘어나는 구간은 없어요.'),
   H(3,'dif','감소 구간','줄어드는 구간 하나를 알려 주세요.',dn?`${tl(dn.l)}~${tl(dn.r)}에는 줄어들어요.`:'정의역 안에서 줄어드는 구간은 없어요.'),
   H(4,'dif','f′(x)=0인 시각','도함수가 0이 되는 시각을 알려 주세요.',(t=>`f′(x)=0이 되는 시각은 ${t}${jo(t)}.`)(A.critAll.map(tl).join(', '))),
   H(5,'dif','극댓값','극댓값을 알려 주세요.',mx.length?(t=>t+jo(t)+'.')(mx.map(e=>`${tl(e.x)}에 극댓값 ${Math.round(e.v)}${u}`).join(', ')):'정의역 안에 극대가 없어요.'),
   H(6,'dif','극솟값','극솟값을 알려 주세요.',mn.length?(t=>t+jo(t)+'.')(mn.map(e=>`${tl(e.x)}에 극솟값 ${Math.round(e.v)}${u}`).join(', ')):'정의역 안에 극소가 없어요.'),
   H(7,'dif','가장 빠른 증가','가장 빠르게 늘어나는 시각은?',`${tl(A.rmax)}에 가장 빠르게 늘어요 (시간당 ${Math.round(A.df(A.rmax))}${u}).`),
   H(8,'dif','가장 빠른 감소','가장 빠르게 줄어드는 시각은?',A.df(A.rmin)<0?`${tl(A.rmin)}에 가장 빠르게 줄어요 (시간당 ${Math.round(-A.df(A.rmin))}${u}).`:'정의역 안에서 줄어드는 때가 없어요.'),
   H(9,'all','처음 값',`${tl(r.dom[0])}의 값은?`,`${tl(r.dom[0])}에 ${Math.round(A.fa)}${u}${jo(u)}.`),
   H(10,'all','마지막 값',`${tl(r.dom[1])}의 값은?`,`${tl(r.dom[1])}에 ${Math.round(A.fb)}${u}${jo(u)}.`),
   H(11,'all','최고차항 부호','최고차항 계수의 부호는?',d.co[0]>0?'양수예요. 시간이 갈수록 결국 위로 올라가요.':'음수예요. 시간이 갈수록 결국 아래로 내려가요.')
   ];
  if(r.c!=null){const ro=roots(x=>A.f(x)-r.c,r.dom[0],r.dom[1]);list.push(H(13,'alg',`${r.c}${u}${jo(u)==='이에요'?'과':'와'} 만나는 시각`,`f(x)=${r.c}의 해는?`,`${ro.map(tl).join(', ')}에 ${r.c}${u}${jo(u)==='이에요'?'이':'가'} 돼요.`));}
  return list;}

/* ---------- 후보 그래프: 정답 · 시간 뒤집기 · 위아래 뒤집기 · 2시간 이동 ---------- */
function seeded(items,seed){let s=0;for(const c of seed)s=(Math.imul(s^c.charCodeAt(0),16777619))>>>0;s=s||1;const v=items.slice();for(let i=v.length-1;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;const j=s%(i+1);[v[i],v[j]]=[v[j],v[i]];}return v;}
const ALT={
 demo:[[[12,33],[14,161],[18,60]],[[12,33],[18,161]],[[12,33],[16,110],[17,105],[18,170]]],
 co2:[[[8,680],[10,1200],[13,930],[16,1000]],[[8,680],[10,2700],[13,930],[16,2280]],[[8,1800],[11,700],[14,1600],[16,1100]]],
 study:[[[17,30],[18,68],[22,10]],[[17,14],[22,68]],[[17,14],[20,50],[21,45],[22,75]]],
 library:[[[13,51],[14,40],[17,67],[19,55]],[[13,51],[14,5],[17,67],[19,15]],[[13,20],[16,70],[19,40]]],
 power:[[[9,345],[10,400],[11,265],[16,940]],[[9,150],[10,400],[13,265],[16,940]],[[9,600],[12,900],[16,300]]],
 store:[[[8,16],[9,6],[10,70],[11,95],[13,108],[15,114],[17,70]],[[8,16],[9,6],[12,20],[13,40],[14,90],[15,114],[17,70]],[[8,60],[11,110],[14,20],[17,80]]],
 wifi:[[[8,140],[10,460],[14,140],[16,300],[17,350]],[[8,140],[10,460],[14,140],[15,600],[16,900],[17,950]],[[8,700],[12,200],[17,500]]],
 bus:[[[15,31],[17,40],[19,32]],[[15,10],[16.5,30],[17,40],[17.5,30],[19,5]],[[15,45],[16,40],[19,10]]],
 cross:[[[9,180],[11,92],[17,308],[19,150]],[[9,180],[11,92],[12,200],[17,308],[19,220]],[[9,320],[13,100],[19,180]]]
};
function mono(P){const n=P.length,X=P.map(p=>p[0]),Y=P.map(p=>p[1]),d=[],m=[];for(let i=0;i<n-1;i++)d[i]=(Y[i+1]-Y[i])/(X[i+1]-X[i]);
  m[0]=d[0];m[n-1]=d[n-2];for(let i=1;i<n-1;i++)m[i]=d[i-1]*d[i]<=0?0:(d[i-1]+d[i])/2;
  for(let i=0;i<n-1;i++){if(d[i]===0){m[i]=0;m[i+1]=0;continue;}const a=m[i]/d[i],b=m[i+1]/d[i],q=a*a+b*b;if(q>9){const t=3/Math.sqrt(q);m[i]=t*a*d[i];m[i+1]=t*b*d[i];}}
  return x=>{let i=0;while(i<n-2&&x>X[i+1])i++;const h=X[i+1]-X[i],t=Math.min(1,Math.max(0,(x-X[i])/h)),t2=t*t,t3=t2*t;return (2*t3-3*t2+1)*Y[i]+(t3-2*t2+t)*h*m[i]+(-2*t3+3*t2)*Y[i+1]+(t3-t2)*h*m[i+1];};}
// 후보 그래프: 정답 1개 + 일부 단서는 같지만 문제의 답이 달라지는 그래프 3개
function candidates(r){const d=DATA[r.data];const base=[{id:'ans',fn:x=>poly(d.co,x-d.cen),ans:true},...ALT[r.id].map((P,i)=>({id:'alt'+i,fn:mono(P)}))];
  return seeded(base,r.id).map((v,i)=>({...v,label:'ABCD'[i]}));}

/* ---------- 그래프 그리기 ---------- */
function bounds(r,sets){let ys=[];sets.forEach(fn=>{for(let i=0;i<=120;i++){const x=r.dom[0]+(r.dom[1]-r.dom[0])*i/120;ys.push(fn(x));}});let lo=Math.min(...ys),hi=Math.max(...ys);const p=(hi-lo)*0.1||1;return [lo-p,hi+p];}
function svgGraph(r,o){const d=DATA[r.data],W=o.w||520,H=o.h||300,L=o.yl?54:16,R=12,T=o.tp||14,B=28,[y0,y1]=o.yb,x0=r.dom[0],x1=r.dom[1];
  const X=x=>L+(x-x0)/(x1-x0)*(W-L-R),Y=y=>T+(y1-y)/(y1-y0)*(H-T-B);let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria||'그래프')}">`;
  const step=(x1-x0)>8?2:1;for(let k=x0;k<=x1;k+=step)s+=`<line x1="${X(k)}" x2="${X(k)}" y1="${T}" y2="${H-B}" stroke="var(--line)"/><text x="${X(k)}" y="${H-B+16}" font-size="${W<=440?13:11}" text-anchor="middle" fill="var(--muted)">${k}시</text>`;
  const fs=W<=440?14:11;if(o.yl){const raw=(y1-y0)/5,p=Math.pow(10,Math.floor(Math.log10(raw))),st=[1,2,2.5,5,10].map(k=>k*p).find(k=>k>=raw);for(let v=Math.ceil(y0/st)*st;v<=y1;v+=st){s+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${L-6}" y="${Y(v)+4}" font-size="${fs}" text-anchor="end" fill="var(--muted)">${Math.round(v)}</text>`;}}else for(let i=0;i<=4;i++){const v=y0+(y1-y0)*i/4;s+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/>`;}
  if(r.c!=null&&o.cline)s+=`<line x1="${L}" x2="${W-R}" y1="${Y(r.c)}" y2="${Y(r.c)}" stroke="var(--alg)" stroke-dasharray="6 4" stroke-width="1.5"/><text x="${W-R-4}" y="${Y(r.c)-5}" font-size="11" text-anchor="end" fill="var(--alg)">${r.c}${esc(d.unit)}</text>`;
  (o.curves||[]).forEach(cv=>{let p='';for(let i=0;i<=240;i++){const x=x0+(x1-x0)*i/240,y=cv.fn(x);p+=(i?'L':'M')+X(x).toFixed(1)+' '+Y(y).toFixed(1);}s+=`<path d="${p}" fill="none" stroke="${cv.col}" stroke-width="${cv.w||3}" stroke-linecap="round"/>`;});
  if(o.points)r.xs.forEach((x,i)=>{s+=`<circle cx="${X(x)}" cy="${Y(r.ys[i])}" r="4" fill="var(--muted)"/>`;});
  (o.vlines||[]).forEach((m,i)=>{if(!isFinite(m.x))return;const rt=X(m.x)>W-140;s+=`<line x1="${X(m.x)}" x2="${X(m.x)}" y1="${T}" y2="${H-B}" stroke="${m.col}" stroke-width="2.5" ${m.dash?'stroke-dasharray="6 4"':''}/><text x="${rt?X(m.x)-4:X(m.x)+4}" text-anchor="${rt?'end':'start'}" y="${T+12+i*15}" font-size="12" font-weight="700" fill="${m.col}">${esc(m.t)}</text>`;});
  return s+'</svg>';}


/* ---------- 후보 그래프가 단서와 맞는지 (교사 화면 '단서 비교'와 채점 설명에 사용) ---------- */
function feat(r,f){const [a,b]=r.dom,df=x=>(f(x+1e-3)-f(x-1e-3))/2e-3;
  const crit=roots(df,a+0.02,b-0.02).filter(x=>Math.sign(df(x-0.05))!==Math.sign(df(x+0.05)));
  const ext=crit.map(x=>({x,v:f(x),type:df(x-0.05)>0?'max':'min'}));
  const pts=[a,...crit,b],ivs=pts.slice(0,-1).map((p,i)=>({l:p,r:pts[i+1],up:df((p+pts[i+1])/2)>0}));
  let rmax=a,rmin=a;for(let x=a;x<=b;x+=0.01){if(df(x)>df(rmax))rmax=x;if(df(x)<df(rmin))rmin=x;}
  return {crit,ext,ivs,rmax,rmin,decr:df(rmin)<0,fa:f(a),fb:f(b),f12:f(12),end:Math.sign(df(b-0.05)),rc:r.c!=null?roots(x=>f(x)-r.c,a,b):[]};}
function fits(id,T,C){const near=(p,q,t)=>Math.abs(p-q)<=t,rel=(p,q)=>Math.abs(p-q)<=Math.max(8,Math.abs(q)*0.04);
  const iv=(A,B)=>(!A&&!B)||(A&&B&&near(A.l,B.l,0.5)&&near(A.r,B.r,0.5));
  const ex=(t)=>{const P=T.ext.filter(e=>e.type===t),Q=C.ext.filter(e=>e.type===t);return P.length===Q.length&&P.every((e,i)=>near(e.x,Q[i].x,0.5)&&rel(Q[i].v,e.v));};
  switch(id){
   case 1:return T.ext.filter(e=>e.type==='max').length===C.ext.filter(e=>e.type==='max').length&&T.ext.filter(e=>e.type==='min').length===C.ext.filter(e=>e.type==='min').length;
   case 2:return iv(T.ivs.find(v=>v.up),C.ivs.find(v=>v.up));
   case 3:return iv(T.ivs.find(v=>!v.up),C.ivs.find(v=>!v.up));
   case 4:return T.crit.length===C.crit.length&&T.crit.every((x,i)=>near(x,C.crit[i],0.5));
   case 5:return ex('max');case 6:return ex('min');
   case 7:return near(T.rmax,C.rmax,0.75);
   case 8:return T.decr===C.decr&&(!T.decr||near(T.rmin,C.rmin,0.75));
   case 9:return rel(C.fa,T.fa);case 10:return rel(C.fb,T.fb);case 11:return T.end===C.end;case 12:return rel(C.f12,T.f12);
   case 13:return T.rc.length===C.rc.length&&T.rc.every((x,i)=>near(x,C.rc[i],0.3));}
  return true;}
function remaining(r,ids){const C=candidates(r),T=feat(r,C.find(c=>c.ans).fn);return C.filter(c=>c.ans||ids.every(id=>fits(id,T,feat(r,c.fn))));}

