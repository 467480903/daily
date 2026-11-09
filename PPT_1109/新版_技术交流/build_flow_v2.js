const fs=require('fs'),path=require('path');
const Pptx=require('/home/wxf/.codex/skills/pptx/node_modules/pptxgenjs');
const sz=require('/home/wxf/.codex/skills/pptx/node_modules/image-size');
const D=__dirname,U=120;
const slides=JSON.parse(fs.readFileSync(path.join(D,'layout.json'),'utf8'));
const old=slides[1];
const C={blue:'2365A0',navy:'17324D',teal:'187D80',orange:'A76734',gray:'5A7186',pale:'F2F7FB',border:'BCD4EB'};
const nodes=[];
function shape(kind,x,y,w,h,fill,stroke=fill){nodes.push({type:'shape',shape:kind,x,y,w,h,fill,stroke});}
function text(str,x,y,w,size=28,color=C.navy,bold=false,align='center',h=50){nodes.push({type:'text',str,x,y,w,h:Math.max(h,size*1.6),size,color,bold,align,font:'SimSun'});}
function arrow(x1,y1,x2,y2,color=C.blue){const horizontal=y1===y2;shape(horizontal?(x2>x1?'rightArrow':'leftArrow'):(y2>y1?'downArrow':'upArrow'),Math.min(x1,x2)-(horizontal?0:13),Math.min(y1,y2)-(horizontal?13:0),horizontal?Math.abs(x2-x1):26,horizontal?26:Math.abs(y2-y1),color);}
function route(points,color){for(let i=1;i<points.length;i++){const [x1,y1]=points[i-1],[x2,y2]=points[i];if(i===points.length-1)arrow(x1,y1,x2,y2,color);else shape('rect',Math.min(x1,x2)-5,Math.min(y1,y2)-5,Math.max(10,Math.abs(x2-x1)+10),Math.max(10,Math.abs(y2-y1)+10),color);}}
function process(x,w,title,body,color=C.blue,dark=false){shape('roundRect',x,220,w,220,dark?color:'F2F7FB',dark?color:C.border);text(title,x+12,242,w-24,30,dark?'FFFFFF':color,true);body.forEach((v,i)=>text(v,x+12,308+i*37,w-24,23,dark?'E5EEF7':C.gray,false,'center',38));}
// Keep the title and original logo, replacing only the flow content.
nodes.push(...old.nodes.slice(0,2));
text('01',60,161,220,24,C.blue,true);text('02',335,161,230,24,C.blue,true);
text('SIM',620,161,240,24,C.blue,true);text('SIM2SIM',915,161,240,24,C.blue,true);text('SIM2REAL',1350,161,190,23,C.blue,true);
process(60,220,'舞蹈数据',['LAFAN1','d2s5 · d2s3','d1s2v3']);
process(335,230,'动作重定向',['X2骨架适配','生成参考轨迹']);
process(620,220,'仿真训练',['mjlab / Warp','PPO策略优化','Isaac Lab对照'],C.blue,true);
process(915,240,'仿真验证',['MuJoCo','接口与动作质量']);
process(1350,190,'真机部署',['X2原厂运控','完整播放回站']);
arrow(280,330,327,330);arrow(565,330,612,330);arrow(840,330,907,330);
text('ONNX',841,267,73,19,C.blue,true);
arrow(1155,330,1191,330);
shape('diamond',1195,270,120,120,'FFFFFF',C.blue);text('通过？',1211,306,88,23,C.blue,true,'center',42);
arrow(1315,330,1342,330);text('是',1314,275,36,21,C.teal,true);
// Separate the real-data loop from the failure branch.
route([[1445,440],[1445,642]],C.teal);text('REAL2SIM',1218,516,200,25,C.teal,true);
function lower(x,title,body){shape('roundRect',x,650,250,150,'EDF7F5',C.border);text(title,x+14,667,222,31,C.teal,true);text(body,x+14,730,222,25,C.gray);}
lower(1290,'真机数据采集','动作偏差回收');lower(940,'生成评估报告','仿真与真机对齐');lower(615,'调整训练参数','奖励与采样优化');
arrow(1290,725,1198,725,C.teal);arrow(940,725,873,725,C.teal);
route([[740,650],[740,448]],C.teal);text('重新训练',500,528,220,28,C.teal,true);
route([[1255,390],[1255,500],[1065,500],[1065,642]],C.orange);
text('否：问题回流',1030,444,210,24,C.orange,true);
shape('ellipse',80,652,18,18,C.blue);text('主流程：训练到部署',113,632,380,26,C.navy,false,'left');
shape('ellipse',80,715,18,18,C.teal);text('闭环：真机反馈返训',113,695,380,26,C.teal,false,'left');
shape('ellipse',80,778,18,18,C.orange);text('分支：验证未通过',113,758,380,26,C.orange,false,'left');
slides[1]={...old,nodes,notes:old.notes.replace('交互概览图采用ref交互引用、初始节点、判断节点与返训回路','流程图采用实心箭头、处理节点、明确判断与返训回路')+' 本次仅重绘技术路线页。连接采用有非零宽高的实心箭头及矩形折线段，避免部分预览器对零宽/零高线段的兼容问题；不是依赖线端箭头的细线连接。'};
const data=f=>'data:image/png;base64,'+fs.readFileSync(f).toString('base64');
function contain(o){const b=fs.readFileSync(o.file),d=typeof sz==='function'?sz(b):sz.imageSize(b),k=Math.min(o.w/d.width,o.h/d.height),w=d.width*k,h=d.height*k;return{x:(o.x+(o.w-w)/2)/U,y:(o.y+(o.h-h)/2)/U,w:w/U,h:h/U};}
async function main(){const p=new Pptx();p.defineLayout({name:'CUSTOM',width:1600/U,height:900/U});p.layout='CUSTOM';p.title='敏实人形机器人小脑端研发';p.author='曾贤';p.lang='zh-CN';p.theme={headFontFace:'SimSun',bodyFontFace:'SimSun',lang:'zh-CN'};
for(const a of slides){const sl=p.addSlide();sl.background={color:'FFFFFF'};for(const o of a.nodes){
 if(o.type==='shape')sl.addShape(p.ShapeType[o.shape],{x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U,fill:{color:o.fill},line:{color:o.stroke,width:.6},radius:.15});
 else if(o.type==='text')sl.addText(o.str,{x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U,fontFace:o.font,fontSize:o.size*.6,color:o.color,bold:o.bold,margin:0,align:o.align,valign:'mid',paraSpaceAfter:0,breakLine:false});
 else if(o.type==='image')sl.addImage({path:o.file,...contain(o)});
 else if(o.type==='video')sl.addMedia({type:'video',path:o.file,cover:data(o.poster),x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U});
 else throw new Error('Unexpected type '+o.type);
}sl.addNotes(a.notes);}
await p.writeFile({fileName:path.join(D,'敏实人形机器人小脑端研发_流程图改版.pptx')});fs.writeFileSync(path.join(D,'layout_流程图改版.json'),JSON.stringify(slides,null,2));console.log('Flow redesign exported.');}
main().catch(e=>{console.error(e);process.exit(1)});
