/* eslint-disable @typescript-eslint/no-unused-vars */

'use strict';


import assert from 'assert';

import axios from 'axios';

import ajv, { ValidateFunction } from 'ajv';

import Logger from 'f5-conx-core/dist/logger';
import { 
    atcMetaData,
    as3ExampleDec,
    cfExampleDec,
    doExampleDec,
    tsExampleDec
} from 'f5-conx-core';

import as3Schema from '../src/schemas/as3Schema.json';
import deviceSchema from '../src/schemas/deviceSchema.json';
import doSchema from '../src/schemas/doSchema.json';
import tsSchema from '../src/schemas/tsSchema.json';
import cfSchema from '../src/schemas/cfSchema.json';


const logger = new Logger('F5_CONX_CORE_LOG_LEVEL');
logger.console = false;

// create ajv instance, disable strict mode
const as3 = new ajv({ strict: false });
const doV = new ajv({ strict: false });
const doQ = new ajv({ strict: false });
const ts = new ajv({ strict: false });
const cf = new ajv({ strict: false });

// const val = v.compile(as3SchemaLatest);
let as3Validator: ValidateFunction;
let doValidator: ValidateFunction;
let doQValidator: ValidateFunction;
let tsValidator: ValidateFunction;
let cfValidator: ValidateFunction;



describe('schema validator Unit Tests', function () {

    before(async function () {
        // log test file name - makes it easer for troubleshooting
        console.log('       file:', __filename)
            as3Validator = as3.compile(as3Schema)
            doValidator = doV.compile(deviceSchema)
            doQValidator = doV.compile(doSchema)
            tsValidator = ts.compile(tsSchema)
            cfValidator = cf.compile(cfSchema)

        // await axios.get(atcMetaData.as3.schema).then( resp => {
        //     as3Validator = as3.compile(resp.data)
        // })
        // await axios.get(atcMetaData.do.schema).then( resp => {
        //     // do breaks with error;
        //     // can't resolve reference system.schema.json# from id https://raw.githubusercontent.com/F5Networks/f5-declarative-onboarding/master/schema/base.schema.json
        //     doValidator = doV.compile(resp.data)
        // })
        // await axios.get(atcMetaData.do.parentSchema).then( resp => {
        //     // do breaks with error;
        //     // can't resolve reference base.schema.json# from id https://raw.githubusercontent.com/F5Networks/f5-declarative-onboarding/master/schema/remote.schema.json
        //     doQValidator = doV.compile(resp.data)
        // })
        // await axios.get(atcMetaData.ts.schema).then( resp => {
        //     // ts breaks with error;
        //     // can't resolve reference system_schema.json# from id base_schema.json
        //     tsValidator = ts.compile(resp.data)
        // await axios.get(atcMetaData.cf.schema).then( resp => {
        //     cfValidator = cf.compile(resp.data)
        // })
    })

    beforeEach(function () {
        // runs before each test in this block\
        logger.clearLogs();
    });

    //   https://stackoverflow.com/questions/31538124/vs-code-json-schema-cache
    // https://stackoverflow.com/questions/42776272/vscode-jsonvalidation-using-local-schema-files
    // https://www.jsonschemavalidator.net/  *** works ***

    it('validate as3 declaration', async function () {
        const x = as3Validator(as3ExampleDec)
        assert.ok(x)
    });

    it('validate bad as3 declaration -', async function () {
        const x = as3Validator({ "oops": "eee" })
        assert.ok(!x)
    });
    
    // it('validate do declaration', async function () {
    //     const x = doValidator(doExampleDec)
    //     assert.ok(x)
    // });
    // it('validate bad do declaration', async function () {
    //     const x = doValidator({ "oops": "eee" })
    //     assert.ok(!x)
    // });


    // it('validate do bigiq declaration', async function () {
    //     const x = doQValidator(doExampleDecDevice)
    //     assert.ok(x)
    // });
    // it('validate bad do bigiq declaration', async function () {
    //     const x = doQValidator({ "oops": "eee" })
    //     assert.ok(!x)
    // });


    // it('validate ts declaration', async function () {
    //     const x = tsValidator(tsExampleDec)
    //     assert.ok(x)
    // });
    // it('validate bad ts declaration', async function () {
    //     const x = tsValidator({ "oops": "eee" })
    //     assert.ok(!x)
    // });


    it('validate cf declaration', async function () {
        const x = cfValidator(cfExampleDec)
        assert.ok(x)
    });
    it('validate bad cf declaration', async function () {
        const x = cfValidator({ "oops": "eee" })
        assert.ok(!x)
    });

});