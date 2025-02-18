 /**
 * Notion API types
 */
export interface RichText {
    plain_text: string;
    type?: string;
    text?: {
        content: string;
        link?: {
            url: string;
        };
    };
    annotations?: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
    };
}

export interface TableRow {
    type: string;
    table_row: {
        cells: RichText[][];
    };
}

export interface Block {
    id: string;
    type: string;
    has_children?: boolean;
    created_time?: string;
    last_edited_time?: string;
    archived?: boolean;
    [key: string]: any;
}

export interface NotionPage {
    id: string;
    object: string;
    created_time: string;
    last_edited_time: string;
    archived: boolean;
    properties: {
        [key: string]: {
            type: string;
            title?: RichText[];
            rich_text?: RichText[];
            number?: number;
            select?: {
                name: string;
                color: string;
            };
            multi_select?: Array<{
                name: string;
                color: string;
            }>;
            date?: {
                start: string;
                end?: string;
            };
            checkbox?: boolean;
            url?: string;
            email?: string;
            phone_number?: string;
        };
    };
}

export interface SearchResponse {
    object: 'list';
    results: NotionPage[];
    next_cursor: string | null;
    has_more: boolean;
}

export interface BlockChildrenResponse {
    object: 'list';
    results: Block[];
    next_cursor: string | null;
    has_more: boolean;
}
