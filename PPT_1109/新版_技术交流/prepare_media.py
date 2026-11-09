from pathlib import Path
import subprocess, json

OUT=Path(__file__).resolve().parent
SRC=OUT.parent
MEDIA=OUT/'media'
MEDIA.mkdir(exist_ok=True)
records=[]
for n in range(1,4):
    source=SRC/f'DEMO{n}.mp4'
    meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(source)]))
    duration=float(meta['format']['duration'])
    # Reserve container overhead, keep original duration and a low-bitrate audio track.
    bitrate=int(880000*8/duration/1000)-24
    dest=MEDIA/f'DEMO{n}_压缩.mp4'
    log=str(MEDIA/f'encode{n}')
    common=['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(source),'-map','0:v:0','-vf','scale=270:480,fps=20','-c:v','libx264','-preset','slow','-b:v',f'{bitrate}k','-pix_fmt','yuv420p','-passlogfile',log]
    subprocess.run(common+['-pass','1','-an','-f','null','/dev/null'],check=True)
    subprocess.run(common+['-map','0:a:0?','-pass','2','-c:a','aac','-b:a','24k','-ac','1','-movflags','+faststart',str(dest)],check=True)
    assert dest.stat().st_size<1000000,(dest,dest.stat().st_size)
    subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-ss','5','-i',str(source),'-frames:v','1',str(MEDIA/f'DEMO{n}_poster.png')],check=True)
    records.append({'source':source.name,'output':dest.name,'duration_seconds':duration,'bytes':dest.stat().st_size,'video_kbps':bitrate,'audio_kbps':24})
(OUT/'视频压缩记录.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
print(json.dumps(records,ensure_ascii=False,indent=2))
