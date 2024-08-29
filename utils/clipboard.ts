export async function copy(text: string) {
  if (!import.meta.client) return
  await navigator.clipboard.writeText(text)
}
