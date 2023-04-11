kill $(lsof -t -i:3000) &> /dev/null
echo "React server stopped."

kill $(lsof -t -i:8000) &> /dev/null
echo "Django server stopped."
