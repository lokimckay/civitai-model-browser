export function err(message: string, error?: any) {
  return { message, error: error ? serializeError(error) : null };
}

function serializeError(error: any) {
  return JSON.stringify(error, Object.getOwnPropertyNames(error));
}
