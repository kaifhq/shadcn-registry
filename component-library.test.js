import registry from './registry.js'

const REQUIRED_INDEX_PROPERTIES = [
  'name',
  'files',
  'type',
]
const OPTIONAL_INDEX_PROPERTIES = [
  'devDependencies',
  'dependencies',
  'registryDependencies',
]
const ALLOWED_INDEX_PROPERTIES = REQUIRED_INDEX_PROPERTIES.concat(OPTIONAL_INDEX_PROPERTIES)

test('index file has array of components inside', () => {
  expect(registry).toBeInstanceOf(Array)
  registry.forEach(item => {
    expect(item).toHaveProperty('name')
    expect(item).toHaveProperty('type')
    expect(item).toHaveProperty('files.0')
    const properties = Object.keys(item)
    properties.forEach(prop => {
      expect(ALLOWED_INDEX_PROPERTIES).toContain(prop)
      if (OPTIONAL_INDEX_PROPERTIES.includes(prop)) {
        expect(item[prop]).toHaveProperty('0')
      }
    })
  })
  const names = registry.map(item => item.name)
  const namesDedup = [...new Set(names)]
  expect(names).toHaveLength(namesDedup.length)
})
