Last login: Tue Jul 28 23:19:41 on ttys003
adam@MacBook-Air-Adam project % curl http://localhost:4000/api/health
{"status":"ok","timestamp":"2026-07-28T18:21:49.325Z"}%                                                                 adam@MacBook-Air-Adam project % cd /Users/adam/soi.uz
nano soi-start.sh

























  UW PICO 5.09                                       File: soi-start.sh                                       Modified  

cd $PROJECT/project

if ! lsof -i :3456 >/dev/null
then
    nohup node dev-server.js \
    > /Users/adam/soi-front.log 2>&1 &
else
    echo "Frontend already running"
fi


echo ""
echo "✅ SOI.UZ started"
echo ""
echo "Frontend:"
echo "http://localhost:3456"
echo ""
echo "API:"
echo "http://localhost:4000/api"
echo ""
echo "Swagger:"
echo "http://localhost:4000/api/docs"Last login: Tue Jul 28 22:16:59 on ttys000   
adam@MacBook-Air-Adam ~ % nano ~/soi-start.sh



^G Get Help         ^O WriteOut         ^R Read File        ^Y Prev Pg          ^K Cut Text         ^C Cur Pos          
^X Exit             ^J Justify          ^W Where is         ^V Next Pg          ^U UnCut Text       ^T To Spell        
