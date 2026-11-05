"""Convert the Playwright-verified HTML geometry into editable PowerPoint.

Run inspect_html.js first.  This renderer uses the browser-measured element
positions, styles and isolated image viewports, rather than reflowing content.
"""
from pathlib import Path
import json
import re

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN, MSO_AUTO_SIZE
from pptx.oxml.xmlchemy import OxmlElement
from pptx.oxml.ns import qn

ROOT=Path(__file__).resolve().parent
PPI=120.0
OUT=ROOT/'工装夹具改造与推理落地.pptx'


def rgb(css):
    nums=re.findall(r'[\d.]+',css)
    return RGBColor(*(int(float(n)) for n in nums[:3]))


def add_text(slide,item):
    sh=slide.shapes.add_textbox(*(Inches(item[k]/PPI) for k in ['x','y','w','h']))
    sh.name=f"HTML {item['id']} {item['text']}"
    tf=sh.text_frame;tf.clear()
    tf.margin_left=tf.margin_right=tf.margin_top=tf.margin_bottom=0
    tf.word_wrap=False;tf.auto_size=MSO_AUTO_SIZE.NONE
    tf.vertical_anchor=MSO_ANCHOR.MIDDLE
    p=tf.paragraphs[0]
    p.alignment={'center':PP_ALIGN.CENTER,'right':PP_ALIGN.RIGHT}.get(item['align'],PP_ALIGN.LEFT)
    p.space_before=p.space_after=Pt(0)
    p.line_spacing=1.0
    run=p.add_run();run.text=item['text']
    size=item['fontSize']*72/PPI
    run.font.name='SimSun';run.font.size=Pt(size)
    run.font.bold=item['bold'];run.font.color.rgb=rgb(item['color'])
    rpr=run._r.get_or_add_rPr();rpr.set('lang','zh-CN')
    for script in ['latin','ea','cs']:
        node=rpr.find(qn('a:'+script))
        if node is None: node=OxmlElement('a:'+script);rpr.append(node)
        node.set('typeface','SimSun')
    end=OxmlElement('a:endParaRPr');end.set('sz',str(round(size*100)));end.set('lang','zh-CN');p._p.append(end)
    return sh


def add_box(slide,item):
    sh=slide.shapes.add_shape(MSO_SHAPE.RECTANGLE,*(Inches(item[k]/PPI) for k in ['x','y','w','h']))
    sh.name=f"HTML {item['id']} frame"
    if item['background']=='rgba(0, 0, 0, 0)': sh.fill.background()
    else: sh.fill.solid();sh.fill.fore_color.rgb=rgb(item['background'])
    sh.line.color.rgb=rgb(item['borderColor'])
    sh.line.width=Pt(max(1,item['borderWidth'])*72/PPI)
    # Do not inherit a default shape shadow from Office themes.
    style=sh._element.find(qn('p:style'))
    if style is not None: sh._element.remove(style)


def main():
    report=json.loads((ROOT/'build/html_qa.json').read_text())
    if report['findings']: raise RuntimeError('Resolve HTML QA findings before conversion')
    layout=json.loads((ROOT/'build/dom_layout.json').read_text())
    outline=json.loads((ROOT/'outline.json').read_text())
    prs=Presentation()
    prs.slide_width=Inches(layout['width']/PPI)
    prs.slide_height=Inches(layout['height']/PPI)
    for n,slide_layout in enumerate(layout['slides']):
        slide=prs.slides.add_slide(prs.slide_layouts[6])
        slide.background.fill.solid();slide.background.fill.fore_color.rgb=RGBColor(255,255,255)
        for item in slide_layout['items']:
            if item['type']=='box': add_box(slide,item)
            elif item['type']=='text': add_text(slide,item)
            elif item['type']=='image':
                pic=slide.shapes.add_picture(str(ROOT/item['cropFile']),*(Inches(item[k]/PPI) for k in ['x','y','w','h']))
                pic.name=f"HTML {item['id']} {item['image']}"
        info=outline['slides'][n]
        note=f"来源：PPT_content.md；按 PPT_skill.md 制作。HTML 实测布局转为可编辑文字与独立图片。\n{info['title']}\n"
        note+='\n'.join(s['title']+'：'+'；'.join(s['lines']) for s in info['sections'])
        if n==0: note+='\n±1 mm 至 ±40 mm 为原稿示例，不作为实测数据。照片为用户提供现场资料。'
        else: note+='\n本页为计划推进的光源与导向改造，效果目标待现场验证。导向槽根据本轮现场照片及手绘截面调整为加宽开口、加长两侧引导面。'
        slide.notes_slide.notes_text_frame.text=note
    prs.core_properties.title='工装夹具改造与推理落地'
    prs.core_properties.subject='三项已完成改造与两项推进方案'
    prs.core_properties.author=''
    prs.save(OUT)
    print(OUT)


if __name__=='__main__':main()
