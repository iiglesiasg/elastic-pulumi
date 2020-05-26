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

const mongo = new k8s.helm.v3.Chart("bilbo-mongo", {
    repo: "bitnami",
    //version: "0.2.0-ITX",
    chart: "mongodb",
});

// helm repo add inigo-repo https://iiglesiasg.github.io/helm-charts-repo/
const elkoperator = new k8s.helm.v2.Chart("elk-operator", {
    repo: "inigo-repo",
    version: "0.3.0-ITX",
    chart: "elk-operator",

},{dependsOn: Operatoryamlelk});

const logstash = new k8s.helm.v2.Chart("bilbao", {
    repo: "inigo-repo",
    chart: "logstash",    
    version: "0.2.0-ITX"
},{dependsOn: elkoperator});

const metricbeat = new k8s.helm.v2.Chart("metricbeat", {
    repo: "inigo-repo",
    chart: "metricbeat",    
    version: "0.2.0-ITX"
},{dependsOn: elkoperator});

const appdemo = new k8s.helm.v2.Chart("micro-chart", {
    repo: "inigo-repo",
    version: "0.2.0-ITX",
    chart: "demoapp",    
},{dependsOn: [elkoperator,mongo,logstash]});

//export const name = deployment.metadata.name;
