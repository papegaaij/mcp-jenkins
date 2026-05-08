import { JenkinsClient } from "../lib/jenkins-client.js";
export interface ToggleNodeOfflineInput {
    nodeName: string;
    offlineMessage?: string;
}
export declare const toggleNodeOffline: (client: JenkinsClient, input: ToggleNodeOfflineInput) => Promise<{
    nodeName: string;
    toggledOffline: boolean;
}>;
//# sourceMappingURL=toggle-node-offline.d.ts.map