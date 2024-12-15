import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { PrismaService } from "src/prisma.service";
import { ChatController } from "./chat.controller";
import { MulterModule } from "@nestjs/platform-express";

@Module({
    imports: [
        MulterModule.register({
            limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
          }),
    ],
    providers: [
        ChatService
        ,PrismaService
    ],
    controllers: [ChatController],
})
export class ChatModule {}