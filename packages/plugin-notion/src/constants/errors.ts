export const ERROR_CODES = {
    INVALID_TOKEN: 401,
    INVALID_PARAMETERS: 400,
    NOT_FOUND: 404,
    RATE_LIMITED: 429,
} as const;

export const ERROR_MESSAGES = {
    MISSING_TOKEN: 'Notion token is required but not configured',
    INVALID_TOKEN: 'Invalid Notion token',
    BLOCK_NOT_FOUND: (blockId: string) => `Block not found: ${blockId}`,
    PAGE_NOT_FOUND: (pageId: string) => `Page not found: ${pageId}`,
    RATE_LIMITED: 'Rate limit exceeded. Please try again later.',
} as const;