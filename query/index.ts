import * as k8s from "@pulumi/kubernetes";
import * as kx from "@pulumi/kubernetesx";
import * as kq from "@pulumi/query-kubernetes";
import { secret } from "@pulumi/pulumi";
import { Secret } from "@pulumi/kubernetes/core/v1";

const ElasticUser = kq
    .list("v1", "Secret")
    .filter(secret => secret.metadata.name === "quickstart-es-elastic-user")
    .distinct();

ElasticUser.forEach(console.log);

const ElasticCert = kq
    .list("v1", "Secret")
    .filter(secret => secret.metadata.name === "quickstart-es-http-certs-public")
    .distinct();

ElasticCert.forEach(console.log);
