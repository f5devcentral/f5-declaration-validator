#!/usr/bin/env ts-node

import { spawn, fork, exec } from 'child_process';

import { Command, Flags } from '@oclif/core'
import { conxLog } from '../index';

export class Service extends Command {
    static description = 'start F5 ATC declaration REST API Service'

    static flags = {
        help: Flags.help({ char: 'h' }),
        port: Flags.string({
            char: 'p',
            default: '3030',
            description: 'port to run service on',
        }),
        cert: Flags.string({
            char: 'c',
            description: 'path to cert'
        }),
        key: Flags.string({
            char: 'k',
            description: 'path to cert-key'
        })
    }

    async run(): Promise<void> {
        const { flags } = await this.parse(Service)

        conxLog.info(`---- start service comamand: ${JSON.stringify(flags)}`)

        fork(
            './dist/app.js',
            [flags.port, flags.cert, flags.key],
            { stdio: 'inherit' }
        )

    }
}