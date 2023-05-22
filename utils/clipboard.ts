export function copy(text: string) {
  const tmp = document.createElement('textarea')
  tmp.style.position = 'fixed'
  tmp.style.right = '200%'
  tmp.textContent = text
  document.body.appendChild(tmp)
  tmp.select()
  document.execCommand('copy')
  document.body.removeChild(tmp)
}
