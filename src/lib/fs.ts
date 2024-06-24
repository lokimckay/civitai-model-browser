type FileResult = {
  handle: FileSystemHandle;
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
    yield { handle: entry, name: entry.name, path };
  } else if (entry.kind === "directory") {
    for await (const handle of (entry as FileSystemDirectoryHandle).values()) {
      yield* getFilesRecursively(directory, handle);
    }
  }
}

export async function getHash(handle: FileSystemFileHandle) {
  const file = await handle.getFile();
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function toArray<T>(iter: AsyncGenerator<T>): Promise<T[]> {
  const arr = [];
  for await (const i of iter) arr.push(i);
  return arr;
}
