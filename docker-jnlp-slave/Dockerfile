FROM alicorpacr.azurecr.io/alicorp-agent:adopt-jdk8-j9
MAINTAINER Oleg Nenashev <o.v.nenashev@gmail.com>
LABEL Description="This is a base image, which allows connecting Jenkins agents via JNLP protocols" Vendor="Jenkins project" Version="3.35-2"

ARG user=root

USER root
COPY jenkins-agent /usr/local/bin/jenkins-agent 
RUN chmod +x /usr/local/bin/jenkins-agent &&\
    ln -s /usr/local/bin/jenkins-agent /usr/local/bin/jenkins-slave &&\
    apt-get update &&\
    apt-get install -y --no-install-recommends apt-utils &&\
    apt-get install ca-certificates software-properties-common curl apt-transport-https lsb-release gnupg sudo build-essential -y; \
    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - && \
    curl -sL https://deb.nodesource.com/setup_12.x | sudo bash - &&\
    echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list &&\
    curl -sL https://packages.microsoft.com/keys/microsoft.asc | \
    gpg --dearmor | tee /etc/apt/trusted.gpg.d/microsoft.asc.gpg > /dev/null &&\
    AZ_REPO=$(lsb_release -cs) && echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $AZ_REPO main" | tee /etc/apt/sources.list.d/azure-cli.list &&\
    echo "deb http://ppa.launchpad.net/ansible/ansible/ubuntu trusty main" >> /etc/apt/sources.list; \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 93C4A3FD7BB9C367 &&\
    apt-get update; \
    apt install ansible kubectl azure-cli unzip nodejs -y; \
    npm install -g npm-cli-login && curl -fsSL https://get.pulumi.com | sh && npm install grpc@1.21.1; \
    export PATH=$PATH:/root/.pulumi/bin
USER ${user}

ENTRYPOINT ["jenkins-agent"]
