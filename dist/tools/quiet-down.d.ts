import { JenkinsClient } from "../lib/jenkins-client.js";
export interface QuietDownInput {
    reason?: string;
    confirm: boolean;
}
export declare const quietDown: (client: JenkinsClient, input: QuietDownInput) => Promise<{
    quietingDown: boolean;
}>;
//# sourceMappingURL=quiet-down.d.ts.map