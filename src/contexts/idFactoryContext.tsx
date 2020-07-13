import { createContext } from 'react'

export const createIdFactory = () => {
  const counters = {} as { [type: string]: number }

  return (type: string) => {
    if (!counters[type]) {
      counters[type] = 1
    }
    return `${type}-${counters[type]++}`
  }
}

export const IdFactoryContext = createContext(createIdFactory())
