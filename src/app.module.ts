import { Global, Logger, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './framework/config/configuration';
import { UtilService } from './framework/util/util.service';
import { CustomLoggerService } from './framework/logger/logger.service';
import { CustomSummaryLoggerService } from './framework/logger/summary.logger.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as fs from "fs";
const logger = new Logger('AppModule')
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import { RequestHelperService } from './framework/helper/request.service';
import { FlushSummaryLog } from './framework/util/flush-summary.logger.service';
import { HttpModule } from '@nestjs/axios';
import { CustomAxiosService } from './framework/util/custom-axios.service';


const applicationVersionFile = './APPLICATION_VERSION.txt'

fs.readFile(applicationVersionFile, function (err, data) {
  if (!err) logger.log(`Application GIT-SCM detials: \n${data.toString().trim()}`)
});
const loggerTransport = [];
loggerTransport.push(new winston.transports.Console())

if(process.env.ZONE !== "prod") {
  logger.log(`None Production ENV Detected! Program will write log to file`)
  loggerTransport.push(new winstonDailyRotateFile({
    dirname: 'logs/detail',
    filename: 'detail-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    extension: '.log',
  }))
}else{
  logger.log(`Production ENV Detected! Disable logger file transport`)
}


@Global()
@Module({
  imports: [HttpModule.register({}),UsersModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      ignoreEnvFile: true
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        level: config.get<string>('log.level'),
        format: winston.format.combine(
          winston.format.json()
        ),
        transports: loggerTransport
      }),
    }),
  
  ],
  controllers: [],
  providers: [CustomAxiosService,FlushSummaryLog, CustomLoggerService, CustomSummaryLoggerService, UtilService, RequestHelperService],
  exports: [CustomAxiosService,CustomLoggerService, UtilService, FlushSummaryLog]
  })
export class AppModule {}

