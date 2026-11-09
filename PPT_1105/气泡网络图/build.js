const fs = require('fs');
const path = require('path');
const pptxgen = require('/home/wxf/.codex/skills/pptx/node_modules/pptxgenjs');
const OUT = __dirname;
const title = '人形机器人应用开发技术路线';
const W = 1600, H = 900, U = 120;
const nodes = [];
function n(id, label, x, y, d, color, font=25, dark=false, parent=null) {
  nodes.push({id,label,x,y,d,color,font,dark,parent});
}
n('core','人形\n应用',800,415,190,'17324D',43,true);
n('brain','大脑端\n探索',480,300,144,'A94D1E',30,true,'core');
n('body','本体\n使用',420,605,129,'26705E',29,true,'core');
n('scene','场景\n项目',1120,330,129,'2865A5',29,true,'core');
n('motor','小脑\n探索',1180,600,118,'6552A0',28,true,'core');
n('data','数据',800,660,129,'17747C',32,true,'core');
n('pi','PI',200,230,125,'F3A45B',36,false,'brain');
n('groot','GR00T',360,195,114,'EDBC74',28,false,'brain');
n('ling','LingBot',570,190,106,'F2C99B',25,false,'brain');
n('act','ACT\nDP',205,400,99,'E8A39A',26,false,'brain');
n('sim','Genine\nSIM',365,430,96,'F5DDB5',21,false,'brain');
n('g2','智元\nG2',140,585,122,'A6D9C5',28,false,'body');
n('x2','智元\nX2',220,745,110,'A6D9C5',27,false,'body');
n('a3','智元\nA3',390,785,99,'A6D9C5',25,false,'body');
n('rpo','萝博派对\nRPO',550,710,98,'D6DFA7',19,false,'body');
n('metal','轻长扁\n金属上下料',1050,200,122,'C4DDF4',21,false,'scene');
n('plastic','轻长宽\n塑料上下料',1250,200,122,'C4DDF4',21,false,'scene');
n('assembly','轻小扁\n塑料件装配',1430,330,134,'C4DDF4',22,false,'scene');
n('dance','X2/A3\n舞蹈',1405,520,103,'C5B6E5',25,false,'motor');
n('isaac','Isaac',1420,690,91,'D6C9EC',26,false,'motor');
n('mojoco','Mojoco',1235,785,97,'E3D8F0',23,false,'motor');
n('capture','数采\n平台',650,790,106,'A9D9DD',26,false,'data');
n('lerobot','Lerobot',790,805,91,'C2E5E7',22,false,'data');
n('finedance','FineDance',920,800,104,'D5EDEE',18,false,'data');
n('volume','1.3TB\n2.4万条',1010,675,114,'97CDD3',26,false,'data');
const index = Object.fromEntries(nodes.map(v=>[v.id,v]));
const edges = nodes.filter(v=>v.parent).map(v=>{
  const a=index[v.parent], dx=v.x-a.x, dy=v.y-a.y, dist=Math.hypot(dx,dy);
  return {a:a.id,b:v.id,x1:a.x+dx/dist*a.d/2,y1:a.y+dy/dist*a.d/2,
    x2:v.x-dx/dist*v.d/2,y2:v.y-dy/dist*v.d/2,
    color:a.id==='core'?v.color:a.color,width:a.id==='core'?3:1.7};
});
const errors=[];
for(let i=0;i<nodes.length;i++) {
 const a=nodes[i];
 if(a.x-a.d/2<50 || a.x+a.d/2>1550 || a.y-a.d/2<125 || a.y+a.d/2>855) errors.push('bounds '+a.id);
 for(let j=i+1;j<nodes.length;j++) {
   const b=nodes[j], gap=Math.hypot(a.x-b.x,a.y-b.y)-(a.d+b.d)/2;
   if(gap<12) errors.push('circles '+a.id+' '+b.id+' '+gap);
 }
}
for(const e of edges) for(const v of nodes) {
 if(v.id===e.a || v.id===e.b) continue;
 const dx=e.x2-e.x1,dy=e.y2-e.y1;
 const t=Math.max(0,Math.min(1,((v.x-e.x1)*dx+(v.y-e.y1)*dy)/(dx*dx+dy*dy)));
 if(Math.hypot(v.x-e.x1-t*dx,v.y-e.y1-t*dy)<v.d/2+3) errors.push('edge '+e.a+'-'+e.b+' crosses '+v.id);
}
if(errors.length) throw new Error(errors.join('\n'));
const xml = s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const logo = fs.readFileSync(path.join(OUT,'../logo.png')).toString('base64');
function makeHtml() {
 const shapes=edges.map(e=>`<line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" stroke="#${e.color}" stroke-opacity=".45" stroke-width="${e.width}"/>`).join('');
 const bubbles=nodes.map(v=>{
   const lines=v.label.split('\n'), lineH=v.font*1.18;
   return `<g class="bubble" data-id="${v.id}"><circle cx="${v.x}" cy="${v.y}" r="${v.d/2}" fill="#${v.color}"/><text text-anchor="middle" fill="${v.dark?'#fff':'#243447'}" font-size="${v.font}" font-weight="${v.dark?'700':'500'}">${lines.map((line,i)=>`<tspan x="${v.x}" y="${v.y-(lines.length-1)*lineH/2+i*lineH}" dominant-baseline="central">${xml(line)}</tspan>`).join('')}</text></g>`;
 }).join('');
 fs.writeFileSync(path.join(OUT,'ppt.html'),`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>${title} · 气泡网络图</title><style>*{box-sizing:border-box}html,body{margin:0;background:#fff;width:1600px;height:900px}svg{display:block;font-family:SimSun,'Noto Serif CJK SC',serif}.title{font-weight:700}</style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="人形应用及五个技术能力群组"><rect width="1600" height="900" fill="white"/><text class="title" x="55" y="80" font-size="48" fill="#17324D">${title}</text><image href="data:image/png;base64,${logo}" x="1465" y="35" width="78.5" height="49.5"/><rect x="50" y="125" width="1500" height="730" fill="none" stroke="#BCD4EB" stroke-width="1"/>${shapes}${bubbles}</svg></body></html>`);
 fs.writeFileSync(path.join(OUT,'layout.json'),JSON.stringify({title,nodes,edges},null,2));
 console.log('HTML and layout ready; 25 nodes, 24 edges; geometry checks passed.');
}
async function makePpt() {
 const ppt = new pptxgen(); ppt.defineLayout({name:'BUBBLE_WIDE',width:W/U,height:H/U}); ppt.layout='BUBBLE_WIDE';
 ppt.author='曾贤'; ppt.subject='部门人形机器人应用开发技术路线';ppt.title=title;ppt.company='';ppt.lang='zh-CN';
 ppt.theme={headFontFace:'SimSun',bodyFontFace:'SimSun',lang:'zh-CN'};
 const slide=ppt.addSlide();slide.background={color:'FFFFFF'};
 slide.addText(title,{x:55/U,y:27/U,w:1300/U,h:65/U,fontFace:'SimSun',fontSize:48*.6,bold:true,color:'17324D',margin:0,breakLine:false});
 slide.addImage({path:path.join(OUT,'../logo.png'),x:1465/U,y:35/U,w:78.5/U,h:49.5/U});
 slide.addShape(ppt.ShapeType.rect,{x:50/U,y:125/U,w:1500/U,h:730/U,fill:{color:'FFFFFF',transparency:100},line:{color:'BCD4EB',width:.6}});
 for(const e of edges) slide.addShape(ppt.ShapeType.line,{x:Math.min(e.x1,e.x2)/U,y:Math.min(e.y1,e.y2)/U,w:Math.abs(e.x2-e.x1)/U,h:Math.abs(e.y2-e.y1)/U,flipV:(e.x2-e.x1)*(e.y2-e.y1)<0,line:{color:e.color,transparency:55,width:e.width*.6,beginArrowType:'none',endArrowType:'none'}});
 for(const v of nodes) {
   slide.addShape(ppt.ShapeType.ellipse,{x:(v.x-v.d/2)/U,y:(v.y-v.d/2)/U,w:v.d/U,h:v.d/U,line:{color:v.color,transparency:100},fill:{color:v.color},objectName:v.id});
   const lines=v.label.split('\n').length,h=v.font*1.4*lines;
   slide.addText(v.label,{x:(v.x-v.d*.46)/U,y:(v.y-h/2)/U,w:v.d*.92/U,h:h/U,fontFace:'SimSun',fontSize:v.font*.6,bold:v.dark,color:v.dark?'FFFFFF':'243447',margin:0,align:'center',valign:'mid',breakLine:false,paraSpaceAfter:0,objectName:v.id+'-label'});
 }
 slide.addNotes(fs.readFileSync(path.join(OUT,'../PPT_content_气泡网络图.md'),'utf8')+'\n制作说明：直径为视觉层级，不代表量化能力。PPT 采用 SimSun；本机预览使用宋体风格回退字体。');
 await ppt.writeFile({fileName:path.join(OUT,'人形应用技术路线_气泡网络图.pptx')});
 console.log('Editable PPTX exported.');
}
if(process.argv.includes('--pptx')) makePpt().catch(e=>{console.error(e);process.exit(1)}); else makeHtml();
