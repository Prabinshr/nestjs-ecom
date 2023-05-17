import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionSerializer extends PassportSerializer{
    constructor(private authService:AuthService){
        super()
    }
    serializeUser(user: any, done: Function) {
        console.log("Serialize User")
        done(null,user)
    }

    deserializeUser(payload: any, done: Function) {
        console.log("Deserialize User")
        const user = this.authService.findUser(payload.id)
        console.log(user)
        return user ? done(null,user):done(null,null)
    }
}