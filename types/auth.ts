import { TimeStamp } from "./common";

export interface RefreshToken {
    refreshToken : string;
}

export interface SignInRes extends RefreshToken {
    accessToken : string;
    email : string;
    userId : string;
    name : string;
}

export interface User extends TimeStamp {
    email : string;
    id : string;
    img_url : string;
    name : string;
    verified_at : string | null;
}

