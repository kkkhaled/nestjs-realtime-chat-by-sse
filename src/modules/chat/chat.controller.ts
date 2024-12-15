import { Body, Controller, Param, Post, Query, Req, Sse, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "src/decorators/jwt-auth-decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { from, interval, map, merge, Observable } from "rxjs";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    // create chat 
    @Post('create')
    @UseGuards(JwtAuthGuard)
   async createChat(
     @Req() req,
     @Body('receiverId') receiverId: string
   ){
     return await this.chatService.createChat([req.user.id, receiverId]);
   }
  
    // add message 
    @Post(':chatId/message')
    @UseInterceptors(FileInterceptor('voiceDataFile')) 
    @UseGuards(JwtAuthGuard)
    async addMessage(
      @Param('chatId') chatId: string,
      @Req() req,
      @Body('content') content?: string,
      @UploadedFile() voiceDataFile?: any, 
    ) {
 
        const senderId = req.user.id;

      const voiceData = voiceDataFile?.buffer;
  
      return await this.chatService.addMessage({
        chatId,
        senderId,
        content,
        voiceData
      });
    }

    // get chat 
    @Sse('messages/:chatId')
  async getChatMessages(
    @Param('chatId') chatId: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Req() req
  ): Promise<Observable<any>> {
    const pageNum = parseInt(page as any, 10);
    const size = parseInt(pageSize as any, 10);

    // Get initial paginated messages
    const initialMessages$ = from(this.chatService.getInitialMessages(chatId, pageNum, size)).pipe(
      map((result) => ({
        type: 'initial',
        data: result.messages,
        metadata: result.metadata, // Include metadata in the response
      })),
    );

    // Get real-time updates
    const realTimeMessages$ = this.chatService.getChatMessageStream(chatId).pipe(
      map((message) => ({
        type: 'update',
        data: message,
      })),
    );

      // Clean up when the client disconnects
      req.on('close', () => {
        console.log(`SSE connection closed for chatId: ${chatId}`);
        this.chatService.cleanupStream(chatId); // Cleanup logic in the service
      });

    // Merge the initial messages and real-time updates
    return merge(initialMessages$, realTimeMessages$);
  }
}