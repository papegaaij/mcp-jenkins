import { McpError } from "../common/index.js";
export const safeRestart = async (client, input) => {
    if (!input.confirm)
        throw new McpError("CONFIRM_REQUIRED", "Set confirm: true to safely restart Jenkins (waits for running builds to finish).", 400);
    return client.safeRestart();
};
//# sourceMappingURL=safe-restart.js.map