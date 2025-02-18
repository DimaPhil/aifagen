import { ActionExample } from "@elizaos/core";

export const searchPagesExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you find pages about project planning?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll search for project planning documents in Notion.",
                action: "SEARCH_PAGES",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here are the pages I found matching \"project planning\":\n- Project Planning Guide (created: 2024-01-15)\n- Q1 Project Timeline (created: 2024-01-20)",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Можешь найти страницы про проект планирование?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Я ищу страницы про проект планирование в Notion.",
                action: "SEARCH_PAGES",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Вот страницы, которые я нашел по запросу \"project planning\":\n- Project Planning Guide (created: 2024-01-15)\n- Q1 Project Timeline (created: 2024-01-20)",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Find my meeting notes from last week",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll look for meeting notes in your Notion workspace.",
                action: "SEARCH_PAGES",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here are the pages I found matching \"meeting notes\":\n- Team Sync Notes (created: 2024-01-25)\n- Client Meeting Summary (created: 2024-01-23)",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Найди мои заметки митингов за последнюю неделю",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Я ищу заметки с митингов за последнюю неделю.",
                action: "SEARCH_PAGES",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Вот страницы, которые я нашел по запросу \"заметки с митингов\":\n- Team Sync Notes (created: 2024-01-25)\n- Client Meeting Summary (created: 2024-01-23)",
            },
        },
    ],
];

export const getPageContentExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Show me the content of page abc123",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll get the content from page abc123 for you.",
                action: "GET_PAGE_CONTENT",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here's the content of \"Project Overview\":\n\nProject Goals:\n1. Launch new feature by Q2\n2. Improve user engagement\n\nTimeline:\n- Planning: January\n- Development: February-March\n- Testing: April\n- Launch: May",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What's in the meeting notes page def456?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll show you the content of def456.",
                action: "GET_PAGE_CONTENT",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here's the content of \"Team Meeting Notes\":\n\nAttendees:\n- John\n- Sarah\n- Mike\n\nDiscussion Points:\n1. Project status update\n2. Resource allocation\n3. Next steps",
            },
        },
    ],
];