'use strict';

import * as assert from 'assert';

import { f5DecType } from '../src'

import { as3ExampleDec, deviceExampleDec, doExampleDec, tsExampleDec, cfExampleDec} from '../src/models/examples'

// format json document with vscode code:  https://github.com/microsoft/monaco-editor/issues/32


describe('discover F5 ATC declaration type', function () {

    it('as3 declaration', async function () {
        const results = await f5DecType(as3ExampleDec)
        assert.deepStrictEqual(results.type, 'AS3')
        assert.ok(results.schema)
    });

    it('do (bigiq-DO) declaration', async function () {
        const results = await f5DecType(doExampleDec)
        assert.deepStrictEqual(results.type, 'DO')
        assert.ok(results.schema)
    });

    it('device (bigip-DO) declaration', async function () {
        const results = await f5DecType(deviceExampleDec)
        assert.deepStrictEqual(results.type, 'Device')
        assert.ok(results.schema)
    });

    it('ts declaration', async function () {
        const results = await f5DecType(tsExampleDec)
        assert.deepStrictEqual(results.type, 'Telemetry')
        assert.ok(results.schema)
    });

    it('cf declaration', async function () {
        const results = await f5DecType(cfExampleDec)
        assert.deepStrictEqual(results.type, 'Cloud_Failover')
        assert.ok(results.schema)
    });




});
