export interface HttpClientOptions {
    timeoutMs?: number;
    headers?: Record<string, string>;
}
export declare const httpGetJson: <T>(url: string, init?: RequestInit & {
    timeoutMs?: number;
}) => Promise<T>;
export declare const httpGetText: (url: string, init?: RequestInit & {
    timeoutMs?: number;
}) => Promise<string>;
export declare const httpPost: (url: string, init?: RequestInit & {
    timeoutMs?: number;
}) => Promise<{
    status: number;
    headers: Record<string, string | null>;
}>;
export declare const httpGetBuffer: (url: string, init?: RequestInit & {
    timeoutMs?: number;
}) => Promise<Buffer>;
//# sourceMappingURL=http.d.ts.map