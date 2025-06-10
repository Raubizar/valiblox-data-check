#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { createClient } = require('@supabase/supabase-js');

const server = new Server(
  {
    name: 'supabase-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Supabase client
let supabase;
try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  }
  
  supabase = createClient(supabaseUrl, supabaseKey);
  console.error('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error.message);
  process.exit(1);
}

// Define tools
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'query_table',
        description: 'Query a Supabase table with optional filters',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'The name of the table to query',
            },
            select: {
              type: 'string',
              description: 'Columns to select (default: *)',
              default: '*',
            },
            filter: {
              type: 'object',
              description: 'Filter conditions as key-value pairs',
              additionalProperties: true,
            },
            limit: {
              type: 'number',
              description: 'Maximum number of rows to return',
              default: 100,
            },
          },
          required: ['table'],
        },
      },
      {
        name: 'insert_row',
        description: 'Insert a new row into a Supabase table',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'The name of the table to insert into',
            },
            data: {
              type: 'object',
              description: 'The data to insert as key-value pairs',
              additionalProperties: true,
            },
          },
          required: ['table', 'data'],
        },
      },
      {
        name: 'update_row',
        description: 'Update rows in a Supabase table',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'The name of the table to update',
            },
            data: {
              type: 'object',
              description: 'The data to update as key-value pairs',
              additionalProperties: true,
            },
            filter: {
              type: 'object',
              description: 'Filter conditions to identify rows to update',
              additionalProperties: true,
            },
          },
          required: ['table', 'data', 'filter'],
        },
      },
      {
        name: 'delete_row',
        description: 'Delete rows from a Supabase table',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'The name of the table to delete from',
            },
            filter: {
              type: 'object',
              description: 'Filter conditions to identify rows to delete',
              additionalProperties: true,
            },
          },
          required: ['table', 'filter'],
        },
      },
      {
        name: 'create_table',
        description: 'Create a new table in Supabase (requires appropriate permissions)',
        inputSchema: {
          type: 'object',
          properties: {
            sql: {
              type: 'string',
              description: 'SQL CREATE TABLE statement',
            },
          },
          required: ['sql'],
        },
      },
      {
        name: 'execute_sql',
        description: 'Execute raw SQL query (use with caution)',
        inputSchema: {
          type: 'object',
          properties: {
            sql: {
              type: 'string',
              description: 'SQL query to execute',
            },
          },
          required: ['sql'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'query_table': {
        let query = supabase.from(args.table).select(args.select || '*');
        
        if (args.filter) {
          Object.entries(args.filter).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        if (args.limit) {
          query = query.limit(args.limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'insert_row': {
        const { data, error } = await supabase
          .from(args.table)
          .insert(args.data)
          .select();
        
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully inserted row: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case 'update_row': {
        let query = supabase.from(args.table).update(args.data);
        
        Object.entries(args.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
        
        const { data, error } = await query.select();
        
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully updated rows: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case 'delete_row': {
        let query = supabase.from(args.table);
        
        Object.entries(args.filter).forEach(([key, value]) => {
          query = query.delete().eq(key, value);
        });
        
        const { data, error } = await query.select();
        
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully deleted rows: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case 'create_table':
      case 'execute_sql': {
        const { data, error } = await supabase.rpc('exec_sql', { sql: args.sql });
        
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: `SQL executed successfully: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Supabase MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
