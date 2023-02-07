import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { UserEmailNotificationEvent } from "../dtos/producer/user-email-notification.event";
import { ProducerEvents } from "../enums/produce.events.enum";

@Injectable()
export class EventProducerService {
    constructor(@Inject('USER_PRODUCER') private readonly eventPublisherClient: ClientKafka){}

      userEmailNotificationPublisher(data: UserEmailNotificationEvent){
        this.eventPublisherClient.emit(ProducerEvents.UserEmailNotification, data);
      }
}