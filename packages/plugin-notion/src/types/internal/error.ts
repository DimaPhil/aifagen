 /**
 * Base error class for Notion-related errors
 */
export class NotionError extends Error {
    public readonly code: number;
    public readonly originalError?: unknown;

    constructor(message: string, code: number = 400, originalError?: unknown) {
        super(message);
        this.name = 'NotionError';
        this.code = code;
        this.originalError = originalError;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotionError);
        }
    }
}

export class AuthenticationError extends NotionError {
    constructor(message = 'Invalid Notion token') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

export class BlockNotFoundError extends NotionError {
    constructor(blockId: string) {
        super(`Block not found: ${blockId}`, 404);
        this.name = 'BlockNotFoundError';
    }
}

export class PageNotFoundError extends NotionError {
    constructor(pageId: string) {
        super(`Page not found: ${pageId}`, 404);
        this.name = 'PageNotFoundError';
    }
}

export class ApiError extends NotionError {
    constructor(
        message: string,
        code: number,
        public readonly response?: unknown
    ) {
        super(message, code);
        this.name = 'ApiError';
    }
}