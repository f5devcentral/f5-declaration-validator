'use strict';

import * as assert from 'assert';

import { validate } from '../src'

import { 
    as3ExampleDec,
    deviceExampleDec,
    doExampleDec,
    tsExampleDec,
    cfExampleDec
} from '../src/models/examples'


// format json document with vscode code:  https://github.com/microsoft/monaco-editor/issues/32


describe('discover F5 ATC declaration type', function () {

    it('good as3 dec', async function () {
        const { diagnostics } = await validate(as3ExampleDec)
        assert.deepStrictEqual(diagnostics.length, 0)
    });

    it('good as3 dec w/injected schema reference', async function () {
        // want to show some sort of test that this works with and without the imbeded schema reference
        const { diagnostics } = await validate(as3ExampleDec)
        assert.deepStrictEqual(diagnostics.length, 0)
    });

    it('bad as3 dec', async function () {
        const { diagnostics } = await validate({
            "class": "AS3",
            "action": "breaking",
            "persist": true,
        })
        assert.ok(diagnostics.length > 0);
    });

    it('good device dec', async function () {
        const { diagnostics } = await validate(deviceExampleDec)
        assert.ok(diagnostics.length === 0)
    });

    it('good do dec', async function () {
        const { diagnostics } = await validate(doExampleDec)
        assert.ok(diagnostics.length === 0)
    });

    it('good ts dec', async function () {
        const { diagnostics } = await validate(tsExampleDec)
        assert.ok(diagnostics.length === 0)
    });

    it('good cf dec', async function () {
        const { diagnostics } = await validate(cfExampleDec)
        assert.ok(diagnostics.length === 0)
    });




});
