/** Sleep for `ms` (argument) miliseconds */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
