const dir = "src/"
const fileName = "aoc-01-input.txt"

main()

async function main() {
  const fileContent = await readInputFile(`${dir}${fileName}`)
  const coordinateLists = prepareLists(fileContent)
  const totalDistance = calculateTotalDistance(coordinateLists)
  console.log("totalDistance: ", totalDistance)
  const similarityScore = calculateSimilarityScore(coordinateLists)
  console.log("similarityScore: ", similarityScore)
}

type CoordinateLists = {
  leftList: number[]
  rightList: number[]
}

async function readInputFile(filename: string) {
  return await Deno.readTextFile(filename)
}

function prepareLists(fileContent: string) {
  const rows = fileContent.split("\n")

  const leftList: number[] = []
  const rightList: number[] = []
  const listSeparator = "   "

  for (const row of rows) {
    leftList.push(parseInt(row.split(listSeparator)[0]))
    rightList.push(parseInt(row.split(listSeparator)[1]))
  }

  leftList.sort((a, b) => a - b)
  rightList.sort((a, b) => a - b)

  return { leftList, rightList }
}

function calculateTotalDistance(coordinateLists: CoordinateLists) {
  const { leftList, rightList } = coordinateLists
  const length = leftList.length

  const locationDistances: number[] = []
  for (let index = 0; index < length; index++) {
    locationDistances.push(Math.abs(leftList[index] - rightList[index]))
  }

  return locationDistances.reduce((distanceSum, distance) => distanceSum + distance, 0)
}

function calculateSimilarityScore(coordinateLists: CoordinateLists) {
  const { leftList, rightList } = coordinateLists
  const similarityScores: number[] = []

  for (const leftEntry of leftList) {
    let apperances = 0
    for (const rightEntry of rightList) {
      if (leftEntry === rightEntry) {
        apperances++
      }
    }
    similarityScores.push(leftEntry * apperances)
  }

  return similarityScores.reduce((similaritySum, similarityScore) => similaritySum + similarityScore, 0)
}
