import _ from 'lodash'
import { MappedSet } from '../lib'
import chalk from 'chalk'

type Input = number[][]

export function parseInput(s: string): Input {
  const INPUT = /\d+/
  return s.split(/\r?\n/)
    .flatMap(x => {
      const match = INPUT.exec(x)
      if (!match) return []

      const input = match[0].split('').map(_.toNumber)

      return [input]
    })
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

        const newFrontier = new LocationSet(
          frontier.values()
            .flatMap(borderLocation => {
              const borderValue = this.data[borderLocation.row][borderLocation.col]

              return this.neighbors(borderLocation)
                .filter(neighborLocation => {
                  const neighborValue = this.data[neighborLocation.row][neighborLocation.col]

                  return neighborValue !== 9
                    && neighborValue > borderValue
                    && !basin.has(neighborLocation)
                })
            })
        )

        newFrontier.forEach(location => basin.add(location))

        return expandBasin(basin, newFrontier)
      }

      return expandBasin(new LocationSet([lowPoint]), new LocationSet([lowPoint]))
    })
  }

  toString() {
    const chalkMap = {
      [0]: chalk.bgHex('#000000'),
      [1]: chalk.bgHex('#111111'),
      [2]: chalk.bgHex('#222222'),
      [3]: chalk.bgHex('#333333'),
      [4]: chalk.bgHex('#444444'),
      [5]: chalk.bgHex('#555555'),
      [6]: chalk.bgHex('#666666'),
      [7]: chalk.bgHex('#777777'),
      [8]: chalk.bgHex('#888888'),
      [9]: chalk.bgHex('#999999'),
    } as Record<number, chalk.Chalk>

    return this.data
      .map(row => row.map(val => chalkMap[val](val))
        .join('')
      ).join('\n')
  }
  toJSON() {
    return this.toString()
  }
}

export function part1(data: Input, debug = true) {
  const grid = new HeightMap(data)
  if (debug) {
    console.info(grid.toString())
  }
  return grid.riskLevels.reduce(_.add)
}

export function part2(data: Input, debug = true) {
  const grid = new HeightMap(data)
  if (debug) {
    console.info(grid.toString())
  }
  return _.chain(grid.basins)
    .map(basin => basin.size)
    .orderBy(_.identity, 'desc')
    .take(3)
    .reduce(_.multiply)
    .value()
}

export function* solve(debug = false) {
  const input: string = yield [__dirname, __filename]
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
