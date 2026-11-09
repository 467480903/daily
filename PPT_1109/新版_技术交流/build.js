const fs=require('fs'),path=require('path');
const Pptx=require('/home/wxf/.codex/skills/pptx/node_modules/pptxgenjs');
const sizeOf=require('/home/wxf/.codex/skills/pptx/node_modules/image-size');
const OUT=__dirname,MEDIA=path.join(OUT,'media'),W=1600,H=900,U=120;
const C={blue:'2365A0',navy:'17324D',gray:'5A7186',border:'BCD4EB',pale:'F2F7FB',teal:'187D80',mint:'EDF7F5',orange:'A76734'};
let slides=[],s;
function box(x,y,w,h,fill='FFFFFF',stroke=C.border,shape='rect'){s.nodes.push({type:'shape',shape,x,y,w,h,fill,stroke});}
function text(str,x,y,w,h=44,size=28,color=C.navy,bold=false,align='left',font='SimSun'){const hh=Math.max(h,size*1.6);s.nodes.push({type:'text',str,x,y:y-(hh-h)/2,w,h:hh,size,color,bold,align,font});}
function line(x1,y1,x2,y2,arrow=false,color=C.blue,dash=false){s.nodes.push({type:'line',x1,y1,x2,y2,arrow,color,dash});}
function poly(pts,arrow=true,color=C.blue,dash=false){for(let i=1;i<pts.length;i++)line(...pts[i-1],...pts[i],arrow&&i===pts.length-1,color,dash);}
function image(file,x,y,w,h,frame=true){if(frame)box(x,y,w,h);s.nodes.push({type:'image',file,x:x+1,y:y+1,w:w-2,h:h-2});}
function page(title,notes,cover=false){s={title,notes,nodes:[]};slides.push(s);if(!cover){text(title,60,30,1310,70,48,C.navy,true);image(path.join(OUT,'../logo.png'),1465,35,78.5,49.5,false);}}
function ref(x,y,title,lines,accent=C.blue){box(x,y,420,220,C.pale);box(x,y,62,30,'FFFFFF');text('ref',x+10,y+2,45,25,20,C.gray,false,'left','Calibri');text(title,x+28,y+42,364,52,34,accent,true);lines.forEach((v,i)=>text(v,x+28,y+105+i*35,364,32,24,C.gray));}
function callout(x,y,w,h,title,lines,accent=C.blue,fill=C.pale){box(x,y,w,h,fill);text(title,x+26,y+18,w-52,50,32,accent,true);lines.forEach((v,i)=>text(v,x+26,y+86+i*43,w-52,38,27,C.gray));}

page('敏实人形机器人小脑端研发','按内容要求，封面仅保留标题，不加Logo、页码或副标题。',true);
text('敏实人形机器人',140,310,1320,115,78,C.navy,true,'center');text('小脑端研发',140,445,1320,115,78,C.blue,true,'center');

page('小脑端技术路线','来源：PPT_CONTENT.md第一页、技术架构说明第2—5、10—12节。交互概览图采用ref交互引用、初始节点、判断节点与返训回路，展示工程逻辑，不宣称所有步骤已自动化。开源数据LAFAN1，动作名按内容要求为d2s5、d2s3、d1s2v3；技术说明第三支动作记录为d1s2v，版本对应待核。主训练路线为mjlab/MuJoCo Warp、PPO，导出ONNX。Isaac Lab（基于Isaac Sim）为独立对照，非当前三支演示的主训练来源。真机反馈回收用于离线分析、奖励和参数调整、再训练，不是在舞蹈执行期间在线更新。');
ref(60,190,'舞蹈数据',['LAFAN1','d2s5 / d2s3 / d1s2v3']);
ref(590,190,'X2动作重定向',['骨架与坐标适配','机器人参考轨迹']);
ref(1120,190,'仿真策略训练',['mjlab / MuJoCo Warp','PPO → ONNX','对照：Isaac Lab']);
text('SIM',1420,205,95,32,22,C.teal,true,'right','Calibri');
box(65,130,22,22,C.blue,C.blue,'ellipse');line(76,152,76,185,true);
line(480,300,582,300,true);line(1010,300,1112,300,true);
ref(1120,550,'独立仿真验证',['MuJoCo','接口与动作质量']);text('SIM2SIM',1370,565,145,30,21,C.teal,true,'right','Calibri');
ref(590,550,'X2真机部署',['原厂运控执行','完整播放回站']);text('SIM2REAL',840,565,145,30,21,C.teal,true,'right','Calibri');
ref(60,550,'真机反馈评估',['偏差采集与报告','奖励与参数调整'],C.teal);text('REAL2SIM',305,565,150,30,21,C.teal,true,'right','Calibri');
poly([[1540,300],[1570,300],[1570,660],[1547,660]]);
line(1120,660,1098,660,true);
box(1035,630,60,60,'FFFFFF',C.blue,'diamond');
line(1035,660,1018,660,true);text('通过',1020,590,100,32,21,C.teal,false,'center');
poly([[1065,690],[1065,820],[270,820],[270,778]],true,C.orange);text('未通过',1080,780,115,33,22,C.orange);
line(590,660,488,660,true);
poly([[270,550],[270,465],[1330,465],[1330,418]],true,C.teal);
box(640,444,320,42,'FFFFFF','FFFFFF');text('评估后调参重训',650,446,300,38,24,C.teal,true,'center');

page('逆运动学重定向','来源：技术架构说明第5、6、11节。把人体骨架位姿映射到X2关节与根部轨迹，需适配骨架比例、坐标单位、前臂零位、腕部链与限位。插图为X2外观参考的概念示意，不作为精确机械模型。示意优化目标为min_q Σ_i w_i^p ||p_i^robot(q)-p̃_i^human||² + Σ_i w_i^R d_R(R_i^robot(q),R̃_i^human)²。页面用Ep与ER简写位置与姿态误差，目标人体位姿已做尺度和姿态适配。IK是0→1关键门槛，但仅有运动学解不保证动态稳定，还需可执行性检查与强化学习训练。');
box(60,150,900,690);image(path.join(MEDIA,'X2_人体重定向.png'),75,165,870,580,false);
text('X2参考动作',95,768,370,44,30,C.blue,true,'center');text('人体动作输入',535,768,370,44,30,C.blue,true,'center');
callout(990,150,550,200,'打通0→1',['骨架与坐标对齐','零位与限位适配']);
box(990,375,550,285,'FFFFFF');text('位置与姿态优化',1015,390,500,48,32,C.blue,true);
text('q* = arg min [ Eₚ(q) + Eᵣ(q) ]',1018,453,490,45,29,C.navy,false,'center','Cambria Math');
text('Eₚ = Σᵢ wᵢ ‖pᵢ(q) − p̂ᵢ‖²',1018,514,490,43,28,C.navy,false,'center','Cambria Math');
text('Eᵣ = Σᵢ vᵢ d(Rᵢ(q), R̂ᵢ)²',1018,574,490,43,28,C.navy,false,'center','Cambria Math');
callout(990,685,550,155,'生成机器人参考',['动态稳定仍需训练'],C.teal,C.mint);

page('当前小脑端真机推理视频','来源：用户提供的DEMO1、DEMO2、DEMO3视频及技术架构说明第1、12—14节。视频保留完整文件时长和音轨，并压缩到每个1,000,000字节以内。视频编号与三支动作的对应未经确认，因此不在视频上标注d2s5等动作名。原文三支专项历史模型分别执行完成并返回STAND_DEFAULT；现场有吊绳与急停保护。视频长度不等于日志中的完整动作时长。三支专项策略并非同一个通用模型；多动作基座与新动作迁移仍在研究。放映模式点击视频播放，建议使用桌面PowerPoint。');
const vidW=319,vidH=567.11;
for(let i=1;i<=3;i++){
 const x=60+(i-1)*349;box(x,150,319,690);
 s.nodes.push({type:'video',file:path.join(MEDIA,`DEMO${i}_压缩.mp4`),poster:path.join(MEDIA,`DEMO${i}_poster.png`),x:x+1,y:165,w:vidW-2,h:vidH});
 text(['演示一','演示二','演示三'][i-1],x+20,756,279,48,30,C.blue,true,'center');
}
callout(1137,150,403,205,'专项模型自训',['三支舞蹈已执行','非通用单一模型']);
callout(1137,380,403,205,'真机闭环验证',['动作执行完整','结束自动回站']);
callout(1137,610,403,230,'下一阶段',['多动作运动基座','保持旧动作能力','改善朝向与落地'],C.teal,C.mint);

page('NVIDIA专家技术咨询','来源：技术架构说明第13—15、17节。以下全部为面向NVIDIA专家的咨询议题，不是已实现成果。1.如何对齐MuJoCo Warp与Isaac Lab的接触、执行器、积分步长和观测，构建可信Sim2Sim与Sim2Real校准？2.如何区分GPU物理推进、rollout与PPO更新瓶颈，降低达到指定动作质量的总时间？3.多动作微调如何保持旧技能，并控制长时朝向、跳跃和落地，如何设计独立未见动作验证？4.真实ONNX含Gather与参考表/常量输出，如何评估TensorRT兼容性、数值一致性与最坏时延？TensorRT尚未作为已部署能力。');
const cards=[
 {x:60,y:150,k:'01',title:'仿真如何对齐？',ls:['接触与执行器校准','MuJoCo ↔ Isaac Lab'],tag:'跨仿真一致性'},
 {x:815,y:150,k:'02',title:'训练如何提效？',ls:['物理与PPO瓶颈','同质量下缩短耗时'],tag:'GPU训练效率'},
 {x:60,y:505,k:'03',title:'旧技能如何保持？',ls:['多动作增量微调','朝向与落地约束'],tag:'运动基座泛化'},
 {x:815,y:505,k:'04',title:'部署如何优化？',ls:['ONNX算子兼容','数值与最坏时延'],tag:'TensorRT评估'}
];
for(const q of cards){box(q.x,q.y,725,320,C.pale);box(q.x+28,q.y+28,70,70,'FFFFFF',C.border,'ellipse');text(q.k,q.x+28,q.y+40,70,45,32,C.blue,true,'center','Calibri');text(q.title,q.x+125,q.y+34,560,60,36,C.blue,true);q.ls.forEach((v,i)=>text(v,q.x+125,q.y+125+i*50,560,43,28,C.navy));text(q.tag,q.x+125,q.y+253,550,38,25,C.teal,true);}

const esc=v=>v.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const data=f=>'data:image/png;base64,'+fs.readFileSync(f).toString('base64');
function svg(o){
 if(o.type==='shape'){
  const a=`fill="#${o.fill}" stroke="#${o.stroke}" stroke-width="1"`;
  if(o.shape==='ellipse')return `<ellipse cx="${o.x+o.w/2}" cy="${o.y+o.h/2}" rx="${o.w/2}" ry="${o.h/2}" ${a}/>`;
  if(o.shape==='diamond')return `<polygon points="${o.x+o.w/2},${o.y} ${o.x+o.w},${o.y+o.h/2} ${o.x+o.w/2},${o.y+o.h} ${o.x},${o.y+o.h/2}" ${a}/>`;
  return `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" ${a}/>`;
 }
 if(o.type==='text'){let xx=o.align==='center'?o.x+o.w/2:o.align==='right'?o.x+o.w:o.x;return `<text data-box="${o.x},${o.y},${o.w},${o.h}" x="${xx}" y="${o.y+o.h/2}" font-family="${o.font},Noto Serif CJK SC,serif" font-size="${o.size}" font-weight="${o.bold?700:400}" fill="#${o.color}" text-anchor="${o.align==='center'?'middle':o.align==='right'?'end':'start'}" dominant-baseline="central">${esc(o.str)}</text>`;}
 if(o.type==='line')return `<line x1="${o.x1}" y1="${o.y1}" x2="${o.x2}" y2="${o.y2}" stroke="#${o.color}" stroke-width="2" ${o.dash?'stroke-dasharray="6 4"':''} ${o.arrow?'marker-end="url(#arrow)"':''}/>`;
 if(o.type==='image')return `<image href="${data(o.file)}" x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" preserveAspectRatio="xMidYMid meet"/>`;
 if(o.type==='video')return `<foreignObject x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}"><video xmlns="http://www.w3.org/1999/xhtml" controls="controls" preload="metadata" poster="media/${path.basename(o.poster)}" src="media/${path.basename(o.file)}" style="width:100%;height:100%;object-fit:contain;background:white"></video></foreignObject>`;
}
function html(){fs.writeFileSync(path.join(OUT,'ppt.html'),`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>敏实人形机器人小脑端研发</title><link rel="icon" href="data:,"><style>body{margin:0;background:#e7edf3}section{width:1600px;height:900px;margin-bottom:24px;background:white}svg{display:block}</style></head><body>${slides.map((a,i)=>`<section id="slide${i+1}"><svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs>${a.nodes.map(svg).join('')}</svg></section>`).join('')}</body></html>`);fs.writeFileSync(path.join(OUT,'layout.json'),JSON.stringify(slides,null,2));console.log('HTML ready');}
function contain(o){const b=fs.readFileSync(o.file),dims=typeof sizeOf==='function'?sizeOf(b):sizeOf.imageSize(b);const k=Math.min(o.w/dims.width,o.h/dims.height),w=dims.width*k,h=dims.height*k;return{x:(o.x+(o.w-w)/2)/U,y:(o.y+(o.h-h)/2)/U,w:w/U,h:h/U};}
async function ppt(){const p=new Pptx();p.defineLayout({name:'CUSTOM',width:W/U,height:H/U});p.layout='CUSTOM';p.title='敏实人形机器人小脑端研发';p.author='曾贤';p.subject='技术路线、重定向、真机演示与NVIDIA技术交流';p.lang='zh-CN';p.theme={headFontFace:'SimSun',bodyFontFace:'SimSun',lang:'zh-CN'};
for(const a of slides){const sl=p.addSlide();sl.background={color:'FFFFFF'};for(const o of a.nodes){
 if(o.type==='shape')sl.addShape(p.ShapeType[o.shape],{x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U,fill:{color:o.fill},line:{color:o.stroke,width:.6}});
 else if(o.type==='text')sl.addText(o.str,{x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U,fontFace:o.font,fontSize:o.size*.6,color:o.color,bold:o.bold,margin:0,align:o.align,valign:'mid',paraSpaceAfter:0,breakLine:false});
 else if(o.type==='line')sl.addShape(p.ShapeType.line,{x:Math.min(o.x1,o.x2)/U,y:Math.min(o.y1,o.y2)/U,w:Math.abs(o.x2-o.x1)/U,h:Math.abs(o.y2-o.y1)/U,flipH:o.x2<o.x1,flipV:o.y2<o.y1,line:{color:o.color,width:1.2,endArrowType:o.arrow?'triangle':'none',dashType:o.dash?'dash':'solid'}});
 else if(o.type==='image')sl.addImage({path:o.file,...contain(o)});
 else if(o.type==='video')sl.addMedia({type:'video',path:o.file,cover:data(o.poster),x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U});
}sl.addNotes(a.notes);}await p.writeFile({fileName:path.join(OUT,'敏实人形机器人小脑端研发_5页.pptx')});console.log('PPT ready');}
for(const [i,a] of slides.entries())for(const o of a.nodes)if(o.type!=='line'&&(o.x<0||o.y<0||o.x+o.w>W||o.y+o.h>H))throw new Error('Out of slide '+i+JSON.stringify(o));
if(process.argv.includes('--pptx'))ppt().catch(e=>{console.error(e);process.exit(1)});else html();
