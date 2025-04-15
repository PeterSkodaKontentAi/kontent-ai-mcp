import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createDeliveryClient } from '@kontent-ai/delivery-sdk';

// Create server instance
const { server } = createServer();
  
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Kontent.ai MCP Server for DAPI running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

