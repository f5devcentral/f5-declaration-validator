import { expect, test } from '@oclif/test'
import * as path from 'path';
import fs from 'fs';

import { Validate } from '../src/commands/validate'


describe('validate command tests', () => {

  const as3App1 = path.join(__dirname, '..', '..', '..', 'tenants', 'app1.as3.json')


  const as3Dec = fs.readFileSync('examples/sample_app_01.as3.json').toString();
  test
    .stdout()
    .command([
      'validate', as3Dec,
    ])
    // .do(async () => {
    //     new Validate([ 'validate', as3Dec])
    // })
    .it('basic as3 with file as arg', ctx => {
      const x = ctx.stdout;
      expect(ctx.stdout).to.contain("tenant: 'Sample_01'")
    })


})
