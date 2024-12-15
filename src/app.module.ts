import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
    isGlobal: true,
  }),
PrismaModule,
AuthModule,
ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
