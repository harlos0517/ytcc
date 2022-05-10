/* eslint-disable @typescript-eslint/no-explicit-any */

export type PromiseOptional<T> = T | Promise<T>

export const getUniqueArray = (arr: any[]) => [...new Set(arr)]

export const toStringArray = (x: any) => {
  const filtered = x.filter((y: any) => typeof y === 'string') as string[]
  return filtered.length ? filtered : null
}
