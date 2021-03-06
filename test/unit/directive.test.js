import messages from './fixture/index'

describe('custom directive', () => {
  let i18n
  beforeEach(() => {
    i18n = new VueI18n({
      locale: 'en',
      messages
    })
  })

  function createVM (options) {
    const el = document.createElement('div')
    return new Vue(options).$mount(el)
  }

  describe('v-t', () => {
    describe('string literal', () => {
      it('should be translated', done => {
        const vm = createVM({
          i18n,
          render (h) {
            // <p ref="text" v-t="'message.hello'"></p>
            return h('p', { ref: 'text', directives: [{
              name: 't', rawName: 'v-t', value: ('message.hello'), expression: "'message.hello'"
            }] })
          }
        })
        nextTick(() => {
          assert.equal(vm.$refs.text.textContent, messages.en.message.hello)
          assert.equal(vm.$refs.text._vt, messages.en.message.hello)
          vm.$forceUpdate()
        }).then(() => {
          assert.equal(vm.$refs.text.textContent, messages.en.message.hello)
          assert.equal(vm.$refs.text._vt, messages.en.message.hello)
        }).then(done)
      })
    })

    describe('object', () => {
      it('should be translated', done => {
        const vm = createVM({
          i18n,
          data: {
            msgPath: 'message.format.named'
          },
          render (h) {
            // <p ref="text" v-t="{ path: msgPath, locale: 'ja', args: { name: 'kazupon' } }"></p>
            return h('p', { ref: 'text', directives: [{
              name: 't', rawName: 'v-t',
              value: ({ path: this.msgPath, locale: 'ja', args: { name: 'kazupon' } }),
              expression: "{ path: msgPath, locale: 'ja', args: { name: 'kazupon' } }"
            }] })
          }
        })
        const expected = 'こんにちは kazupon, ごきげんいかが？'
        nextTick(() => {
          assert.equal(vm.$refs.text.textContent, expected)
          assert.equal(vm.$refs.text._vt, expected)
          vm.$forceUpdate()
        }).then(() => {
          assert.equal(vm.$refs.text.textContent, expected)
          assert.equal(vm.$refs.text._vt, expected)
        }).then(done)
      })
    })

    describe('not support warning', () => {
      it('should be warned', done => {
        const spy = sinon.spy(console, 'warn')
        createVM({
          i18n,
          render (h) {
            // <p ref="text" v-t="[1]"></p>
            return h('p', { ref: 'text', directives: [{
              name: 't', rawName: 'v-t', value: ([1]), expression: '[1]'
            }] })
          }
        })
        nextTick(() => {
          assert(spy.notCalled === false)
          assert(spy.callCount === 1)
          spy.restore()
        }).then(done)
      })
    })

    describe('path required warning', () => {
      it('should be warned', done => {
        const spy = sinon.spy(console, 'warn')
        createVM({
          i18n,
          render (h) {
            // <p ref="text" v-t="{ locale: 'ja', args: { name: 'kazupon' } }"></p>
            return h('p', { ref: 'text', directives: [{
              name: 't', rawName: 'v-t',
              value: ({ locale: 'ja', args: { name: 'kazupon' } }),
              expression: "{ locale: 'ja', args: { name: 'kazupon' } }"
            }] })
          }
        })
        nextTick(() => {
          assert(spy.notCalled === false)
          assert(spy.callCount === 1)
          spy.restore()
        }).then(done)
      })
    })

    describe('VueI18n instance warning', () => {
      it('should be warned', done => {
        const spy = sinon.spy(console, 'warn')
        createVM({
          render (h) {
            return h('p', { ref: 'text', directives: [{
              name: 't', rawName: 'v-t', value: ('message.hello'), expression: "'message.hello'"
            }] })
          }
        })
        nextTick(() => {
          assert(spy.notCalled === false)
          assert(spy.callCount === 1)
          spy.restore()
        }).then(done)
      })
    })
  })
})
