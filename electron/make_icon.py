from PIL import Image, ImageDraw, ImageFilter
S=512
img=Image.new("RGBA",(S,S),(11,8,20,255))
d=ImageDraw.Draw(img)
def orb(cx,cy,r,col):
    g=Image.new("RGBA",(S,S),(0,0,0,0));gd=ImageDraw.Draw(g)
    gd.ellipse((cx-r*1.5,cy-r*1.5,cx+r*1.5,cy+r*1.5),fill=col+(90,));g=g.filter(ImageFilter.GaussianBlur(r*.35));img.alpha_composite(g)
    o=ImageDraw.Draw(img)
    for i in range(r,0,-2):
        k=i/r;c=tuple(int(col[j]*(.45+.55*(1-k))+255*max(0,(1-k)-.6)*1.2) for j in range(3))
        o.ellipse((cx-i-(r-i)*.25,cy-i-(r-i)*.3,cx+i-(r-i)*.25,cy+i-(r-i)*.3),fill=min(c[0],255),) if False else o.ellipse((cx-i+(r-i)*-.3,cy-i+(r-i)*-.35,cx+i+(r-i)*-.3,cy+i+(r-i)*-.35),fill=tuple(min(255,v) for v in c)+(255,))
orb(175,180,120,(54,226,255))
orb(340,335,140,(255,77,122))
img.convert("RGBA").save("build/icon.png")
img.resize((256,256),Image.LANCZOS).save("build/icon.ico",sizes=[(256,256),(128,128),(64,64),(48,48),(32,32),(16,16)])
