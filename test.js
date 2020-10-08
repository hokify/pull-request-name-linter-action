var lint = require('@commitlint/lint')
var load = require('@commitlint/load')

async function run() {
  console.log('DEBUG: 1')
  try {
    console.log('DEBUG: 1')
    console.log(`DEBUG: 2:`)
    const title = "build: example"
    console.log(`DEBUG: 3 ${title}`)
    if (!title) {
      console.log('Could not get pull request title from context, exiting')
      return
    }
    console.log(`DEBUG: 4`)
    await lintPullRequest(title, './commitlint.config.js')
  } catch (error) {
    console.log(error)
    console.log(error)
    console.log(error.message)
  }
}

async function lintPullRequest(title, configPath) {
  const opts = await load({}, {file: configPath, cwd: process.cwd()})

  console.log(`TEST: ${JSON.stringify(opts)}`)
  const result = await lint(title, opts.rules, opts)
  if (result.valid) return

  const errorMessage = result.errors
    .map(({message, name}) => `${name}:${message}`)
    .join('\n')
  throw new Error(errorMessage)
}

run()
