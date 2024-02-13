const PILOT_KEY = '__pilot'

export interface PilotMetadata {
  __pilot: {
    version: number
    last_migrated: number
  }
}

export interface MigrateSource extends PilotMetadata {
  [key: string]: any
}

export interface MigrateVersion {
  // type: 'object'
  version: number
  default_data: { [key: string]: any }
}

export type MigrateVersions = MigrateVersion[]

export interface MigrateOptions {
  targetVersion?: number
  sort?: boolean
}

export function migrate(
  source: MigrateSource | { [key: string]: any },
  versions: MigrateVersions,
  options: MigrateOptions = { targetVersion: -1, sort: true }
): MigrateSource {
  let clonedSource = structuredClone(source) as MigrateSource

  if (!Object.hasOwn(clonedSource, PILOT_KEY)) {
    debug(
      'Pilot configuration not found, adding it to the source. Treating as version 0 to apply all migrations.'
    )

    clonedSource.__pilot = {
      version: 0,
      last_migrated: Math.round(new Date().getTime() / 1000),
    }
  }

  if (versions.length === 0) {
    return clonedSource as MigrateSource
  }

  for (const version of versions) {
    if (version.version <= clonedSource.__pilot.version) {
      continue
    }

    if (
      options.targetVersion &&
      options.targetVersion > 0 &&
      version.version > options.targetVersion
    ) {
      continue
    }

    debug(`Migrating to version ${version.version}`)

    clonedSource = addChanges(version.default_data, clonedSource)

    clonedSource.__pilot = {
      version: version.version,
      last_migrated: Math.round(new Date().getTime() / 1000),
    }
  }

  if (options.sort) {
    return sortObject(clonedSource) as MigrateSource
  }

  return clonedSource
}

function sortObject(obj: { [key: string]: any }) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  const sortedObj: { [key: string]: any } = {}
  const keys = Object.keys(obj)

  keys.sort((a, b) => {
    a = a.toLowerCase()
    b = b.toLowerCase()

    if (a < b) {
      return -1
    }

    if (a > b) {
      return 1
    }

    return 0
  })

  for (const key of keys) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      sortedObj[key] = sortObject(obj[key])
    } else {
      sortedObj[key] = obj[key]
    }
  }

  return sortedObj
}

function addChanges(bullet: { [key: string]: any }, target: MigrateSource) {
  const cloneTarget = structuredClone(target)

  for (const key in bullet) {
    if (key === PILOT_KEY) {
      continue
    }

    if (!Object.hasOwn(cloneTarget, key)) {
      cloneTarget[key] = bullet[key]

      continue
    }

    if (
      Object.hasOwn(cloneTarget, key) &&
      typeof cloneTarget[key] === 'object'
    ) {
      cloneTarget[key] = addChanges(bullet[key], cloneTarget[key])
    }
  }

  return cloneTarget
}

function debug(...args: any[]) {
  if (process.env.DEBUG) {
    const now = new Date()
    const timestamp = formatTimestamp(now)
    console.log(timestamp, '[jsonpilot] [DEBUG]', ...args)
  }
}

function formatTimestamp(date: Date) {
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getDate().toString().padStart(2, '0') +
    ' ' +
    date.getHours().toString().padStart(2, '0') +
    ':' +
    date.getMinutes().toString().padStart(2, '0') +
    ':' +
    date.getSeconds().toString().padStart(2, '0')
  )
}
