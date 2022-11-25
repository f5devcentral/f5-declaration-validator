/* eslint-disable @typescript-eslint/no-unused-vars */


import fs from 'fs';
import path from 'path';

import $RefParser from "@apidevtools/json-schema-ref-parser";
import { OpenApiRequest } from 'openapi-data-validator/dist/framework/types';
import { OpenApiValidator } from 'openapi-data-validator';
import ajv from 'ajv';
import assert from 'assert';



const deviceInventoryPostBody = {
    "address": "10.145.10.1",
    "device_password": "admin",
    "device_user": "admin",
    "management_password": "admin",
    "management_user": "sample_mgmt_admin",
    "port": 5443
};


const deviceInventoryPostSchema = {
    properties: {
          address: {
            type: "string",
          },
          device_group: {
            type: "string",
          },
          device_password: {
            format: "password",
            type: "string",
          },
          device_user: {
            type: "string",
          },
          management_password: {
            format: "password",
            minLength: 1,
            type: "string",
          },
          management_user: {
            minLength: 1,
            type: "string",
          },
          port: {
            format: "int32",
            maximum: 65535,
            minimum: 1,
            type: "integer",
          },
        },
        required: [
          "address",
          "port",
          "device_user",
          "device_password",
          "management_user",
          "management_password",
        ],
        type: "object",
  }

const localOaiPath = path.join(__dirname, 'openapi_nextCm_minor.json');
const apiSpec = JSON.parse(fs.readFileSync(localOaiPath).toString());

describe('NEXT CM OpenApi Schema Validation', () => {


    it('simple validate', async () => {

        const body = {
            "address": "10.145.10.1",
            "device_password": "admin",
            "device_user": "admin",
            "management_password": "admin",
            "management_user": "sample_mgmt_admin",
            "port": 5443
        };


        const req = {
            method: "POST",
            route: "/api/device/v1/inventory",
            body
        };

        const schema = await $RefParser.dereference(localOaiPath);

        const ajvOptions = {
            validateSchema: false,
            useDefaults: true,
            removeAdditional: false,
            validateFormats: false,
            serDesMap: {
              date: {
                format: "date",
                serialize: function(d) {
                  return d && d.toISOString().split('T')[0];
                },
              },
              "date-time": {
                format: "date-time",
                serialize: function(d) {
                  return d && d.toISOString();
                },
              },
            },
          }

        // debugger;

    }).timeout(10000);


    
    it('ajv base', async () => {

        const deviceInventoryPostBody = {
            // "address": "10.145.10.1",    // required prop
            "device_password": "admin",
            "device_user": "admin",
            "management_password": "admin",
            "management_user": "sample_mgmt_admin",
            "port": "5443"      // should be a number
        };

          const nextCmAjv = new ajv({ 
            strict: false,
            allErrors: true,
            verbose: true
        });
          const validator = nextCmAjv.compile(deviceInventoryPostSchema);

          const valid = validator(deviceInventoryPostBody)

          const errors = validator.errors;

          const exampleErrors = [
            {
              instancePath: "",
              schemaPath: "#/required",
              keyword: "required",
              params: {
                missingProperty: "address",
              },
              message: "must have required property 'address'",
            },
            {
              instancePath: "/port",
              schemaPath: "#/properties/port/type",
              keyword: "type",
              params: {
                type: "integer",
              },
              message: "must be integer",
            },
          ]

          assert.ok(valid === false);
          assert.ok(errors?.length === 2);

    }).timeout(10000);
    
    it('simple validate', async () => {

        const body = JSON.stringify({
            "address": "10.145.10.1",
            "device_password": "admin",
            "device_user": "admin",
            "management_password": "admin",
            "management_user": "sample_mgmt_admin",
            "port": 5443
        });


        const req: OpenApiRequest = {
            method: "POST",
            route: "/api/device/v1/inventory",
            body
        };

        const openApiValidator = new OpenApiValidator({ 
            apiSpec,
            validateRequests: {
            allowUnknownQueryParameters: true
        } });

        const validator = openApiValidator.createValidator();

        await validator(req)
            .then(x => {
                const v = x;
                console.log(v);
            })
            .catch(err => {
                const zz = err;
                console.log(zz);
            });


    }).timeout(10000);

});



