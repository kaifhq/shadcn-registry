# shadcn-registry

This template is helpful to build your own custom
component registry that can be seamlessly used with
standard shadcn command line tool.
While you could clone
[shadcn/ui repository](https://github.com/shadcn-ui/ui)
directly, you would not want to spelunk through the
entire codebase to figure out how to create your
own component.

## Developing

Install dependencies with:
```
npm i
```

Build out library to `dist` folder with:
```
npm run build
```

Test configuration for structural completeness with:
```
npm run test
```

## Usage

Install `cross-env` and call shadcn cli with extra
environment variable, or configure it within
`package.json` like so:

```json
{
  ...
  "scripts": {
    "shadcn": "cross-env REGISTRY_URL=\"https://path to your dist directory\" npx shadcn@latest",
  },
  ...
}
```

## Structure

You can use any frontend library or framework of
preference, shadcn cli is framework agnostic.
However, consider writing some tests. This template
comes equipped with vitest. There is also an example
test for ui component.

Define components in `registry.js`,
styles in `styles.js`, colors in `colors.js`.

Place component code inside of `registry` folder
within subfolder for all different styles you wish
to support.

This repository only has 300 lines of code,
so everything should be straight-forward.
For more information go to
[official documentation](https://ui.shadcn.com/docs).

Anyways, feel free to suggest further improvements.

