import * as k8s from "@pulumi/kubernetes";


export const Operatoryamlelk = new k8s.yaml.ConfigFile("Operator", {
    file: "https://download.elastic.co/downloads/eck/1.1.1/all-in-one.yaml"
});

const elkoperator = new k8s.helm.v2.Chart("elk-operator", {
    version: "0.3.0-ITX",
    chart: "elk-operator",
    fetchOpts: {repo: "https://iiglesiasg.github.io/helm-charts-repo/"}
},{dependsOn: Operatoryamlelk});

export const certManagerCRD = new k8s.yaml.ConfigFile("certmanagercrd", {
    file: "https://github.com/jetstack/cert-manager/releases/download/v0.15.0/cert-manager.crds.yaml"             
});

export const clusterIssuers = new k8s.yaml.ConfigGroup("clusterIssuers", 
    {
        files: ["cluster-issuer-prod.yaml",
                "cluster-issuer-sef-signed.yaml"]   
    },  {dependsOn: certManagerCRD}
);

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
        chart: "cert-manager",
        namespace: "cert-manager",
        fetchOpts: {repo: "https://charts.jetstack.io"},
        version: "v0.15.0",
    },  { dependsOn: namespace}
);

const mongo = new k8s.helm.v3.Chart("bilbo-mongo", {
    chart: "mongodb",
    fetchOpts: {repo: "https://charts.bitnami.com/bitnami"},
});



const nginx = new k8s.helm.v3.Chart("nginx-ingress",
    {
        repo: "stable",
        chart: "nginx-ingress",
        
    }, {dependsOn: certmanagerchart }
);

const logstash = new k8s.helm.v2.Chart("bilbao", {
    chart: "logstash",    
    version: "0.2.0-ITX",
    fetchOpts: {repo: "https://iiglesiasg.github.io/helm-charts-repo/"},
},{dependsOn: elkoperator.getResource("apps/v1/StatefulSet","quickstart-es-master")});

const metricbeat = new k8s.helm.v2.Chart("metricbeat", {
    chart: "metricbeat",    
    version: "0.2.0-ITX",
    fetchOpts: {repo: "https://iiglesiasg.github.io/helm-charts-repo/"},
},{dependsOn: elkoperator.getResource("apps/v1/StatefulSet","quickstart-es-master")});

const appdemo = new k8s.helm.v2.Chart("micro-chart", {
    version: "0.2.0-ITX",
    chart: "demoapp",    
    fetchOpts: {repo: "https://iiglesiasg.github.io/helm-charts-repo/"},
},{dependsOn: [elkoperator.getResource("apps/v1/StatefulSet","quickstart-es-master"),mongo,logstash]});


const loadgenerator = new k8s.helm.v2.Chart("load-generator", {
    version: "0.2.0-ITX",
    chart: "load-generator",    
    fetchOpts: {repo: "https://iiglesiasg.github.io/helm-charts-repo/"},
},{dependsOn: [elkoperator.getResource("apps/v1/StatefulSet","quickstart-es-master"),mongo,logstash]});
