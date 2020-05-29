import * as kq from "@pulumi/query-kubernetes";

export async function querysts() {
    return  kq
    .list("apps/v1", "StatefulSet")
    //.flatMap(sts => sts.status.currentReplicas)
    //.map(sts => sts.status)
    .filter(sts => sts.status.readyReplicas>0 && sts.metadata.name=="quickstart-es-master")
    .first();
}

/*
export async function addToZ(): Promise<boolean> {
    for await (const e of kq.watch("v1", "Event")) {
        const { apiVersion, kind, name } = e.object.involvedObject;
        if (
            apiVersion === "apps/v1" &&
            kind === "StatefulSet" &&
            name === "quickstart-es-elastic-user"
            
        ) {
            console.log("inigo rules");
            const sts = kq
                                    .list("apps/v1", "StatefulSet")
                                    //.flatMap(sts => sts.status.currentReplicas)
                                    //.map(sts => sts.status)
                                    .filter(sts => sts.status.readyReplicas>0 && sts.metadata.name=="quickstart-es-master")
                                    .first();


            const { type, reason, message } = e.object;
            if (reason == "SuccessfulCreate")
            sts.then({
                //console.log(`${type} [${reason}] ${message}`);
                
                return true;
                }
            );
     }
    return false;
}*/