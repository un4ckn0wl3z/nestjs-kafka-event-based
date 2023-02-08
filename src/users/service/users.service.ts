import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { DataDuplicatedError } from "src/framework/exception/application.exception";
import { CustomLoggerService } from "src/framework/logger/logger.service";
import { UserRegistedEvent } from "../dtos/consumer/user-registed.event";
import { UserEmailNotificationEvent } from "../dtos/producer/user-email-notification.event";
import { EventProducerService } from "../producer/event.producer.service";

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private eventProducerService: EventProducerService,
        private logger: CustomLoggerService,
        ){}
    async createUser(dto: UserRegistedEvent){
      this.logger.info('[+] createUser entered', dto)
        const foundUser = await this.prisma.user.findUnique({where:{
            email: dto.email
          }})
          if(foundUser){
            this.logger.error('[-] Data duplicated', foundUser)            
            throw new DataDuplicatedError()
            //return;
          }
          try {
            await this.prisma.user.create({ data: {
                email: dto.email,
                firstname: dto.firstname,
                hashPassword: dto.password,
                lastname: dto.lastname,
                nickname: dto.nickname
              }})
          } catch (error) {
            this.logger.error('[-] Something wrong', error)            
          }
          this.logger.info('[+] Data saved', dto)            
          const event: UserEmailNotificationEvent = {
            email: dto.email,
            text: 'Register successful.'
          }
          this.logger.info('[+] UserEmailNotificationEventevent producing', event)            
          this.eventProducerService.userEmailNotificationPublisher(event)

        }
  
      updateUser(){
        // TODO
      }
  
      deleteUser(){
        // TODO
      }

}