import type { Plugin } from "@elizaos/core";
import { searchPages } from "./actions/searchPages";
import { getPageContent } from "./actions/getPageContent";

export const notionPlugin: Plugin = {
    name: "notion",
    description: "Notion integration plugin for Eliza",
    actions: [searchPages, getPageContent],
    evaluators: [],
    providers: [],
};

export default notionPlugin;