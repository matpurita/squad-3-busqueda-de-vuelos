import crypto from 'crypto'

/**
 * Encripta una contraseña usando AES-128-CBC
 * @param password - Contraseña en texto plano
 * @returns string - Contraseña encriptada en formato base64
 */
export function encryptPasswordAES128(password: string): string {
  const algorithm = 'aes-128-cbc'
  const key = 'default-key-16b' // 16 bytes para AES-128

  // Asegurar que la clave tenga exactamente 16 bytes
  const keyBuffer = Buffer.from(key.padEnd(16, '0').substring(0, 16), 'utf8')

  // Generar IV aleatorio
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv)

  let encrypted = cipher.update(password, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  // Combinar IV y texto encriptado (IV:encrypted)
  return `${iv.toString('base64')}:${encrypted}`
}
