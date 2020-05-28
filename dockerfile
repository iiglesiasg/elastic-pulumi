FROM ubuntu:18.04
MAINTAINER Inigo Iglesias<iiglesig@everis.com>
LABEL description="Imagen base de Ubuntu con helm y pulumi"

USER root
RUN apt-get update &&\
    apt-get install -y --no-install-recommends apt-utils &&\
    apt-get install ca-certificates software-properties-common curl apt-transport-https lsb-release gnupg sudo build-essential -y;\
    apt install kubectl unzip nodejs -y;\
    npm install -g npm-cli-login && curl -fsSL https://get.pulumi.com | sh && npm install grpc@1.24.2

ENTRYPOINT ["git clone https://github.com/iiglesiasg/elastic-pulumi.git && cd elastic-pulumi && pulumi login && pulumi up"]
