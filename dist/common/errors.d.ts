export declare class McpError extends Error {
    code: string;
    status?: number;
    constructor(code: string, message: string, status?: number);
}
export declare const Errors: {
    authFailed: () => McpError;
    jobNotFound: (job: string) => McpError;
    timeout: () => McpError;
    artifactNotFound: (path: string) => McpError;
    unexpected: (message: string) => McpError;
};
export declare const errorResponse: (err: unknown) => {
    error: string;
    code: string;
};
//# sourceMappingURL=errors.d.ts.map