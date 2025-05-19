import { TimeStamp } from "./common";

export interface Modules extends TimeStamp {
    description : string;
    id : string;
    img_url? : string;
    name : string;
    progress : Progress[] | [];
}

interface Completed extends TimeStamp {
    completed : boolean
}

export interface Material extends TimeStamp {
    title : string;
    content : string;
    moduleId : string;
    id : string;
    module : {
        name : string
    }
    completed : Completed[]|[]
}

export interface Progress extends TimeStamp {
    progress : number;
}

export interface Test extends TimeStamp {
    title : string;
    description : string;
    moduleId : string;
    config : string[];
    id : string;
    completed : Completed[]|[]
}

export interface Module extends Modules {
    materials : Material[];
    test : Material[];
}

export interface ModuleForm {
    img: File | null;
    name: string;
    description: string;
}