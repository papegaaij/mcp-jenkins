export class McpError extends Error {
    code;
    status;
    constructor(code, message, status) {
        super(message);
        this.code = code;
        this.status = status;
    }
}
export const Errors = {
    authFailed: () => new McpError('AUTH_FAILED', 'Authentication failed. Check credentials.', 401),
    jobNotFound: (job) => new McpError('JOB_NOT_FOUND', `Job not found: ${job}`, 404),
    timeout: () => new McpError('TIMEOUT', 'Jenkins request timed out.', 504),
    artifactNotFound: (path) => new McpError('ARTIFACT_NOT_FOUND', `Artifact not found: ${path}`, 404),
    unexpected: (message) => new McpError('UNEXPECTED', message, 500)
};
export const errorResponse = (err) => {
    if (err instanceof McpError)
        return { error: err.message, code: err.code };
    return { error: 'Unexpected error', code: 'UNEXPECTED' };
};
//# sourceMappingURL=errors.js.map