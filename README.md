docker build -t iiglesias/multicloud-sandbox:0.1.0 .

docker run -v ${HOME}/.kube:/usr/multicloud/kube iiglesias/multicloud-sandbox:0.1.0
