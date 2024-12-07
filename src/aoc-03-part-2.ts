const dir = "src/"
const fileName = "aoc-03-input.txt"

main()

async function main() {
  const fileContent = await readInputFile(`${dir}${fileName}`)
  const multiplications = parseForInstructions(fileContent)
  calcMultiplicationSum(multiplications)
}

async function readInputFile(filename: string) {
  return await Deno.readTextFile(filename)
}

function parseForInstructions(fileContent: string) {
  const mulRegex = /mul\(\d.?.?,\d.?.?\)/g
  const doRegex = /do\(\)/g
  const dontRegex = /don't\(\)/g

  // TODO: how to find the proper order?
  console.log(fileContent.split(dontRegex)[1])
  // mit split() könnte man an der stelle aufteilen in davor und danach
  const matches = []

  const multiplicationStrings = fileContent.match(mulRegex) ?? []

  const multiplications: number[][] = []
  for (const string of multiplicationStrings) {
    multiplications.push(
      string
        .replace("mul(", "")
        .replace(")", "")
        .split(",")
        .map((num) => parseInt(num))
    )
  }
  return multiplications
}

function calcMultiplicationSum(multiplications: number[][]) {
  let result = 0
  for (const multiplication of multiplications) {
    const multiplicationResult = multiplication.reduce((a, b) => a * b, 1)
    result += multiplicationResult
  }
  console.log("result", result)
}
