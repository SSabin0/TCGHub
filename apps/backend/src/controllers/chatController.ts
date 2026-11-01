import type {
  ChatCreationBodyInterface,
  ChatParamsInterface,
  ChatPostMessageBodyInterface,
} from '@/routes/api/v1/routeSchemas.js';
import Facade from '@/services/facade.js';
import type { ChatWithMembers, ChatWithMembersCreationInterface } from '@/types/chatObject.js';
import { type UserJwtType, UserJwt } from '@/types/JWTObject.js';
import { find } from '@/utils/find.js';
import type { UserWithChats } from '@/types/userObject.js';
import type { ChatMember } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';

const facade = new Facade();

export default class ChatController {
  async getChats(request: FastifyRequest, reply: FastifyReply) {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const user = await facade.getUserWithChats(jwt.userId);
    const userWithChats = await facade.getUserWithChats(user.id);
    return reply.code(200).send(
      userWithChats.chats.map((x) => {
        const members = x.Chat.members.map((y) => {
          return y.user_id;
        });
        return {
          id: x.Chat.id,
          title: x.Chat.title,
          type: x.Chat.type,
          created_at: x.Chat.created_at,
          members: members,
          last_read_message_id: x.last_read_message_id,
          joined_at: x.joined_at,
        };
      }),
    );
  }

  async createChat(
    request: FastifyRequest<{ Body: ChatCreationBodyInterface }>,
    reply: FastifyReply,
  ) {
    // TODO: handle invalid userId in members
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const chatDetails: ChatWithMembersCreationInterface = request.body;
    chatDetails.members.push(jwt.userId);
    const chat = await facade.createChatWithMembers(chatDetails);
    return reply.code(201).send({ success: 'Chat created', chatID: chat.id });
  }

  async deleteChat(request: FastifyRequest<{ Body: {} }>, reply: FastifyReply) {
    return reply.code(503).send({ error: 'not implemented yet' });
  }

  async getChatDetails(
    request: FastifyRequest<{ Params: ChatParamsInterface }>,
    reply: FastifyReply,
  ) {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const user = await facade.getUserWithChats(jwt.userId);
    const userWithChats: UserWithChats = await facade.getUserWithChats(user.id);
    const chat = await find<
      ChatWithMembers & { joined_at: Date; last_read_message_id: string | null }
    >(
      'id',
      userWithChats.chats.map((x) => {
        return { ...x.Chat, joined_at: x.joined_at, last_read_message_id: x.last_read_message_id };
      }),
      request.params.chatId,
    );
    if (chat === null) {
      return reply.code(404).send({ error: 'Chat Not Found' });
    }

    return reply.code(200).send({
      id: chat.id,
      title: chat.title,
      type: chat.type,
      created_at: chat.created_at,
      members: chat.members.map((x) => {
        return x.user_id;
      }),
      joined_at: chat.joined_at,
      last_read_message_id: chat.last_read_message_id,
    });
  }

  async updateChatDetails(
    request: FastifyRequest<{ Params: ChatParamsInterface }>,
    reply: FastifyReply,
  ) {
    return reply.code(503).send({ error: 'not implemented yet' });
  }

  async getChatMessages(
    request: FastifyRequest<{ Params: ChatParamsInterface }>,
    reply: FastifyReply,
  ) {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const user = await facade.getUserWithChats(jwt.userId);
    const chatFromUser = await find<ChatMember>('chat_id', user.chats, request.params.chatId);
    if (chatFromUser === null) {
      return reply.code(404).send({ error: 'Chat not found' });
    }
    const chat = await facade.getChatWithMessages(chatFromUser.chat_id);

    return reply.code(200).send({
      messages: chat.messages.sort((a, b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }),
    });
  }

  async postMessage(
    request: FastifyRequest<{ Params: ChatParamsInterface; Body: ChatPostMessageBodyInterface }>,
    reply: FastifyReply,
  ) {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const message = request.body.body;
    const userId = jwt.userId;
    const user = await facade.getUserWithChats(userId);
    const chatFromUser = await find<ChatMember>('chat_id', user.chats, request.params.chatId);
    if (chatFromUser === null) {
      return reply.code(404).send({ error: 'Chat not found' });
    }

    await facade.createMessage({
      chat_id: chatFromUser.chat_id,
      sender_id: userId,
      body: message,
    });
    return reply.code(201).send({ success: 'message sent' });
  }
}
