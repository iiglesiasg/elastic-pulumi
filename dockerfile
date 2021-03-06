FROM ubuntu:18.04
LABEL maintainer="Inigo Iglesias <iiglesig@everis.com>"
LABEL description="Imagen base de Ubuntu con helm y pulumi"

USER root
WORKDIR /usr/multicloud/
RUN apt-get update &&\
    apt-get install -y --no-install-recommends apt-utils &&\
    apt-get install ca-certificates software-properties-common curl apt-transport-https lsb-release gnupg sudo build-essential coreutils -y;\
    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - &&\
    curl -sL https://deb.nodesource.com/setup_12.x | sudo bash - &&\
    echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list; \
    apt-get update && apt update;\
    apt-get install -y kubectl &&\
    apt install git unzip nodejs -y;\
    npm install -g npm-cli-login && curl -fsSL https://get.pulumi.com | sh && npm install grpc@1.24.2 &&\
    curl -L https://git.io/get_helm.sh | bash && mkdir /usr/multicloud/kube 
    
ENV KUBECONFIG=/usr/multicloud/kube/config    
COPY ["entrypoint.sh","/usr/multicloud"]
VOLUME ["/usr/multicloud/kube"]
ENTRYPOINT ["bash", "/usr/multicloud/entrypoint.sh"]
