export function getEnv(key: string): string | undefined {
    const value = process.env[key]
    if (!value) {
      console.error(`Environment variable ${key} is not set`)
    }
    return value
  }
  