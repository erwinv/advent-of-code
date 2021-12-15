import _ from 'lodash'

type LineEndpoints = readonly [x1: number, y1: number, x2: number, y2: number]
type Input = LineEndpoints[]

export function parseInput(s: string): Input {
  return s.split(/\r?\n/)
    .flatMap((x) => {
      const match = LINE_COORDINATES.exec(x.trim())
      if (!match) return []
      return [[_.toNumber(match[1]), _.toNumber(match[2]), _.toNumber(match[3]), _.toNumber(match[4])] as const]
    })
}

const LINE_COORDINATES = /(\d+),(\d+) -> (\d+),(\d+)/

class Line {
  x1: number
  y1: number
  x2: number
  y2: number
  constructor(x1: number, y1: number, x2: number, y2: number) {
    if (y1 === y2) {
      this.x1 = Math.min(x1, x2)
      this.x2 = Math.max(x1, x2)
      this.y1 = this.y2 = y1
    } else if (x1 === x2) {
      this.y1 = Math.min(y1, y2)
      this.y2 = Math.max(y1, y2)
      this.x1 = this.x2 = x1
    } else {
      this.x1 = Math.min(x1, x2)
      this.x2 = Math.max(x1, x2)
      if (this.x1 === x1) {
        this.y1 = y1
        this.y2 = y2
      } else {
        this.y1 = y2
        this.y2 = y1
      }
    }
  }
}

class Grid {
  cells: number[][]
  constructor(sizeX: number, sizeY: number) {
    this.cells = _.range(sizeY)
      .map(row => _.range(sizeX).fill(0))
  }
}

export function part1(data: Input, includeDiagonalLines = false) {
  const [horizontalOrVerticalLines , diagonalLines] = _.partition(
    data.map(([x1, y1, x2, y2]) => new Line(x1, y1, x2, y2)),
    (line) => line.x1 === line.x2 || line.y1 === line.y2
  )

  const [horizontalLines, verticalLines] = _.partition(horizontalOrVerticalLines,
    (line) => line.y1 === line.y2)

  const allX = horizontalOrVerticalLines.flatMap(line => [line.x1, line.x2])
  const allY = horizontalOrVerticalLines.flatMap(line => [line.y1, line.y2])

  const maxX = _.max(allX)!
  const maxY = _.max(allY)!

  const grid = new Grid(maxX + 1, maxY + 1)

  for (const horizontalLine of horizontalLines) {
    const y = horizontalLine.y1
    for (const x of _.range(horizontalLine.x1, horizontalLine.x2 + 1)) {
      grid.cells[y][x] += 1
    }
  }
  for (const verticalLine of verticalLines) {
    const x = verticalLine.x1
    for (const y of _.range(verticalLine.y1, verticalLine.y2 + 1)) {
      grid.cells[y][x] += 1
    }
  }
  if (includeDiagonalLines) {
    for (const diagonalLine of diagonalLines) {
      const {x1, y1, x2, y2} = diagonalLine
      const slope = y1 < y2 ? 1 : -1
      for (const x of _.range(x1, x2 + 1)) {
        const y = y1 + slope * (x - x1)
        grid.cells[y][x] += 1
      }
    }
  }

  return grid.cells
    .flatMap(row => row)
    .filter(cell => cell >= 2)
    .length
}

export function part2(data: Input) {
  return part1(data, true)
}
