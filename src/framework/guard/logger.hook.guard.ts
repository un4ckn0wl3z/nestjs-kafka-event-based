import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";
import { GLOBAL_KAFKA_LOGGER_INSTANCE, GLOBAL_REQUEST_HELPER_INSTANCE } from "src/main";

export const LoggerHookGuard = ({event}: any): Type<CanActivate> => {
    class RoleGuardMixin implements CanActivate {
      async canActivate(context: ExecutionContext) {    
        if(context.getType() == 'rpc'){
          GLOBAL_REQUEST_HELPER_INSTANCE.setNow(Date.now())
          const data = context.switchToRpc().getData();
          GLOBAL_KAFKA_LOGGER_INSTANCE.flushKafkaRequest(event, {data})
        }
        return true
      }
    }
    const guard = mixin(RoleGuardMixin);
    return guard;
  }
  