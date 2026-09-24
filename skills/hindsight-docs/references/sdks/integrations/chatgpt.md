
# ChatGPT

Add persistent, searchable memory to [ChatGPT](https://chatgpt.com) using [Hindsight](https://vectorize.io/hindsight). Store insights from your conversations and automatically recall relevant context in future sessions—all secured with OAuth.

## Overview

ChatGPT's built-in memory helps with preferences, but knowledge from specific conversations (research, code, decisions) is lost when you start a new chat. Hindsight solves this by providing:

- **Cross-session memory** — Knowledge from one conversation persists to the next
- **Smart recall** — Hindsight automatically retrieves relevant memories when you need them
- **No API keys** — OAuth handles authentication securely
- **Custom instructions** — Aggressive auto-retain/recall via system prompts

## Quick Start

### 1. Create a Hindsight Cloud Account

[Sign up free](https://ui.hindsight.vectorize.io/signup) for Hindsight Cloud.

### 2. Add Hindsight as a Plugin in ChatGPT

**Requirements**

- A ChatGPT plan that allows custom MCP servers. OpenAI documents this for Plus, Pro, Business, Enterprise and Edu; the option may also appear on Free.
- **Developer mode** turned on. Custom MCP servers are a developer-mode feature. On Business and Enterprise plans an admin may have to allow it first, which is the most common reason the option is missing.

**Steps** (verified against chatgpt.com in September 2026; menu names vary by plan and rollout)

1. Go to [ChatGPT Settings](https://chatgpt.com/#settings) → **Plugins** (older builds call this **Apps & Connectors** or **Connectors**)
2. Click **Developer mode**. It opens **Security and login → Developer mode**; turn the toggle on
3. Back in **Plugins**, click **Browse plugins**, then the **+** button next to the search box, then **Upload plugin**
4. In the **New Plugin** dialog click **Create MCP App**
5. Fill in:
   - **Name:** `Hindsight` (or your preferred name)
   - **Connection:** Server URL `https://api.hindsight.vectorize.io/mcp/default/`
   - **Authentication:** OAuth
   - Tick **I understand and want to continue**
6. Click **Create**, then **Sign in with Hindsight**. A window opens on Hindsight Cloud
7. Sign in if asked, choose the organization to authorize, and click **Approve and Continue**
8. Return to ChatGPT; the plugin shows its tools once the connection completes

To use in a chat: click **+** in the message composer → **More** → select **Hindsight**

ChatGPT's settings menus change between plans and rollouts, so the labels above may not match yours exactly. Whatever the menu is called, the steps are the same: turn on Developer mode, create a plugin or connector, paste the Hindsight MCP URL, choose OAuth.

### 3. Configure Custom Instructions for Automatic Retention

The connector is now active, but you need to tell ChatGPT to actually use it. Add custom instructions to enable automatic memory capture and recall:

1. Go to **Settings → Personalization → Custom instructions**
2. Copy and paste this instruction:

```
After every response, automatically use the Hindsight tool to retain key information from our conversation:
- Important facts, decisions, or learnings we discussed
- Your preferences, goals, or constraints mentioned
- Code patterns, architecture decisions, or technical insights
- Any information that might be useful in future conversations

Before generating each response, automatically use the Hindsight tool to recall relevant memories that might apply to the current conversation. Include recalled memories in your reasoning.

Retain and recall aggressively—assume everything is valuable. The Hindsight tool will handle deduplication and relevance filtering.
```

3. Save and close settings

From now on, ChatGPT will automatically store insights from your conversations and surface relevant memories without you needing to ask.

> **💡 Tip**
>
Feel free to experiment with the instructions to ensure proper behavior.
## Features

- **Automatic retention** — Custom instructions tell ChatGPT to store insights after every response
- **Intelligent recall** — ChatGPT queries Hindsight before generating each response to include relevant memories as context
- **OAuth-secured** — No API keys to copy-paste; sign in once via browser
- **Bank isolation** — Separate memory banks for different projects or purposes
- **Semantic search** — Hindsight understands context, not just keyword matching

## What to Store

Store meaningful, specific knowledge for best results:

- **Project context** — goals, requirements, architecture decisions, constraints
- **Personal preferences** — coding style, communication preferences, learning style
- **Discoveries** — research findings, useful resources, lessons learned
- **Domain knowledge** — industry facts, patterns, techniques you reference
- **Decision history** — why you chose A over B, trade-offs considered

**Example of what to store:**
```
"We're building a real-time collaboration tool. Constraints:
- <500ms latency for cursor updates
- Support 10k concurrent users
- GDPR-compliant data storage
- Team prefers WebSockets over polling"
```

Later, when you ask ChatGPT *"How should we structure our database?"*, Hindsight recalls these constraints. ChatGPT's answer becomes tailored to your actual situation, not generic advice.

## Best Practices

**Be intentional about what you store.** Not every conversation needs retention. Focus on storing insights that will be useful later: lessons learned, architectural decisions, research findings, and personal preferences. Storing trivial facts clutters your memory bank and makes retrieval less useful.

**Use consistent terminology.** If you call your project "ProjectX" in one session and "Project X" in another, Hindsight's semantic search may miss the connection. Establish naming conventions and stick to them.

**Review and refine.** The Hindsight Cloud dashboard lets you browse your memory bank. Periodically review what you've stored. Delete outdated information and consolidate similar insights. A curated memory bank is more valuable than an exhaustive one.

**Structure multi-part decisions.** When storing complex decisions (like architecture trade-offs), include context: the constraints, alternatives considered, and why you chose one path. Future-you will thank present-you for the context.

## Architecture: Single-Bank vs. Multi-Bank

### Single-Bank Mode (Recommended)

Each connector accesses one memory bank. Simpler for most users.

- **URL:** `https://api.hindsight.vectorize.io/mcp/YOUR_BANK_ID/`
- **Setup:** Just enter the URL in the Connector settings
- **Best for:** Dedicated memory per tool (e.g., ChatGPT uses a `writing` bank)

### Multi-Bank Mode

Both tools access multiple banks via bank_id parameter.

- **URL:** `https://api.hindsight.vectorize.io/mcp`
- **Setup:** Requires additional configuration in Hindsight Cloud
- **Best for:** When ChatGPT and Perplexity collaborate on the same project

## Data Privacy and Security

- **OAuth-secured** — no API keys, no copy-paste secrets
- **Your account** — memories live in your Hindsight Cloud account
- **Encrypted in transit** — HTTPS + TLS for all connections
- **No vendor lock-in** — export your memories anytime
- **Scoped access** — the connector can only read/write to its assigned bank

When you approve OAuth in the browser, you're authorizing ChatGPT to:
- **Read** your memory banks (to recall relevant facts)
- **Write** to your memory banks (to store new discoveries)
- **Search** your memories (to find context)

You can revoke access anytime by removing the connector in ChatGPT settings.

## Troubleshooting

**"Connector failed to load"**
- Verify the URL is correct (no typos in your bank ID)
- Check that your Hindsight Cloud account is active
- Try re-creating the connector

**"Authorization failed" or "Access denied"**
- Make sure you're signing in with the same Hindsight Cloud account where you want to store memories
- If using a team account, verify you have permission to access the bank
- Try logging out and back in

**"We couldn't connect this account" or "OAuth callback error" right after approving on Hindsight Cloud**
- The approval on the Hindsight side succeeded but ChatGPT could not finish the token exchange. Send support the exact error text, the time, and which ChatGPT plan you are on
- Sign in to [Hindsight Cloud](https://ui.hindsight.vectorize.io) in the same browser first, then delete and re-create the plugin in ChatGPT
- Don't start the flow twice: if a sign-in window is already open, finish it before clicking **Create** again

**Can't find "Plugins", "Developer mode" or "Create MCP App"**
- Check your plan: custom connectors need Plus, Pro, Business, Enterprise or Edu
- On Business and Enterprise, an admin has to enable Developer mode for the workspace
- The menu names vary; look for **Plugins**, **Apps & Connectors** or **Connectors** under Settings

**"Memory tools appear but don't return results"**
- Give Hindsight a few seconds to index memories (processing is async)
- Make sure you've stored relevant memories using the `retain` operation
- Check the memory bank name matches your connector URL

**Memories aren't being stored**
- Use the Hindsight Cloud dashboard to verify memories are being created
- In ChatGPT, explicitly ask Hindsight to store something: *"Hindsight, remember that we use Vue.js for frontend"*
- Check that your bank isn't full (unlikely, but possible with very large memory sets)

## Next Steps

1. Create your Hindsight Cloud account
2. Add the Hindsight connector to ChatGPT
3. Set up your custom instructions
4. Store your first memory — ask ChatGPT to remember something important to you
5. Start a new chat and ask a related question — watch Hindsight retrieve your stored memory
6. Build the habit of storing meaningful insights over time

Over weeks and months, as your memory bank grows, ChatGPT will give increasingly personalized, informed answers because it's working with your accumulated context instead of starting fresh every time.
