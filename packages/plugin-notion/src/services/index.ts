import { elizaLogger } from "@elizaos/core";
import { API_DEFAULTS, API_ENDPOINTS } from "../constants/api";
import { ERROR_MESSAGES } from "../constants/errors";
import type { NotionConfig, PageContent, SearchRequest } from "../types/internal/config";
import type { NotionPage, SearchResponse } from "../types/api/notion";
import axios from "axios";

export class NotionService {
    private token: string;
    private baseURL: string;
    private version: string;

    constructor(config: NotionConfig) {
        this.token = config.token;
        this.baseURL = config.baseURL || API_DEFAULTS.BASE_URL;
        this.version = config.version || API_DEFAULTS.API_VERSION;
    }

    private async request<T>(endpoint: string, options: any = {}): Promise<T> {
        try {
            const response = await axios({
                ...options,
                url: `${this.baseURL}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Notion-Version': this.version,
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
            return response.data;
        } catch (error: any) {
            elizaLogger.error('Notion API Error:', error);
            throw new Error(error.response?.data?.message || error.message);
        }
    }

    async searchPages(params: SearchRequest) {
        const response = await this.request<SearchResponse>(API_ENDPOINTS.SEARCH, {
            method: 'POST',
            data: {
                query: params.query,
                filter: params.filter,
                page_size: params.page_size || 10,
            },
        });

        return response.results.map((page: NotionPage) => ({
            id: page.id,
            title: page.properties.title?.title?.[0]?.plain_text || 'Untitled',
            created_time: page.created_time,
            url: this._constructNotionPageUrl(page),
        }));
    }

    async getPageContent(pageId: string): Promise<PageContent> {
        const page = await this.request<NotionPage>(`${API_ENDPOINTS.PAGES}/${pageId}`);
        
        const blocks = await this.request<any>(`${API_ENDPOINTS.BLOCKS}/${pageId}/children`);
        
        const content = blocks.results.map((block: any) => {
            if (block.paragraph) {
                return block.paragraph.rich_text.map((text: any) => text.plain_text).join('');
            }
            return '';
        }).filter(Boolean);

        return {
            id: page.id,
            title: page.properties.title?.title?.[0]?.plain_text || 'Untitled',
            created_time: page.created_time,
            last_edited_time: page.last_edited_time,
            content,
        };
    }

     /**
     * Constructs a Notion page URL from a NotionPage object
     * @param page NotionPage object
     * @param workspaceName Optional workspace name (defaults to 'workspace')
     * @returns Constructed Notion page URL
     */
     _constructNotionPageUrl(page: NotionPage): string {
        // Get the page title from properties
        let pageTitle = '';
        for (const [key, value] of Object.entries(page.properties)) {
            if (value.type === 'title' && value.title && value.title.length > 0) {
                pageTitle = value.title.map(text => text.plain_text).join('');
                break;
            }
        }

        // Sanitize the page title for URL
        const sanitizedTitle = pageTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

        // Format the page ID by removing hyphens
        const formattedId = page.id.replace(/-/g, '');

        // Construct the URL
        return `https://notion.so/${sanitizedTitle}-${formattedId}`;
    }
}