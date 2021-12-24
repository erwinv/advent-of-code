import _ from 'lodash'
import { chooseK, combinations, pairPermutations, slidingPairs } from '../lib'

const input = _.range(1, 5)

// for (const combination of combinations(input)) {
//   console.info(`[${combination.join(', ')}]`)
// }

for (const choose12 of chooseK(input, 2)) {
  console.info(`[${choose12.join(', ')}]`)
}