export interface Issues {
  codes?: string[]
  fields?: {
    [fieldName: string]: Issues
  }
  items?: Issues[]
  message?: any // string or React Element or etc.
}
