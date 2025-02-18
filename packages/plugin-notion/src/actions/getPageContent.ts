import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    composeContext,
    generateObjectDeprecated,
    ModelClass,
} from "@elizaos/core";
import { validateNotionConfig } from "../environment";
import { getPageContentExamples } from "../examples";
import { NotionService } from "../services";

const contentTemplate = `Look at ONLY your LAST RESPONSE message in this conversation, where you just confirmed which page to retrieve.
Based on ONLY that last message, extract the page ID.

Always reply in RUSSIAN language.

For example:
- If your last message was "I'll get the content from page abc123..." -> return "abc123"
- If your last message was "I'll show you the content of def456..." -> return "def456"

\`\`\`json
{
    "pageId": "<page ID from your LAST response only>"
}
\`\`\`

Last part of conversation:
{{recentMessages}}`;

export const getPageContent: Action = {
    name: "GET_PAGE_CONTENT",
    similes: [
        "SHOW_PAGE",
        "VIEW_PAGE",
        "READ_PAGE",
        "GET_CONTENT",
        "SHOW_CONTENT",
        "VIEW_CONTENT",
        "DISPLAY_PAGE",
    ],
    description: "Retrieve and display content from a specific Notion page",
    validate: async (runtime: IAgentRuntime) => {
        await validateNotionConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: Record<string, unknown>,
        callback?: HandlerCallback
    ): Promise<boolean> => {
        try {
            const config = await validateNotionConfig(runtime);
            const notionService = new NotionService({
                token: config.NOTION_API_TOKEN,
            });

            let localState = state;
            localState = !localState
                ? await runtime.composeState(message)
                : await runtime.updateRecentMessageState(localState);

            const context = composeContext({
                state: localState,
                template: contentTemplate,
            });

            const content = await generateObjectDeprecated({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
            });

            if (!content?.pageId) {
                throw new Error("Не смог понять, какую страницу вы хотите получить");
            }

            const pageContent = await notionService.getPageContent(content.pageId);

            if (callback) {
                if (!pageContent) {
                    callback({
                        text: "Извините, я не смог получить содержимое страницы. Страница может не существовать или у меня нет доступа к ней.",
                        content: { error: "Page not found or inaccessible" },
                    });
                } else {
                    const contentText = pageContent.content.join("\n\n");
                    callback({
                        text: `Вот содержимое страницы "${pageContent.title}":\n\n${contentText}`,
                        content: pageContent,
                    });
                }
            }

            return true;
        } catch (error: any) {
            elizaLogger.error("Error retrieving page content:", error);
            if (callback) {
                callback({
                    text: `Извините, произошла ошибка при получении содержимого страницы: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: getPageContentExamples as ActionExample[][],
} as Action;