const dir = "src/"
const fileName = "advent-of-code-01-input.txt"

main()

async function main() {
  const fileContent = await readInputFile(`${dir}${fileName}`)
  const coordinateLists = prepareLists(fileContent)
  const totalDistance = calculateTotalDistance(coordinateLists)
  console.log(totalDistance)
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

function calculateTotalDistance(coordinateLists: { leftList: number[]; rightList: number[] }) {
  const { leftList, rightList } = coordinateLists
  const length = leftList.length

  const locationDistances: number[] = []
  for (let index = 0; index < length; index++) {
    locationDistances.push(Math.abs(leftList[index] - rightList[index]))
  }

  return locationDistances.reduce((distanceSum, distance) => distanceSum + distance, 0)
}
