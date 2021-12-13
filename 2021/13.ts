import _, { round } from 'lodash'

type Coords = readonly [x: number, y: number]
type Fold = {
  along: 'x',
  x: number
} | {
  along: 'y',
  y: number
}
export type Input = Coords | Fold

export function parseInput(s: string): Input[] {
  const INPUT1 = /(\d+),(\d+)/
  const INPUT2 = /fold along ([xy])=(\d+)/
  return s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT1.exec(line) ?? INPUT2.exec(line)
      if (!match) return []
      return [
        INPUT1.test(line)
          ? [_.toNumber(match[1]), _.toNumber(match[2])] as Coords
          : { along: match[1], [match[1]]: _.toNumber(match[2]) } as Fold
      ]
    })
}

class Grid {
  cells: boolean[][]

  constructor(points: Coords[]) {
    const maxX = _.max(points.map(([x]) => x))!
    const maxY = _.max(points.map(([, y]) => y))!
    this.cells = _.range(maxX + 1).map(() => _.range(maxY + 1).map(() => false))
    for (const [x, y] of points) {
      this.cells[x][y] = true
    }
  }

  fold(fold: Fold) {
    const maxX = this.cells.length - 1
    const maxY = this.cells[0].length - 1

    if (fold.along === 'x') {
      for (const x_ of _.range(fold.x + 1, maxX + 1)) {
        const _x = fold.x - (x_ - fold.x)
        for (const y of _.range(0, maxY + 1)) {
          this.cells[_x][y] ||= this.cells[x_][y]
        }
      }
      this.cells.splice(fold.x)
    } else {
      for (const y_ of _.range(fold.y + 1, maxY + 1)) {
        const _y = fold.y - (y_ - fold.y)
        for (const x of _.range(0, maxX + 1)) {
          this.cells[x][_y] ||= this.cells[x][y_]
        }
      }
      this.cells.forEach(ys => ys.splice(fold.y))
    }
  }

  get numDots() {
    return this.cells.flatMap(_.identity).filter(_.identity).length
  }

  toString() {
    return _.unzip(this.cells)
      .map(r => r.map(c => c ? '#' : '.').join('')).join('\n')
  }
  toJSON() {
    return this.toString()
  }
}

function isCoords(x: Input): x is Coords {
  return _.isArray(x)
}

export function part1(data: Input[]) {
  const [points, folds] = _.partition(data, isCoords)
  const grid = new Grid(points)
  for (const fold of [_.head(folds)!]) {
    grid.fold(fold)
  }
  return grid.numDots
}

export function part2(data: Input[]) {
  const [points, folds] = _.partition(data, isCoords)
  const grid = new Grid(points)
  for (const fold of folds) {
    grid.fold(fold)
  }
  return grid
}
