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
    args;
    port;
    cert;
    cert_key;

    constructor(args: string[]) {
        this.pjson = packageJson;
        args = args;
        this.port = 3030;
        this.cert = `${packageJson.name}.crt`;
        this.cert_key = `${packageJson.name}.key`;

        args.map(s => {
            const [key, value] = s.split('=');
        
            if (key === '--port') {
                log.info(`got port flag ${value}`);
                this.port = parseInt(value);
            }
            if (key === '--cert') {
                log.info(`got cert flag ${value}`);
                this.cert = value;
            }
            if (key === '--cert_key') {
                log.info(`got cert_key flag ${value}`);
                this.cert_key = value;
            }
        
        })

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

