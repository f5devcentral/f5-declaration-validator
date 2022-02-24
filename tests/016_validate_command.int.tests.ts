'use strict';

import { expect, test } from '@oclif/test'
import fs from 'fs';

// import { Validate } from '../src/commands/validate'


describe('validate command tests', () => {

  before(function () {
    console.log(`       file:  ${this.test.file}`)
    // psjon = process.env;
  })

  const as3Dec = fs.readFileSync('examples/sample_app_01.as3.json').toString();

  test
    .stdout()
    .command(['validate', as3Dec])
    .it('basic as3 with declaration as arg (in bash buffer)', ctx => {
      const out = ctx.stdout;
      // print stringified json
      expect(out).to.contain('{"valid":true,"diagnostics":[],"dec":{')
    })

  test
    .stdout()
    .command(['validate', as3Dec, '--json'])
    .it('basic as3 with declaration as arg (in bash buffer) w/--json flag', ctx => {
      const out = ctx.stdout;
      // print json pretty
      expect(out).to.contain('{\n  "valid": true,\n  "diagnostics": [],\n  "dec": {')
    })


  test
    .stdout()
    .command(['validate', '{"class":"AS3","action":"breaking","persist":true}'])
    .it('bad as3 declaration as arg', ctx => {
      const out = ctx.stdout;
      const expected = "{\"valid\":false,\"diagnostics\":[\"[line 2] Value is not accepted. Valid values: \\\"deploy\\\", \\\"dry-run\\\", \\\"patch\\\", \\\"redeploy\\\", \\\"retrieve\\\", \\\"remove\\\".\"],\"dec\":{\"class\":\"AS3\",\"action\":\"breaking\",\"persist\":true}}\n"
      expect(out).to.contain(expected)
    })

  test
    .stdout()
    .command(['validate', '--file=examples/sample_app_01.as3.json'])
    .it('basic as3 with declaration as file flag', ctx => {
      const out = ctx.stdout;
      expect(out).to.contain('{"valid":true,"diagnostics":[],"dec":{')
    })



})
