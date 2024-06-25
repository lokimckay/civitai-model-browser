export function err(message: string, error: any) {
  return { message, error: serializeError(error) };
}

function serializeError(error: any) {
  return JSON.stringify(error, Object.getOwnPropertyNames(error));
}
