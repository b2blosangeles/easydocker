# easydocker

1. install docker and git

apt update \\
&&  apt install sudo \
&& apt install -y apt-transport-https ca-certificates curl software-properties-common \
&& curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - \
&& add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable" \
&& apt-cache policy docker-ce \
&& apt install -y docker-ce \
&& apt-get -y install git

2. setup easydocker

rm -fr /var/easydocker \
&&  mkdir -p /var/easydocker \
&&  cd /var/easydocker \
&& git clone https://github.com/b2blosangeles/easydocker.git .
