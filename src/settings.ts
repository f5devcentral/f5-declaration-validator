'use strict';

import { execSync } from 'child_process';
import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: 
import packageJson from '../package.json';

import { log } from './app'

// export const pjson = packageJson;

export class Settings {

    pjson;
    args: any;
    port;
    cert;
    cert_key;

    constructor(args: string[]) {
        this.pjson = packageJson;
        args = args;
        this.port = 3030;
        this.cert = `${packageJson.name}.crt`;
        this.cert_key = `${packageJson.name}.key`;

        const a = args[0]
        const b = args[1]
        const c = args[2]
        
        log.info(`spawn args: ${JSON.stringify(args)}`)

        // filter "undefined" strings from the command instantiation
        args = args.filter(i => i !== "undefined")

        if(args[0]) {
            this.port = parseInt(args[0]);
        }

        if(args[1]) {
            this.cert = args[1];
        }

        if(args[2]) {
            this.cert_key = args[2];
        }
// const port = args[0];
// const cert = process.argv[3];
// const key = process.argv[4];

        // args.map(s => {
        //     const [key, value] = s.split('=');
        
        //     if (key === '--port') {
        //         log.info(`got port flag ${value}`);
        //         this.port = parseInt(value);
        //     }
        //     if (key === '--cert') {
        //         log.info(`got cert flag ${value}`);
        //         this.cert = value;
        //     }
        //     if (key === '--cert_key') {
        //         log.info(`got cert_key flag ${value}`);
        //         this.cert_key = value;
        //     }
        
        // })

    }
}




/**
 * 
 * checks specified cert/key locations.  If cert cannot be found, generate it
 * 
 * @param cert certificate file path
 * @param key matching certificate key file path
 */
export function getCert(settings: Settings) {

    const appName = settings.pjson.name;
    let cert = settings.cert;
    let key = settings.cert_key;

    const certGenCmd = `openssl req -x509 -nodes -days 3650 -newkey 2056 -subj \
    '/CN=${appName}' -keyout ${appName}.key -out ${appName}.crt`

    log.info(`loading tls cert: ${cert}, and key: ${key}`)

    //try to load the cert/key specified in the settings
    try {
        cert = fs.readFileSync(cert).toString();
        key = fs.readFileSync(key).toString();
        return { cert, key }
    } catch (e) {

        // cert/key specified not found, generate default 
        log.error(`specified cert/key not found;  cert:${cert}, cert_key:${key}, generating new cert/key pair`)

        try {
            const gen = execSync(certGenCmd).toString();
            log.info(`new cert/key generated`, gen);
            cert = fs.readFileSync(cert).toString();
            key = fs.readFileSync(key).toString();
            return { cert, key }
        } catch (e) {
                throw Error(e);
        }
    }
}

