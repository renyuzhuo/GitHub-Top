echo "Begin"
git pull
echo "Git Pull Finish"
node daily.js -> daily.json
echo "Finish Daily"
node month.js -> monthly.json
echo "Finish Month"
node week.js -> weekly.json
echo "Finish Week"
git add .
git commit -m "[feat]Update Json"
git push origin master
echo "End"
