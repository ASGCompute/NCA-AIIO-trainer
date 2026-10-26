# Render figures for review: python3 figs-src/shot.py out_dir id[:node] ...   (needs the local server on :8765)
import asyncio, sys
from playwright.async_api import async_playwright
out = sys.argv[1]; ids = sys.argv[2:]
HTML = """<!doctype html><meta charset=utf-8><link rel=stylesheet href="/style.css"><link rel=stylesheet href="/figs/view.css">
<body style="background:#050505;margin:0;padding:12px"><div class="figv-card iso" data-theme="light" style="width:%dpx"><div class="figv-stage" id="s"></div></div>
<script src="/figs/%s.js"></script><script>const d=FIGD['%s'];document.getElementById('s').innerHTML=d.svg;
const sel='%s';if(sel)document.querySelectorAll('.it[data-s="'+sel+'"]').forEach(n=>{n.querySelectorAll('.iso-solid').forEach(s=>s.setAttribute('data-lit',''));n.querySelectorAll('.iso-line[data-w],.iso-dots[data-w]').forEach(w=>w.setAttribute('data-tone','lit'))});</script>"""
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 900, 'height': 900}, device_scale_factor=1.5)
    for spec in ids:
      fid, _, node = spec.partition(':')
      await pg.goto('http://localhost:8765/figs/index.js'); await pg.set_content(HTML % (820, fid, fid, node)); await pg.wait_for_timeout(400)
      await pg.locator('.figv-card').screenshot(path=f"{out}/{fid}{'-'+node if node else ''}.png")
    await b.close()
asyncio.run(main())
