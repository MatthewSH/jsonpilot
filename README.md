# JSON Pilot

A library designed to help version JSON objects and migrate through them while also providing default data.

## Features

- **Minimal Modification:** Everything JSON Pilot needs to work is under `__pilot` to minimize potential collisions.
- **Plug'n play:** Have an existing object? No problem! JSON Pilot will add it's necessary metadata and treat it as "version 0."
- **Non-destructive:** If a property already exist, JSON Pilot doesn't change it. It only changes what it needs to change.
- **Automatic Sorting:** Option to enable sorting of all properties in the object.
- **CommonJS and ESM Support:** JSONPilot leverages SWC to export the library in both CommonJS and ESM.

## Getting Started

### Installation

```bash
npm install jsonpilot
# or
yarn add jsonpilot
# or
pnpm add jsonpilot
```

### Basic Usage

```typescript
import { migrate, MigrateVersions } from 'jsonpilot'

const originalObject = {
  some_value: '123',
}

const versions: MigrateVersions = [
  {
    version: 1,
    migration: {
      some_value: null,
    },
  },
  {
    version: 2,
    migration: {
      another_value: 0,
    },
  },
]

/**
 * This will return the following object
 * {
 *   some_value: '123',
 *   another_value: 0
 * }
 */
const migratedObject = migrate(originalObject, versions)
```

## API Reference

### Migrate

#### `migrate(source, versions, options)`

- `source`: JSON object that is already defined and you want to migrate (if needed).
- `versions`: An array of version definitions. The version number is not semantic versioning and follows a simple incremental pattern.
- `options`: Optional options to use to further adjust the migration process.
  - `targetVersion`: If you want to override the default versioning process (to the latest). Defaults to `-1` to always upgrade the object to the latest version available.
  - `sort`: Sorts the object (and nested objects) properties alphabetically. Defaults to false.

## License

JSON Pilot is licensed under Mozilla Public License Version 2.0.

## Support

While there's no official support, you can always create a new [discussion](https://github.com/MatthewSH/jsonpilot/discussions) or if you encounter a bug please feel free to [open an issue](https://github.com/MatthewSH/jsonpilot/issues)
