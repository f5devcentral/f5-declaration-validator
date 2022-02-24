'use strict';

import * as assert from 'assert';
import { fork } from 'child_process';

import { ExtHttp,  isArray, wait } from 'f5-conx-core';
import { after, beforeEach } from 'mocha';

import pjson from '../package.json';

import { validate } from '../src'

import {
    as3ExampleDec,
    deviceExampleDec,
    doExampleDec,
    tsExampleDec,
    cfExampleDec
} from '../src/models/examples'

const f5Https = new ExtHttp({ rejectUnauthorized: false })


// format json document with vscode code:  https://github.com/microsoft/monaco-editor/issues/32


// let psjon;

describe('REST API Tests', function () {

    before(async function () {
        console.log(`       file:  ${this.test.file}`)

        fork('./dist/app.js', ['3000'], { stdio: 'inherit' })
        await wait(4000)
    })
    
    beforeEach( async function () {
        await wait(1000)    // give each test/log a moment to settle
    })

    after(async function () {
        // all done, so close the service and release supporing processes
        await f5Https.makeRequest({ url: 'https://[::1]:3000/exit' })
    })

    it('base / redirect to /info', async function () {
        const resp = await f5Https.makeRequest({ url: 'https://[::1]:3000/' })
            .then(resp => resp)
            .catch(err => {
                debugger;
                throw Error(err);
            })
        // did we get to the info endpoint?
        assert.deepStrictEqual(resp.request.url, '/')
        assert.deepStrictEqual(resp.data.appName, 'f5-declaration-validator')

    });

    it('base /notConfiguredRoute redirect to /info', async function () {
        const resp = await f5Https.makeRequest({ url: 'https://[::1]:3000/notConfiguredRoute' })
            .then(resp => resp)
            .catch(err => {
                debugger;
                throw Error(err);
            })
        assert.deepStrictEqual(resp.request.url, '/notConfiguredRoute')
        // still gave us the info details
        assert.deepStrictEqual(resp.data.appName, 'f5-declaration-validator')
    });

    it('GET /info details', async function () {
        const resp = await f5Https.makeRequest({ url: 'https://[::1]:3000/info' })
            .then(resp => resp)
            .catch(err => {
                debugger;
                throw Error(err);
            })
        assert.deepStrictEqual(resp.request.url, '/info')
        // did the /info endpoint respond appropriately?
        assert.deepStrictEqual(resp.data.appName, pjson.name)
        assert.deepStrictEqual(resp.data.version, pjson.version)
        assert.deepStrictEqual(resp.data.license, pjson.license)
        assert.deepStrictEqual(resp.data.homepage, pjson.homepage)
        assert.ok(isArray(resp.data.routes))
    });


    it('POST /validate - as3', async function () {
        const resp = await f5Https.makeRequest({
            url: 'https://[::1]:3000/validate',
            method: 'POST',
            data: as3ExampleDec
        })
            .then(resp => resp)
            .catch(err => {
                debugger;
                throw Error(err);
            })

        assert.ok(resp.data.valid, `as3 declaration validation should return true`)
        assert.ok(resp.data.diagnostics.length === 0, `diagnostics array should be empty`)
    });

    it('POST /validate - bad as3', async function () {
        const resp = await f5Https.makeRequest({
            url: 'https://[::1]:3000/validate',
            method: 'POST',
            data: {
                declaration: {
                    class: 'Tenant',
                    something: 'missing'
                }
            }
        })
            .then(resp => resp)
            .catch(err => {
                debugger;
                throw Error(err);
            })



        assert.ok(!resp.data.valid, `as3 declaration validation should return false`)
        assert.ok(resp.data.diagnostics.length > 0, `diagnostics array should have errors`)
    });



});
