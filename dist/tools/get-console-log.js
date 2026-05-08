export const getConsoleLog = async (client, input) => {
    return client.getConsoleLog(input.jobName, input.buildNumber, input.maxSnippetLength);
};
//# sourceMappingURL=get-console-log.js.map