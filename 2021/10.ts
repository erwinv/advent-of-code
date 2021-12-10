import _ from 'lodash'

const CHUNK_DELIMITERS = [
  '(', ')',
  '[', ']',
  '{', '}',
  '<', '>',
] as const

type ChunkDelimiter = typeof CHUNK_DELIMITERS[number]

export type Input = ChunkDelimiter[]

export function parseInput(s: string): Input[] {
  const INPUT = /([()[\]{}<>]+)/
  return s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT.exec(line)
      if (!match) return []
      return [
        match[1].split('') as Input
      ]
    })
}

const CLOSING_DELIMITERS = [')', ']', '}', '>'] as const
const OPENING_DELIMITERS = ['(', '[', '{', '<'] as const
type ClosingDelimiter = typeof CLOSING_DELIMITERS[number]
type OpeningDelimiter = typeof OPENING_DELIMITERS[number]

const CLOSING_DELIMETER_MATCH: Record<ClosingDelimiter, OpeningDelimiter> = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
} as const
const OPENING_DELIMITER_MATCH: Record<OpeningDelimiter, ClosingDelimiter> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
} as const

const SYNTAX_ERROR_SCORE: Record<ClosingDelimiter, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}
const COMPLETION_CHARACTER_SCORE: Record<ClosingDelimiter, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

function isClosingDelimiter(delimiter: ChunkDelimiter): delimiter is ClosingDelimiter {
  return CLOSING_DELIMITERS.includes(delimiter as any)
}

export function part1(data: Input[]) {
  return data.flatMap(line => {
    const {syntaxError, stack} = line.reduce(({syntaxError, stack}, delimiter) => {
      if (syntaxError) return {syntaxError, stack}

      if (!isClosingDelimiter(delimiter)) {
        stack.push(delimiter)
        return {syntaxError, stack}
      }

      if (CLOSING_DELIMETER_MATCH[delimiter] === _.last(stack)) {
        stack.pop()
        return {syntaxError, stack}
      }

      stack.push(delimiter)
      return {syntaxError: true, stack}
    }, {
      syntaxError: false,
      stack: [] as ChunkDelimiter[]
    })
    if (!syntaxError) return []

    const score = SYNTAX_ERROR_SCORE[_.last(stack) as ClosingDelimiter]
    return [score]
  })
  .reduce(_.add)
}

export function part2(data: Input[]) {
  const scores = data.flatMap(line => {
    const {syntaxError, stack} = line.reduce(({syntaxError, stack}, delimiter) => {
      if (syntaxError) return {syntaxError, stack}

      if (!isClosingDelimiter(delimiter)) {
        stack.push(delimiter)
        return {syntaxError, stack}
      }

      if (CLOSING_DELIMETER_MATCH[delimiter] === _.last(stack)) {
        stack.pop()
        return {syntaxError, stack}
      }

      stack.push(delimiter)
      return {syntaxError: true, stack}
    }, {
      syntaxError: false,
      stack: [] as ChunkDelimiter[]
    })
    if (syntaxError || stack.length === 0) return []

    const completionString = stack.reverse()
      .map(openDelimiter => OPENING_DELIMITER_MATCH[openDelimiter as OpeningDelimiter])
    const completionStringScore = completionString
      .map(completionChar => COMPLETION_CHARACTER_SCORE[completionChar])
      .reduce((totalScore, score) => totalScore * 5 + score, 0)

    return [completionStringScore]
  })
  .sort((a, b) => a - b)

  const median = scores[Math.floor(scores.length / 2)]

  return median
}
