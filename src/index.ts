import { sleep } from './util'

export default class Init {
  private foo: string = 'world'
  async run () {
    console.log('hello')
    await sleep(1)
    console.log(this.foo)
  }
}
