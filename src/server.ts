import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createDeliveryClient } from '@kontent-ai/delivery-sdk';
import { createManagementClient } from '@kontent-ai/management-sdk';

// Create server instance
export const createServer = () => {
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
  server.tool(
    "get-variant-mapi",
    "Get language variant of a content item from Management API",
    {
      itemCodename: z.string().describe("Codename of the content item"),
      languageCodename: z.string().describe("Codename of the language variant to get")
    },
    async ({ itemCodename, languageCodename }) => {
      const client = createManagementClient({
        apiKey: process.env.KONTENT_API_KEY ?? "",
        environmentId: process.env.KONTENT_ENVIRONMENT_ID ?? "",
      });

      const response = await client
        .viewLanguageVariant()
        .byItemCodename(itemCodename)
        .byLanguageCodename(languageCodename)
        .toPromise();

      return {
        content: [
          {
            type: "text", 
            text: JSON.stringify(response.data)
          }
        ]
      };
    }
  );
  server.tool(
    "get-type-mapi",
    "Get content type by codename from Management API",
    {
      codename: z.string().describe("Codename of the content type to get")
    },
    async ({ codename }) => {
      const client = createManagementClient({
        apiKey: process.env.KONTENT_API_KEY ?? "",
        environmentId: process.env.KONTENT_ENVIRONMENT_ID ?? "",
      });

      const response = await client
        .viewContentType()
        .byTypeCodename(codename)
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
    "list-all-content-types-mapi",
    "Get all content types from Management API",
    {},
    async () => {
      const client = createManagementClient({
        apiKey: process.env.KONTENT_API_KEY ?? "",
        environmentId: process.env.KONTENT_ENVIRONMENT_ID ?? "",
      });

      const response = await client
        .listContentTypes()
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
    "add-item-mapi",
    "Add a new content item via Management API",
    {
      name: z.string().describe("Display name of the item"),
      typeCodename: z.string().describe("Codename of the content type that defines the structure and elements of the item (e.g. article, blog_post, etc.)")
    },
    async ({ name, typeCodename }) => {
      const client = createManagementClient({
        apiKey: process.env.KONTENT_API_KEY ?? "",
        environmentId: process.env.KONTENT_ENVIRONMENT_ID ?? "",
      });

      const response = await client
        .addContentItem()
        .withData({
          name: name,
          type: {
            codename: typeCodename
          }
        })
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
    "upsert-variant-mapi",
    "Create or update a language variant of a content item via Management API",
    {
      itemCodename: z.string().describe("Codename of the content item to modify"),
      languageCodename: z.string().describe("Codename of the language variant (e.g. 'en-US', 'es-ES')"),
      elements: z.record(z.any()).describe("List of elements as defined in the item's content type")
    },
    async ({ itemCodename, languageCodename, elements }) => {
      const client = createManagementClient({
        apiKey: process.env.KONTENT_API_KEY ?? "",
        environmentId: process.env.KONTENT_ENVIRONMENT_ID ?? "",
      });

      const response = await client
        .upsertLanguageVariant()
        .byItemCodename(itemCodename)
        .byLanguageCodename(languageCodename)
        .withData(() => {
          return {
            elements: Object.entries(elements).map(([codename, value]) => ({
              element: { codename },
              value
            }))
          };
        })
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

  return { server };
};