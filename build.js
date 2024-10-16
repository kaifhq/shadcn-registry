import { readFile } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import registry from './registry.js'
import styles from './styles.js'

const OUTDIR = 'dist'

const processComponent = async (component, style) => {
  const files = await Promise.all(
    component.files.map(file => {
      const p = `./registry/${style.name}/${file}`
      return new Promise((resolve, reject) => {
        readFile(p, 'utf8', (err, content) => {
          if (err) reject(err)
          resolve({content, name: file})
        })
      })
    })
  )

  const content = JSON.stringify({
    name: component.name,
    files,
    type: component.type,
  }, null, "  ")

  await writeFile(
    `./${OUTDIR}/styles/${style.name}/${component.name}.json`,
    content,
  )
}

const makeComponentJSONs = async () => {
  const proms = styles.reduce((acc, style) => {
    const styledComponents = registry.map(
      component => processComponent(component, style)
    )

    return acc.concat(styledComponents)
  }, [])
  return proms
}

const makeStyles = async () => {
  const content = JSON.stringify(
    styles, null, "  ",
  )
  await writeFile(
    `./${OUTDIR}/styles/index.json`,
    content,
  )
}

const makeIndex = async () => {
  const content = JSON.stringify(
    registry, null, "  ",
  )
  await writeFile(
    `./${OUTDIR}/index.json`,
    content,
  )
}

const start = async () => {
  await Promise.all([
    makeIndex(),
    makeStyles(),
  ].concat(makeComponentJSONs()))
}

start()
