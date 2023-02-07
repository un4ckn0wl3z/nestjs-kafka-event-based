import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { LoggerHookGuard } from 'src/framework/guard/logger.hook.guard';
import { CustomLoggerService } from 'src/framework/logger/logger.service';
import { UserRegistedEvent } from '../dtos/consumer/user-registed.event';
import { ConsumerEvents } from '../enums/consume.events.enum';
import { UsersService } from '../service/users.service';

@Controller()
export class EventConsumerController {

  constructor(
    private usersService: UsersService,
    private logger: CustomLoggerService,
  ){

  }
  @EventPattern(ConsumerEvents.UserRegisted)
  @UseGuards(LoggerHookGuard({event: ConsumerEvents.UserRegisted}))
  handleUserRegistered(data: UserRegistedEvent){
    this.logger.info('[+] handleUserRegistered entered', data)
    this.usersService.createUser(data)
  }
}