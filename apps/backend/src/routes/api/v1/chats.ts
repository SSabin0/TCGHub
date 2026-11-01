import Fastify from 'fastify';
import ChatController from '@/controllers/chatController.js';
import {
  chatCreationBodySchema,
  chatParamsSchema,
  chatPostMessageBodySchema,
} from './routeSchemas.js';
import type {
  ChatCreationBodyInterface,
  ChatParamsInterface,
  ChatPostMessageBodyInterface,
} from './routeSchemas.js';
import { ChatType } from '@prisma/client';
import { properties } from 'zod';

export default async function chatRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new ChatController();

  fastify.get(
    '/',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        response: {
          200: {
            description: 'OK',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                type: { type: 'string', enum: Object.values(ChatType) },
                title: { type: 'string' },
                created_at: { type: 'string', format: 'date-time' },
                members: {
                  type: 'array',
                  items: { type: 'string', format: 'uuid' },
                },
                last_read_message_id: { type: ['string', 'null'], format: 'uuid' },
                joined_at: { type: 'string', format: 'date-time' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.getChats,
  );

  fastify.post<{ Body: ChatCreationBodyInterface }>(
    '/',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        body: chatCreationBodySchema,
        response: {
          201: {
            description: 'Created',
            type: 'object',
            properties: {
              success: { type: 'string' },
              chatID: { type: 'string', format: 'uuid' },
            },
          },
          401: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.createChat,
  );

  fastify.delete<{ Body: {} }>(
    '/',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        body: {},
        response: {
          503: {
            description: 'Service Unavailable',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.deleteChat,
  );

  fastify.get<{ Params: ChatParamsInterface }>(
    '/:chatId',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        params: chatParamsSchema,
        response: {
          200: {
            description: 'OK',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              type: { type: 'string', enum: Object.values(ChatType) },
              title: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              members: {
                type: 'array',
                items: { type: 'string', format: 'uuid' },
              },
              last_read_message_id: { type: ['string', 'null'], format: 'uuid' },
              joined_at: { type: 'string', format: 'date-time' },
            },
          },
          401: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          404: {
            description: 'Not Found',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.getChatDetails,
  );

  fastify.patch<{ Params: ChatParamsInterface; Body: {} }>(
    '/:chatId',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        params: chatParamsSchema,
        body: {},
        response: {
          503: {
            description: 'Service Unavailable',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.updateChatDetails,
  );

  fastify.get<{ Params: ChatParamsInterface }>(
    '/:chatId/messages',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        params: chatParamsSchema,
        response: {
          200: {
            description: 'OK',
            type: 'object',
            properties: {
              messages: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    body: { type: 'string' },
                    chat_id: { type: 'string', format: 'uuid' },
                    sender_id: { type: 'string', format: 'uuid' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          404: {
            description: 'Not Found',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.getChatMessages,
  );

  fastify.post<{ Params: ChatParamsInterface; Body: ChatPostMessageBodyInterface }>(
    '/:chatId/messages',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        params: chatParamsSchema,
        body: chatPostMessageBodySchema,
        response: {
          201: {
            description: 'Created',
            type: 'object',
            properties: {
              success: { type: 'string' },
            },
          },
          401: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          404: {
            description: 'Not Found',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    controller.postMessage,
  );
}
