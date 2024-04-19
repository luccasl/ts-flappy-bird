async function audioHandler(path: string): Promise<ResourceData> {
    return new Promise((resolve, reject) => {
        const audio = new Audio(path);
        const resourceData = {
            data: audio,
        };

        audio.addEventListener("loadeddata", () => resolve(resourceData));
        audio.addEventListener("error", reject);
    });
}

export default audioHandler;
