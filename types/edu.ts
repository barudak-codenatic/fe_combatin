import { TimeStamp } from "./common";

export interface Modules extends TimeStamp {
    description : string;
    id : string;
    img_url? : string;
    name : string;
}

export interface Material extends TimeStamp {
    title : string;
    id : string;
}

export interface Module extends Modules {
    materials : Material[];
    test : Material[];
}

