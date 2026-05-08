export interface JenkinsEnv {
    JENKINS_URL: string;
    JENKINS_USER?: string;
    JENKINS_API_TOKEN?: string;
    JENKINS_BEARER_TOKEN?: string;
}
export interface CliArgs {
    jenkinsUrl?: string;
    jenkinsUser?: string;
    jenkinsApiToken?: string;
    jenkinsBearerToken?: string;
}
/**
 * Load all named Jenkins instances from environment variables.
 *
 * Single instance:
 *   MCP_JENKINS_URL=https://jenkins.example.com
 *   MCP_JENKINS_USER=admin
 *   MCP_JENKINS_API_TOKEN=token
 *
 * Multiple instances (comma or pipe separated, positional):
 *   MCP_JENKINS_INSTANCES=pipeline,scheduler
 *   MCP_JENKINS_URL=https://pipeline.example.com,https://scheduler.example.com
 *   MCP_JENKINS_USER=admin,admin
 *   MCP_JENKINS_API_TOKEN=token1,token2
 *
 * The first instance is always the default (used when no instance param is provided).
 */
export declare const loadAllJenkinsInstances: (cliArgs?: CliArgs) => Map<string, JenkinsEnv>;
/** Returns the single (first) Jenkins instance — backwards-compatible helper. */
export declare const loadJenkinsEnv: (cliArgs?: CliArgs) => JenkinsEnv;
/** Returns instance names available at startup (for tool schema description). */
export declare const getInstanceNames: () => string[];
export interface ToolFilter {
    allowlist: string[] | null;
    blocklist: string[];
}
/**
 * Load tool allow/block lists from environment variables.
 *
 * Allowlist (only these tools are exposed):
 *   MCP_JENKINS_ALLOW_TOOLS=jenkins_list_jobs,jenkins_get_job_status
 *
 * Blocklist (all tools except these):
 *   MCP_JENKINS_BLOCK_TOOLS=jenkins_delete_job,jenkins_trigger_build
 *
 * If both are set, allowlist takes precedence and blocklist is ignored.
 */
export declare const loadToolFilter: () => ToolFilter;
//# sourceMappingURL=env.d.ts.map