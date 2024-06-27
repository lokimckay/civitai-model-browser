import { modelExtensions } from "./config";
import { type Model } from "./types";
import { createId } from "@paralleldrive/cuid2";

addEventListener("message", (event) => {
  if (!(event.data.files instanceof FileList))
    return console.error("Worker received invalid data", event.data);
  const fileList: FileList = event.data.files;
  const hashCache = event.data.hashCache;

  const models = Array.from(fileList)
    .filter((file) => {
      const ext = file.name.split(".").pop();
      return ext && modelExtensions.includes(ext);
    })
    .map((file: File): Model => {
      const { name, webkitRelativePath, size } = file;
      const hash = hashCache[name];
      const returnObj = {
        id: createId(),
        name,
        path: webkitRelativePath,
        extension: name.split(".").pop() || "",
        size,
        hash,
        localFile: file,
      };
      if (!hash) delete returnObj.hash;
      return returnObj;
    });

  const sorted = models.sort((a, b) => a.name.localeCompare(b.name));
  postMessage({ type: "models", models: sorted });

  let pendingModels = [...sorted];

  const maxActiveWorkers = 2; // TODO expose as setting
  for (let i = 0; i < maxActiveWorkers; i++) {
    const subworker = new Worker(new URL("./subworker", import.meta.url), {
      type: "module",
    });

    subworker.addEventListener("message", (event) => {
      switch (event.data.type) {
        case "processed":
          // Remove model from pendingModels array
          const doneModel = pendingModels.find(
            (m) => m.id === event.data.model.id
          );
          const index = doneModel && pendingModels.indexOf(doneModel);
          index && pendingModels.splice(index, 1);

          // If there are still pending models, start the next one
          const nextModel = pendingModels.shift();
          nextModel && subworker.postMessage(nextModel);

          // Terminate this subworker if there are no more models to process
          if (!nextModel) subworker.terminate();
          postMessage(event.data); // Forward this event to worker creator
          break;
        default:
          postMessage(event.data);
      }
    });

    subworker.postMessage(pendingModels[i]); // Start the subworker
  }
});
