import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const notionEnvSchema = z.object({
    NOTION_API_TOKEN: z.string().min(1, "Notion API token is required"),
});

export type NotionConfig = z.infer<typeof notionEnvSchema>;

export async function validateNotionConfig(
    runtime: IAgentRuntime
): Promise<NotionConfig> {
    try {
        const config = {
            NOTION_API_TOKEN: runtime.getSetting("NOTION_API_TOKEN"),
        };
        return notionEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Notion API configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}