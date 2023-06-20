export const checkPasswordFormat = (v: string) => {
  const regex = [
    /[a-z]/g,
    /[A-Z]/g,
    /\d/g,
    /[!"#$%&'()*+,\-./:;<=>?@\\[\]^_`{}|~]/g
  ]
  return (
    regex
      .map((r) => (r.test(v) ? 1 : 0))
      .reduce((a, b) => a + b, 0 as number) >= 3 ||
    '英小文字、英大文字、数字、記号のうち3つ以上が含まれている必要があります。'
  )
}
