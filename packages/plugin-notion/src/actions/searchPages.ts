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
import { searchPagesExamples } from "../examples";
import { NotionService } from "../services";
import { SearchRequest } from "../types/internal/config";

const searchTemplate = `Look at ONLY your LAST RESPONSE message in this conversation, where you just confirmed what to search for in Notion.
Based on ONLY that last message, extract the search query.

Always reply in RUSSIAN language.

For example:
- If your last message was "I'll search for project planning documents..." -> return "project planning"
- If your last message was "I'll look for meeting notes..." -> return "meeting notes"
- If your last message was "I'll find documents about marketing strategy..." -> return "marketing strategy"

\`\`\`json
{
    "query": "<search query from your LAST response only>"
}
\`\`\`

Last part of conversation:
{{recentMessages}}`;

export const searchPages: Action = {
    name: "SEARCH_PAGES",
    similes: [
        "FIND_PAGES",
        "SEARCH_NOTION",
        "FIND_DOCUMENTS",
        "SEARCH_DOCUMENTS",
        "FIND_IN_NOTION",
        "LOOKUP_PAGES",
    ],
    description: "Search for pages in Notion based on a query",
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
                template: searchTemplate,
            });

            const content = await generateObjectDeprecated({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
            }) as SearchRequest;

            if (!content?.query) {
                throw new Error("Я не смог понять, что именно вы хотите найти в Notion");
            }

            const searchResults = await notionService.searchPages(content);

            if (callback) {
                if (searchResults.length === 0) {
                    callback({
                        text: `Я не смог найти страницы в Notion по запросу "${content.query}"`,
                        content: { results: [] },
                    });
                } else {
                    const resultText = searchResults
                        .map(page => `- [${page.title}](${page.url}) (создана: ${page.created_time})`)
                        .join("\n");

                    callback({
                        text: `Вот страницы, которые я нашел в Notion по запросу "${content.query}":\n${resultText}`,
                        content: { results: searchResults },
                    });
                }
            }

            return true;
        } catch (error: any) {
            elizaLogger.error("Ошибка при поиске страниц в Notion:", error);
            if (callback) {
                callback({
                    text: `Извините, произошла ошибка при поиске: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: searchPagesExamples as ActionExample[][],

} as Action;