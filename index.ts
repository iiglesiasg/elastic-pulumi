import * as k8s from "@pulumi/kubernetes";
import * as kx from "@pulumi/kubernetesx";


/*const appLabels = { app: "nginx" };
const deployment = new k8s.apps.v1.Deployment("nginx", {
    spec: {
        selector: { matchLabels: appLabels },
        replicas: 1,
        template: {
            metadata: { labels: appLabels },
            spec: { containers: [{ name: "nginx", image: "nginx" }] }
        }
    }
});
*/
export const Operatoryamlelk = new k8s.yaml.ConfigFile("Operator", {
    file: "https://download.elastic.co/downloads/eck/1.1.1/all-in-one.yaml"
});

export const certManagerCRD = new k8s.yaml.ConfigFile("certmanagercrd", {
    file: "https://github.com/jetstack/cert-manager/releases/download/v0.15.0/cert-manager.crds.yaml"             
});

export const clusterIssuers = new k8s.yaml.ConfigGroup("clusterIssuers", {
    files: ["cluster-issuer-prod.yaml",
            "cluster-issuer-sef-signed.yaml"]   
},{dependsOn: certManagerCRD});

const namespace = new k8s.core.v1.Namespace("cert-manager",
    {
        metadata: {
            name: "cert-manager",
            labels: {"certmanager.k8s.io/disable-validation": "true" }
            }
        
    },  {  dependsOn: certManagerCRD }
);

const certmanagerchart = new k8s.helm.v3.Chart("cert-manager",
    {
       // repo: "jetstack",
        chart: "cert-manager",
        namespace: "cert-manager",
        fetchOpts: {repo: "https://charts.jetstack.io"},
        version: "v0.15.0"
        
    },  { dependsOn: namespace}
);

const mongo = new k8s.helm.v3.Chart("bilbo-mongo", {
    repo: "bitnami",
    //version: "0.2.0-ITX",
    chart: "mongodb",
    fetchOpts: {repo: "https://charts.bitnami.com/bitnami"},
});

// helm repo add inigo-repo https://iiglesiasg.github.io/helm-charts-repo/
const elkoperator = new k8s.helm.v2.Chart("elk-operator", {
    repo: "inigo-repo",
    version: "0.3.0-ITX",
    chart: "elk-operator",
    fetchOpts: {repo: "https://iiglesiasg.github.io/helm-charts-repo/"},
},{dependsOn: Operatoryamlelk});

const logstash = new k8s.helm.v2.Chart("bilbao", {
    repo: "inigo-repo",
    chart: "logstash",    
    version: "0.2.0-ITX",
    fetchOpts: {repo: "https://iiglesiasg.github.io/helm-charts-repo/"},
},{dependsOn: elkoperator});

const metricbeat = new k8s.helm.v2.Chart("metricbeat", {
    repo: "inigo-repo",
    chart: "metricbeat",    
    version: "0.2.0-ITX",
    fetchOpts: {repo: "https://iiglesiasg.github.io/helm-charts-repo/"},
},{dependsOn: elkoperator});

const nginx = new k8s.helm.v3.Chart("nginx-ingress",
    {
        repo: "stable",
        chart: "nginx-ingress",
        
    }, {dependsOn: certmanagerchart }
);
const appdemo = new k8s.helm.v2.Chart("micro-chart", {
    repo: "inigo-repo",
    version: "0.2.0-ITX",
    chart: "demoapp",    
    fetchOpts: {repo: "https://iiglesiasg.github.io/helm-charts-repo/"},
},{dependsOn: [elkoperator,mongo,logstash]});

//export const name = deployment.metadata.name;
