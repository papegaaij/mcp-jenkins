import { httpGetJson, httpGetText, httpPost, Errors, McpError, logger, loadJenkinsEnv, } from "../common/index.js";
const jobPath = (name) => name.split("/").map(encodeURIComponent).join("/job/");
export class JenkinsClient {
    baseUrl;
    authHeader;
    crumb;
    constructor(credentials) {
        if (credentials) {
            // Use credentials provided by the caller (from request headers)
            this.baseUrl = credentials.baseUrl;
            this.authHeader = credentials.authHeader;
        }
        else {
            // loadJenkinsEnv will use globally set values from CLI args or env vars
            const env = loadJenkinsEnv();
            this.baseUrl = env.JENKINS_URL;
            // Support both Bearer token and Basic auth from env
            if (env.JENKINS_BEARER_TOKEN) {
                this.authHeader = "Bearer " + env.JENKINS_BEARER_TOKEN;
            }
            else {
                // Fall back to Basic auth with user + API token
                this.authHeader =
                    "Basic " +
                        Buffer.from(env.JENKINS_USER + ":" + env.JENKINS_API_TOKEN).toString("base64");
            }
        }
    }
    headers(extra) {
        return { Authorization: this.authHeader, ...extra };
    }
    // List jobs (shallow) returns name + url
    async listJobs() {
        try {
            const data = await httpGetJson(`${this.baseUrl}/api/json`, {
                headers: this.headers(),
            });
            if (Array.isArray(data.jobs)) {
                return data.jobs.map((j) => ({ name: j.name, url: j.url }));
            }
            return [];
        }
        catch (e) {
            if (e.message?.includes("HTTP 401"))
                throw Errors.authFailed();
            throw e;
        }
    }
    // Recent builds metadata for a job (last N, default 5)
    async getRecentBuilds(jobName, limit = 5) {
        try {
            const raw = await httpGetJson(`${this.baseUrl}/job/${jobPath(jobName)}/api/json?depth=1`, { headers: this.headers() });
            if (!raw.builds)
                return [];
            const builds = raw.builds
                .slice(0, limit)
                .map((b) => this.normalizeBuild(b));
            return builds;
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    normalizeBuild(raw) {
        const building = raw.building === true;
        const result = building ? "RUNNING" : raw.result || "RUNNING";
        return {
            id: String(raw.number ?? raw.id ?? ""),
            result,
            durationMs: raw.duration ?? 0,
            timestamp: raw.timestamp
                ? new Date(raw.timestamp).toISOString()
                : new Date().toISOString(),
            url: raw.url || "",
        };
    }
    async getLastBuild(jobName) {
        try {
            const raw = await httpGetJson(`${this.baseUrl}/job/${jobPath(jobName)}/lastBuild/api/json`, { headers: this.headers() });
            return this.normalizeBuild(raw);
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    async getBuild(jobName, buildNumber) {
        try {
            const raw = await httpGetJson(`${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/api/json`, { headers: this.headers() });
            return this.normalizeBuild(raw);
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    async getConsoleLog(jobName, buildNumber, maxSnippetLength = 200) {
        let bn = buildNumber;
        if (bn == null) {
            bn = Number((await this.getLastBuild(jobName)).id);
        }
        try {
            const fullLog = await httpGetText(`${this.baseUrl}/job/${jobPath(jobName)}/${bn}/consoleText`, { headers: this.headers() });
            const snippet = fullLog
                .trim()
                .slice(0, maxSnippetLength)
                .replace(/\r/g, "");
            return { jobName, buildNumber: bn, logSnippet: snippet, fullLog };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    async ensureCrumb() {
        if (this.crumb)
            return this.crumb;
        try {
            const crumb = await httpGetJson(`${this.baseUrl}/crumbIssuer/api/json`, { headers: this.headers() });
            this.crumb = crumb;
            return crumb;
        }
        catch (e) {
            // Some Jenkins instances may not have CSRF protection enabled
            logger.warn("Crumb fetch failed (continuing)", { error: String(e) });
            return undefined;
        }
    }
    async triggerBuild(jobName, params) {
        const crumb = await this.ensureCrumb();
        const isParameterized = params && Object.keys(params).length > 0;
        const path = isParameterized ? "buildWithParameters" : "build";
        const url = `${this.baseUrl}/job/${jobPath(jobName)}/${path}`;
        let body;
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        if (isParameterized) {
            const usp = new URLSearchParams();
            for (const [k, v] of Object.entries(params))
                usp.append(k, String(v));
            body = usp.toString();
            headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        try {
            const res = await httpPost(url, { headers, body });
            const queueUrl = res.headers["location"] || null;
            return { jobName, queueUrl };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    async listArtifacts(jobName, buildNumber) {
        try {
            const data = await httpGetJson(`${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/api/json?tree=artifacts[fileName,relativePath]`, { headers: this.headers() });
            if (!data || !Array.isArray(data.artifacts))
                return [];
            return data.artifacts.map((a) => ({
                fileName: a.fileName,
                relativePath: a.relativePath,
                url: `${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/artifact/${a.relativePath}`,
            }));
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    async getArtifact(jobName, buildNumber, relativePath) {
        const url = `${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/artifact/${relativePath}`;
        try {
            const data = await httpGetText(url, { headers: this.headers() });
            const buf = Buffer.from(data, "utf8");
            return {
                fileName: relativePath.split("/").pop() || relativePath,
                relativePath,
                size: buf.length,
                base64: buf.toString("base64"),
            };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.artifactNotFound(relativePath);
            throw e;
        }
    }
    async searchJobs(query) {
        if (!query.trim())
            return [];
        const all = await this.listJobs();
        const q = query.toLowerCase();
        return all.filter((j) => j.name.toLowerCase().includes(q));
    }
    // Stop/abort a running build
    async stopBuild(jobName, buildNumber) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            await httpPost(`${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/stop`, { headers });
            return { jobName, buildNumber, stopped: true };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    // Delete a build
    async deleteBuild(jobName, buildNumber) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            await httpPost(`${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/doDelete`, { headers });
            return { jobName, buildNumber, deleted: true };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    // Get test results for a build.
    //
    // The full Jenkins testReport API can return tens of MB of JSON for large
    // suites, with the bulk of the size coming from per-case `stdout`/`stderr`
    // captures and from passing cases (which are rarely useful). That oversize
    // response has historically crashed the MCP stdio transport. We use a
    // Jenkins `tree=` filter to drop stdout/stderr server-side, and by default
    // we strip passing cases on the client side so the JSON returned over MCP
    // stays small and focused on actionable failures.
    async getTestResults(jobName, buildNumber, options = {}) {
        const includePassing = options.includePassing === true;
        const tree = "duration,passCount,failCount,skipCount," +
            "suites[name,duration,timestamp," +
            "cases[className,name,status,duration,errorDetails,errorStackTrace,age,skipped]]";
        try {
            const data = await httpGetJson(`${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/testReport/api/json?tree=${encodeURIComponent(tree)}`, { headers: this.headers(), timeoutMs: 120000 });
            const suitesRaw = Array.isArray(data.suites) ? data.suites : [];
            const suites = includePassing
                ? suitesRaw
                : suitesRaw
                    .map((s) => {
                    const cases = Array.isArray(s.cases)
                        ? s.cases.filter((c) => {
                            const status = String(c.status || "").toUpperCase();
                            return status !== "PASSED" && status !== "FIXED";
                        })
                        : [];
                    return cases.length ? { ...s, cases } : null;
                })
                    .filter(Boolean);
            const passCount = data.passCount || 0;
            const failCount = data.failCount || 0;
            const skipCount = data.skipCount || 0;
            return {
                jobName,
                buildNumber,
                totalTests: passCount + failCount + skipCount,
                passedTests: passCount,
                failedTests: failCount,
                skippedTests: skipCount,
                duration: data.duration || 0,
                includePassing,
                suites,
            };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404")) {
                return {
                    jobName,
                    buildNumber,
                    totalTests: 0,
                    passedTests: 0,
                    failedTests: 0,
                    skippedTests: 0,
                    message: "No test results found",
                };
            }
            throw e;
        }
    }
    // Fetch a single test case (with full stdout/stderr/stack trace) by
    // hitting Jenkins's per-case testReport URL. This is the safe way to
    // retrieve console output for a failing test without downloading the
    // entire (potentially many-MB) report.
    //
    // Jenkins's JUnit plugin places each case under a "package" URL segment
    // that is *not* always the FQCN package — many test result formats land
    // every class under the `(root)` pseudo-package even though the class's
    // FQCN includes a real package. We probe `(root)` first and fall back
    // to the FQCN-derived package, so callers can pass either an FQCN or a
    // simple class name and the right URL is found.
    async getTestCase(jobName, buildNumber, className, caseName) {
        const lastDot = className.lastIndexOf(".");
        const pkg = lastDot >= 0 ? className.substring(0, lastDot) : null;
        const cls = lastDot >= 0 ? className.substring(lastDot + 1) : className;
        // Jenkins JUnit plugin replaces path-unsafe characters and whitespace
        // with '_' when generating per-case detail URLs. Dots are preserved.
        const safe = (s) => s.replace(/[\\/?#&%*:|<>"\s]/g, "_");
        const safeCls = safe(cls);
        const safeMethod = safe(caseName);
        // `(root)` must stay literal — encodeURIComponent would turn it into
        // `%28root%29`, which Jenkins also accepts but the literal form is the
        // canonical link used in the testReport HTML.
        const candidates = [];
        candidates.push(`(root)/${safeCls}/${safeMethod}`);
        if (pkg) {
            candidates.push(`${encodeURIComponent(safe(pkg))}/${safeCls}/${safeMethod}`);
        }
        const attemptedUrls = [];
        let lastError = null;
        for (const path of candidates) {
            const url = `${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/testReport/${path}/api/json`;
            attemptedUrls.push(url);
            try {
                const data = await httpGetJson(url, {
                    headers: this.headers(),
                    timeoutMs: 60000,
                });
                return {
                    jobName,
                    buildNumber,
                    className: data.className ?? className,
                    name: data.name ?? caseName,
                    status: data.status ?? null,
                    duration: data.duration ?? 0,
                    age: data.age ?? 0,
                    skipped: data.skipped ?? false,
                    skippedMessage: data.skippedMessage ?? null,
                    errorDetails: data.errorDetails ?? null,
                    errorStackTrace: data.errorStackTrace ?? null,
                    stdout: data.stdout ?? null,
                    stderr: data.stderr ?? null,
                    url,
                };
            }
            catch (e) {
                if (e.message?.includes("HTTP 404")) {
                    lastError = e;
                    continue;
                }
                throw e;
            }
        }
        return {
            jobName,
            buildNumber,
            className,
            name: caseName,
            message: "Test case not found at any candidate URL. Verify className and caseName " +
                "match the values reported by jenkins_get_test_results.",
            attemptedUrls,
        };
    }
    // Get build queue
    async getQueue() {
        try {
            const data = await httpGetJson(`${this.baseUrl}/queue/api/json`, {
                headers: this.headers(),
            });
            if (!data.items)
                return [];
            return data.items.map((item) => ({
                id: item.id,
                blocked: item.blocked || false,
                buildable: item.buildable || false,
                stuck: item.stuck || false,
                why: item.why || "",
                task: {
                    name: item.task?.name || "",
                    url: item.task?.url || "",
                },
                inQueueSince: item.inQueueSince
                    ? new Date(item.inQueueSince).toISOString()
                    : null,
            }));
        }
        catch (e) {
            throw e;
        }
    }
    // Cancel queued build
    async cancelQueue(queueId) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            await httpPost(`${this.baseUrl}/queue/cancelItem?id=${queueId}`, {
                headers,
            });
            return { queueId, cancelled: true };
        }
        catch (e) {
            throw e;
        }
    }
    // Enable a job
    async enableJob(jobName) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            await httpPost(`${this.baseUrl}/job/${jobPath(jobName)}/enable`, {
                headers,
            });
            return { jobName, enabled: true };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    // Disable a job
    async disableJob(jobName) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            await httpPost(`${this.baseUrl}/job/${jobPath(jobName)}/disable`, {
                headers,
            });
            return { jobName, disabled: true };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    // Delete a job
    async deleteJob(jobName) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            await httpPost(`${this.baseUrl}/job/${jobPath(jobName)}/doDelete`, {
                headers,
            });
            return { jobName, deleted: true };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    // Get job configuration (XML)
    async getJobConfig(jobName) {
        try {
            const config = await httpGetText(`${this.baseUrl}/job/${jobPath(jobName)}/config.xml`, { headers: this.headers() });
            return { jobName, config };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    // Get parameter definitions for a parameterised job
    async getJobParameters(jobName) {
        try {
            const data = await httpGetJson(`${this.baseUrl}/job/${jobPath(jobName)}/api/json?tree=property[parameterDefinitions[name,type,description,defaultParameterValue[value],choices]]`, { headers: this.headers() });
            const paramProp = (data.property ?? []).find((p) => p._class === "hudson.model.ParametersDefinitionProperty" ||
                Array.isArray(p.parameterDefinitions));
            const defs = paramProp?.parameterDefinitions ?? [];
            const parameters = defs.map((d) => {
                const raw = d.type ?? d._class ?? "";
                const type = raw
                    .replace(/^.*\./, "")
                    .replace(/ParameterDefinition$/, "")
                    .toLowerCase();
                const entry = {
                    name: d.name ?? "",
                    type,
                    description: d.description ?? "",
                    defaultValue: d.defaultParameterValue?.value ?? null,
                };
                if (Array.isArray(d.choices))
                    entry.choices = d.choices;
                return entry;
            });
            return { jobName, parameters };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    // List nodes/agents
    async listNodes() {
        try {
            const data = await httpGetJson(`${this.baseUrl}/computer/api/json?depth=1`, { headers: this.headers() });
            if (!data.computer)
                return [];
            return data.computer.map((node) => ({
                name: node.displayName || "",
                offline: node.offline || false,
                idle: node.idle || false,
                numExecutors: node.numExecutors || 0,
                busyExecutors: node.monitorData?.["hudson.node_monitors.SwapSpaceMonitor"]?.availablePhysicalMemory
                    ? 0
                    : node.numExecutors,
                temporarilyOffline: node.temporarilyOffline || false,
                offlineCauseReason: node.offlineCauseReason || "",
            }));
        }
        catch (e) {
            throw e;
        }
    }
    // Get system info
    async getSystemInfo() {
        try {
            const data = await httpGetJson(`${this.baseUrl}/api/json`, {
                headers: this.headers(),
            });
            return {
                nodeDescription: data.nodeDescription || "",
                nodeName: data.nodeName || "",
                numExecutors: data.numExecutors || 0,
                mode: data.mode || "",
                quietingDown: data.quietingDown || false,
                useCrumbs: data.useCrumbs || false,
                useSecurity: data.useSecurity || false,
            };
        }
        catch (e) {
            throw e;
        }
    }
    // Get Jenkins version
    async getVersion() {
        try {
            const res = await fetch(`${this.baseUrl}/api/json`, {
                method: "HEAD",
                headers: this.headers(),
            });
            const version = res.headers.get("x-jenkins") || "unknown";
            return { version };
        }
        catch (e) {
            throw e;
        }
    }
    // Get installed plugins
    async getPlugins() {
        try {
            const data = await httpGetJson(`${this.baseUrl}/pluginManager/api/json?depth=1`, { headers: this.headers() });
            if (!data.plugins)
                return [];
            return data.plugins.map((plugin) => ({
                shortName: plugin.shortName || "",
                longName: plugin.longName || "",
                version: plugin.version || "",
                enabled: plugin.enabled || false,
                active: plugin.active || false,
                hasUpdate: plugin.hasUpdate || false,
            }));
        }
        catch (e) {
            throw e;
        }
    }
    // Get build changes/commits
    async getBuildChanges(jobName, buildNumber) {
        try {
            const data = await httpGetJson(`${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/api/json?tree=changeSet[items[author[fullName],msg,commitId,timestamp]]`, { headers: this.headers() });
            if (!data.changeSet || !data.changeSet.items) {
                return { jobName, buildNumber, changes: [] };
            }
            return {
                jobName,
                buildNumber,
                changes: data.changeSet.items.map((change) => ({
                    author: change.author?.fullName || "unknown",
                    message: change.msg || "",
                    commitId: change.commitId || "",
                    timestamp: change.timestamp
                        ? new Date(change.timestamp).toISOString()
                        : null,
                })),
            };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    // Get pipeline stages
    async getPipelineStages(jobName, buildNumber) {
        try {
            const data = await httpGetJson(`${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/wfapi/describe`, { headers: this.headers() });
            return {
                jobName,
                buildNumber,
                status: data.status || "",
                stages: (data.stages || []).map((stage) => ({
                    id: stage.id || "",
                    name: stage.name || "",
                    status: stage.status || "",
                    startTimeMillis: stage.startTimeMillis || 0,
                    durationMillis: stage.durationMillis || 0,
                    pauseDurationMillis: stage.pauseDurationMillis || 0,
                })),
            };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404")) {
                return {
                    jobName,
                    buildNumber,
                    message: "Not a pipeline build or workflow API not available",
                };
            }
            throw e;
        }
    }
    async createJob(jobName, configXml) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers({
            "Content-Type": "application/xml",
        });
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        const res = await httpPost(`${this.baseUrl}/createItem?name=${encodeURIComponent(jobName)}`, { headers, body: configXml });
        if (res.status >= 400)
            throw Errors.unexpected(`Create job failed: HTTP ${res.status}`);
        return { jobName, created: true };
    }
    async updateJobConfig(jobName, configXml) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers({
            "Content-Type": "application/xml",
        });
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            await httpPost(`${this.baseUrl}/job/${jobPath(jobName)}/config.xml`, {
                headers,
                body: configXml,
            });
            return { jobName, updated: true };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    async renameJob(jobName, newName) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            await httpPost(`${this.baseUrl}/job/${jobPath(jobName)}/rename?newName=${encodeURIComponent(newName)}`, { headers });
            return { oldName: jobName, newName, renamed: true };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
    async copyJob(fromName, newName) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            const res = await httpPost(`${this.baseUrl}/createItem?name=${encodeURIComponent(newName)}&from=${encodeURIComponent(fromName)}&mode=copy`, { headers });
            if (res.status >= 400)
                throw Errors.unexpected(`Copy job failed: HTTP ${res.status}`);
            return { fromName, newName, copied: true };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(fromName);
            throw e;
        }
    }
    async getNode(nodeName) {
        try {
            const data = await httpGetJson(`${this.baseUrl}/computer/${encodeURIComponent(nodeName)}/api/json?depth=1`, { headers: this.headers() });
            return {
                name: data.displayName || nodeName,
                offline: data.offline || false,
                temporarilyOffline: data.temporarilyOffline || false,
                offlineCauseReason: data.offlineCauseReason || "",
                idle: data.idle || false,
                numExecutors: data.numExecutors || 0,
                assignedLabels: (data.assignedLabels || []).map((l) => l.name),
                monitorData: data.monitorData || {},
            };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw new McpError("NODE_NOT_FOUND", `Node not found: ${nodeName}`, 404);
            throw e;
        }
    }
    async toggleNodeOffline(nodeName, offlineMessage = "") {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            await httpPost(`${this.baseUrl}/computer/${encodeURIComponent(nodeName)}/toggleOffline?offlineMessage=${encodeURIComponent(offlineMessage)}`, { headers });
            return { nodeName, toggledOffline: true };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw new McpError("NODE_NOT_FOUND", `Node not found: ${nodeName}`, 404);
            throw e;
        }
    }
    async listViews() {
        const data = await httpGetJson(`${this.baseUrl}/api/json?tree=views[name,url,jobs[name,url]]`, { headers: this.headers() });
        if (!Array.isArray(data.views))
            return [];
        return data.views.map((v) => ({
            name: v.name || "",
            url: v.url || "",
            jobs: (v.jobs || []).map((j) => ({ name: j.name, url: j.url })),
        }));
    }
    async getView(viewName) {
        try {
            const data = await httpGetJson(`${this.baseUrl}/view/${encodeURIComponent(viewName)}/api/json`, { headers: this.headers() });
            return {
                name: data.name || viewName,
                url: data.url || "",
                description: data.description || "",
                jobs: (data.jobs || []).map((j) => ({
                    name: j.name,
                    url: j.url,
                    color: j.color,
                })),
            };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw new McpError("VIEW_NOT_FOUND", `View not found: ${viewName}`, 404);
            throw e;
        }
    }
    async quietDown(reason = "") {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        const url = reason
            ? `${this.baseUrl}/quietDown?reason=${encodeURIComponent(reason)}`
            : `${this.baseUrl}/quietDown`;
        await httpPost(url, { headers });
        return { quietingDown: true };
    }
    async cancelQuietDown() {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        await httpPost(`${this.baseUrl}/cancelQuietDown`, { headers });
        return { quietingDown: false };
    }
    async safeRestart() {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        await httpPost(`${this.baseUrl}/safeRestart`, { headers });
        return { restarting: true };
    }
    // Replay build (for pipeline jobs)
    async replayBuild(jobName, buildNumber) {
        const crumb = await this.ensureCrumb();
        const headers = this.headers();
        if (crumb)
            headers[crumb.crumbRequestField] = crumb.crumb;
        try {
            const res = await httpPost(`${this.baseUrl}/job/${jobPath(jobName)}/${buildNumber}/replay/rebuild`, { headers });
            return { jobName, buildNumber, queueUrl: res.headers["location"] || null };
        }
        catch (e) {
            if (e.message?.includes("HTTP 404"))
                throw Errors.jobNotFound(jobName);
            throw e;
        }
    }
}
export const createClient = () => new JenkinsClient();
//# sourceMappingURL=jenkins-client.js.map