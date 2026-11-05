"""Build the two-slide 2026-11-02 embodied-AI briefing from the supplied template.

The source markdown supplies the seven anatomy mappings and eight quarterly
scores.  Text, boxes, table cells and connectors remain editable in PowerPoint;
the two compact illustrations are generated locally by this script.
"""

from pathlib import Path
from tempfile import TemporaryDirectory
from math import sin, cos, pi

from PIL import Image, ImageDraw, ImageFont
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE
from pptx.util import Inches, Pt
from pptx.oxml.xmlchemy import OxmlElement
from pptx.oxml.ns import qn


ROOT = Path(__file__).resolve().parent
TEMPLATE = ROOT / "nvidia_minth2.pptx"
LOGO = ROOT / "logo.png"
OUTPUT = ROOT / "ppt_request-1102_具身推理技术与机遇风险.pptx"
TECH_OUTPUT = ROOT / "ppt_request-1102_具身推理技术与机遇风险_科技版.pptx"
NEURAL_IMAGE = ROOT / "ppt_assets/1102/neural_system_blue_white.png"

BLUE = RGBColor(23, 101, 173)
DARK = RGBColor(25, 42, 61)
MID = RGBColor(80, 96, 111)
PALE = RGBColor(225, 237, 248)
RED = RGBColor(207, 69, 66)
WHITE = RGBColor(255, 255, 255)


def explicit_font(paragraph, size, bold, color, family="Noto Sans CJK SC"):
    """Match the reference's explicit a:rPr, including East Asian font.

    Some PPT previewers ignore paragraph-only defRPr.  Every text run must
    therefore carry its own size, weight, color and latin/ea/cs font names.
    """
    paragraph.font.name = family
    paragraph.font.size = Pt(size)
    paragraph.space_before = Pt(0)
    paragraph.space_after = Pt(0)
    ppr = paragraph._p.get_or_add_pPr()
    ppr.set("marL", "0"); ppr.set("indent", "0")
    if ppr.find(qn("a:buNone")) is None:
        ppr.append(OxmlElement("a:buNone"))
    for run in paragraph.runs:
        run.font.name = family
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.color.rgb = color
        rpr = run._r.get_or_add_rPr()
        rpr.set("lang", "zh-CN")
        for script in ("latin", "ea", "cs"):
            tag = rpr.find(qn(f"a:{script}"))
            if tag is None:
                tag = OxmlElement(f"a:{script}"); rpr.append(tag)
            tag.set("typeface", family)
    end = paragraph._p.find(qn("a:endParaRPr"))
    if end is None:
        end = OxmlElement("a:endParaRPr"); paragraph._p.append(end)
    end.set("sz", str(round(size * 100)))
    end.set("lang", "zh-CN")


def rect(slide, x, y, w, h, fill=WHITE, line=None, width=0.8):
    sh = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    sh.fill.solid()
    sh.fill.fore_color.rgb = fill
    if line is None:
        sh.line.fill.background()
    else:
        sh.line.color.rgb = line
        sh.line.width = Pt(width)
    return sh


def txt(slide, text, x, y, w, h, size=10, bold=False, color=DARK,
        align=PP_ALIGN.LEFT, margin=0.02, valign=MSO_ANCHOR.MIDDLE):
    sh = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = sh.text_frame
    tf.clear()
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.TEXT_TO_FIT_SHAPE
    tf.margin_left = tf.margin_right = Inches(margin)
    tf.margin_top = tf.margin_bottom = Inches(0)
    tf.vertical_anchor = valign
    p = tf.paragraphs[0]
    p.alignment = align
    p.text = text
    explicit_font(p, size, bold, color)
    return sh


def line(slide, x1, y1, x2, y2, color=BLUE, width=0.8):
    sh = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    sh.line.color.rgb = color
    sh.line.width = Pt(width)
    return sh


def circle(slide, x, y, d, fill, text=None):
    sh = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x), Inches(y), Inches(d), Inches(d))
    sh.fill.solid(); sh.fill.fore_color.rgb = fill
    sh.line.color.rgb = WHITE; sh.line.width = Pt(1)
    if text:
        tf = sh.text_frame; tf.clear()
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER; p.text = str(text)
        explicit_font(p,7.5,True,WHITE)
    return sh


def clear_slide(slide):
    for sh in list(slide.shapes):
        el = sh._element
        el.getparent().remove(el)


def header(slide, number, title, subtitle, page):
    rect(slide, 0, 0, 10, 5.625)
    txt(slide, f"{number:02d}  {title}", .5, .19, 8.3, .44, 20.5, True, BLUE)
    txt(slide, subtitle, .5, .67, 6.8 if page==2 else 8.35, .30, 9.2, False, MID)
    # The supplied reference uses the same logo at 0.98 x 0.62 in.  Both
    # dimensions are scaled to exactly 60% as requested.
    slide.shapes.add_picture(str(LOGO), Inches(8.90), Inches(.22), Inches(.588), Inches(.372))
    line(slide, .5, 5.26, 9.5, 5.26, RGBColor(126,168,206), .65)
    footer="敏实｜具身智能技术应用 · AI生成概念插图" if page==1 else "敏实｜具身智能技术应用 · 需求稿情景判断"
    txt(slide, footer, .5, 5.33, 8.2, .18, 6.4, False, MID)
    txt(slide, f"{page}/2", 9.0, 5.33, .5, .18, 6.4, False, MID, PP_ALIGN.RIGHT)


def brain_image(path):
    S = 4
    im = Image.new("RGBA", (1350, 1380), (255, 255, 255, 0))
    d = ImageDraw.Draw(im)
    # Bright but restrained flat-vector cartoon; semi-transparent lobes show
    # approximate regions, not a medical anatomical diagram.
    d.ellipse((145, 140, 1040, 770), fill=(233, 244, 252), outline=(23, 101, 173), width=15)
    d.polygon([(170, 360), (285, 240), (460, 230), (485, 430), (345, 605), (200, 555)], fill=(108, 170, 216))
    d.polygon([(465, 205), (745, 145), (955, 280), (790, 435), (490, 435)], fill=(127, 198, 198))
    d.ellipse((655, 480, 1040, 755), fill=(247, 183, 141), outline=(23, 101, 173), width=8)
    d.ellipse((425, 455, 655, 615), fill=(215, 181, 222), outline=(23, 101, 173), width=7)
    d.ellipse((575, 535, 710, 650), fill=(249, 212, 119), outline=(23, 101, 173), width=6)
    # Cortical folds / synaptic network.
    for pts in [((270, 325), (355, 280), (415, 335)), ((310, 425), (400, 390), (455, 445)),
                ((540, 260), (625, 215), (710, 285)), ((760, 270), (845, 320), (910, 375)),
                ((560, 365), (625, 320), (705, 385))]:
        d.line(pts, fill=(60, 123, 176), width=8, joint="curve")
    for cx, cy in [(410, 325), (535, 250), (715, 280), (865, 390), (485, 500)]:
        d.ellipse((cx-10,cy-10,cx+10,cy+10),fill=(23,101,173))
    # Brainstem and vertebrae.
    d.rounded_rectangle((470, 685, 650, 1220), radius=65, fill=(215, 231, 244), outline=(23, 101, 173), width=12)
    for cy in range(770, 1180, 70):
        d.arc((480, cy-20, 640, cy+45), 5, 175, fill=(87, 149, 196), width=10)
    d.line([(260, 1070), (390, 1000), (530, 1020)], fill=(23, 101, 173), width=8)
    d.line([(630, 1020), (760, 1000), (870, 1070)], fill=(23, 101, 173), width=8)
    im.save(path)


def slide_one(slide, image_path):
    header(slide, 1, "人形机器人应用层技术组成介绍", "人脑功能类比｜七个推理、学习与运动控制模块", 1)
    # Preserve the reference's white canvas, restrained border and blue rails.
    rect(slide, .5, 1.25, 3.53, 3.87, WHITE, RGBColor(126,168,206), .65)
    slide.shapes.add_picture(str(image_path), Inches(.72), Inches(1.27),
                             width=Inches(3.05), height=Inches(3.8125))
    rows = [
        ("前额叶", "VLA / WAM", "场景理解与决策"),
        ("顶叶皮层", "末端力控", "高精度抓取"),
        ("海马体", "仿真推理", "仿真优化模型"),
        ("脊柱", "短程推理", "快速局部响应"),
        ("小脑", "全身控制 WBC", "全身动作协调"),
        ("突触网络", "模型训练", "训练动作技能"),
        ("丘脑", "数据治理", "清洗标注数据"),
    ]
    assert all(len(row[2]) <= 8 for row in rows)
    tx, tw, top, head_h, rh = 4.28, 5.22, 1.25, .38, .49
    widths = [1.38, 1.70, 2.14]
    for k,(label,w) in enumerate(zip(["神经结构", "机器人应用层", "功能描述"], widths)):
        x=tx+sum(widths[:k])
        txt(slide,label,x+.10,top,w-.14,head_h,8.5,True,MID)
    line(slide,tx,top+head_h,tx+tw,top+head_h,RGBColor(126,168,206),.65)
    for i,(organ,app,desc) in enumerate(rows):
        y=top+head_h+i*rh
        if i%2==0: rect(slide,tx,y+.035,tw,rh-.07,RGBColor(246,250,253))
        rect(slide,tx,y+.11,.028,rh-.22,BLUE)
        circle(slide,tx+.10,y+.15,.19,BLUE,str(i+1))
        txt(slide,organ,tx+.37,y+.04,widths[0]-.40,rh-.08,9.6,True,DARK)
        txt(slide,app,tx+widths[0]+.10,y+.04,widths[1]-.14,rh-.08,10.0,True,BLUE)
        txt(slide,desc,tx+sum(widths[:2])+.10,y+.04,widths[2]-.14,rh-.08,10.2,False,DARK)
    # Short local leaders and matching numbers replace long crossing wires.
    callouts=[(1, .66,1.96, 1.30,1.91), (2,3.59,1.59,2.64,1.62),
              (3, .66,2.62, 2.20,2.31), (4,3.59,4.12,2.51,4.12),
              (5,3.59,2.84,2.88,2.65), (6,.66,1.47,1.61,1.61),
              (7,3.59,2.18,2.24,2.08)]
    for n,mx,my,ax,ay in callouts:
        line(slide,mx+.105,my+.105,ax,ay,RGBColor(126,168,206),.55)
        circle(slide,ax-.025,ay-.025,.05,BLUE)
        circle(slide,mx,my,.21,BLUE,str(n))


def smooth_series(values, steps=100):
    """Shape-preserving cubic Hermite curve through the original data points."""
    slopes=[b-a for a,b in zip(values,values[1:])]
    tangents=[0.0]*len(values)
    for i in range(1,len(values)-1):
        a,b=slopes[i-1],slopes[i]
        tangents[i]=2*a*b/(a+b) if a*b>0 else 0.0
    for index,a,b in [(0,slopes[0],slopes[1]),(-1,slopes[-1],slopes[-2])]:
        m=(3*a-b)/2
        if m*a<=0: m=0.0
        elif a*b<0 and abs(m)>3*abs(a): m=3*a
        tangents[index]=m
    result=[]
    for i in range(len(values)-1):
        for j in range(steps):
            t=j/steps
            v=(2*t**3-3*t**2+1)*values[i]+(t**3-2*t**2+t)*tangents[i]
            v+=(-2*t**3+3*t**2)*values[i+1]+(t**3-t**2)*tangents[i+1]
            result.append((i+t,v))
    result.append((len(values)-1,float(values[-1])))
    return result


def chart_image(path):
    W,H=2000,650
    im=Image.new("RGB",(W,H),(255,255,255)); d=ImageDraw.Draw(im)
    font_path="/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
    tick_font=ImageFont.truetype(font_path,33)
    year_font=ImageFont.truetype(font_path,37)
    scores_o=[3,5,4,3,4,5,4,2]; scores_r=[2,1,1,2,1,0,3,5]
    left,right,top,bottom=110,1880,32,485
    X=lambda i:left+(right-left)*i/7
    Y=lambda v:bottom-(bottom-top)*v/6
    # Six numbered levels (1–6), with all numeric Y labels hidden.
    # Retain the original zero-valued observation at the unlabeled baseline.
    for v in range(1,7):
        yy=Y(v); d.line((left,yy,right,yy),fill=(228,236,243),width=3)
    opportunity=smooth_series(scores_o)
    risk=smooth_series(scores_r)
    for i in range(len(opportunity)-1):
        x0,o0=opportunity[i]; x1,o1=opportunity[i+1]
        r0=risk[i][1]; r1=risk[i+1][1]
        gap0=o0-r0; gap1=o1-r1
        if gap0*gap1<0:
            t=gap0/(gap0-gap1)
            cx=X(x0+(x1-x0)*t)
            cy=Y(o0+(o1-o0)*t)
            first=[(X(x0),Y(o0)),(cx,cy),(X(x0),Y(r0))]
            second=[(cx,cy),(X(x1),Y(o1)),(X(x1),Y(r1))]
            d.polygon(first,fill=(229,241,251) if gap0>0 else (251,231,230))
            d.polygon(second,fill=(229,241,251) if gap1>0 else (251,231,230))
        else:
            poly=[(X(x0),Y(o0)),(X(x1),Y(o1)),(X(x1),Y(r1)),(X(x0),Y(r0))]
            d.polygon(poly,fill=(229,241,251) if gap0>=0 else (251,231,230))
    d.line([(X(x),Y(v)) for x,v in opportunity],fill=(23,101,173),width=7,joint="curve")
    d.line([(X(x),Y(v)) for x,v in risk],fill=(207,69,66),width=7,joint="curve")
    for i in range(8):
        for vals,color in [(scores_o,(23,101,173)),(scores_r,(207,69,66))]:
            x,y=X(i),Y(vals[i]); d.ellipse((x-10,y-10,x+10,y+10),fill=color,outline=(255,255,255),width=3)
        label=["季度一","季度二","季度三","季度四"][i%4]
        d.text((X(i)-d.textlength(label,font=tick_font)/2,510),label,font=tick_font,fill=(60,75,89))
    d.line((left,bottom,right,bottom),fill=(80,96,111),width=4)
    d.line((left,top,left,bottom),fill=(80,96,111),width=4)
    d.text((X(1.5)-40,575),"2025",font=year_font,fill=(60,75,89))
    d.text((X(5.5)-40,575),"2026",font=year_font,fill=(60,75,89))
    im.save(path)


def slide_two(slide, chart_path):
    header(slide,2,"近两年的风险机遇变化","2025—2026｜机遇与风险之差，勾勒市场热度变化",2)
    line(slide,7.75,.81,7.98,.81,BLUE,1.6)
    txt(slide,"机遇",8.04,.70,.44,.22,8.0,False,BLUE)
    line(slide,8.70,.81,8.93,.81,RED,1.6)
    txt(slide,"风险",8.99,.70,.44,.22,8.0,False,RED)
    # One full-width time-series image, with concise editable judgments
    # floating above their respective quarters.
    labels=["政策降温","高校创业潮","VLA数采升温","创业泡沫破裂",
            "模型生态扩张","POC项目激增","泛化瓶颈显现","模型出口双压"]
    assert all(len(label)<=8 for label in labels)
    plot_x,plot_w=.5,9.0
    for i,label in enumerate(labels):
        cx=plot_x+plot_w*(110+(1880-110)*i/7)/2000
        bx=cx-.48
        txt(slide,label,bx-.01,1.40,.98,.32,8.8,True,RED if i==7 else BLUE,
            PP_ALIGN.CENTER)
        line(slide,cx,1.80,cx,1.98,RGBColor(126,168,206),.65)
        circle(slide,cx-.022,1.78,.044,BLUE)
    slide.shapes.add_picture(str(chart_path), Inches(plot_x), Inches(2.04),
                             width=Inches(plot_w), height=Inches(2.92))
    txt(slide,"蓝区：机遇领先   /   红区：风险领先",.64,5.01,8.7,.18,7.3,False,MID)


def main():
    prs=Presentation(TEMPLATE)
    while len(prs.slides)>2:
        sld_id=prs.slides._sldIdLst[-1]
        prs.part.drop_rel(sld_id.rId)
        prs.slides._sldIdLst.remove(sld_id)
    with TemporaryDirectory(prefix="ppt1102-") as td:
        brain=NEURAL_IMAGE; chart=Path(td)/"chart.png"
        if not brain.is_file():
            raise FileNotFoundError(f"Missing generated project illustration: {brain}")
        chart_image(chart)
        clear_slide(prs.slides[0]); clear_slide(prs.slides[1])
        slide_one(prs.slides[0],brain)
        slide_two(prs.slides[1],chart)
        prs.core_properties.title="机器人推理自动化与具身应用机遇风险"
        prs.core_properties.subject="依据 ppt_request-1102.md 的两页汇报"
        prs.save(OUTPUT)
        prs.save(TECH_OUTPUT)
    print(OUTPUT)
    print(TECH_OUTPUT)


if __name__=="__main__":
    main()
