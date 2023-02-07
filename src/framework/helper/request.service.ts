import { Injectable } from "@nestjs/common";

@Injectable()
export class RequestHelperService {
    
    private now: number;

    setNow(date: number){
        this.now = date;
    }

    getNow(){
        return this.now;
    }

}