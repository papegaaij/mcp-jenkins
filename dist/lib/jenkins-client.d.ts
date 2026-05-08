export interface NormalizedBuild {
    id: string;
    result: "SUCCESS" | "FAILURE" | "ABORTED" | "RUNNING" | string;
    durationMs: number;
    timestamp: string;
    url: string;
}
export interface JenkinsCredentials {
    baseUrl: string;
    authHeader: string;
}
export declare class JenkinsClient {
    readonly baseUrl: string;
    private authHeader;
    private crumb?;
    constructor(credentials?: JenkinsCredentials);
    private headers;
    listJobs(): Promise<{
        name: string;
        url: string;
    }[]>;
    getRecentBuilds(jobName: string, limit?: number): Promise<NormalizedBuild[]>;
    private normalizeBuild;
    getLastBuild(jobName: string): Promise<NormalizedBuild>;
    getBuild(jobName: string, buildNumber: number): Promise<NormalizedBuild>;
    getConsoleLog(jobName: string, buildNumber?: number, maxSnippetLength?: number): Promise<{
        jobName: string;
        buildNumber: number;
        logSnippet: string;
        fullLog: string;
    }>;
    private ensureCrumb;
    triggerBuild(jobName: string, params?: Record<string, any>): Promise<{
        jobName: string;
        queueUrl: string | null;
    }>;
    listArtifacts(jobName: string, buildNumber: number): Promise<{
        fileName: string;
        relativePath: string;
        url: string;
        size?: number;
    }[]>;
    getArtifact(jobName: string, buildNumber: number, relativePath: string): Promise<{
        fileName: string;
        relativePath: string;
        size: number;
        base64: string;
    }>;
    searchJobs(query: string): Promise<{
        name: string;
        url: string;
    }[]>;
    stopBuild(jobName: string, buildNumber: number): Promise<{
        jobName: string;
        buildNumber: number;
        stopped: boolean;
    }>;
    deleteBuild(jobName: string, buildNumber: number): Promise<{
        jobName: string;
        buildNumber: number;
        deleted: boolean;
    }>;
    getTestResults(jobName: string, buildNumber: number, options?: {
        includePassing?: boolean;
    }): Promise<any>;
    getTestCase(jobName: string, buildNumber: number, className: string, caseName: string): Promise<any>;
    getQueue(): Promise<any[]>;
    cancelQueue(queueId: number): Promise<{
        queueId: number;
        cancelled: boolean;
    }>;
    enableJob(jobName: string): Promise<{
        jobName: string;
        enabled: boolean;
    }>;
    disableJob(jobName: string): Promise<{
        jobName: string;
        disabled: boolean;
    }>;
    deleteJob(jobName: string): Promise<{
        jobName: string;
        deleted: boolean;
    }>;
    getJobConfig(jobName: string): Promise<{
        jobName: string;
        config: string;
    }>;
    getJobParameters(jobName: string): Promise<{
        jobName: string;
        parameters: {
            name: string;
            type: string;
            description: string;
            defaultValue: any;
            choices?: string[];
        }[];
    }>;
    listNodes(): Promise<any[]>;
    getSystemInfo(): Promise<any>;
    getVersion(): Promise<{
        version: string;
    }>;
    getPlugins(): Promise<any[]>;
    getBuildChanges(jobName: string, buildNumber: number): Promise<any>;
    getPipelineStages(jobName: string, buildNumber: number): Promise<any>;
    createJob(jobName: string, configXml: string): Promise<{
        jobName: string;
        created: boolean;
    }>;
    updateJobConfig(jobName: string, configXml: string): Promise<{
        jobName: string;
        updated: boolean;
    }>;
    renameJob(jobName: string, newName: string): Promise<{
        oldName: string;
        newName: string;
        renamed: boolean;
    }>;
    copyJob(fromName: string, newName: string): Promise<{
        fromName: string;
        newName: string;
        copied: boolean;
    }>;
    getNode(nodeName: string): Promise<any>;
    toggleNodeOffline(nodeName: string, offlineMessage?: string): Promise<{
        nodeName: string;
        toggledOffline: boolean;
    }>;
    listViews(): Promise<{
        name: string;
        url: string;
        jobs: {
            name: string;
            url: string;
        }[];
    }[]>;
    getView(viewName: string): Promise<any>;
    quietDown(reason?: string): Promise<{
        quietingDown: boolean;
    }>;
    cancelQuietDown(): Promise<{
        quietingDown: boolean;
    }>;
    safeRestart(): Promise<{
        restarting: boolean;
    }>;
    replayBuild(jobName: string, buildNumber: number): Promise<{
        jobName: string;
        buildNumber: number;
        queueUrl: string | null;
    }>;
}
export declare const createClient: () => JenkinsClient;
//# sourceMappingURL=jenkins-client.d.ts.map