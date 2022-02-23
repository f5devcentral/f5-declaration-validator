#!/usr/bin/env ts-node

import * as fs from 'fs-extra'
import { Command, Flags } from '@oclif/core'
import { validate } from '..'
import Logger from 'f5-conx-core/dist/logger';

export const conxLog = new Logger('F5_DECLARATION_VALIDATOR_LOG');
conxLog.console = false;

export class Validate extends Command {
    static description = 'validate F5 ATC declaration'

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

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Validate)

        // re-assing this/cli logging function
        const cliLogger = this.log;

        // redirect conx logger through the cli logger
        conxLog.output = function (x: string) {
            cliLogger(x);
        };

        if (args) {
            // process declaration from this buffer input
        } else {

            try {
                const dec = fs.readJSONsync(flags.file)
                // validate and capture any errors
                return await validate(dec)
                    .then(diagnostics => conxLog.info(diagnostics))
                    .catch(e => {
                        conxLog.error({
                            valid: false,
                            diagnostics: [
                                'not able to parse or discover f5 atc delcaration type',
                                'does the parent object class contain: AS3, ADC, DO, Device, Telemetry, or Cloud_Failover?'
                            ],
                            dec
                        })
                    })
            } catch (e) {
                return conxLog.error(`could not read/jsonify ${flags.file}`)
            }
        }
    }
}