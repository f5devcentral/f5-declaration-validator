'use strict';

import * as assert from 'assert';

import { injectSchema } from 'f5-conx-core';

import { decType, validate } from '../src'

import { as3ExampleDec, deviceExampleDec, doExampleDec, tsExampleDec, cfExampleDec} from '../src/models/examples'

import as3Schema from '../src/schemas/as3Schema.json';
import deviceSchema from '../src/schemas/deviceSchema.json';
import doSchema from '../src/schemas/doSchema.json';
import tsSchema from '../src/schemas/tsSchema.json';
import cfSchema from '../src/schemas/cfSchema.json';

const as3SchemaURL = "https://raw.githubusercontent.com/F5Networks/f5-appsvcs-extension/master/schema/latest/as3-schema.json";

// format json document with vscode code:  https://github.com/microsoft/monaco-editor/issues/32


describe('discover F5 ATC declaration type', function () {

    it('as3 declaration', async function () {
        const results = await decType(as3ExampleDec)
        assert.deepStrictEqual(results.type, 'AS3')
        assert.ok(results.schema)
    });

    it('do (bigiq-DO) declaration', async function () {
        const results = await decType(doExampleDec)
        assert.deepStrictEqual(results.type, 'DO')
        assert.ok(results.schema)
    });

    it('device (bigip-DO) declaration', async function () {
        const results = await decType(deviceExampleDec)
        assert.deepStrictEqual(results.type, 'Device')
        assert.ok(results.schema)
    });

    it('ts declaration', async function () {
        const results = await decType(tsExampleDec)
        assert.deepStrictEqual(results.type, 'Telemetry')
        assert.ok(results.schema)
    });

    it('cf declaration', async function () {
        const results = await decType(cfExampleDec)
        assert.deepStrictEqual(results.type, 'Cloud_Failover')
        assert.ok(results.schema)
    });




});
