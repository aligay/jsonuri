'use strict'

const safeTrim = require('../dist/index')

describe('safeTrim', () => {
  it('trim 0', () => {
    let str = 'a\u200Bb   c	\r\n\r\td e\u2003       f ᠎             　   	   g'
    let ret = safeTrim(str)
    expect(ret).toEqual('ab   c\n\ndef      g')
  })
  
  it('trim 1', () => {
    let str = '  "a":1    a	\r\n\r\t  ᠎             　b   	   '
    let ret = safeTrim(str)
    expect(ret).toEqual('"a":1    a\n\nb')
  })
  
  it('converted CR CR-LR into LR', () => {
    // safeTrim('\r\n') === ''
    expect(safeTrim('   a\r\n\r\nb  ')).toEqual('a\n\nb')
    expect(safeTrim(' \r\n\r\n ')).toEqual('')
    
    expect(safeTrim('  a\r\rb ')).toEqual('a\n\nb')
    expect(safeTrim('  \r\r\r  ')).toEqual('')
    
    expect(safeTrim(' a\r\r\nb ')).toEqual('a\n\nb')
    expect(safeTrim(' \r\r\n  ')).toEqual('')
  })
  
  it('trim BOM', () => {
    let str = '﻿{"a":1}'
    let ret
    try {
      JSON.parse(str)
    } catch (e) {
      ret = 'error!!!'
    }
    expect(ret).toEqual('error!!!')
  })
  
  it('safe trim Bom', () => {
    let str = '﻿{"a":1}'
    let ret = JSON.parse(safeTrim(str))
    expect(ret).toEqual({a: 1})
  })
})

describe('bad args', () => {
  it('{}', () => {
    expect(safeTrim({})).toEqual('[object Object]')
  })
  
  it('[]', () => {
    expect(safeTrim([])).toEqual('')
  })
  
  it('NaN', () => {
    expect(safeTrim(NaN)).toEqual('NaN')
  })
  
  it('undefined', () => {
    expect(safeTrim(undefined)).toEqual('undefined')
  })
  
  it('null', () => {
    expect(safeTrim(null)).toEqual('null')
  })
  
  it('0', () => {
    expect(safeTrim(0)).toEqual('0')
  })
  
  it('function', () => {
    let fun = () => {}
    let ret = safeTrim(fun)
    expect(ret).toEqual(String(fun))
  })
})
