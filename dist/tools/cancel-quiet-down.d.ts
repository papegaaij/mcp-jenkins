import { JenkinsClient } from "../lib/jenkins-client.js";
export interface CancelQuietDownInput {
}
export declare const cancelQuietDown: (client: JenkinsClient, _input: CancelQuietDownInput) => Promise<{
    quietingDown: boolean;
}>;
//# sourceMappingURL=cancel-quiet-down.d.ts.map