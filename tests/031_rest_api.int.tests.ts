'use strict';

import * as assert from 'assert';
import axios from 'axios';

import { injectSchema, isArray } from 'f5-conx-core';

import pjson from '../package.json';

import { validate } from '../src'

import {
    as3ExampleDec,
    deviceExampleDec,
    doExampleDec,
    tsExampleDec,
    cfExampleDec
} from '../src/models/examples'


// format json document with vscode code:  https://github.com/microsoft/monaco-editor/issues/32


// let psjon;

describe('REST API Tests', function () {

    before(function () {
        console.log(`       file:  ${this.test.file}`)
        // psjon = process.env;
    })

    it('base / redirect to /info', async function () {
        const resp = await axios.get(`http://localhost:3000`)
            .then(resp => resp)
            .catch(err => {
                debugger;
                throw Error(err);
            })
        // did we get to the info endpoint?
        assert.deepStrictEqual(resp.request.path, '/info')

    });

    it('base /notConfiguredRoute redirect to /info', async function () {
        const resp = await axios.get(`http://localhost:3000`)
            .then(resp => resp)
            .catch(err => {
                debugger;
                throw Error(err);
            })
        assert.deepStrictEqual(resp.request.path, '/info')
    });

    it('GET /info details', async function () {
        const resp = await axios.get(`http://localhost:3000/info`)
            .then(resp => resp)
            .catch(err => {
                debugger;
                throw Error(err);
            })
        assert.deepStrictEqual(resp.request.path, '/info')
        // did the /info endpoint respond appropriately?
        assert.deepStrictEqual(resp.data.appName, pjson.name)
        assert.deepStrictEqual(resp.data.version, pjson.version)
        assert.deepStrictEqual(resp.data.license, pjson.license)
        assert.deepStrictEqual(resp.data.homepage, pjson.homepage)
        assert.ok(isArray(resp.data.routes))
    });


    it('POST /validate - as3', async function () {
        const resp = await axios.post(`http://localhost:3000/validate`, as3ExampleDec)
            .then(resp => resp)
            .catch(err => {
                debugger;
                throw Error(err);
            })

        assert.ok(resp.data.valid, `as3 declaration validation should return true`)
        assert.ok(resp.data.diagnostics.length === 0, `diagnostics array should be empty`)
    });

    it('POST /validate - bad as3', async function () {
        const resp = await axios.post(`http://localhost:3000/validate`, {
                    declaration: {
                        class: 'Tenant',
                        something: 'missing'
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
