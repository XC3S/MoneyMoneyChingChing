# Install Script

apt-get update

# Node
curl -sl https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install nodejs

#xvfb
apt-get install xvfb
apt-get install libgtk2.0-0
apt-get install libxtst6
apt-get install libxss1
apt-get install libgconf-2-4
apt-get install libnss3-dev
apt-get install libasound2

git clone xxx
cd xxx

npm install