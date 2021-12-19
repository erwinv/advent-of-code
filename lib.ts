export abstract class MappedSet<T, U> {
  abstract map(value: T): U
  abstract inverseMap(value: U): T
  data: Set<U>

  constructor(values: Iterable<T> = []) {
    this.data = new Set([...values].map(this.map))
  }

  has(value: T) {
    return this.data.has(this.map(value))
  }

  add(value: T) {
    return this.data.add(this.map(value))
  }

  get size() { return this.data.size }

  values(): T[] {
    return [...this.data.values()]
      .map(this.inverseMap)
  }

  forEach(fn: (value: T) => void) {
    return this.data
      .forEach(value => fn(this.inverseMap(value)))
  }

  *[Symbol.iterator]() {
    for (const el of this.data) {
      yield this.inverseMap(el)
    }
  }
}

export function slidingPairs<T>(xs: T[]): Iterable<readonly [T, T]> {
  const generator = function*() {
    let i = 0
    while (true) {
      const window = xs.slice(i, i + 2)
      if (window.length !== 2) {
        break
      }
      const [x1, x2] = window
      yield [x1, x2] as const
      i++
    }
  }

  return generator()
}

export function* pairPermutations<T>(xs: T[], excludeSelfPairings = false): Iterable<readonly [T, T]> {
  for (const [i1, x1] of xs.entries()) {
    for (const [i2, x2] of xs.entries()) {
      if (excludeSelfPairings && i1 === i2)
        continue
      yield [x1, x2] as const
    }
  }
}

export function* combinations<T>(xs_: T[], size: number): Iterable<T[]> {
  const xs = [...xs_]
  if (size >= xs_.length) {
    return xs
  }

  for (const [i1, x1] of xs.entries()) {
    xs.splice(i1, 1)
    for (const subCombination of combinations(xs, size - 1)) {
      yield [x1, ...subCombination]
    }
  }
}

export class PriorityQueue<T> {
  queue: Array<{
    value: T
    priority: number
  }> = []
  set: Set<T> = new Set()

  addWithPriority(value: T, priority: number) {
    const i = this.queue.findIndex(item => item.priority > priority)
    if (i >= 0) {
      this.queue.splice(i, 0, { value, priority })
    } else {
      this.queue.push({ value, priority })
    }
    this.set.add(value)
  }
  decreasePriority(value: T, priority: number) {
    const i = this.queue.findIndex(item => item.value === value)
    this.queue.splice(i, 1)
    this.set.delete(value)

    this.addWithPriority(value, priority)
  }
  extractMin(): T | undefined {
    const min = this.queue.shift()?.value
    if (min) this.set.delete(min)
    return min
  }
  get size() {
    return this.queue.length
  }
  has(value: T) {
    return this.set.has(value)
  }
}
