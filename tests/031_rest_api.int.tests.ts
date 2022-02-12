'use strict';

import * as assert from 'assert';
import axios from 'axios';

import { injectSchema, isArray } from 'f5-conx-core';

import { validate } from '../src'

import { 
    as3ExampleDec,
    deviceExampleDec,
    doExampleDec,
    tsExampleDec,
    cfExampleDec
} from '../src/models/examples'


// format json document with vscode code:  https://github.com/microsoft/monaco-editor/issues/32

// const psjon = process.env


describe('REST API Tests', function () {

    // it('base / redirect to /info', async function () {
    //     const resp = await axios.get(`http://localhost:3000`)
    //     .then( resp => resp)
    //     .catch( err => {
    //         debugger;
    //         throw Error(err);
    //     })
    //     // did we get to the info endpoint?
    //     assert.deepStrictEqual(resp.request.path, '/info')
    //     // did the /info endpoint respond appropriately?
    //     assert.deepStrictEqual(resp.data.appName, process.env.npm_package_name)
    //     assert.deepStrictEqual(resp.data.appName, process.env.npm_package_version)
    //     assert.deepStrictEqual(resp.data.appName, process.env.npm_package_license)
    //     assert.deepStrictEqual(resp.data.appName, process.env.npm_package_homepage)
    //     assert.ok(isArray(resp.data.routes))
    // });

    it('GET /info', async function () {
        const resp = await axios.get(`http://localhost:3000/info`)
        .then( resp => resp)
        .catch( err => {
            debugger;
            throw Error(err);
        })
        // did we get to the info endpoint?
        // assert.deepStrictEqual(resp.request.path, '/info')
        // did the /info endpoint respond appropriately?
        assert.deepStrictEqual(resp.data.appName, 'f5-declaration-validator')
        assert.deepStrictEqual(resp.data.appName, process.env.npm_package_version)
        assert.deepStrictEqual(resp.data.appName, process.env.npm_package_license)
        assert.deepStrictEqual(resp.data.appName, process.env.npm_package_homepage)
        assert.ok(isArray(resp.data.routes))
    });


    it('POST /validate - as3', async function () {
        const resp = await axios.post(`http://localhost:3000/validate`, as3ExampleDec)
        .then( resp => resp)
        .catch( err => {
            debugger;
            throw Error(err);
        })
        // did we get to the info endpoint?
        assert.deepStrictEqual(resp.request.path, '/info')
        // did the /info endpoint respond appropriately?
        assert.deepStrictEqual(resp.data.appName, process.env.npm_package_name)
        assert.deepStrictEqual(resp.data.appName, process.env.npm_package_version)
        assert.deepStrictEqual(resp.data.appName, process.env.npm_package_license)
        assert.deepStrictEqual(resp.data.appName, process.env.npm_package_homepage)
        assert.ok(isArray(resp.data.routes))
    });

 

});
