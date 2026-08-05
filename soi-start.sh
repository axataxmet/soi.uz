Last login: Tue Jul 28 22:16:59 on ttys000
adam@MacBook-Air-Adam ~ % nano ~/soi-start.sh




























  UW PICO 5.09                                 File: /Users/adam/soi-start.sh                                 Modified  

#!/bin/zsh

echo "🚀 Запуск SOI.UZ..."

brew services start postgresql@17

cd /Users/adam/soi.uz/server
npm run start:dev > /tmp/soi-backend.log 2>&1 &

cd /Users/adam/soi.uz/project
node dev-server.js > /tmp/soi-frontend.log 2>&1 &

sleep 5

open http://127.0.0.1:3456

echo "✅ SOI.UZ запущен"
echo "Frontend: http://127.0.0.1:3456"
echo "Backend: http://localhost:4000/api"







^G Get Help         ^O WriteOut         ^R Read File        ^Y Prev Pg          ^K Cut Text         ^C Cur Pos          
^X Exit             ^J Justify          ^W Where is         ^V Next Pg          ^U UnCut Text       ^T To Spell        
