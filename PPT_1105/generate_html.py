from pathlib import Path
from html import escape
P=Path(__file__).resolve().parent
out=[]
def add(v): out.append(v)
TREE_COLOR = '#287e74'
def twig(d,w=5,color=TREE_COLOR):
    add(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')
def leaf(cx,cy,w,h,lines,fill,edge,fs=17,rot=0):
    # asymmetric pointed leaf with a fine midrib and small lateral veins
    L=-w/2; R=w/2; T=-h/2; B=h/2
    path=f'M{L} 0 C{L+w*.18} {T*.88} {R-w*.17} {T*1.18} {R} 0 C{R-w*.14} {B*1.15} {L+w*.23} {B*.92} {L} 0Z'
    add(f'<g transform="translate({cx} {cy}) rotate({rot})" filter="url(#leafShadow)"><path d="{path}" fill="{fill}" stroke="{edge}" stroke-width="1.6"/>')
    add(f'<path d="M{L+10} 0 C{-w*.16} {-h*.06} {w*.12} {h*.04} {R-10} 0" fill="none" stroke="{edge}" stroke-width="1.2" opacity=".28"/>')
    add(f'<path d="M{-w*.18} {-h*.03} l{-w*.09} {-h*.23} M{w*.09} 0 l{w*.08} {-h*.23} M{-w*.06} 0 l{-w*.05} {h*.23} M{w*.22} {h*.02} l{w*.08} {h*.19}" stroke="{edge}" stroke-width="1" opacity=".2"/>')
    line_h=fs*1.25
    y0=-(len(lines)-1)*line_h/2+fs*.35
    for i,line in enumerate(lines):
        add(f'<text x="0" y="{y0+i*line_h:.1f}" text-anchor="middle" class="leafText" font-size="{fs}">{escape(line)}</text>')
    add('</g>')
def path_text(path_id,d,title,fs=18,offset='50%'):
    add(f'<defs><path id="{path_id}" d="{d}"/></defs><text fill="#fff" font-size="{fs}" font-weight="700" text-anchor="middle" dy="-6"><textPath href="#{path_id}" startOffset="{offset}">{escape(title)}</textPath></text>')
add('''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>人形应用技术路线</title><style>html,body{margin:0;width:100%;height:100%;background:#e8eef2}body{display:grid;place-items:center}.slide{width:1600px;height:900px;background:#fff;overflow:hidden;box-shadow:0 20px 60px #14304425}svg{display:block;width:100%;height:100%}text{font-family:"Noto Serif CJK SC","Songti SC","SimSun",serif}.title{font-size:43px;font-weight:700;fill:#123a5a}.leafText{font-weight:700;fill:#254863}.branchText{font-size:19px;font-weight:700;fill:#245475}.code{font-family:Arial,sans-serif;font-size:15px;font-weight:700;fill:#6d9ca8;letter-spacing:1px}.trunkText{font-size:24px;font-weight:700;fill:#fff}.micro{font-family:Arial,sans-serif;font-size:12px;fill:#7ea1b3;letter-spacing:2px}</style></head><body><div class="slide"><svg viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg"><defs>
<linearGradient id="rootFade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5fafb"/><stop offset="1" stop-color="#edf5f7"/></linearGradient>
<filter id="leafShadow" x="-30%" y="-65%" width="160%" height="230%"><feDropShadow dx="1" dy="5" stdDeviation="5" flood-color="#1e465a" flood-opacity=".13"/></filter>
<filter id="treeShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="#174e5a" flood-opacity=".15"/></filter>
<pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#eaf1f4" stroke-width=".8"/></pattern>
</defs><rect width="1600" height="900" fill="#fff"/><rect x="46" y="151" width="1508" height="703" fill="#fcfefe" stroke="#c7d9e2" stroke-width="1"/><rect x="47" y="152" width="1506" height="701" fill="url(#grid)" opacity=".45"/>
<rect x="54" y="47" width="6" height="64" fill="#216c82"/><text x="79" y="91" class="title">人形应用技术路线</text><image href="logo.png" x="1460" y="46" width="79" height="50"/>
<rect x="47" y="670" width="1506" height="183" fill="url(#rootFade)"/><path d="M77 670H1523" stroke="#a2c4ca" stroke-width="1.6"/>
<!-- continuous tapered tree structure -->
<g filter="url(#treeShadow)">
<path d="M740 670 C756 606 763 545 767 486 C770 444 775 407 785 381 C796 394 805 406 814 382 C830 421 829 451 833 488 C839 561 850 615 866 670Z" fill="#287e74"/>
<path d="M781 448 C697 390 642 362 568 335 C525 319 486 304 448 288 L437 300 C488 328 526 339 563 357 C636 390 690 420 767 473Z" fill="#287e74"/>
<path d="M771 499 C698 486 632 485 558 500 C511 509 466 519 421 527 L423 540 C477 534 521 527 565 518 C639 508 696 509 768 525Z" fill="#287e74"/>
<path d="M812 448 C886 390 958 355 1033 330 C1082 311 1120 294 1153 277 L1163 289 C1123 315 1083 335 1037 351 C963 382 897 421 827 474Z" fill="#287e74"/>
<path d="M830 499 C904 490 971 502 1042 523 C1090 536 1135 548 1183 557 L1179 571 C1126 562 1082 549 1038 537 C967 520 903 516 829 526Z" fill="#287e74"/>
<!-- fine branches: brain -->''')
twig('M493 314 C420 270 310 236 200 235',6)
twig('M468 303 C465 267 458 235 445 218',5)
twig('M484 328 C388 352 290 367 190 355',6)
twig('M506 338 C480 344 452 349 425 345',5)
twig('M537 324 C592 292 627 263 650 228',5)
# hardware
twig('M460 531 C376 492 286 470 190 465',6)
twig('M463 532 C452 509 439 491 425 480',5)
twig('M457 538 C379 574 281 598 180 595',6)
twig('M469 537 C449 569 424 594 400 602',5)
# scene
twig('M1096 306 C1136 276 1164 248 1180 225',6)
twig('M1090 318 C1202 308 1320 318 1425 320',6)
twig('M1092 339 C1146 376 1184 398 1220 410',6)
# cerebellum
twig('M1120 545 C1151 525 1181 514 1210 510',6)
twig('M1129 550 C1233 548 1333 552 1425 553',5)
twig('M1113 557 C1176 590 1231 619 1275 627',5)
add('</g>')
# Thick, tapering root silhouettes form a continuous system with the trunk.
add('<g fill="#287e74">')
add('<path d="M740 668 C753 693 772 716 788 743 L814 743 C832 715 852 692 866 668Z"/>')
add('<path d="M783 674 C735 698 678 724 603 739 C474 767 348 772 190 806 C342 789 483 797 615 774 C702 759 766 725 805 695Z"/>')
add('<path d="M789 683 C785 732 741 779 574 837 C701 811 779 783 810 737 C823 717 824 696 822 680Z"/>')
add('<path d="M801 683 C819 738 868 793 1043 839 C913 828 831 804 794 749 C783 714 780 697 780 681Z"/>')
add('<path d="M815 674 C875 701 932 723 1001 741 C1111 769 1248 779 1421 810 C1253 798 1116 803 992 777 C914 759 848 731 795 696Z"/>')
add('<path d="M469 774 C427 795 389 815 344 835 C397 821 445 805 491 786Z"/>')
add('<path d="M708 796 C684 819 665 835 643 848 C679 838 702 821 727 804Z"/>')
add('<path d="M937 804 C951 825 970 840 991 848 C970 827 964 817 957 808Z"/>')
add('<path d="M1177 779 C1225 805 1265 826 1314 842 C1274 813 1241 795 1209 784Z"/>')
add('</g>')
# White lettering follows the actual branch direction, without cards or boxes.
path_text('brain-label','M530 350 C620 383 698 427 754 463','大脑端探索',18,'52%')
path_text('body-label','M480 540 C580 515 683 510 755 527','本体使用',18,'52%')
path_text('scene-label','M842 463 C925 410 1001 369 1081 337','场景项目',18,'50%')
path_text('control-label','M860 522 C958 522 1050 546 1140 568','小脑探索',18,'50%')
add('<text text-anchor="middle" class="trunkText"><tspan x="801" y="531">人</tspan><tspan x="801" y="559">形</tspan><tspan x="801" y="587">应</tspan><tspan x="801" y="615">用</tspan></text>')
# Larger, fuller leaves fill the canopy while retaining the requested size order.
leaf(200,235,226,115,['π0 / π0.5'],'#f2d4b5','#c99766',20,-7)
leaf(445,218,210,106,['GROOT N1.7'],'#f0dca9','#c4a35e',19,4)
leaf(190,355,205,103,['LingBot 2'],'#f1cbc0','#cb9689',19,-4)
leaf(425,345,190,94,['ACT / DP'],'#f1dabc','#c2a276',18,5)
leaf(650,228,174,86,['Genine SIM','仿真'],'#f0debd','#c5a574',17,-6)
# Shared Agibot green; RPO uses a distinct green.
leaf(190,465,210,100,['智元 G2'],'#c5e5ce','#7daa8d',19,-7)
leaf(425,480,190,94,['智元 X2'],'#c5e5ce','#7daa8d',19,5)
leaf(180,595,180,88,['智元 A3'],'#c5e5ce','#7daa8d',18,-4)
leaf(400,602,155,80,['RPO'],'#d2e2bc','#93ad7c',18,8)
# Industrial scenes.
leaf(1180,225,240,102,['轻长扁金属上下料'],'#cce4ed','#7faab9',18,6)
leaf(1425,320,220,100,['轻长宽塑料上下料'],'#cce4ed','#7faab9',17,-4)
leaf(1220,410,220,94,['轻小扁塑料装配'],'#d1e7ee','#88b0bf',18,5)
# Cerebellum exploration.
leaf(1210,510,210,98,['X2/A3 舞蹈'],'#d4dbed','#97a8c6',18,-5)
leaf(1425,553,170,82,['Isaac'],'#d8dfee','#9eacc8',18,5)
leaf(1275,627,180,84,['MuJoCo'],'#d8dfee','#9eacc8',18,-7)
# Data names sit directly on thick roots; no leaf shapes below ground.
add('<text x="800" y="704" fill="#fff" font-size="21" font-weight="700" text-anchor="middle">数据</text>')
for cx,cy,angle,title,fs in [(435,779,-2,'数采平台',19),(704,792,-28,'LeRobot',18),(908,799,27,'FineDance',18),(1204,792,5,'1.3TB / 2.4万条',18)]:
    add(f'<text transform="translate({cx} {cy}) rotate({angle})" x="0" y="6" fill="#fff" font-size="{fs}" font-weight="700" text-anchor="middle">{escape(title)}</text>')
add('</svg></div></body></html>')
(P/'ppt.html').write_text(''.join(out),encoding='utf-8')
print(P/'ppt.html')
