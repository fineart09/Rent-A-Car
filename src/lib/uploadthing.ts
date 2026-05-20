// Placeholder UploadThing/S3 configuration helper
export const uploadConfig = {
  provider: process.env.UPLOADTHING_URL ? 'uploadthing' : 's3',
  url: process.env.UPLOADTHING_URL ?? process.env.S3_ENDPOINT ?? '',
  secret: process.env.UPLOADTHING_SECRET ?? process.env.S3_SECRET ?? ''
}

export function getUploadProvider() {
  return uploadConfig.provider
}

export function getUploadUrl(key: string) {
  if (!key) return ''
  return `${uploadConfig.url}/${key}`
}
