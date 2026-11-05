async (page) => {
  await page.waitForFunction(() => window.deckReady === true);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
  const layout = await page.evaluate(() => window.collectDeckLayout());
  const findings = [];
  const policy = await page.evaluate(() => ({
    footerCount:document.querySelectorAll('.footer,.subtitle,.pageno,.source').length,
    titles:[...document.querySelectorAll('.titlebox')].map(el=>({border:getComputedStyle(el).borderTopWidth,children:el.children.length})),
    visibleText:document.querySelector('#deck').innerText,
    colors:[...new Set([...document.querySelectorAll('[data-ppt="text"]')].map(el=>getComputedStyle(el).color))],
    groups:[...document.querySelectorAll('.panel')].map(el=>({imageBottom:el.querySelector('.pair').getBoundingClientRect().bottom,textTop:el.querySelector('.summary').getBoundingClientRect().top}))
  }));
  if(policy.footerCount) findings.push({kind:'unwanted_footer_or_subtitle'});
  if(policy.titles.some(t=>t.border!=='0px'||t.children!==1)) findings.push({kind:'title_frame_or_subtitle'});
  if(/AI|人工智能生成|牛角|0\.5m/.test(policy.visibleText)) findings.push({kind:'outdated_or_unwanted_text'});
  if(policy.colors.length<3) findings.push({kind:'insufficient_color_hierarchy'});
  if(policy.groups.some(g=>g.textTop<g.imageBottom)) findings.push({kind:'not_image_above_text'});
  for (let s = 0; s < layout.slides.length; s++) {
    const slide = layout.slides[s];
    for (const el of slide.items) {
      if (el.type === 'text') {
        if ([...el.text].length > 10) findings.push({slide:s+1,kind:'too_long',text:el.text});
        if (el.overflowX || el.overflowY) findings.push({slide:s+1,kind:'text_overflow',text:el.text});
      }
      if (el.x < -1 || el.y < -1 || el.x+el.w > 1601 || el.y+el.h > 901) findings.push({slide:s+1,kind:'outside_slide',id:el.id});
      if (el.type === 'image') {
        const i = parseInt(el.id.split('-').pop(),10);
        el.cropFile = `build/crops/${el.id}.png`;
        await page.locator(`#${slide.id} [data-ppt]`).nth(i).screenshot({path:el.cropFile});
      }
    }
    const texts = slide.items.filter(x=>x.type==='text');
    for (let a=0;a<texts.length;a++) for(let b=a+1;b<texts.length;b++) {
      const p=texts[a],q=texts[b];
      if(Math.min(p.x+p.w,q.x+q.w)-Math.max(p.x,q.x)>1 && Math.min(p.y+p.h,q.y+q.h)-Math.max(p.y,q.y)>1) findings.push({slide:s+1,kind:'text_overlap',texts:[p.text,q.text]});
    }
    await page.locator(`#${slide.id}`).screenshot({path:`output/playwright/slide-${s+1}.png`});
  }
  const downloadJson = async (object, path) => {
    const pending = page.waitForEvent('download');
    await page.evaluate(({object,name}) => {
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([JSON.stringify(object,null,2)],{type:'application/json'}));
      a.download=name;document.body.append(a);a.click();a.remove();
    }, {object,name:path.split('/').pop()});
    const download=await pending;
    await download.saveAs(path);
  };
  const report={slides:layout.slides.length,images:layout.slides.reduce((n,s)=>n+s.items.filter(x=>x.type==='image').length,0),colors:policy.colors,findings};
  await downloadJson(layout,'build/dom_layout.json');
  await downloadJson(report,'build/html_qa.json');
  await page.pdf({path:'build/HTML预览.pdf',width:'1600px',height:'900px',printBackground:true,preferCSSPageSize:true});
  console.log(JSON.stringify(report));
}
