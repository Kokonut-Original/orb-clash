IDS=$(node -e "const c=require('./engine').createContext();console.log(c.info().balls.filter(b=>b.id.match(/./)).slice(126).map(b=>b.id).join(','))")
for r in 2 3 4; do QUIET=1 node balance.js 60 $IDS > ../balop$r.txt 2>&1; node optune.js ../balop$r.txt; done
echo DONE > ../tune_done.txt
