import _ from 'lodash'

export type Input = number[]

export function parseInput(s: string): Input[] {
  const INPUT = /\d+/
  return s.split(/\r?\n/)
    .flatMap(x => {
      const match = INPUT.exec(x)
      if (!match) return []

      const input = match[0].split('').map(_.toNumber) as Input

      return [input]
    })
}

abstract class MappedSet<T, U> {
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
}

interface Location {
  row: number
  col: number
}

class LocationSet extends MappedSet<Location, `${number},${number}`> {
  map(loc: Location) {
    return `${loc.row},${loc.col}` as const
  }
  inverseMap(str: `${number},${number}`) {
    const [row, col] = str.split(',').map(_.toNumber)
    return {row, col} as Location
  }
}

class HeightMap {
  numRows: number
  numCols: number
  lowPoints: Location[] = []
  riskLevels: number[] = []

  constructor(public data: number[][]) {
    this.numRows = data.length
    this.numCols = data[0].length
    this.findLowPointsAndRiskLevels()
  }

  neighbors({row, col}: Location): Location[] {
    const top = {row: row-1, col}
    const bot = {row: row+1, col}
    const left = {row, col: col-1}
    const right = {row, col: col+1}

    const isTopRow = row === 0
    const isBotRow = row === this.numRows - 1
    const isLeftEdge = col === 0
    const isRightEdge = col === this.numCols - 1

    const neighbors = [] as Location[]
    if (!isTopRow) neighbors.push(top)
    if (!isBotRow) neighbors.push(bot)
    if (!isLeftEdge) neighbors.push(left)
    if (!isRightEdge) neighbors.push(right)

    return neighbors
  }

  findLowPointsAndRiskLevels() {
    for (const [i, row] of this.data.entries()) {
      for (const [j, value] of row.entries()) {
        if (value === 9) continue

        const isLowPoint = this.neighbors({ row: i, col: j})
          .map(({ row, col }) => this.data[row][col])
          .every(neighborValue => neighborValue > value)

        if (isLowPoint) {
          this.lowPoints.push({row: i, col: j})
          this.riskLevels.push(value + 1)
        }
      }
    }
  }

  get basins(): LocationSet[] {
    return this.lowPoints.map(lowPoint => {
      const expandBasin = (basin: LocationSet, frontier: LocationSet): LocationSet => {
        if (frontier.size === 0) return basin

        const newFrontier = frontier.values().flatMap(borderLocation => {
          const borderValue = this.data[borderLocation.row][borderLocation.col]

          return this.neighbors(borderLocation)
            .filter(neighborLocation => {
              const neighborValue = this.data[neighborLocation.row][neighborLocation.col]

              return neighborValue !== 9
                && neighborValue > borderValue
                && !basin.has(neighborLocation)
            })
        })
        newFrontier.forEach(location => basin.add(location))

        return expandBasin(basin, new LocationSet(newFrontier))
      }

      return expandBasin(new LocationSet([lowPoint]), new LocationSet([lowPoint]))
    })
  }
}

export function part1(data: Input[]) {
  const grid = new HeightMap(data)
  return grid.riskLevels.reduce(_.add)
}

export function part2(data: Input[]) {
  const grid = new HeightMap(data)
  return _.chain(grid.basins)
    .map(basin => basin.size)
    .orderBy(_.identity, 'desc')
    .take(3)
    .reduce(_.multiply)
}
