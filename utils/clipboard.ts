export async function copy(text: string) {
  if (!process.client) return
  await navigator.clipboard.writeText(text)
}
