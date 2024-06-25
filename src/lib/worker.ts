import { modelExtensions } from "@/lib/config";
import { type Model } from "@/lib/types";
import { createId } from "@paralleldrive/cuid2";
import { getInfo, getHash } from "@/lib/api";

addEventListener("message", (event) => {
  if (!(event.data instanceof FileList))
    return console.error("Worker received invalid data", event.data);
  const fileList: FileList = event.data;
  const models = Array.from(fileList)
    .filter((file) => {
      const ext = file.name.split(".").pop();
      return ext && modelExtensions.includes(ext);
    })
    .map((file: File): Model => {
      const { name, webkitRelativePath, size } = file;
      return {
        id: createId(),
        name,
        path: webkitRelativePath,
        size,
        localFile: file,
      };
    });

  postMessage({ type: "models", models });
  const sorted = models.sort((a, b) => a.name.localeCompare(b.name));
  processModels(sorted);
});

function postUpdate(data: any) {
  postMessage({ type: "updateModel", ...data });
}

async function processModels(models: Model[]) {
  for (const model of models) {
    postMessage({ type: "processing", model });
    const { id } = model;

    postUpdate({ id, hashing: true });
    const hash = await getHash(model, (hashedBytes) =>
      postUpdate({ id, hashedBytes })
    )
      .then((hash) => {
        postUpdate({ id, hash, hashing: false });
        return hash;
      })
      .catch((error) => {
        postUpdate({ id, error, hashing: false });
      });

    if (!hash) continue;

    postUpdate({ id, fetching: true });
    await getInfo(hash)
      .then((info) => {
        postUpdate({ id, info, fetching: false });
      })
      .catch((error) => {
        postUpdate({ id, error, fetching: false });
      });

    postMessage({ type: "processed", model });
  }
}
