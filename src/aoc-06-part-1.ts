const dir = "src/"
const outDir = "src/out/"
const fileName = "aoc-06-input.txt"
const outName = "aoc-06-output.txt"

main()

async function main() {
  const fileContent = await readInputFile(`${dir}${fileName}`)
  const fileStrings = fileContent.split("\n")

  const grid: string[][] = []
  for (const fileString of fileStrings) {
    grid.push(Array.from(fileString))
  }

  const initialGuardPosition = getGuardPosition(grid)
  printLocalEnvironment(initialGuardPosition, grid, 4)
  walkUntilOutOfGrid(initialGuardPosition, grid)

  const outputString = grid.map((row) => row.join("")).join("\n")
  const numberOfVisitedTiles = outputString.match(/[X]/g)?.length
  console.log(numberOfVisitedTiles! + 1) // +1 Because the last tile is the guard
  await Deno.writeTextFile(`${outDir}${outName}`, outputString)
}

function walkUntilOutOfGrid(guardPosition: GuardPosition, grid: string[][]) {
  while (true) {
    if (
      guardPosition.lookingAtY === undefined ||
      guardPosition.lookingAtX === undefined ||
      guardPosition.lookingAt === undefined
    ) {
      console.log("Stopping condition met.")
      return
    }

    // Turn if facing obstacle
    if (guardPosition.lookingAt === "#") {
      rotateGuard(guardPosition)
      updateLookingAt(guardPosition, grid)
      continue // Skip movement
    }

    // Move and mark path
    grid[guardPosition.y][guardPosition.x] = "X"
    grid[guardPosition.lookingAtY][guardPosition.lookingAtX] = guardPosition.facing

    // Update position data
    guardPosition.x = guardPosition.lookingAtX
    guardPosition.y = guardPosition.lookingAtY
    updateLookingAt(guardPosition, grid)

    printLocalEnvironment(guardPosition, grid, 5)
    console.log("\n")
  }
}

function rotateGuard(guardPosition: GuardPosition) {
  const validFacings = ["<", ">", "^", "v"]
  if (!validFacings.includes(guardPosition.facing)) {
    console.error("Invalid facing detected:", guardPosition.facing)
    return
  }

  switch (guardPosition.facing) {
    case "<":
      guardPosition.facing = "^"
      break
    case ">":
      guardPosition.facing = "v"
      break
    case "^":
      guardPosition.facing = ">"
      break
    case "v":
      guardPosition.facing = "<"
      break
  }
}

function getGuardPosition(grid: string[][]) {
  const guardPosition: GuardPosition = {
    facing: "",
    y: 0,
    x: 0,
    lookingAt: "",
    lookingAtY: 0,
    lookingAtX: 0,
  }
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const position = grid[y][x]
      const guardRegex = /[<>^v]/g

      if (position.match(guardRegex)) {
        guardPosition.facing = grid[y][x]
        guardPosition.y = y
        guardPosition.x = x
        updateLookingAt(guardPosition, grid)
      }
    }
  }
  return guardPosition
}

function updateLookingAt(guardPosition: GuardPosition, grid: string[][]) {
  switch (guardPosition.facing) {
    case "<":
      guardPosition.lookingAt = grid[guardPosition.y][guardPosition.x - 1]
      guardPosition.lookingAtY = guardPosition.y
      guardPosition.lookingAtX = guardPosition.x - 1
      break
    case ">":
      guardPosition.lookingAt = grid[guardPosition.y][guardPosition.x + 1]
      guardPosition.lookingAtY = guardPosition.y
      guardPosition.lookingAtX = guardPosition.x + 1
      break
    case "^":
      guardPosition.lookingAt = grid[guardPosition.y - 1][guardPosition.x]
      guardPosition.lookingAtY = guardPosition.y - 1
      guardPosition.lookingAtX = guardPosition.x
      break
    case "v":
      guardPosition.lookingAt = grid[guardPosition.y + 1][guardPosition.x]
      guardPosition.lookingAtY = guardPosition.y + 1
      guardPosition.lookingAtX = guardPosition.x
      break
    default:
      guardPosition.lookingAt = undefined
      guardPosition.lookingAtY = undefined
      guardPosition.lookingAtX = undefined
  }
}

function printLocalEnvironment(guardPosition: GuardPosition, grid: string[][], size: number = 1) {
  for (let y = guardPosition.y - size; y <= guardPosition.y + size; y++) {
    let row = ""
    for (let x = guardPosition.x - size; x <= guardPosition.x + size; x++) {
      if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
        row += grid[y][x] + " "
      } else {
        row += "  " // Out of grid
      }
    }
    console.log(row.trim())
  }
}

async function readInputFile(filename: string) {
  return await Deno.readTextFile(filename)
}

type GuardPosition = {
  facing: string
  y: number
  x: number
  lookingAt: string | undefined
  lookingAtY: number | undefined
  lookingAtX: number | undefined
}
