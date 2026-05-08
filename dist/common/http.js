import { Errors } from './errors.js';
const DEFAULT_TIMEOUT_MS = 60000;
export const httpGetJson = async (url, init = {}) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), init.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    try {
        const res = await fetch(url, { ...init, signal: controller.signal });
        if (res.status === 401)
            throw Errors.authFailed();
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        return await res.json();
    }
    catch (e) {
        if (e.name === 'AbortError')
            throw Errors.timeout();
        throw e;
    }
    finally {
        clearTimeout(t);
    }
};
export const httpGetText = async (url, init = {}) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), init.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    try {
        const res = await fetch(url, { ...init, signal: controller.signal });
        if (res.status === 401)
            throw Errors.authFailed();
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        return await res.text();
    }
    catch (e) {
        if (e.name === 'AbortError')
            throw Errors.timeout();
        throw e;
    }
    finally {
        clearTimeout(t);
    }
};
export const httpPost = async (url, init = {}) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), init.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    try {
        const res = await fetch(url, { method: 'POST', ...init, signal: controller.signal });
        if (res.status === 401)
            throw Errors.authFailed();
        return { status: res.status, headers: Object.fromEntries(res.headers.entries()) };
    }
    catch (e) {
        if (e.name === 'AbortError')
            throw Errors.timeout();
        throw e;
    }
    finally {
        clearTimeout(t);
    }
};
export const httpGetBuffer = async (url, init = {}) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), init.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    try {
        const res = await fetch(url, { ...init, signal: controller.signal });
        if (res.status === 401)
            throw Errors.authFailed();
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        const ab = await res.arrayBuffer();
        return Buffer.from(ab);
    }
    catch (e) {
        if (e.name === 'AbortError')
            throw Errors.timeout();
        throw e;
    }
    finally {
        clearTimeout(t);
    }
};
//# sourceMappingURL=http.js.map