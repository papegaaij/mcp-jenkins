import { JenkinsClient } from "../lib/jenkins-client.js";
export interface GetNodeInput {
    nodeName: string;
}
export declare const getNode: (client: JenkinsClient, input: GetNodeInput) => Promise<any>;
//# sourceMappingURL=get-node.d.ts.map