'use strict';



import * as assert from 'assert';

import { getLanguageService, TextDocument } from 'vscode-json-languageservice';

import { injectSchema } from 'f5-conx-core';

import { as3ExampleDec, deviceExampleDec, doExampleDec, tsExampleDec, cfExampleDec} from '../src/models/examples'

import as3Schema from '../src/schemas/as3Schema.json';
import deviceSchema from '../src/schemas/deviceSchema.json';
import doSchema from '../src/schemas/doSchema.json';
import tsSchema from '../src/schemas/tsSchema.json';
import cfSchema from '../src/schemas/cfSchema.json';

const as3SchemaURL = "https://raw.githubusercontent.com/F5Networks/f5-appsvcs-extension/master/schema/latest/as3-schema.json";


// format json document with vscode code:  https://github.com/microsoft/monaco-editor/issues/32


async function validate(dec: unknown, schema: string) {

    // stringify and format the json declaration into lines
    const decString = JSON.stringify(dec, undefined, 4)

    // create test document with declaration
    const textDocument = TextDocument.create('f5://server/f5.data.json', 'json', 1, decString);

    const jsonLanguageService = getLanguageService({
        schemaRequestService: (uri) => {
            if (uri === "f5://server/f5.schema.json") {
                // this happens when no $schema reference in the json
            } else {
                // if there is a $schema reference in the json, it will be the uri
                // so we could add logic here to try to get it over the internet or try local cache first
            }
            return Promise.resolve(schema);
            // return Promise.reject(`Unabled to load schema at ${uri}`);
        }
    });
    // associate `*.data.json` with the `foo://server/f5.schema.json` schema
    jsonLanguageService.configure({ allowComments: false, schemas: [{ fileMatch: ["*.data.json"], uri: "f5://server/f5.schema.json" }] });

    const jsonDocument = jsonLanguageService.parseJSONDocument(textDocument);

    const diagnostics = await jsonLanguageService.doValidation(textDocument, jsonDocument);
    console.log('Validation results:', diagnostics.map(d => `[line ${d.range.start.line}] ${d.message}`));

    return diagnostics;
}

describe('JSON Schema', function () {

    this.beforeEach( function () {
        // remote the schema reference in each of the examples so we can see how it works with/without it since this validator will want to fullfill it's reference
        delete as3ExampleDec['$schema']
    })

    it('good as3 dec', async function () {
        const results = await validate(as3ExampleDec, JSON.stringify(as3Schema))
        assert.ok(results.length === 0)
    });


    it('bad as3 dec', async function () {
        const results = await validate({
            "class": "AS3",
            "action": "breaking",
            "persist": true,
        }, JSON.stringify(as3Schema))
        assert.ok(results.length > 0)
    });

    it('good as3 dec w/injected schema reference', async function () {
        const as3_wS = await injectSchema(as3ExampleDec)
        const results = await validate(as3_wS, JSON.stringify(as3Schema))
        assert.ok(results.length === 0)
    });


    it('good as3 dec w/injected schema reference - no manual schema', async function () {
        const as3_wS = await injectSchema(as3ExampleDec)
        // if we don't supply a schema, we get the following error
        //  ['[line 1] Unable to load schema from 'https://raw.…ster/schema/latest/as3-schema.json': No content.']
        const results = await validate(as3_wS, '')
        assert.ok(results.length > 0)
    });



    it('good device dec', async function () {
        const results = await validate(deviceExampleDec, JSON.stringify(deviceSchema))
        assert.ok(results.length === 0)
    });

    it('good do dec', async function () {
        const results = await validate(doExampleDec, JSON.stringify(doSchema))
        assert.ok(results.length === 0)
    });

    it('good ts dec', async function () {
        const results = await validate(tsExampleDec, JSON.stringify(tsSchema, undefined, 4))
        assert.ok(results.length === 0)
    });

    it('good cf dec', async function () {
        const results = await validate(cfExampleDec, JSON.stringify(cfSchema, undefined, 4))
        assert.ok(results.length === 0)
    });
});
