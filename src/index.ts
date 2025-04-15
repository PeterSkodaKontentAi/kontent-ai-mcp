import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createDeliveryClient } from '@kontent-ai/delivery-sdk';
import { createManagementClient } from '@kontent-ai/management-sdk';

// Create server instance
const server = new McpServer({
  name: "kontent-ai",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "get-item-mapi",
  "Get Kontent.ai item by codename from Management API",
  {
    codename: z.string().describe("Codename of the item to get")
  },
  async ({ codename }) => {
    const client = createManagementClient({
      apiKey: process.env.KONTENT_API_KEY ?? "",
      environmentId: process.env.KONTENT_ENVIRONMENT_ID ?? "",
    });

    const response = await client
      .viewContentItem()
      .byItemCodename(codename)
      .toPromise();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data),
        },
      ],
    };
  }
);

server.tool(
  "get-item-dapi",
  "Get Kontent.ai item by codename from Delivery API",
  {
    codename: z.string().describe("Codename of the item to get"),
    environmentId: z.string().describe("Environment ID of the item's environment"),
  },
  async ({ codename, environmentId }) => {
    const client = createDeliveryClient({
      environmentId, 
    });

    const response = await client
      .item(codename)
      .toPromise();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data.item),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Kontent.ai MCP Server for DAPI running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

