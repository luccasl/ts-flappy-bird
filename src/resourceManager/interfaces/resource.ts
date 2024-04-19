import ResourceType from "./resourceType";

interface Resource {
    type: ResourceType;
    path: string;
    data: any;
}

export default Resource;
