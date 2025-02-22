import {
    type Action,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger
} from "@elizaos/core";
import { encodingForModel, type TiktokenModel } from "js-tiktoken";
import { WebSearchService } from "../services/webSearchService";
import type { SearchResult } from "../types";

const DEFAULT_MAX_WEB_SEARCH_TOKENS = 4000;
const DEFAULT_MODEL_ENCODING = "gpt-3.5-turbo";

function getTotalTokensFromString(
    str: string,
    encodingName: TiktokenModel = DEFAULT_MODEL_ENCODING
) {
    const encoding = encodingForModel(encodingName);
    return encoding.encode(str).length;
}

function MaxTokens(
    data: string,
    maxTokens: number = DEFAULT_MAX_WEB_SEARCH_TOKENS
): string {
    if (getTotalTokensFromString(data) >= maxTokens) {
        return data.slice(0, maxTokens);
    }
    return data;
}

export const webSearch: Action = {
    name: "WEB_SEARCH",
    similes: [
        "SEARCH_WEB",
        "INTERNET_SEARCH",
        "LOOKUP",
        "QUERY_WEB",
        "FIND_ONLINE",
        "SEARCH_ENGINE",
        "WEB_LOOKUP",
        "ONLINE_SEARCH",
        "FIND_INFORMATION",
    ],
    suppressInitialMessage: true,
    description:
        "Perform a web search to find information related to the message. Always reply in RUSSIAN.",
    // eslint-disable-next-line
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const tavilyApiKeyOk = !!runtime.getSetting("TAVILY_API_KEY");

        return tavilyApiKeyOk;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Composing state for message:", message);
        state = (await runtime.composeState(message)) as State;
        const userId = runtime.agentId;
        elizaLogger.log("User ID:", userId);

        const webSearchPrompt = message.content.text;
        elizaLogger.log("web search prompt received:", webSearchPrompt);

        const webSearchService = new WebSearchService();
        await webSearchService.initialize(runtime);
        const searchResponse = await webSearchService.search(
            webSearchPrompt,
        );

        if (searchResponse && searchResponse.results.length) {
            const responseList = searchResponse.answer
                ? `${searchResponse.answer}${
                      Array.isArray(searchResponse.results) &&
                      searchResponse.results.length > 0
                          ? `\n\nFor more details, you can check out these resources:\n${searchResponse.results
                                .map(
                                    (result: SearchResult, index: number) =>
                                        `${index + 1}. [${result.title}](${result.url})`
                                )
                                .join("\n")}`
                          : ""
                  }`
                : "";

            callback({
                text: MaxTokens(responseList, DEFAULT_MAX_WEB_SEARCH_TOKENS),
            });
        } else {
            elizaLogger.error("search failed or returned no data.");
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Find the latest news about SpaceX launches.",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here is the latest news about SpaceX launches:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you find details about the iPhone 16 release?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here are the details I found about the iPhone 16 release:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is the schedule for the next FIFA World Cup?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here is the schedule for the next FIFA World Cup:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Check the latest stock price of Tesla." },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here is the latest stock price of Tesla I found:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are the current trending movies in the US?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here are the current trending movies in the US:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is the latest score in the NBA finals?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here is the latest score from the NBA finals:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "When is the next Apple keynote event?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here is the information about the next Apple keynote event:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Найди последние новости о запусках SpaceX.",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Вот последние новости о запусках SpaceX:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Можешь найти подробности о выходе iPhone 16?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Вот подробности, которые я нашел о выходе iPhone 16:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Какое расписание следующего Чемпионата мира по футболу?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Вот расписание следующего Чемпионата мира по футболу:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { 
                    text: "Проверь последнюю цену акций Tesla." 
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Вот последняя цена акций Tesla, которую я нашел:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Какие фильмы сейчас в тренде в США?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Вот фильмы, которые сейчас в тренде в США:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Какой последний счет в финалах NBA?",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Вот последний счет финалов NBA:",
                    action: "WEB_SEARCH",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { 
                    text: "Когда следующая презентация Apple?" 
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Вот информация о следующей презентации Apple:",
                    action: "WEB_SEARCH",
                },
            },
        ],
    ],
} as Action;