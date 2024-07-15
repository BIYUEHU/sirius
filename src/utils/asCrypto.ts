class AsCrypto {
  private readonly KEY_PREFIX = '☆★'
  private readonly KEY_SUFFIX = '★☆'

  public encrypt(text: string, key: string): string {
    const uniqueKey = this.getUniqueKey(key)
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i)
      const keyChar = uniqueKey[i % uniqueKey.length]
      const encryptedCharCode = charCode ^ keyChar.charCodeAt(0)
      result += String.fromCharCode(encryptedCharCode)
    }
    return `${this.KEY_PREFIX}${data.toBase64(result)}${this.KEY_SUFFIX}`
  }

  public decrypt(encryptedText: string, key: string): string {
    if (!this.isEncrypted(encryptedText)) {
      throw new Error('The input string is not encrypted.')
    }
    const uniqueKey = this.getUniqueKey(key)
    const base64 = encryptedText.slice(this.KEY_PREFIX.length, -this.KEY_SUFFIX.length)
    const encrypted = data.fromBase64(base64, false).toString()
    let result = ''
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i)
      const keyChar = uniqueKey[i % uniqueKey.length]
      const decryptedCharCode = charCode ^ keyChar.charCodeAt(0)
      result += String.fromCharCode(decryptedCharCode)
    }
    return result
  }

  public isEncrypted(text: string): boolean {
    return text.startsWith(this.KEY_PREFIX) && text.endsWith(this.KEY_SUFFIX)
  }

  private getUniqueKey(key: string): string {
    return Array.from(new Set(key.split(''))).join('')
  }
}

export default new AsCrypto()
