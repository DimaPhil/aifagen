 # Notion Plugin for Eliza

This plugin enables Eliza to interact with Notion, providing capabilities for searching pages and retrieving content.

## Features

- 🔍 Search Notion pages
- 📄 Retrieve page content
- 📝 Parse rich text and tables
- ✅ Comprehensive error handling
- 🔒 Secure API integration

## Prerequisites

1. **Notion Account**: You need a Notion account and integration
2. **API Token**: Generate an API token from your Notion integrations page:
    - Go to https://www.notion.so/my-integrations
    - Create a new integration
    - Copy the integration token
    - Share the pages you want to access with your integration

## Configuration

Set the following environment variable:

```env
NOTION_API_TOKEN=your_integration_token
```

## Installation

Add the plugin to your Eliza configuration:

```json
{
    "plugins": ["@elizaos/plugin-notion"]
}
```

## Available Actions

The plugin provides the following actions:

1. **SEARCH_PAGES**: Search for pages in Notion
    - Example: "Find pages about project planning"
    - Example: "Search for meeting notes"

2. **GET_PAGE_CONTENT**: Retrieve content from a specific page
    - Example: "Show me the content of the project roadmap"
    - Example: "Get the meeting notes from yesterday"

## Important Notes

1. **API Rate Limits**: Notion implements rate limiting:
    - The plugin handles rate limiting errors appropriately
    - Implements exponential backoff for retries

2. **Permissions**: Pages must be shared with your integration:
    - The integration can only access pages it has been explicitly shared with
    - Make sure to share relevant pages with your integration

3. **Error Handling**: The plugin provides detailed error messages for:
    - Invalid API tokens
    - Missing permissions
    - Rate limiting
    - Other API-specific errors

## Service Architecture

The plugin is organized into specialized services:

- `SearchService`: Handles page search operations
- `ContentService`: Manages content retrieval and parsing
- `BaseService`: Provides common functionality