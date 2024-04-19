async function imageHandler(path: string): Promise<ResourceData> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = path;
        const resourceData = {
            data: image,
        };

        image.addEventListener("load", () => resolve(resourceData));
        image.addEventListener("error", reject);
    });
}

export default imageHandler;
