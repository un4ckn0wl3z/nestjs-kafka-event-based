import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { LoggerHookGuard } from 'src/framework/guard/logger.hook.guard';
import { CustomLoggerService } from 'src/framework/logger/logger.service';
import { FlushSummaryLog } from 'src/framework/util/flush-summary.logger.service';
import { UserRegistedEvent } from '../dtos/consumer/user-registed.event';
import { ConsumerEvents } from '../enums/consume.events.enum';
import { PhotosApiService } from '../service/photo-api.service';
import { UsersService } from '../service/users.service';

@Controller()
export class EventConsumerController {
  constructor(
    private usersService: UsersService,
    private photoService: PhotosApiService,
    private logger: CustomLoggerService,
    private summaryFlush: FlushSummaryLog,

  ){

  }
  @EventPattern(ConsumerEvents.UserRegisted)
  @UseGuards(LoggerHookGuard({event: ConsumerEvents.UserRegisted}))
  async handleUserRegistered(data: UserRegistedEvent){
    this.logger.info('[+] handleUserRegistered entered', data)
    const res = await this.photoService.listPhoto()
    this.logger.debug('[+] Test Axios with via photoservice', res)
    try {
      await this.usersService.createUser(data)
      this.summaryFlush.flush()
    } catch (error) {
      this.summaryFlush.flushError(error)
    }
  }
}