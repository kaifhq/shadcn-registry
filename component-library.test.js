import registry from './registry.js'
import styles from './styles.js'
import colors from './colors.js'

test('index file has array of components inside', () => {
  expect(registry).toBeInstanceOf(Array)
  registry.forEach(item => {
    expect(item).toHaveProperty('name')
    expect(item).toHaveProperty('type')
    expect(item).toHaveProperty('files.0')
    const properties = Object.keys(item)
    properties.forEach(prop => {
      expect([
        'name',
        'files',
        'type',
        'dependencies',
        'devDependencies',
        'registryDependencies',
      ]).toContain(prop)
      if ([
        'dependencies',
        'devDependencies',
        'registryDependencies',
      ].includes(prop)) {
        expect(item[prop]).toHaveProperty('0')
      }
    })
  })
  const names = registry.map(item => item.name)
  const namesDedup = [...new Set(names)]
  expect(names).toHaveLength(namesDedup.length)
})

test('styles file has array of styles inside', () => {
  expect(styles).toBeInstanceOf(Array)
  styles.forEach(item => {
    expect(item).toHaveProperty('name')
    expect(item).toHaveProperty('label')
    const properties = Object.keys(item)
    properties.forEach(prop => {
      expect(['name', 'label']).toContain(prop)
    })
  })
  const names = styles.map(item => item.name)
  const namesDedup = [...new Set(names)]
  expect(names).toHaveLength(namesDedup.length)
})

test('colors file has array of colors inside', () => {
  expect(colors).toBeInstanceOf(Array)
  colors.forEach(item => {
    expect(item).toHaveProperty('name')
    expect(item).toHaveProperty('label')
    const properties = Object.keys(item)
    properties.forEach(prop => {
      expect(['name', 'label']).toContain(prop)
    })
  })
  const names = colors.map(item => item.name)
  const namesDedup = [...new Set(names)]
  expect(names).toHaveLength(namesDedup.length)
})


import { stat } from 'node:fs'
test('all announced components are present', async () => {
  const compPaths = styles.reduce((acc, style) => {
    const styledComponents = registry.reduce(
      (acc, component) => {
        const styledFiles = component.files.map(
          file => `./registry/${style.name}/${file}`
        )
        return acc.concat(styledFiles)
      },
      [],
    )

    return acc.concat(styledComponents)
  }, [])

  const proms = compPaths.map(p => {
    return new Promise((resolve, reject) => {
      stat(p, (err, stats) => {
        if (err) reject(err)
        resolve(stats && !stats.isDirectory())
      })
    })
  })

  const res = await Promise.all(proms)
  res.every(r => expect(r).toBeTruthy())
})

