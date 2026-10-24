// đọc kết quả balance (dòng "id:rar:win%") và cập nhật OP_TUNE trong src/3d-onepiece.js
const fs=require("fs"),path=require("path");const F=path.join(__dirname,"..","src","3d-onepiece.js");
const res=fs.readFileSync(process.argv[2],"utf8").split(/\s+/).filter(x=>x.split(":").length===3).map(x=>x.split(":"));
let src=fs.readFileSync(F,"utf8");const m=/\/\*TUNE\*\/([\s\S]*?)\/\*END\*\//.exec(src);const T=JSON.parse(m[1]);
for(const [id,,w] of res){const wv=Math.max(2,Math.min(98,+w)),f=Math.max(.75,Math.min(1.35,Math.pow(50/wv,.28)));const t=T[id]||[1,1,1];
  T[id]=[+(t[0]*f).toFixed(3),+(t[1]*Math.sqrt(f)).toFixed(3),+(t[2]/Math.sqrt(f)).toFixed(3)]}
src=src.replace(m[0],"/*TUNE*/"+JSON.stringify(T)+"/*END*/");fs.writeFileSync(F,src);console.log("tuned",res.length);
