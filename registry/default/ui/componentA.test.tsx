import { ComponentA } from './componentA.tsx'

vi.mock('react')
test('componentA works', () => {
  expect(ComponentA()).toEqual({
    elem: 'div',
    props: null,
    children: ['Test'],
  }) 
})
