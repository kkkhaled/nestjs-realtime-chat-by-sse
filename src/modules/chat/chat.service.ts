import { BadRequestException, Injectable } from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ChatService {

    private chatMessageStreams: Map<string, Subject<any>> = new Map();

    constructor(private readonly prisma: PrismaService) {
    }

   // create chat by users Ids 
   async createChat(usersIds: string[]) {
    try {
      // Ensure the chat has exactly two users
      if (usersIds.length !== 2) {
        throw new BadRequestException('Chat must have exactly two users.');
      }
  
      // Check if a chat already exists with the given two users
      const existedChat = await this.prisma.chat.findFirst({
        where: {
          AND: [
            { users: { some: { id: usersIds[0] } } },
            { users: { some: { id: usersIds[1] } } },
          ],
        },
      });
  
      if (existedChat) {
        return {
          chatId: existedChat.id,
        };
      }
  
      // Create a new chat
      const newChat = await this.prisma.chat.create({
        data: {
          users: {
            connect: usersIds.map((id) => ({ id })), 
          },
        },
      });
  
      return {
        chatId: newChat.id,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create chat: ${error.message}`);
    }
  }
  
   // add message to chats 
   async addMessage(data:{
    senderId: string,
    chatId:string,
    content?: string,
    voiceData?: Buffer
   }){
      try {
        const message = await this.prisma.message.create({
            data: {
                senderId: data.senderId,
                chatId: data.chatId,
                content: data?.content,
                voiceData: data?.voiceData
            }
        })

      // Emit the new message to subscribers
      const chatStream = this.getMessageStream(data.chatId);
      chatStream.next({
        id: message.id,
        senderId: message.senderId,
        content: message.content,
        voiceData: message.voiceData || null,
        createdAt: message.createdAt,
      });

        return {message}
      } catch (error) {
        throw new BadRequestException(`Failed to add message: ${error}`);
      }
   }

   // get chat messages (real time) by ss
// Get paginated initial messages
  async getInitialMessages(chatId: string, page: number, pageSize: number) {
    try {
      const totalMessages = await this.prisma.message.count({
        where: { chatId },
      });

      const totalPages = Math.ceil(totalMessages / pageSize);

      const messages = await this.prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return {
        messages: messages.map((message) => ({
          id: message.id,
          senderId: message.senderId,
          content: message.content,
          voiceData: message.voiceData ||  null,
          createdAt: message.createdAt,
        })),
        metadata: {
          totalMessages,
          totalPages,
          page,
          pageSize,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get initial chat messages: ${error}`);
    }
  }

  // Stream real-time updates
  getChatMessageStream(chatId: string): Observable<any> {
    const chatStream = this.getMessageStream(chatId);
    return chatStream.asObservable();
  }

  // Helper: Get or create a Subject for a chat
  private getMessageStream(chatId: string): Subject<any> {
    if (!this.chatMessageStreams.has(chatId)) {
      this.chatMessageStreams.set(chatId, new Subject<any>());
    }
    return this.chatMessageStreams.get(chatId);
  }

    // Clean up the stream when the client disconnects
     cleanupStream(chatId: string) {
        if (this.chatMessageStreams.has(chatId)) {
          console.log(`Cleaning up stream for chatId: ${chatId}`);
          const stream = this.chatMessageStreams.get(chatId);
          stream.complete(); // Complete the stream
          this.chatMessageStreams.delete(chatId); // Remove it from the map
        }
  }
}