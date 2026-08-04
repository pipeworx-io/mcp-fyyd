# @pipeworx/fyyd

fyyd MCP — open podcast directory (~3M podcasts indexed worldwide). No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search_podcasts(term, lang?, count?, page?)` — search shows by title
- `search_episodes(term, lang?, count?, page?)` — search across episode titles + descriptions
- `get_podcast(podcast_id)` — show metadata + last episodes
- `get_podcast_by_url(feed_url)` — resolve an RSS feed URL to a fyyd id
- `latest_episodes(podcast_id, count?, page?)` — chronological episode list
- `top_podcasts(category?, lang?, count?)` — current popular shows
- `categories()` — fyyd's category tree

## Data source

`https://api.fyyd.de/0.2/` — public REST.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
