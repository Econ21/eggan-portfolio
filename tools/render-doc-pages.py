"""Prepare original PDFs as local page previews for the reference-matched reader."""
from pathlib import Path
import fitz,json
root=Path(__file__).resolve().parent.parent
files={'cv':'eggan-nachson-silueta-cv.pdf','bachelor':'bachelor-certificate-transcript.pdf','masters':'masters-certificate-transcript.pdf','thesis-en':'master-thesis-english.pdf','thesis-id':'master-thesis-indonesian.pdf','certificates':'certificates-and-awards.pdf'}
manifest={}
for key,name in files.items():
 doc=fitz.open(root/'assets/credentials'/name);dest=root/'assets/credentials/pages'/key;dest.mkdir(parents=True,exist_ok=True)
 for i,page in enumerate(doc):
  # Preserve aspect and originals. 1100 px high is enough for the default reader; PDF remains downloadable.
  pix=page.get_pixmap(matrix=fitz.Matrix(1100/page.rect.height,1100/page.rect.height),alpha=False)
  pix.save(str(dest/f'{key}-{i+1:02d}.jpg'),jpg_quality=82)
 manifest[key]={'pages':len(doc),'file':name}
 print(key,len(doc),flush=True)
(root/'assets/credentials/document-pages.json').write_text(json.dumps(manifest,indent=2))
