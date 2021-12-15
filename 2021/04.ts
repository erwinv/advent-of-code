import _ from 'lodash'

type Input = number[][]

export function parseInput(s: string): Input {
  const NUMBER_DRAW = /[\d,]+/
  const BOARD_ROW = /[\d\s]+/

  return s.split(/\r?\n/)
    .filter(l => l.trim() !== '')
    .flatMap((x, index) => {
      if (index === 0) {
        const match = NUMBER_DRAW.exec(x.trim())
        if (!match) return []
        return [match[0].split(',').map(x => _.toNumber(x))]
      }

      const match = BOARD_ROW.exec(x.trim())
      if (!match) return []
      return [match[0].split(/\s+/).map(x => _.toNumber(x))]
    })
}

class BingoBoard {
  cells: number[][]
  size: number
  unmarked: Set<number>
  marked: Set<number> = new Set()
  numMarkedPerRow: number[]
  numMarkedPerCol: number[]
  winningDraw: number = NaN

  constructor(cells: number[][]) {
    this.size = cells.length
    this.cells = [...cells.map(row => [...row])]
    this.unmarked = new Set(cells.flatMap(row => row))
    this.numMarkedPerRow = Array(this.size).fill(0)
    this.numMarkedPerCol = Array(this.size).fill(0)
  }

  tryToMarkAndCheckBingo(draw: number) {
    if (this.unmarked.has(draw)) {
      this.unmarked.delete(draw)
      this.marked.add(draw)

      for (const [rowIndex, row] of this.cells.entries()) {
        const colIndex = row.indexOf(draw)
        if (colIndex >= 0) {
          if (++this.numMarkedPerRow[rowIndex] === this.size
            || ++this.numMarkedPerCol[colIndex] === this.size) {
            this.winningDraw = draw
            return true
          }

          return false
        }
      }
    }

    return false
  }

  score() {
    return Array.from(this.unmarked).reduce(_.add) * this.winningDraw
  }
}

export function part1(data: Input) {
  const draws = _.head(data)!
  const boards = _.chunk(_.tail(data), 5)
    .map(cells => new BingoBoard(cells))

  for (const draw of draws) {
    const bingoScores = boards
      .flatMap(board => board.tryToMarkAndCheckBingo(draw) ? [board.score()] : [])
    if (bingoScores.length > 0) {
      return _.max(bingoScores)
    }
  }

  return NaN
}

export function part2(data: Input) {
  const draws = _.head(data)!
  const boards = _.chunk(_.tail(data), 5)
    .map(cells => new BingoBoard(cells))

  let bingos = [] as BingoBoard[]
  let noBingos = [...boards]
  for (const draw of draws) {
    [bingos, noBingos] = _.partition(noBingos, board => board.tryToMarkAndCheckBingo(draw))
    if (noBingos.length === 0) {
      return _.min(bingos.map(board => board.score()))
    }
  }

  return NaN
}
