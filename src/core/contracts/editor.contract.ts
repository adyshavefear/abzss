export interface OpenEditorResult {
  isAvailable: boolean
  opened: boolean
  path: string
}

export interface Editor {
  isAvailable(): boolean
  open(path: string): boolean
}