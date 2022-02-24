#!/usr/bin/env ts-node

import fs from 'fs-extra'
import { Command, Flags } from '@oclif/core'
import { validateDec, ValidateOut } from '../utils'

export class Validate extends Command {
    static description = 'validate F5 ATC declaration'
    static enableJsonFlag = true;

    static args = [{
        name: 'dec',
    }]

    static flags = {
        help: Flags.help({ char: 'h' }),
        file: Flags.string({
            char: 'f',
            description: 'f5 atc declaration file',
        })
    }

    async run() {
        const { args, flags } = await this.parse(Validate)

        let response;
        if (args.dec) {

            // handle declaration from cli buffer
            let dec: Record<string, unknown>
            try {
                dec = JSON.parse(args.dec);
            } catch (e) {
                throw Error(`could not read/jsonify declaration arg/string`)
            }
            // process declaration from this buffer input
            response = await validateDec(dec)
            .then(diagnostics => diagnostics)
            .catch( () => {
                return {
                    valid: false,
                    diagnostics: [
                        'not able to parse or discover f5 atc delcaration type',
                        'does the parent object class contain: AS3, ADC, DO, Device, Telemetry, or Cloud_Failover?'
                    ],
                    dec
                }
            })

        } else if(flags.file) {

            // handle file pointer

            try {
                // read file
                const dec = fs.readJSONSync(flags.file)
                // validate and capture any errors
                response = await validateDec(dec)
                    .then(diagnostics => diagnostics)
                    .catch( () => {
                        return {
                            valid: false,
                            diagnostics: [
                                'not able to parse or discover f5 atc delcaration type',
                                'does the parent object class contain: AS3, ADC, DO, Device, Telemetry, or Cloud_Failover?'
                            ],
                            dec
                        }
                    })
            } catch (e) {
                throw Error(`could not read/jsonify ${flags.file}`)
            }
        } else {

            // neither arg or flag provideded -> error
            return this.error(`declaration argument or file pointer flag required`)
        }

        // conxLog.info(response);
        this.log(JSON.stringify(response));
        return response as ValidateOut;
    }
}