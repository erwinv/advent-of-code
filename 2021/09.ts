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

type Coordinates = [row: number, col: number]

class HeightMap {
  lowPoints: Coordinates[] = []
  summits: Coordinates[] = []
  riskLevels: number[] = []
  numRows: number
  numCols: number

  constructor(public data: number[][]) {
    this.numRows = data.length
    this.numCols = data[0].length

    for (const [y, row] of data.entries()) {
      for (const [x, cell] of row.entries()) {
        if (cell === 9) {
          this.summits.push([y, x])
          continue
        }

        const neighbors = this.getNeighbors([y, x])
          .map(([y, x]) => this.data[y][x])

        if (neighbors.every(neighbor => cell < neighbor)) {
          this.lowPoints.push([y, x])
          this.riskLevels.push(cell + 1)
        }
      }
    }
  }

  getNeighbors(coordinates: Coordinates) {
    const [y, x] = coordinates

    const neighbors = [] as Coordinates[]
    if (y > 0) neighbors.push([y-1, x])
    if (x > 0) neighbors.push([y, x-1])
    if (y < this.numRows - 1)
      neighbors.push([y+1, x])
    if (x < this.numCols - 1)
      neighbors.push([y, x+1])

    return neighbors
  }

  get basins() {
    return this.lowPoints.map(lowPoint => {
      const expandBasin = (basin: CoordinatesSet, border: CoordinatesSet): CoordinatesSet => {
        if (border.size === 0) return basin

        const frontier = CoordinatesSet.fromCoordinates(
          border.toCoordinates()
            .flatMap(([y, x]) => {
              const thisHeight = this.data[y][x]
              return this.getNeighbors([y, x])
                .filter(([y, x]) => {
                  return !basin.hasCoordinates([y, x])
                    && this.data[y][x] > thisHeight
                    && this.data[y][x] !== 9
                })
            })
          )

        border.forEach(x => basin.add(x))

        return expandBasin(basin, frontier)
      }

      const initialBasin = new CoordinatesSet()
      const initialBorder = new CoordinatesSet([toLocation(lowPoint)])

      return expandBasin(initialBasin, initialBorder)
    })
  }
}

const toCoordinates = (location: string) => location.split(',').map(_.toNumber) as Coordinates
const toLocation = (coordinates: Coordinates) => `${coordinates[0]},${coordinates[1]}` as const

class CoordinatesSet extends Set<`${number},${number}`> {
  constructor(x?: `${number},${number}`[]) {
    super(x)
  }

  addCoordinates(coordinates: Coordinates) {
    return this.add(toLocation(coordinates))
  }
  hasCoordinates(coordinates: Coordinates) {
    return this.has(toLocation(coordinates))
  }
  toCoordinates() {
    return Array.from(this).map(toCoordinates)
  }
  static fromCoordinates(x: Coordinates[]) {
    const ret = new CoordinatesSet()
    x.forEach(x => ret.addCoordinates(x))
    return ret
  }
}

export function part1(data: Input[]) {
  const grid = new HeightMap(data)
  return grid.riskLevels.reduce(_.add)
}

export function part2(data: Input[]) {
  const grid = new HeightMap(data)
  return _.chain(grid.basins)
    .map(basin => basin.toCoordinates().length)
    .orderBy(_.identity, 'desc')
    .take(3)
    .reduce(_.multiply)
}
