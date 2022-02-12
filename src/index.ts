
'use strict';


import { atcMetaData } from 'f5-conx-core';

import { Diagnostic, getLanguageService, TextDocument } from "vscode-json-languageservice";


import as3Schema from '../src/schemas/as3Schema.json';
import deviceSchema from '../src/schemas/deviceSchema.json';
import doSchema from '../src/schemas/doSchema.json';
import tsSchema from '../src/schemas/tsSchema.json';
import cfSchema from '../src/schemas/cfSchema.json';

type ParentClasses = 'AS3' | 'ADC' | 'DO' | 'Device' | 'Telemetry' | 'Cloud_Failover'

const validParentClasses = [
    'AS3', 'ADC', 'DO', 'Device', 'Telemetry', 'Cloud_Failover'
]

const validClasses = {
    AS3: as3Schema,
    ADC: as3Schema,
    DO: doSchema,
    Device: deviceSchema,
    Telemetry: tsSchema,
    Cloud_Failover: cfSchema
}

/**
 * discover F5 ATC declaration type and validate with schema
 * 
 * schemas are in local cache for now
 * 
 * @param dec ATC declaration
 * @returns 
 */
export async function validate(dec: Record<string, unknown>): Promise<Diagnostic[]> {

    // delete schema reference if it's there
    delete dec.$schema;

    // figure out dec type and get schema (this is local cache for now)
    const { type, schema } = await decType(dec as Record<string, string>)

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





/**
 * detects ATC dec type and return appropriate schema
 * 
 * @param dec: json parsed declaration (as3/do/ts/cf)
 * @param (optional) logger class with .info
 */
export async function decType(dec: Record<string, unknown>): Promise<{
    type: string;
    schema: string;
}> {

    if (validParentClasses.includes(dec.class as ParentClasses)) {
        // get and stringify the schema
        const schema = JSON.stringify(validClasses[dec.class as ParentClasses])
        return  {
            type: dec.class as string,
            schema
        }
    } else {
        throw Error(`not a valid f5 declaration, looking for ${JSON.stringify(validParentClasses)} as parent class`)
    }
}


// function getSchema(type: ParentClasses) {
//     if(type === 'AS3') return as3Schema;
//     if(type === 'ADC') return as3Schema;
//     if(type === 'DO') return doSchema;
//     if(type === 'DEVICE') return deviceSchema;
//     if(type === 'Telemetry') return tsSchema;
//     if(type === 'Cloud_Failover') return cfSchema;

//     return validClasses[type];
// }