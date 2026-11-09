const fs = require('fs');
const path = require('path');
const PptxGenJS = require('/home/wxf/.codex/skills/pptx/node_modules/pptxgenjs');
const DIR=__dirname, W=1600,H=900,U=120;
const C={navy:'17324D',blue:'2365A0',muted:'586F83',border:'BCD4EB',pale:'F3F8FC',teal:'177F86',green:'28775D',mint:'E8F4EE',amber:'9C691B',cream:'FBF5E8'};
const slides=[];
let s;
function rect(x,y,w,h,fill='FFFFFF',stroke=C.border,width=1){s.push({type:'rect',x,y,w,h,fill,stroke,width});}
function text(t,x,y,w,h,size=28,color=C.navy,bold=false,align='left'){
 const safeH=Math.max(h,size*1.55);
 s.push({type:'text',t,x,y:y-(safeH-h)/2,w,h:safeH,size,color,bold,align});
}
function line(x1,y1,x2,y2,color=C.border,width=2,arrow=false){s.push({type:'line',x1,y1,x2,y2,color,width,arrow});}
function badge(t,x,y,w,fill,color){rect(x,y,w,36,fill,fill);text(t,x,y,w,36,20,color,true,'center');}
function page(title){s=[];slides.push(s);text(title,55,32,1300,65,48,C.navy,true);s.push({type:'logo',x:1465,y:35,w:78.5,h:49.5});}
function step(x,num,name,tech,detail1,detail2,active=false){
 rect(x,258,256,252,active?'EAF3FB':'FFFFFF');
 text(num,x+20,276,50,30,22,C.muted);
 text(name,x+20,320,216,44,30,C.blue,true);
 text(tech,x+20,386,216,37,27,C.navy,true);
 text(detail1,x+20,437,216,30,23,C.muted);
 text(detail2,x+20,472,216,28,22,C.muted);
}
page('X2全身动作学习');
rect(50,140,1500,488);
text('数据到真机',80,163,600,43,32,C.navy,true);
badge('离线训练',80,218,120,C.pale,C.blue);
badge('NVIDIA GPU',700,218,196,C.pale,C.blue);
badge('本地执行',1280,218,120,C.mint,C.green);
step(80,'01','人体动作','BVH','骨架与坐标','人体动捕');
step(375,'02','动作重定向','GMR / IK','50 Hz参考','限位与过渡');
step(670,'03','GPU训练','mjlab','MuJoCo Warp','PPO / CUDA',true);
step(965,'04','导出与验证','ONNX','关节顺序重排','独立仿真验证');
step(1260,'05','原厂执行','X2 Ultra','本地策略推理','自动返回站立');
for(const x of [336,631,926,1221])line(x+6,370,x+32,370,C.blue,2.6,true);
line(1388,510,1388,565,C.teal,2);
line(1388,565,503,565,C.teal,2);
line(503,565,503,518,C.teal,2,true);
line(798,565,798,518,C.teal,2,true);
rect(830,546,305,39,'FFFFFF','FFFFFF');
text('关节与IMU回收',830,546,305,39,24,C.teal,true,'center');
text('数据迭代',400,583,190,28,21,C.muted,false,'center');
text('训练改进',704,583,190,28,21,C.muted,false,'center');
const ms=[{x:50,value:'151',unit:'维观测',detail:'参考＋状态反馈'},
 {x:560,value:'29',unit:'维动作',detail:'关节位置目标'},
 {x:1070,value:'50 Hz',unit:'策略频率',detail:'机器人本地闭环'}];
for(const m of ms){
 rect(m.x,662,480,178,C.pale);
 text(m.value,m.x+28,679,220,88,m.value==='50 Hz'?60:68,C.blue,true);
 text(m.unit,m.x+242,699,200,44,30,C.navy,true);
 text(m.detail,m.x+30,783,420,35,27,C.muted);
}

page('专项验证与基座演进');
rect(50,140,910,501);
text('实机验证结果',80,160,500,43,32,C.navy,true);
badge('吊绳保护',80,219,120,C.pale,C.blue);
badge('各执行一次',215,219,140,C.pale,C.blue);
badge('三支专项模型',370,219,170,C.mint,C.green);
const cols=[{x:80,w:142,t:'动作'},{x:222,w:142,t:'时长 / 秒'},{x:364,w:165,t:'最大倾角'},
 {x:529,w:221,t:'末帧计数'},{x:750,w:180,t:'结束状态'}];
rect(80,285,850,51,'EDF4FB','EDF4FB');
for(const c of cols)text(c.t,c.x,285,c.w,51,23,C.blue,true,'center');
const data=[['d2s5','47.98','25.03°','2398/2398','已回站'],['d2s3','48.00','27.78°','2398/2398','已回站'],['d1s2v','37.99','37.47°','1898/1898','已回站']];
data.forEach((row,i)=>{const y=342+i*73;for(let j=0;j<row.length;j++){const c=cols[j];text(row[j],c.x,y,c.w,60,j===3?23:26,j===4?C.green:C.navy,j===4,'center');}line(80,y+66,930,y+66,C.border,1);});
text('末帧核验',86,586,245,36,26,C.green,true,'center');
text('关节反馈',352,586,245,36,26,C.green,true,'center');
text('自动回站',618,586,245,36,26,C.green,true,'center');

rect(990,140,560,501);
text('能力演进',1020,160,470,43,32,C.navy,true);
const stages=[{y:229,title:'专项动作闭环',state:'已验证',fill:C.mint,color:C.green,desc:'三模型分别执行'},
 {y:365,title:'多动作运动基座',state:'在研',fill:'EAF3FB',color:C.blue,desc:'保旧技能 · 稳落地'},
 {y:501,title:'未见动作迁移',state:'待验证',fill:C.cream,color:C.amber,desc:'独立留出 · 再验收'}];
stages.forEach((v,i)=>{
 rect(1020,v.y,500,106,v.fill,v.fill);
 text(v.title,1040,v.y+11,310,39,29,C.navy,true);
 badge(v.state,1380,v.y+14,115,v.fill,v.color);
 text(v.desc,1040,v.y+61,440,32,24,C.muted);
 if(i<2)line(1270,v.y+109,1270,v.y+132,C.blue,1.7,true);
});

rect(50,681,1500,159);
text('合作议题',80,698,190,44,30,C.navy,true);
const topics=[{x:300,title:'GPU吞吐分析',detail:'样本与更新分测'},
 {x:705,title:'Isaac Lab对照',detail:'模型与执行校准'},
 {x:1110,title:'TensorRT评估',detail:'后续议题 · 未验收'}];
topics.forEach(t=>{text(t.title,t.x,707,360,42,28,C.blue,true);text(t.detail,t.x,768,360,32,24,C.muted);});

const notes=[
`依据：X2强化学习_技术架构_20261109.md 第1至12节，证据截至2026年11月9日。\n本页概括：人体BVH动作经骨架和坐标适配、GMR逆运动学重定向、重采样、平滑和首尾过渡，生成50Hz机器人参考动作。机器人动力学模型与参考共同进入mjlab / MuJoCo Warp环境，以RSL RL PPO、PyTorch/CUDA完成训练。NVIDIA Warp为GPU物理仿真组成部分。导出ONNX时固化归一化、关节映射及参考表；独立仿真和接口核验后，原厂运控在X2本地执行，关节与IMU记录用于下一轮数据和训练改进。\n151维观测由29参考位置+29参考速度+3重力投影+3角速度+29实际关节位置偏差+29关节速度+29上一动作组成。Actor输出29维动作，经默认姿态加0.25动作缩放转成关节位置目标，不是直接的电机力矩。50Hz是策略周期，不是底层总线或记录频率。Critic仅参与训练。训练机不逐周期远程控制机器人。\n当前主线并非Isaac Sim；Isaac Lab为独立对照工程。没有将TensorRT、GR00T或VLA计作本次动作策略的已实现组件。不同实验并行环境数不同，不声明统一加速倍数。`,
`依据：同名源文档第1、12至15节。2026年11月9日，在吊绳保护和现场急停准备就绪条件下，三支历史专项自训模型各执行一次：d2s5为47.98秒、最大倾角25.03度、末帧2398/2398；d2s3为48.00秒、27.78度、2398/2398；d1s2v为37.99秒、37.47度、1898/1898。三次均有真实关节运动记录并返回STAND_DEFAULT，未触发本次45度旁路阻尼条件。以上来自用户源文档，未在本次制作中重新审计原始日志。\n三个专项ONNX模型不等于统一多动作运动基座。多动作基座正在研究，主要问题包括旧技能保持、长时朝向、跳跃与落地质量。未宣称任意新舞零样本泛化、达到原厂全部观感或无吊绳长期稳定。当前研究候选若完整动作质量未达标，不作为已发布成果。\n合作议题：分解GPU物理推进、采样与PPO更新吞吐；基于既有Isaac Lab适配开展模型与执行对照；TensorRT为后续推理后端评估，需要先核验实际ONNX算子兼容、数值与最坏时延，本项目尚无部署验收证据。`
];
const esc=t=>t.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const logo=fs.readFileSync(path.join(DIR,'logo.png')).toString('base64');
function htmlElement(o,i){
 if(o.type==='rect')return `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" fill="#${o.fill}" stroke="#${o.stroke}" stroke-width="${o.width}"/>`;
 if(o.type==='line')return `<line x1="${o.x1}" y1="${o.y1}" x2="${o.x2}" y2="${o.y2}" stroke="#${o.color}" stroke-width="${o.width}" ${o.arrow?'marker-end="url(#arrow)"':''}/>`;
 if(o.type==='logo')return `<image x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" href="data:image/png;base64,${logo}"/>`;
 const x=o.align==='center'?o.x+o.w/2:o.x;
 return `<text data-i="${i}" data-box="${o.x},${o.y},${o.w},${o.h}" x="${x}" y="${o.y+o.h/2}" dominant-baseline="central" text-anchor="${o.align==='center'?'middle':'start'}" fill="#${o.color}" font-size="${o.size}" font-weight="${o.bold?'700':'400'}">${esc(o.t)}</text>`;
}
function html(){
 const pages=slides.map((slide,i)=>`<section class="slide" id="slide${i+1}"><svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="context-stroke"/></marker></defs><rect width="1600" height="900" fill="white"/>${slide.map(htmlElement).join('')}</svg></section>`).join('');
 fs.writeFileSync(path.join(DIR,'ppt.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>X2强化学习技术架构</title><link rel="icon" href="data:,"><style>*{box-sizing:border-box}body{margin:0;background:#e6ebef}section{width:1600px;height:900px;background:white;margin:0 0 24px}svg{font-family:SimSun,'Noto Serif CJK SC',serif;display:block}@media print{section{margin:0;page-break-after:always}}</style></head><body>${pages}</body></html>`);
 fs.writeFileSync(path.join(DIR,'layout.json'),JSON.stringify(slides,null,2));
 console.log('2-page HTML ready.');
}
async function pptx(){
 const p=new PptxGenJS();p.defineLayout({name:'CUSTOM',width:W/U,height:H/U});p.layout='CUSTOM';
 p.author='曾贤';p.title='X2强化学习：技术架构与专项验证';p.subject='科技公司技术交流';p.lang='zh-CN';p.theme={headFontFace:'SimSun',bodyFontFace:'SimSun',lang:'zh-CN'};
 slides.forEach((items,i)=>{const sl=p.addSlide();sl.background={color:'FFFFFF'};for(const o of items){
   if(o.type==='rect')sl.addShape(p.ShapeType.rect,{x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U,fill:{color:o.fill},line:{color:o.stroke,width:o.width*.6}});
   else if(o.type==='line')sl.addShape(p.ShapeType.line,{x:Math.min(o.x1,o.x2)/U,y:Math.min(o.y1,o.y2)/U,w:Math.abs(o.x2-o.x1)/U,h:Math.abs(o.y2-o.y1)/U,flipV:(o.x2-o.x1)*(o.y2-o.y1)<0,line:{color:o.color,width:o.width*.6,beginArrowType:o.arrow&&(o.x2<o.x1||o.y2<o.y1)?'triangle':'none',endArrowType:o.arrow&&!(o.x2<o.x1||o.y2<o.y1)?'triangle':'none'}});
   else if(o.type==='logo')sl.addImage({path:path.join(DIR,'logo.png'),x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U});
   else sl.addText(o.t,{x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U,fontFace:'SimSun',fontSize:o.size*.6,color:o.color,bold:o.bold,align:o.align,valign:'mid',margin:0,breakLine:false,paraSpaceAfter:0});
 }sl.addNotes(notes[i]);});
 await p.writeFile({fileName:path.join(DIR,'X2强化学习_技术架构与验证_2页.pptx')});console.log('2 editable slides exported.');
}
for(const [i,items] of slides.entries())for(const o of items){if(o.type!=='line'&&(o.x<0||o.y<0||o.x+o.w>W||o.y+o.h>H))throw new Error(`Slide ${i+1} bounds: ${JSON.stringify(o)}`);}
if(process.argv.includes('--pptx'))pptx().catch(e=>{console.error(e);process.exit(1)});else html();
