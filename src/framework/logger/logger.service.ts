
import { LogDto } from './dtos/log.dto';
import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { UtilService } from '../util/util.service';

@Injectable()
export class CustomLoggerService {
    private logDto = new LogDto()
    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly utilService: UtilService
    ){}

    init(data: LogDto){
        this.logDto = data
    }

    getLogDto(){
        return this.logDto
    }

    update(key: string, value: string){
        this.logDto[`${key}`] = value
    }

    info(action: string, data: any){
        this.logDto.action = action
        this.logDto.detail = data
        this.logDto.timestamp = this.utilService.setTimestampFormat(new Date())
        this.logger.log(this.logDto)
        
    }

    debug(action: string, data: any){
        this.logDto.action = action
        this.logDto.detail = data
        this.logDto.timestamp = this.utilService.setTimestampFormat(new Date())
        this.logger.debug(this.logDto)
    }

    error(action: string, data: any, stack?: any){
        this.logDto.action = action
        this.logDto.detail = data
        this.logDto.timestamp = this.utilService.setTimestampFormat(new Date())
        this.logger.error(this.logDto, stack)
    }


    flushKafkaRequest(command: string, data: any){
        this.update('command', command)
        this.info(`start consuming event: ${command}`, data)
    }

}