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

export function pairPermutations<T>(xs: T[]): Iterable<readonly [T, T]> {
  const generator = function*() {
    for (const x1 of xs) {
      for (const x2 of xs) {
        yield [x1, x2] as const
      }
    }
  }

  return generator()
}
