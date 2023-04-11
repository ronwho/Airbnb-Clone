# clear react port
kill $(lsof -t -i:3000) &> /dev/null
# clear django port
kill $(lsof -t -i:8000) &> /dev/null


cd frontend
npm start &

cd ../backend
python3 restify/manage.py runserver &

cd ..
