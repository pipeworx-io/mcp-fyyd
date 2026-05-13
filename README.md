# mcp-fyyd

fyyd MCP — open podcast directory

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_podcasts` | Search podcasts by title. |
| `search_episodes` | Search episodes by title + description. |
| `get_podcast` | Podcast metadata + recent episodes. |
| `get_podcast_by_url` | Resolve an RSS feed URL to its fyyd id. |
| `latest_episodes` | Latest episodes for a podcast. |
| `top_podcasts` | Current popular podcasts. |
| `categories` | Category tree. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "fyyd": {
      "url": "https://gateway.pipeworx.io/fyyd/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Fyyd data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
