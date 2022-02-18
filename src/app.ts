'use strict';

import https from 'https';
import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';

import Logger from 'f5-conx-core/dist/logger';
import { validate } from '.';
import { getCert, settings } from './settings';

// set port or use default
// const port = process.argv[2] || 3030

export const log = new Logger('F5_DECLARATION_VALIDATOR_REST_LOG')
log.console = true;

const app = new Koa();
const router = new Router();


// inject logger and body parser into app
// app.use(logger());
app.use(koaBody());

// Generic error handling middleware.
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
        await next();
    } catch (error: any) {
        ctx.status = error.statusCode || error.status;
        error.status = ctx.status;
        ctx.body = { error };
        ctx.app.emit('error', error, ctx);
    }
});

app.use(async (ctx, next) => {
    // Log the request to the console
    log.info('Url:', ctx.url);
    // Pass the request to the next middleware function
    await next();
});


router.get('/info', async (ctx) => {

    const routes = router.stack.map(r => r.path)
    ctx.body = {
        appName: process.env.npm_package_name,
        version: process.env.npm_package_version,
        license: process.env.npm_package_license,
        homepage: process.env.npm_package_homepage,
        routes
    };
});

router.post('/validate', async (ctx) => {

    // capture the post body
    const dec = ctx.request.body;

    // validate and capture any errors
    const resp = await validate(dec)
    .then( diagnostics => {
        if(diagnostics.length > 0){
            // was able to parse and read ATC declaration, but invalid
            return {
                valid: false,
                diagnostics
            }
        } else {
            // valid declaration
            return {
                valid: true,
                diagnostics
            }
        }
    })
    .catch( e => {
        return {
            valid: false,
            diagnostics: [
                'not able to parse or discover atc delcaration type',
                'does the parent object class contain: AS3, ADC, DO, Device, Telemetry, or Cloud_Failover?'
            ]
        }
    })
    // respond back to client with details
    ctx.response.body = resp
});

router.all('/', async (ctx) => {
    ctx.redirect('/info');
    ctx.status = 301;
})

app.use(router.routes());

// get the cert/key from settings
const { cert, key } = getCert(settings.cert, settings.cert_key)

// start the server with tls
https.createServer({ cert, key}, app.callback()).listen(settings.port, () => {
    log.info(`started ${settings.appName} service on https port: ${settings.port}`)
})