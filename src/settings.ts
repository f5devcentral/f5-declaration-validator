'use strict';

import { execSync } from 'child_process';
import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: 
import pjson from '../package.json';

import { log } from './app'

const env = process.argv.slice(2);

export const settings = {
    port: 3030,
    appName: pjson.name,
    cert: `./${pjson.name}.cert`,
    cert_key: `./${pjson.name}.key`
}

env.map(s => {
    const [k, v] = s.split('=');

    if (k === 'port') {
        log.info(`got port flag ${v}`);
        settings.port = parseInt(v);
    }
    if (k === 'cert') {
        log.info(`got cert flag ${v}`);
        settings.cert = v;
    }
    if (k === 'cert_key') {
        log.info(`got cert_key flag ${v}`);
        settings.cert_key = v;
    }

    log.info(`settings: ${JSON.stringify(settings)}`)

})


/**
 * 
 * checks specified cert/key locations.  If cert cannot be found, generate it
 * 
 * @param cert certificate file path
 * @param key matching certificate key file path
 */
export function getCert(cert: string, key: string) {

    const certGenCmd = `openssl req -x509 -nodes -days 3650 -newkey 2056 -subj '/CN=${settings.appName}' -keyout ${settings.appName}.key -out ${settings.appName}.crt`

    //try to load the cert/key specified in the settings
    try {
        cert = fs.readFileSync(cert).toString();
        key = fs.readFileSync(key).toString();
        return { cert, key }
    } catch (e) {

        // cert/key specified not found, generate default 
        log.error(`specified cert/key not found;  cert:${settings.cert}, cert_key:${settings.cert_key}, generating new cert/key pair`)

        try {
            const gen = execSync(certGenCmd).toString();
            log.info(`new cert/key generated`, gen);
            cert = fs.readFileSync(`${settings.appName}.crt`).toString();
            key = fs.readFileSync(`${settings.appName}.key`).toString();
            return { cert, key }
        } catch (e) {
            throw Error(e);
        }
    }
}

