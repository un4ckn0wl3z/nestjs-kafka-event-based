import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { GLOBAL_REQUEST_HELPER_INSTANCE } from "src/main"
import { CustomLoggerService } from "../logger/logger.service"
import { CustomSummaryLoggerService } from "../logger/summary.logger.service"
import { UtilService } from "./util.service"


@Injectable()
export class FlushSummaryLog {
    constructor(
        private readonly summaryLoggerService: CustomSummaryLoggerService,
        private readonly loggerService: CustomLoggerService,
        private readonly configService: ConfigService,
        private readonly utilService: UtilService
    ){}

    flush(){
        this.summaryLoggerService.init(this.loggerService.getLogDto())
        this.summaryLoggerService.update('type', 'summary')
        this.summaryLoggerService.update('requestTimestamp', `${ this.utilService.setTimestampFormat(new Date(GLOBAL_REQUEST_HELPER_INSTANCE.getNow())) }`)
        this.summaryLoggerService.update('responseTimestamp', `${ this.utilService.setTimestampFormat(new Date()) }`)
        this.summaryLoggerService.update('processTime', `${Date.now() - GLOBAL_REQUEST_HELPER_INSTANCE.getNow()}ms`)
        this.summaryLoggerService.update('transactionResult', "20000")
        this.summaryLoggerService.update('transactionDesc', `[${this.configService.get<string>('app.name').toUpperCase()}] - Success`)
        this.summaryLoggerService.flush()
    }

    flushError(stack?: any){
        this.summaryLoggerService.init(this.loggerService.getLogDto())
        this.summaryLoggerService.update('type', 'summary')
        this.summaryLoggerService.update('requestTimestamp', `${ this.utilService.setTimestampFormat(new Date(GLOBAL_REQUEST_HELPER_INSTANCE.getNow())) }`)
        this.summaryLoggerService.update('responseTimestamp', `${ this.utilService.setTimestampFormat(new Date()) }`)
        this.summaryLoggerService.update('processTime', `${Date.now() - GLOBAL_REQUEST_HELPER_INSTANCE.getNow()}ms`)
        this.summaryLoggerService.update('transactionResult', "50000")
        this.summaryLoggerService.update('transactionDesc', `[${this.configService.get<string>('app.name').toUpperCase()}] - Error`)
        this.summaryLoggerService.flushError(stack)
    }

}


