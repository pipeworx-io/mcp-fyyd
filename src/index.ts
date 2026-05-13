interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * fyyd MCP — open podcast directory
 *
 * Auth: none.
 * Docs: https://github.com/eazyliving/fyyd-api
 */


const BASE = 'https://api.fyyd.de/0.2';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_podcasts',
    description: 'Search podcasts by title.',
    inputSchema: {
      type: 'object',
      properties: {
        term: { type: 'string' },
        lang: { type: 'string', description: 'ISO 639-1 language filter (e.g. en, de)' },
        count: { type: 'number', description: '1-30 (default 10)' },
        page: { type: 'number' },
      },
      required: ['term'],
    },
  },
  {
    name: 'search_episodes',
    description: 'Search episodes by title + description.',
    inputSchema: {
      type: 'object',
      properties: {
        term: { type: 'string' },
        lang: { type: 'string' },
        count: { type: 'number' },
        page: { type: 'number' },
      },
      required: ['term'],
    },
  },
  {
    name: 'get_podcast',
    description: 'Podcast metadata + recent episodes.',
    inputSchema: {
      type: 'object',
      properties: { podcast_id: { type: 'number' } },
      required: ['podcast_id'],
    },
  },
  {
    name: 'get_podcast_by_url',
    description: 'Resolve an RSS feed URL to its fyyd id.',
    inputSchema: {
      type: 'object',
      properties: { feed_url: { type: 'string' } },
      required: ['feed_url'],
    },
  },
  {
    name: 'latest_episodes',
    description: 'Latest episodes for a podcast.',
    inputSchema: {
      type: 'object',
      properties: {
        podcast_id: { type: 'number' },
        count: { type: 'number' },
        page: { type: 'number' },
      },
      required: ['podcast_id'],
    },
  },
  {
    name: 'top_podcasts',
    description: 'Current popular podcasts.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Category slug from `categories`' },
        lang: { type: 'string' },
        count: { type: 'number' },
      },
    },
  },
  {
    name: 'categories',
    description: 'Category tree.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_podcasts': {
      const params = new URLSearchParams({
        term: reqStr(args, 'term', '"tim ferriss"'),
        count: String(Math.min(30, Math.max(1, (args.count as number) ?? 10))),
      });
      if (args.lang) params.set('language', String(args.lang));
      if (args.page !== undefined) params.set('page', String(args.page));
      return fyydGet(`/search/podcast?${params}`);
    }
    case 'search_episodes': {
      const params = new URLSearchParams({
        term: reqStr(args, 'term', '"interview"'),
        count: String(Math.min(30, Math.max(1, (args.count as number) ?? 10))),
      });
      if (args.lang) params.set('language', String(args.lang));
      if (args.page !== undefined) params.set('page', String(args.page));
      return fyydGet(`/search/episode?${params}`);
    }
    case 'get_podcast':
      return fyydGet(`/podcast?podcast_id=${reqNum(args, 'podcast_id', '8095')}`);
    case 'get_podcast_by_url':
      return fyydGet(`/feed/info?url=${encodeURIComponent(reqStr(args, 'feed_url', '"https://example.com/feed.xml"'))}`);
    case 'latest_episodes': {
      const params = new URLSearchParams({
        podcast_id: String(reqNum(args, 'podcast_id', '8095')),
        count: String(Math.min(50, Math.max(1, (args.count as number) ?? 10))),
      });
      if (args.page !== undefined) params.set('page', String(args.page));
      return fyydGet(`/podcast/episodes?${params}`);
    }
    case 'top_podcasts': {
      const params = new URLSearchParams({
        count: String(Math.min(30, Math.max(1, (args.count as number) ?? 10))),
      });
      if (args.category) params.set('category', String(args.category));
      if (args.lang) params.set('language', String(args.lang));
      return fyydGet(`/podcast/hot?${params}`);
    }
    case 'categories':
      return fyydGet('/categories');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function fyydGet(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'pipeworx-mcp-fyyd/1.0 (+https://pipeworx.io)',
    },
  });
  if (res.status === 404) throw new Error('fyyd: not found');
  if (res.status === 429) throw new Error('fyyd: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`fyyd error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}
function reqNum(args: Record<string, unknown>, key: string, example: string): number {
  const v = args[key];
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new Error(`Required argument "${key}" must be a number. Example: ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
