import { RESOURCES_ROOT_PATH } from "../common/constants";
import audioHandler from "./handlers/audioHandler";
import imageHandler from "./handlers/imageHandler";
import Resource from "./interfaces/resource";
import ResourceEntry from "./interfaces/resourceEntry";
import ResourceType from "./interfaces/resourceType";
import resourceConfig from "./config/resourceConfig";

class ResourceManager {
    private readonly resources: Map<string, Resource> = new Map();
    private readonly resourceHandlers: Map<
        string,
        (path: string) => Promise<ResourceData>
    >;
    private isResourcesLoaded: boolean = false;

    constructor() {
        this.resourceHandlers = new Map([
            ["image", imageHandler],
            ["audio", audioHandler],
        ]);
    }

    public async setup() {
        this.config();
        await this.loadResources();
    }

    private config() {
        for (const entry of resourceConfig.resources) {
            this.registerResource({
                key: entry.key,
                type: entry.type as ResourceType,
                path: entry.path,
            });
        }
    }

    private registerResource(entry: ResourceEntry) {
        const resource: Resource = {
            path: entry.path,
            type: entry.type,
            data: null,
        };

        this.resources.set(entry.key, resource);
    }

    private async loadResources() {
        console.debug("Loading resources, please wait...");
        for (const resource of this.resources.values()) {
            console.debug(`Loading resource '${resource.path}'...`);
            try {
                resource.data = await this.loadResourceData(resource);
                console.debug(`Resource '${resource.path}' loaded.`);
            } catch (e) {
                console.error(
                    `An error has occurred while trying to load resource '${resource.path}'.`
                );
            }
        }
        this.isResourcesLoaded = true;
        console.debug("All done!");
    }

    private async loadResourceData(resource: Resource) {
        if (!this.resourceHandlers.has(resource.type)) {
            throw new Error(
                `The resource type '${resource.type}' has no associated resource handler.`
            );
        }

        const handler = this.resourceHandlers.get(resource.type);
        return (await handler(RESOURCES_ROOT_PATH + resource.path)).data;
    }

    public getResource(key: string): any {
        if (!this.isResourcesLoaded) {
            throw new Error(
                `There was an attempt to get the resource at identifier '${key}', but resources are still loading.`
            );
        }

        return this.resources.get(key).data;
    }
}

export default ResourceManager;
