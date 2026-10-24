import pathlib
s=pathlib.Path('src')
head=(s/'1-head.html').read_text(encoding='utf-8');body=(s/'2-body.html').read_text(encoding='utf-8')
js=''.join((s/f).read_text(encoding='utf-8') for f in ['3-data.js','3b-icons.js','3c-skins.js','4-engine.js','4b-fx.js','5-ui.js','6-arenas.js','7-modes.js','8-merge.js','9-boxes.js','10-admin.js','11-ceremony.js','12-net.js','13-tour.js','14-ffa.js'])
page=head+body+'\n<script>\n'+js+'\n</script>\n'
pathlib.Path('orb-clash.html').write_text(page,encoding='utf-8')
pathlib.Path('OrbClash-offline.html').write_text('<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+head+'\n</head>\n<body>\n'+body+'\n<script>\n'+js+'\n</script>\n</body>\n</html>\n',encoding='utf-8')
pathlib.Path('all.js').write_text(js,encoding='utf-8')
print(len(page))
