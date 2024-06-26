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
        size,
        hash,
        localFile: file,
      };
      if (!hash) delete returnObj.hash;
      return returnObj;
    });

  const sorted = models.sort((a, b) => a.name.localeCompare(b.name));
  postMessage({ type: "models", models: sorted });

  let subworkers = [];
  let pendingWorkers = [];

  for (const model of sorted) {
    const subworker = new Worker(new URL("./subworker", import.meta.url), {
      type: "module",
    });
    subworker.addEventListener("message", (event) => {
      switch (event.data.type) {
        case "processed":
          // Remove worker from subworkers array
          const worker = subworkers.find(
            ({ model }) => model.id === event.data.model.id
          );
          const wIdx = worker && subworkers.indexOf(worker);
          worker?.subworker.terminate();
          wIdx && subworkers.splice(wIdx, 1);

          // Remove worker from pendingWorkers array
          const pWorker = pendingWorkers.find(
            ({ model }) => model.id === event.data.model.id
          );
          const pIdx = pWorker && pendingWorkers.indexOf(pWorker);
          pIdx && pendingWorkers.splice(pIdx, 1);

          // If there are still pending workers, start the next one
          const nextWorker = pendingWorkers.shift();
          nextWorker?.subworker.postMessage(nextWorker.model);

          postMessage(event.data);
          break;
        default:
          postMessage(event.data);
      }
    });
    subworkers.push({ model, subworker });
    pendingWorkers.push({ model, subworker });
  }

  const maxActiveWorkers = 2; // TODO expose setting
  for (const model of sorted.slice(0, maxActiveWorkers)) {
    const { subworker } =
      subworkers.find((sw) => sw.model.id === model.id) || {};
    if (!subworker) return;
    subworker.postMessage(model);
    pendingWorkers.shift();
  }
});
