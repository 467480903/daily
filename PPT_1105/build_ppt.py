from pathlib import Path
from pptx import Presentation
from pptx.util import Inches

base = Path(__file__).resolve().parent
prs = Presentation()
prs.slide_width = Inches(13.333333)
prs.slide_height = Inches(7.5)
slide = prs.slides.add_slide(prs.slide_layouts[6])
slide.shapes.add_picture(str(base / 'preview.png'), 0, 0, width=prs.slide_width, height=prs.slide_height)
prs.save(base / '人形应用技术路线.pptx')
print(base / '人形应用技术路线.pptx')
