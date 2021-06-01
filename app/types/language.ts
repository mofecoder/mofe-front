export interface Language {
  innerName: string
  name: string
  mime: string
  isOutdated?: true
  libraries?: string | null
  compilationCommand?: string
  runCommand?: string
}
