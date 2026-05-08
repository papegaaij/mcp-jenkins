import { JenkinsClient } from "../lib/jenkins-client.js";
export interface ListViewsInput {
}
export declare const listViews: (client: JenkinsClient, _input: ListViewsInput) => Promise<{
    name: string;
    url: string;
    jobs: {
        name: string;
        url: string;
    }[];
}[]>;
//# sourceMappingURL=list-views.d.ts.map