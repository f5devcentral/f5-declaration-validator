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

        // 0:'[line 1] Unable to load schema from 'https://raw.githubusercontent.com/F5Networks/f5-appsvcs-extension/master/schema/latest/as3-schema.json': No content.'
    });



    it('good device dec', async function () {
        const results = await validate(deviceExampleDec, JSON.stringify(deviceSchema))
        assert.ok(results.length === 0)

        // --- ERRORS ---
        // 0:'[line 9] Missing property "schemaVersion".'
        // 1:'[line 10] Value must be "Device".'
        // 2:'[line 11] Property hostname is not allowed.'
        // 3:'[line 12] Property cliInactivityTimeout is not allowed.'
        // 4:'[line 13] Property consoleInactivityTimeout is not allowed.'
        // 5:'[line 14] Property autoPhonehome is not allowed.'
        // 6:'[line 16] Missing property "schemaVersion".'
        // 7:'[line 17] Value must be "Device".'
        // 8:'[line 18] Property licenseType is not allowed.'
        // 9:'[line 19] Property regKey is not allowed.'
        // 10:'[line 21] Missing property "schemaVersion".'
        // 11:'[line 22] Value must be "Device".'
        // 12:'[line 23] Property nameServers is not allowed.'
        // 13:'[line 27] Property search is not allowed.'
        // 14:'[line 31] Missing property "schemaVersion".'
        // 15:'[line 32] Value must be "Device".'
        // 16:'[line 33] Property servers is not allowed.'
        // 17:'[line 38] Property timezone is not allowed.'
        // 18:'[line 40] Missing property "schemaVersion".'
        // 19:'[line 41] Value must be "Device".'
        // 20:'[line 42] Property userType is not allowed.'
        // 21:'[line 43] Property oldPassword is not allowed.'
        // 22:'[line 44] Property newPassword is not allowed.'
        // 23:'[line 46] Missing property "schemaVersion".'
        // 24:'[line 47] Value must be "Device".'
        // 25:'[line 48] Property userType is not allowed.'
        // 26:'[line 49] Property password is not allowed.'
        // 27:'[line 50] Property shell is not allowed.'
        // 28:'[line 52] Missing property "schemaVersion".'
        // 29:'[line 53] Value must be "Device".'
        // 30:'[line 54] Property userType is not allowed.'
        // 31:'[line 55] Property password is not allowed.'
        // 32:'[line 56] Property partitionAccess is not allowed.'
        // 33:'[line 62] Missing property "schemaVersion".'
        // 34:'[line 63] Value must be "Device".'
        // 35:'[line 64] Property userType is not allowed.'
        // 36:'[line 65] Property password is not allowed.'
        // 37:'[line 66] Property shell is not allowed.'
        // 38:'[line 67] Property partitionAccess is not allowed.'
        // 39:'[line 73] Missing property "schemaVersion".'
        // 40:'[line 74] Value must be "Device".'
        // 41:'[line 75] Property ltm is not allowed.'
        // 42:'[line 76] Property gtm is not allowed.'
        // 43:'[line 78] Missing property "schemaVersion".'
        // 44:'[line 79] Value must be "Device".'
        // 45:'[line 80] Property tag is not allowed.'
        // 46:'[line 81] Property mtu is not allowed.'
        // 47:'[line 82] Property interfaces is not allowed.'
        // 48:'[line 88] Property cmpHash is not allowed.'
        // 49:'[line 90] Missing property "schemaVersion".'
        // 50:'[line 91] Value must be "Device".'
        // 51:'[line 92] Property address is not allowed.'
        // 52:'[line 93] Property vlan is not allowed.'
        // 53:'[line 94] Property allowService is not allowed.'
        // 54:'[line 95] Property trafficGroup is not allowed.'
        // 55:'[line 97] Missing property "schemaVersion".'
        // 56:'[line 98] Value must be "Device".'
        // 57:'[line 99] Property tag is not allowed.'
        // 58:'[line 100] Property mtu is not allowed.'
        // 59:'[line 101] Property interfaces is not allowed.'
        // 60:'[line 107] Property cmpHash is not allowed.'
        // 61:'[line 109] Missing property "schemaVersion".'
        // 62:'[line 110] Value must be "Device".'
        // 63:'[line 111] Property address is not allowed.'
        // 64:'[line 112] Property vlan is not allowed.'
        // 65:'[line 113] Property allowService is not allowed.'
        // 66:'[line 114] Property trafficGroup is not allowed.'
        // 67:'[line 116] Missing property "schemaVersion".'
        // 68:'[line 117] Value must be "Device".'
        // 69:'[line 118] Property gw is not allowed.'
        // 70:'[line 119] Property network is not allowed.'
        // 71:'[line 120] Property mtu is not allowed.'
        // 72:'[line 122] Missing property "schemaVersion".'
        // 73:'[line 123] Value must be "Device".'
        // 74:'[line 124] Property gw is not allowed.'
        // 75:'[line 125] Property network is not allowed.'
        // 76:'[line 126] Property mtu is not allowed.'
        // 77:'[line 128] Missing property "schemaVersion".'
        // 78:'[line 129] Value must be "Device".'
        // 79:'[line 130] Property id is not allowed.'
        // 80:'[line 131] Property bandWidthControllerPolicy is not allowed.'
        // 81:'[line 132] Property connectionLimit is not allowed.'
        // 82:'[line 133] Property flowEvictionPolicy is not allowed.'
        // 83:'[line 134] Property ipIntelligencePolicy is not allowed.'
        // 84:'[line 135] Property enforcedFirewallPolicy is not allowed.'
        // 85:'[line 136] Property stagedFirewallPolicy is not allowed.'
        // 86:'[line 137] Property securityNatPolicy is not allowed.'
        // 87:'[line 138] Property servicePolicy is not allowed.'
        // 88:'[line 139] Property strict is not allowed.'
        // 89:'[line 140] Property routingProtocols is not allowed.'
        // 90:'[line 143] Property vlans is not allowed.'
        // 91:'[line 147] Missing property "schemaVersion".'
        // 92:'[line 148] Value must be "Device".'
        // 93:'[line 149] Property ui.advisory.enabled is not allowed.'
        // 94:'[line 150] Property ui.advisory.color is not allowed.'
        // 95:'[line 151] Property ui.advisory.text is not allowed.'
    });

    it('good do dec', async function () {
        const results = await validate(doExampleDec, JSON.stringify(doSchema))
        assert.ok(results.length === 0)

        // --- ERRORS ---
        // 0:'[line 2] Missing property "declaration".'
        // 1:'[line 4] Value must be "DO".'
        // 2:'[line 3] Property schemaVersion is not allowed.'
        // 3:'[line 5] Property async is not allowed.'
        // 4:'[line 6] Property Common is not allowed.'
    });

    it('good ts dec', async function () {
        const results = await validate(tsExampleDec, JSON.stringify(tsSchema, undefined, 4))
        assert.ok(results.length === 0)

        // --- ERRORS ---
        // 0:'[line 4] Value is not accepted. Valid values: "Telemetry".'
        // 1:'[line 5] Missing property "class".'
        // 2:'[line 6] Incorrect type. Expected "object".'
        // 3:'[line 10] Value is not accepted. Valid values: "Telemetry".'
        // 4:'[line 11] Incorrect type. Expected "object".'
        // 5:'[line 14] Value is not accepted. Valid values: "Telemetry".'
        // 6:'[line 15] Incorrect type. Expected "object".'
        // 7:'[line 16] Incorrect type. Expected "object".'
        // 8:'[line 17] Incorrect type. Expected "object".'
        // 9:'[line 18] Incorrect type. Expected "object".'
        // 10:'[line 19] Missing property "class".'
        // 11:'[line 20] Incorrect type. Expected "object".'
    });

    it('good cf dec', async function () {
        const results = await validate(cfExampleDec, JSON.stringify(cfSchema, undefined, 4))
        assert.ok(results.length === 0)
    });
});
