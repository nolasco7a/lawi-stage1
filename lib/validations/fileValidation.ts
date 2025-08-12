// Tipos de archivo permitidos por bucket
export const ALLOWED_FILE_TYPES = {
  avatars: {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  documents: {
    extensions: ['txt', 'md', 'pdf', 'doc', 'docx', 'rtf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'],
    mimeTypes: [
      'text/plain',
      'text/markdown',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/tiff'
    ],
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  files: {
    extensions: ['txt', 'md', 'pdf', 'doc', 'docx', 'rtf', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico', 'mp3', 'wav', 'mp4', 'avi', 'mov', 'wmv'],
    mimeTypes: [
      'text/plain',
      'text/markdown',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'text/csv',
      'application/json',
      'application/xml',
      'text/html',
      'text/css',
      'application/javascript',
      'application/typescript',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
      'image/x-icon',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
      'video/x-msvideo',
      'video/quicktime',
      'video/x-ms-wmv'
    ],
    maxSize: 50 * 1024 * 1024 // 50MB
  }
}

export interface FileValidationResult {
  isValid: boolean
  error?: string
}

export function validateFile(file: File, bucket: keyof typeof ALLOWED_FILE_TYPES): FileValidationResult {
  const config = ALLOWED_FILE_TYPES[bucket]
  
  // Validar tamaño
  if (file.size > config.maxSize) {
    return {
      isValid: false,
      error: t('validation.file.too_large', { size: config.maxSize / (1024 * 1024) })
    }
  }
  
  // Validar tipo MIME
  if (!config.mimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: t('validation.file.invalid_mime_type', { types: config.extensions.join(', ') })
    }
  }
  
  // Validar extensión
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !config.extensions.includes(extension)) {
    return {
      isValid: false,
      error: t('validation.file.invalid_extension', { extensions: config.extensions.join(', ') })
    }
  }
  
  return { isValid: true }
}

export function getFileIcon(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'].includes(extension || '')) {
    return '🖼️'
  }
  
  if (['pdf'].includes(extension || '')) {
    return '📄'
  }
  
  if (['doc', 'docx'].includes(extension || '')) {
    return '📝'
  }
  
  if (['txt', 'md', 'rtf'].includes(extension || '')) {
    return '📄'
  }
  
  if (['mp3', 'wav'].includes(extension || '')) {
    return '🎵'
  }
  
  if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) {
    return '🎬'
  }
  
  return '📎'
} 