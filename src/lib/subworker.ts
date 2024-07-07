import { type Model } from "./types";
import { getInfo, getHash, tryMetadataHash } from "./api";

addEventListener("message", (event: MessageEvent<Model>) => {
  if (!event.data?.id)
    return console.error("SubWorker received invalid data", event.data);

  processModel(event.data);
});

function postUpdate(data: any) {
  postMessage({ type: "updateModel", ...data });
}

async function processModel(model: Model) {
  postMessage({ type: "processing", model });
  const { id } = model;

  postUpdate({ id, hashing: true });
  const metaHash = await tryMetadataHash(model).catch((_e) => {});
  if (metaHash) {
    postUpdate({ id, ...metaHash, hashing: false, fetching: false });
    postMessage({ type: "processed", model });
    return;
  }

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

  if (!hash) return;

  postUpdate({ id, fetching: true });
  await getInfo(hash)
    .then((res) => {
      const { info, baseModelInfo } = res;
      postUpdate({ id, info, baseModelInfo, fetching: false });
    })
    .catch((error) => {
      postUpdate({ id, error, fetching: false });
    });

  postMessage({ type: "processed", model });
}
