import { JenkinsClient } from "../lib/jenkins-client.js";
export interface SafeRestartInput {
    confirm: boolean;
}
export declare const safeRestart: (client: JenkinsClient, input: SafeRestartInput) => Promise<{
    restarting: boolean;
}>;
//# sourceMappingURL=safe-restart.d.ts.map