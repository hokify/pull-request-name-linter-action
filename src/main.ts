import lint from '@commitlint/lint'
import load from '@commitlint/load'

async function run(): Promise<void> {
  console.log('DEBUG: 1')
  try {
    console.log('DEBUG: 1')
    const configPath = './commitlint.config.js'
    console.log(`DEBUG: 2:${configPath}`)
    const title = 'build: example'
    console.log(`DEBUG: 3 ${title}`)
    console.log(`DEBUG: 4`)
    await lintPullRequest(title, configPath)
  } catch (error) {
    console.log(error)
  }
}

export async function lintPullRequest(title: string, configPath: string) {
  var configTest = require('../commitlint.config.js')
  console.log(`TEST CONFIG: ${JSON.stringify(configTest)}`)
  const opts = await load({}, {file: configPath, cwd: process.cwd()})

  console.log(`TEST: ${JSON.stringify(opts)}`)
  const result = await lint(title, opts.rules, opts)
  if (result.valid) return

  const errorMessage = result.errors
    .map(({message, name}: any) => `${name}:${message}`)
    .join('\n')
  throw new Error(errorMessage)
}

run()
