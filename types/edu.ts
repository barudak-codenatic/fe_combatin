import { TimeStamp } from "./common";

export interface Modules extends TimeStamp {
    description : string;
    id : string;
    img_url? : string;
    name : string;
}

export interface Material extends TimeStamp {
    title : string;
    content : string;
    moduleId : string;
    id : string;
    module : {
        name : string
    }
}

export interface Test extends TimeStamp {
    title : string;
    description : string;
    moduleId : string;
    config : string[];
    id : string;
}

export interface Module extends Modules {
    materials : Material[];
    test : Material[];
}