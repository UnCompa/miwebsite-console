export const formatedText = (text: string, lengthMax?: number) => {
  const actualLen = text.length
  if (lengthMax) {
    return text.slice(0, lengthMax)
  }
  if (actualLen > 50) {
    return text.slice(0, 75) + '...'
  }
  return text
}