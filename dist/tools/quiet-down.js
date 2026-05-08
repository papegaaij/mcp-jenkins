import { McpError } from "../common/index.js";
export const quietDown = async (client, input) => {
    if (!input.confirm)
        throw new McpError("CONFIRM_REQUIRED", "Set confirm: true to put Jenkins into quiet mode (no new builds will start).", 400);
    return client.quietDown(input.reason);
};
//# sourceMappingURL=quiet-down.js.map