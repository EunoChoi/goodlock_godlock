free -m
sudo dd if=/dev/zero of=/mnt/swapfile bs=128M count=16
sudo mkswap /mnt/swapfile
sudo swapon /mnt/swapfile
free -m

node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))'
export NODE_OPTIONS=--max_old_space_size=2048
node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))'

sudo rm /etc/localtime
sudo ln -s /usr/share/zoneinfo/Asia/Seoul /etc/localtime
date

