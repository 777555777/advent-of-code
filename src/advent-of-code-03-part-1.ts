const dir = "src/"
const fileName = "advent-of-code-03-input.txt"

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
