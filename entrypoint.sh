pwd
whoami
ls -lsa
git clone https://github.com/iiglesiasg/elastic-pulumi.git
cd elastic-pulumi
pwd
echo $PATH
export PULUMI_ACCESS_TOKEN=pul-c0f5b1da538fe7b321598b9fc1e012546680e54c
/root/.pulumi/bin/pulumi login
/root/.pulumi/bin/pulumi preview
tail -f /dev/null