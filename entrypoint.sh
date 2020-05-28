git clone https://github.com/iiglesiasg/elastic-pulumi.git && cd elastic-pulumi
npm install
helm init --client-only
PULUMI_ACCESS_TOKEN=pul-c0f5b1da538fe7b321598b9fc1e012546680e54c
echo $KUBECONFIG
/root/.pulumi/bin/pulumi login
#/root/.pulumi/bin/pulumi stack select elastic 
/root/.pulumi/bin/pulumi up -s elastic --skip-preview -y
tail -f /dev/null