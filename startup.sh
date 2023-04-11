cd backend
sudo apt-get install python3 python3-pip
python3 -m venv ./venv
source ./venv/bin/activate
pip3 install -r restify/requirements.txt
python3 restify/manage.py migrate


cd ../frontend
npm install

cd ..
