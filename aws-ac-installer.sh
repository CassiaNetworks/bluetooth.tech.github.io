version=1.12.10.58
sudo su
yum install -y docker
service docker start
docker pull cassia/updater
curl -sL http://www.bluetooth.tech/acDeploy.sh | bash

docker exec ac wget http://www.bluetooth.tech/Cassia-AC-v${version}.zip
sleep 3
docker exec ac node /opt/cassia-ac/updater/ac_updater /opt/cassia-ac/Cassia-AC-v${version}.zip
docker restart ac
