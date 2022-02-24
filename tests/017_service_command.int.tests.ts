'use strict';

import https from 'https';
import { expect, test } from '@oclif/test'
import axios from 'axios';
import { wait, ExtHttp } from 'f5-conx-core';

const f5Https = new ExtHttp({ rejectUnauthorized: false })

describe('service command tests', () => {

  before(function () {
    console.log(`       file:  ${this.test.file}`)
    // psjon = process.env;
  })
  
  // after( () => {
  //   //
  //   console.log('all done!');
  // })

  test
    .stdout()
    .command(['service'])
    .it('start service with defaults', async ctx => {

      // wait for the service to start
      await wait(4000)

      const resp = await f5Https.makeRequest({ url: 'https://[::1]:3030/' })
        .then(resp => resp)
        .catch(err => {
          debugger;
          throw Error(err);
        })

      const out = ctx.stdout;

      // output from the service command starting the service
      expect(out).to.contain('---- start service comamand: {"port":"3030"}\n')

      // service response (should redirect to info endpoint)
      expect(resp.status).to.equal(200)
      expect(resp.data.appName).to.equal('f5-declaration-validator')
      await f5Https.makeRequest({ url: 'https://[::1]:3030/exit' })

    })


  test
    .stdout()
    .command(['service', '-p=3333', '--cert=tests/artifacts/f5-dv.crt', '--key=tests/artifacts/f5-dv.key'])
    .it('start service with all flags', async ctx => {

      // wait for the service to start
      await wait(4000)

      const resp = await f5Https.makeRequest({ url: 'https://[::1]:3333/' })
        .then(resp => resp)
        .catch(err => {
          debugger;
          throw Error(err);
        })

      const out = ctx.stdout;

      // output from the service command starting the service
      expect(out).to.contain('---- start service comamand: {"port":"3333","cert":"tests/artifacts/f5-dv.crt","key":"tests/artifacts/f5-dv.key"}\n')

      // service response (should redirect to info endpoint)
      expect(resp.status).to.equal(200)
      expect(resp.data.appName).to.equal('f5-declaration-validator')

      await f5Https.makeRequest({ url: 'https://[::1]:3333/exit' })
    })



})
