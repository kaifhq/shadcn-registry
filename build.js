import {
  readFile,
  writeFile,
  rename,
  mkdir,
  rm,
  stat,
} from 'node:fs/promises'
import registry from './registry.js'
import styles from './styles.js'
import colors from './colors.js'

const OUTDIR = './dist'

const processComponent = async (component, style) => {
  const type = component.type
  const name = component.name
  const files = await Promise.all(
    component.files.map(async path => {
      const p = `./registry/${style.name}/${path}`
      const content = await readFile(p, 'utf8')
      return {
        path,
        content: content.replace(/\r\n/g, '\n'),
        type,
      }
    })
  )

  const content = JSON.stringify({
    name,
    type,
    files,
  }, null, "  ")

  await writeFile(
    `${OUTDIR}/styles/${style.name}/${name}.json`,
    content,
  )
}

const makeComponentJSONs = () => {
  const proms = styles.reduce((acc, style) => {
    const styledComponents = registry.map(
      component => processComponent(component, style)
    )

    return acc.concat(styledComponents)
  }, [])
  return proms
}

const makeColorJSONs = () => {
  const proms = colors.map(async (colorData) => {
    const color = colorData.name
    const content = await readFile(`./colors/${color}.json`, 'utf8')
    await writeFile(`${OUTDIR}/colors/${color}.json`, content)
  })
  return proms
}

const makeStyles = async () => {
  const content = JSON.stringify(
    styles, null, "  ",
  )
  await writeFile(
    `${OUTDIR}/styles/index.json`,
    content,
  )
}

const makeColors = async () => {
  const content = JSON.stringify(
    colors, null, "  ",
  )
  await writeFile(
    `${OUTDIR}/colors/index.json`,
    content,
  )
}

const makeIndex = async () => {
  const content = JSON.stringify(
    registry, null, "  ",
  )
  await writeFile(
    `${OUTDIR}/index.json`,
    content,
  )
}

const start = async () => {
  let isDirPresent = false
  try {
    const outputStats = await stat(OUTDIR)
    isDirPresent = outputStats.isDirectory()
  } catch(e) {}
  if (isDirPresent) {
    await rename(OUTDIR, `${OUTDIR}.backup`)
  }
  await mkdir(OUTDIR, { recursive: true })
  await mkdir(`${OUTDIR}/styles`)
  await mkdir(`${OUTDIR}/colors`)
  await Promise.all(
    styles.map(({name, label}) =>
      mkdir(`${OUTDIR}/styles/${name}`)
    )
  )
  try {
    await Promise.all([
      makeIndex(),
      makeStyles(),
      makeColors(),
    ].concat(makeComponentJSONs())
     .concat(makeColorJSONs())
    )
    if (isDirPresent) {
      await rm(`${OUTDIR}.backup`, {recursive: true})
    }
  } catch(e) {
    console.log(e)
    await rm(OUTDIR, {recursive: true})
    if (isDirPresent) {
      await rename(`${OUTDIR}.backup`, OUTDIR)
    }
  }
}

start()
