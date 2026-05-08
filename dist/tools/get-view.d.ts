import { JenkinsClient } from "../lib/jenkins-client.js";
export interface GetViewInput {
    viewName: string;
}
export declare const getView: (client: JenkinsClient, input: GetViewInput) => Promise<any>;
//# sourceMappingURL=get-view.d.ts.map