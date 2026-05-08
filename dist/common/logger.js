const base = (level, msg, fields) => {
    const entry = { level, msg, time: new Date().toISOString() };
    if (fields)
        entry.fields = fields;
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(entry));
};
export const logger = {
    info: (msg, f) => base("info", msg, f),
    warn: (msg, f) => base("warn", msg, f),
    error: (msg, f) => base("error", msg, f),
};
//# sourceMappingURL=logger.js.map