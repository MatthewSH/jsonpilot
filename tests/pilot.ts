import test from 'ava'

import { MigrateSource, MigrateVersions, migrate } from '../src/pilot.js'

const v3_versions: MigrateVersions = [
  {
    version: 1,
    default_data: {
      user: {
        id: 0,
        name: '',
      },
    },
  },
  {
    version: 2,
    default_data: {
      user: {
        id: 0,
        email: '',
        name: '',
      },
    },
  },
  {
    version: 3,
    default_data: {
      user: {
        id: 0,
        email: '',
        name: '',
      },

      inventory: {
        limit: 100,
        items: [],
      },
    },
  },
]

const v3_expectedResult = {
  __pilot: {
    last_migrated: 0,
    version: 3,
  },

  user: {
    id: 1,
    email: '',
    name: 'Random User',
  },

  inventory: {
    limit: 100,
    items: [],
  },
}

test('should migrate from version 1 to version 2', (t) => {
  const source: MigrateSource = {
    name: 'John Doe',
    __pilot: {
      version: 1,
      last_migrated: Math.round(new Date().getTime() / 1000),
    },
  }

  const versions: MigrateVersions = [
    {
      version: 1,
      default_data: {
        name: 'Default Name',
      },
    },
    {
      version: 2,
      default_data: {
        name: 'Default Name',
        age: 0,
      },
    },
  ]

  const actualResult = migrate(source, versions)

  // For the sake of simplicity, we're not testing the last_migrated property
  actualResult.__pilot.last_migrated = 0

  t.deepEqual(actualResult, {
    name: 'John Doe',
    age: 0,
    __pilot: {
      version: 2,
      last_migrated: 0,
    },
  })
})

test('should migrate from version 1 to version 3', (t) => {
  const source: MigrateSource = {
    __pilot: {
      last_migrated: 0,
      version: 1,
    },

    user: {
      id: 1,
      name: 'Random User',
    },
  }

  const actualResult = migrate(source, v3_versions)

  // For the sake of simplicity, we're not testing the last_migrated property
  actualResult.__pilot.last_migrated = 0

  t.deepEqual(actualResult, v3_expectedResult)
})

test('should take a non-pilot object and upgrade it to version 0', (t) => {
  const source = {
    user: {
      id: 1,
      name: 'Random User',
    },
  }

  const actualResult = migrate(source, [])

  // For the sake of simplicity, we're not testing the last_migrated property
  actualResult.__pilot.last_migrated = 0

  t.deepEqual(actualResult, {
    user: {
      id: 1,
      name: 'Random User',
    },
    __pilot: {
      version: 0,
      last_migrated: 0,
    },
  })
})

test('should take a non-pilot object and upgrade it to version 3', (t) => {
  const source = {
    user: {
      id: 1,
      name: 'Random User',
    },
  }

  const actualResult = migrate(source, v3_versions)

  // For the sake of simplicity, we're not testing the last_migrated property
  actualResult.__pilot.last_migrated = 0

  t.deepEqual(actualResult, v3_expectedResult)
})
