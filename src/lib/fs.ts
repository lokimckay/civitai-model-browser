import { err } from "./util";

type FileResult = {
  handle: FileSystemFileHandle;
  name: string;
  path: string[];
};

export async function listFilesInDirectory(
  directory: FileSystemDirectoryHandle
) {
  const files = await toArray(getFilesRecursively(directory, directory));
  return { directory, files };
}

export async function* getFilesRecursively(
  directory: FileSystemDirectoryHandle,
  entry: FileSystemHandle
): AsyncGenerator<FileResult> {
  const path = (await directory.resolve(entry)) || [];
  if (entry.kind === "file") {
    yield { handle: entry as FileSystemFileHandle, name: entry.name, path };
  } else if (entry.kind === "directory") {
    for await (const handle of (entry as FileSystemDirectoryHandle).values()) {
      yield* getFilesRecursively(directory, handle);
    }
  }
}

export function getHash(handle: FileSystemFileHandle): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const file = await handle.getFile();
      const buffer = await file.arrayBuffer();
      const hash = await crypto.subtle.digest("SHA-256", buffer);
      const asStr = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      console.log("DDDD");
      resolve(asStr);
    } catch (error: any) {
      console.log("ERR", error);
      reject(err("Failed to get hash for file", error));
    }
  });
}

export async function toArray<T>(iter: AsyncGenerator<T>): Promise<T[]> {
  const arr = [];
  for await (const i of iter) arr.push(i);
  return arr;
}
