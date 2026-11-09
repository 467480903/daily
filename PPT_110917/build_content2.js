const fs=require('fs'),path=require('path');
const Pptx=require('/home/wxf/.codex/skills/pptx/node_modules/pptxgenjs');
const DIR=__dirname,U=120,W=1600,H=900;
const outFlag=process.argv.indexOf('--out-dir');
const OUT=outFlag>=0?path.resolve(process.argv[outFlag+1]):DIR;
fs.mkdirSync(OUT,{recursive:true});
const C={navy:'17324D',blue:'2365A0',gray:'596F83',border:'BCD4EB',pale:'F2F7FB',teal:'187D80',mint:'EAF5F1',orange:'A76734',warm:'FCF2EB'};
let slides=[],s,notes=[];
function r(x,y,w,h,fill='FFFFFF',stroke=C.border){s.push({type:'rect',x,y,w,h,fill,stroke});}
function t(text,x,y,w,h,size=28,color=C.navy,bold=false,align='left'){const hh=Math.max(h,size*1.55);s.push({type:'text',text,x,y:y-(hh-h)/2,w,h:hh,size,color,bold,align});}
function l(x1,y1,x2,y2,color=C.blue,arrow=false){s.push({type:'line',x1,y1,x2,y2,color,arrow});}
function image(file,x,y,w,h,frame=true){if(frame)r(x,y,w,h);s.push({type:'image',file,x:x+1,y:y+1,w:w-2,h:h-2});}
function photo(id,x,y,w,h){image(path.join(DIR,'image/PPT_content2',id+'.png'),x,y,w,h);}
function page(title,note){s=[];slides.push(s);notes.push(note);t(title,55,32,1300,66,48,C.navy,true);image(path.join(DIR,'../logo.png'),1465,35,78.5,49.5,false);}
function callout(x,y,w,h,title,lines,color=C.blue,fill=C.pale){r(x,y,w,h,fill);t(title,x+28,y+18,w-56,48,31,color,true);lines.forEach((q,i)=>t(q,x+28,y+82+i*43,w-56,36,25,C.gray));}

page('跨工位泛化不足','源文档问题现象：固定位置采集500条数据，机器人在固定位置推理，夹取位置由人工放置，成功率约90%；前一工位抓取铝条后移动至推理工位，成功率约60%。两种条件不同；成功率为原文近似值，没有给出试验次数或统计区间。');
photo('1794219748728',50,145,960,695);
r(1040,145,510,328,C.pale);t('固定工位',1070,165,450,48,32,C.blue,true);t('约90%',1070,225,450,130,84,C.blue,true);t('手动摆料',1070,373,450,40,28);t('固定采集500条',1070,421,450,34,25,C.gray);
r(1040,503,510,337,C.warm);t('移动后推理',1070,523,450,48,32,C.orange,true);t('约60%',1070,583,450,130,84,C.orange,true);t('前站抓料',1070,731,450,38,28);t('移动至推理工位',1070,779,450,36,25,C.gray);

page('抓位与停靠偏差','源文档原因分析：机器人抓取位置不一致，底盘移动定位精度不足。现有验证中，底盘移动位置精度无法确定，不能据照片推导数值精度。两个照片分别为抓取工位与底盘停靠现场，并非严格前后对照。');
r(50,145,1000,695);
photo('1794219748728',70,170,560,420);t('抓取位置不一致',90,621,520,48,31,C.blue,true);t('抓位变化',90,687,500,40,27,C.gray);
photo('1794219775602',650,170,380,560);t('底盘停靠现场',660,761,360,45,29,C.blue,true,'center');
callout(1080,145,470,205,'抓位偏差',['铝条抓位不一致'],C.blue);
callout(1080,380,470,205,'停靠偏差',['移动精度待量化'],C.orange,C.warm);
callout(1080,615,470,225,'验证边界',['底盘精度未确定','单独调整增益有限'],C.teal,C.mint);

page('光照差异影响输入','源文档描述头部相机光照变化不太明显、手部相机差距较大。按画面视角将前两张近端夹爪图标为手部，将后两张工位整体图标为头部；只作画面对比，不推断具体拍摄时段。方案为上午和下午各采300条，夜间不采集。验证观察为数据集照片较明亮、图像质量高；未声称该条件覆盖所有光照。');
r(50,145,960,695);
const light=[['1794219797185',70,160,'手部｜较暗'],['1794219801025',540,160,'手部｜较亮'],['1794219806466',70,505,'头部｜画面一'],['1794219810121',540,505,'头部｜画面二']];
for(const [id,x,y,lab] of light){photo(id,x,y,440,280);t(lab,x,y+288,440,40,26,C.blue,true,'center');}
callout(1040,145,510,205,'手部差异更明显',['明暗变化较大'],C.orange,C.warm);
callout(1040,380,510,205,'头部差异较小',['保留原始画面'],C.blue);
callout(1040,615,510,225,'采集条件收敛',['优先明亮场景','夜间不采集'],C.teal,C.mint);

page('采集与纠偏方案','源文档解决方案：1.通过二维码纠偏尽量固定抓取位置；2.每采100条移动一次底盘，而非固定位置采500条；3.上午300条、下午300条，晚上不采；4.在500条数据中加入约20—30条纠偏数据，包含首次放错后纠正的过程。不同条数描述分别保留，未擅自将600条日间采集和500条纠偏试验合为同一数据集。二维码为原文称谓。');
r(50,145,880,710);photo('1794219875565',50,145,880,660);t('二维码辅助纠偏',70,808,840,42,28,C.blue,true,'center');
callout(960,145,590,150,'抓位纠偏',['二维码定位'],C.blue);
callout(960,315,590,150,'底盘变化',['每100条换位'],C.blue);
r(960,485,590,170,C.pale);t('日间采集',988,500,534,46,31,C.blue,true);t('上午300条',988,561,245,36,26);t('下午300条',1260,561,245,36,26);t('夜间不采集',988,609,510,34,24,C.gray);
callout(960,675,590,165,'加入纠偏',['总量500条','纠偏约20–30条'],C.teal,C.mint);

page('验证结果与局限','源文档验证效果：固定抓取位置后约70%；单独改变底盘位置变量对成功率帮助不大；光照条件与工装夹具共同改变后整体约80%；纠偏方案部分成功，但存在不可控预测情况，约75%。基线为移动后推理约60%。各条是不同条件下的记录，不能作为单变量因果或同组受控对照；原文未提供样本量。纠偏后抓料位置肉眼几乎一致，不等于量化精度。');
r(50,145,920,695);t('各条件约成功率',80,167,850,50,33,C.navy,true);
s.push({type:'chart',x:75,y:255,w:870,h:455,labels:['移动后基线','抓位固定','光照＋工装','纠偏方案'],values:[60,70,80,75]});
t('不同条件，非同组',85,754,830,44,28,C.gray,false,'center');
photo('1794219916975',1000,145,550,413);
r(1000,585,550,255,C.mint);t('抓位趋于一致',1030,603,490,48,32,C.teal,true);t('仅为肉眼观察',1030,670,490,40,27,C.gray);t('底盘增益有限',1030,726,490,40,27,C.gray);t('纠偏仍不稳定',1030,782,490,36,26,C.orange,true);

page('纠偏学习技术请教','源文档请教：模型官方介绍DAgger可提高推理泛化，但目前需要了解纠偏数据如何处理、标注和训练。此页仅归纳提问，不提供未经验证的DAgger方案或效果承诺。原始现象为模型有时放偏后自主纠正，有时持续纠偏不松手。补充的介入时机、片段保留、标签、松手信号、数据混合与退出条件均为将原问题细化的待讨论议题，不是项目已实现功能。');
r(50,145,1500,300);t('纠偏效果仍不稳定',80,165,850,48,33,C.navy,true);t('原数据缺少纠偏',1120,172,390,40,25,C.gray);
const flow=[{x:90,label:'放置偏差',fill:C.pale,color:C.blue},{x:440,label:'模型尝试纠偏',fill:C.pale,color:C.blue},{x:930,label:'自主纠正',fill:C.mint,color:C.teal},{x:930,label:'持续纠偏不松手',fill:C.warm,color:C.orange,y:340}];
flow.forEach(o=>{const yy=o.y||247;r(o.x,yy,o.x===930?500:300,70,o.fill);t(o.label,o.x+15,yy+10,o.x===930?470:270,50,29,o.color,true,'center');});
l(398,282,430,282,C.blue,true);l(740,282,845,282);l(845,282,920,282,C.teal,true);l(845,282,845,375);l(845,375,920,375,C.orange,true);
const qs=[{x:50,title:'如何处理？',a:'何时介入纠偏',b:'哪些片段保留'}, {x:560,title:'如何标注？',a:'纠偏动作标签',b:'成功与松手信号'}, {x:1070,title:'如何训练？',a:'数据如何混合',b:'如何学会退出'}];
for(const q of qs){r(q.x,485,480,355,C.pale);t(q.title,q.x+28,510,424,60,38,C.blue,true);t(q.a,q.x+28,604,424,45,30,C.navy);t(q.b,q.x+28,669,424,45,30,C.navy);t('DAgger交流议题',q.x+28,764,424,42,25,C.gray);}

const esc=x=>x.replaceAll('&','&amp;').replaceAll('<','&lt;');
const dataurl=f=>'data:image/png;base64,'+fs.readFileSync(f).toString('base64');
function contain(o){const b=fs.readFileSync(o.file),iw=b.readUInt32BE(16),ih=b.readUInt32BE(20),scale=Math.min(o.w/iw,o.h/ih),w=iw*scale,h=ih*scale;return {x:(o.x+(o.w-w)/2)/U,y:(o.y+(o.h-h)/2)/U,w:w/U,h:h/U};}
function svg(o){
 if(o.type==='rect')return `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" fill="#${o.fill}" stroke="#${o.stroke}"/>`;
 if(o.type==='line')return `<line x1="${o.x1}" y1="${o.y1}" x2="${o.x2}" y2="${o.y2}" stroke="#${o.color}" stroke-width="2" ${o.arrow?'marker-end="url(#arrow)"':''}/>`;
 if(o.type==='image')return `<image x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" href="${dataurl(o.file)}" preserveAspectRatio="xMidYMid meet"/>`;
 if(o.type==='chart'){
 let z='';const x=o.x+205,y=o.y+30,pw=o.w-285;
 for(let i=0;i<=5;i++){let xx=x+pw*i/5;z+=`<line x1="${xx}" y1="${y-10}" x2="${xx}" y2="${y+350}" stroke="#E2EBF2"/><text x="${xx}" y="${y+390}" font-size="22" fill="#596F83" text-anchor="middle">${i*20}%</text>`;}
 o.labels.forEach((a,i)=>{let yy=y+i*90;z+=`<text x="${x-22}" y="${yy+30}" font-size="27" fill="#17324D" text-anchor="end">${a}</text><rect x="${x}" y="${yy}" width="${pw*o.values[i]/100}" height="44" fill="#2365A0"/><text x="${x+pw*o.values[i]/100+12}" y="${yy+30}" font-size="28" fill="#2365A0">${o.values[i]}%</text>`;});return z;
 }
return `<text data-box="${o.x},${o.y},${o.w},${o.h}" x="${o.align==='center'?o.x+o.w/2:o.x}" y="${o.y+o.h/2}" font-size="${o.size}" fill="#${o.color}" font-weight="${o.bold?700:400}" text-anchor="${o.align==='center'?'middle':'start'}" dominant-baseline="central">${esc(o.text)}</text>`;
}
function html(){const pages=slides.map((a,i)=>`<section id="slide${i+1}"><svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="context-stroke"/></marker></defs><rect width="1600" height="900" fill="white"/>${a.map(svg).join('')}</svg></section>`).join('');
fs.writeFileSync(path.join(OUT,'ppt_content2.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><title>泛化问题与纠偏验证</title><link rel="icon" href="data:,"><style>body{margin:0;background:#e5eaf0}section{width:1600px;height:900px;margin-bottom:24px}svg{display:block;font-family:SimSun,'Noto Serif CJK SC',serif}</style></head><body>${pages}</body></html>`);fs.writeFileSync(path.join(OUT,'layout_content2.json'),JSON.stringify(slides,null,2));console.log('6-page HTML ready: '+OUT);}
async function ppt(){const p=new Pptx();p.defineLayout({name:'WIDE_CUSTOM',width:W/U,height:H/U});p.layout='WIDE_CUSTOM';p.author='曾贤';p.title='跨工位泛化问题与纠偏验证';p.lang='zh-CN';p.theme={headFontFace:'SimSun',bodyFontFace:'SimSun',lang:'zh-CN'};
for(const [i,a] of slides.entries()){const sl=p.addSlide();sl.background={color:'FFFFFF'};for(const o of a){
 if(o.type==='rect')sl.addShape(p.ShapeType.rect,{x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U,fill:{color:o.fill},line:{color:o.stroke,width:.6}});
 else if(o.type==='line')sl.addShape(p.ShapeType.line,{x:Math.min(o.x1,o.x2)/U,y:Math.min(o.y1,o.y2)/U,w:Math.abs(o.x2-o.x1)/U,h:Math.abs(o.y2-o.y1)/U,flipV:(o.x2-o.x1)*(o.y2-o.y1)<0,line:{color:o.color,width:1.2,endArrowType:o.arrow?'triangle':'none'}});
 else if(o.type==='image')sl.addImage({path:o.file,...contain(o)});
 else if(o.type==='chart')sl.addChart(p.ChartType.bar,[{name:'约成功率',labels:o.labels,values:o.values}],{x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U,barDir:'bar',catAxisLabelFontFace:'SimSun',catAxisLabelFontSize:16,catAxisLabelColor:C.navy,catAxisOrientation:'maxMin',valAxisLabelFontFace:'SimSun',valAxisLabelFontSize:12,valAxisLabelColor:C.gray,valAxisMinVal:0,valAxisMaxVal:100,valAxisMajorUnit:20,valAxisLabelFormatCode:'0"%"',showValue:true,dataLabelPosition:'outEnd',dataLabelFormatCode:'0"%"',dataLabelColor:C.blue,dataLabelBkgrdColor:'FFFFFF',dataLabelFormatCodeSourceLinked:false,dataLabelFontFace:'SimSun',dataLabelFontSize:16,showLegend:false,showTitle:false,showBorder:false,showCatName:false,chartColors:[C.blue],catGridLine:{style:'none'},valGridLine:{color:'E2EBF2',width:.5},gapSize:90,showMarker:false});
 else sl.addText(o.text,{x:o.x/U,y:o.y/U,w:o.w/U,h:o.h/U,fontFace:'SimSun',fontSize:o.size*.6,color:o.color,bold:o.bold,align:o.align,valign:'mid',margin:0,paraSpaceAfter:0,breakLine:false});
}sl.addNotes(notes[i]);}await p.writeFile({fileName:path.join(OUT,'泛化问题与纠偏验证_6页.pptx')});console.log('6 editable slides exported: '+OUT);}
for(const [i,a] of slides.entries())for(const o of a)if(o.type!=='line'&&(o.x<0||o.y<0||o.x+o.w>W||o.y+o.h>H))throw new Error('Bounds '+(i+1)+' '+JSON.stringify(o));
if(process.argv.includes('--pptx'))ppt().catch(e=>{console.error(e);process.exit(1)});else html();
