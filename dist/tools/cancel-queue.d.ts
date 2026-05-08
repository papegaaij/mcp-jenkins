import { JenkinsClient } from '../lib/jenkins-client.js';
export interface CancelQueueInput {
    queueId: number;
}
export declare const cancelQueue: (client: JenkinsClient, input: CancelQueueInput) => Promise<{
    queueId: number;
    cancelled: boolean;
}>;
//# sourceMappingURL=cancel-queue.d.ts.map