 /**
 * Notion service configuration
 */
export interface NotionConfig {
    token: string;
    version?: string;
    baseURL?: string;
    timeout?: number;
}

/**
 * Service options
 */
export interface ServiceOptions {
    timeout?: number;
}

/**
 * Page content response
 */
export interface PageContent {
    id: string;
    title: string;
    created_time: string;
    last_edited_time: string;
    content: string[];
}

/**
 * Search request parameters
 */
export interface SearchRequest {
    query: string;
    filter?: {
        property: string;
        value: string;
    };
    page_size?: number;
}

/**
 * Block content request
 */
export interface BlockRequest {
    blockId: string;
    pageSize?: number;
}