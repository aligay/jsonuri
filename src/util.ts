export function sleep (delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay * 1000)
  })
}
