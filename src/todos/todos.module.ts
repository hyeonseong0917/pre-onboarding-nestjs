import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import {Todo} from './entities/todo.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo]),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService)=>({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: '1d'},
      }),

    }),
  ],
  controllers: [TodosController],
  providers: [TodosService, JwtAuthGuard]
})
export class TodosModule {}
