'use strict';

import * as assert from 'assert';

import { injectSchema } from 'f5-conx-core';

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
        const Diagnostic = await validate(as3ExampleDec)
        assert.deepStrictEqual(Diagnostic.length, 0)
    });

    it('good as3 dec w/injected schema reference', async function () {
        // want to show some sort of test that this works with and without the imbeded schema reference
        const Diagnostic = await validate(as3ExampleDec)
        assert.deepStrictEqual(Diagnostic.length, 0)
    });

    it('bad as3 dec', async function () {
        const Diagnostic = await validate({
            "class": "AS3",
            "action": "breaking",
            "persist": true,
        })
        assert.ok(Diagnostic.length > 0);
    });

    it('good device dec', async function () {
        const Diagnostic = await validate(deviceExampleDec)
        assert.ok(Diagnostic.length === 0)
    });

    it('good do dec', async function () {
        const Diagnostic = await validate(doExampleDec)
        assert.ok(Diagnostic.length === 0)
    });

    it('good ts dec', async function () {
        const Diagnostic = await validate(tsExampleDec)
        assert.ok(Diagnostic.length === 0)
    });

    it('good cf dec', async function () {
        const Diagnostic = await validate(cfExampleDec)
        assert.ok(Diagnostic.length === 0)
    });




});
