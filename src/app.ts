'use strict';

import https from 'https';
import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import logger from 'koa-logger';

import Logger from 'f5-conx-core/dist/logger';
import { validate } from '.';
import { getCert, Settings } from './settings';

export const log = new Logger('F5_DECLARATION_VALIDATOR_REST_LOG')
log.console = true;

// load and export settings
export const settings = new Settings(process.argv.slice(2));

const app = new Koa();
const router = new Router();


// inject logger and body parser into app
app.use(logger());
app.use(koaBody());



router.get('/exit', async (ctx) => {
    ctx.body = '\nquitting -> goodbye!\n\n';
    koaServer.close();
})
router.get('/info', async (ctx) => {

    ctx.status = 200;
    const routes = router.stack.map(r => r.path)
    ctx.body = {
        appName: settings.pjson.name,
        version: settings.pjson.version,
        license: settings.pjson.license,
        homepage: settings.pjson.homepage,
        routes
    };
});

router.post('/validate', async (ctx) => {

    // capture the post body
    const dec = ctx.request.body;

    // validate and capture any errors
    const resp = await validate(dec)
    .then( diagnostics => diagnostics )
    .catch( e => {
        return {
            valid: false,
            diagnostics: [
                'not able to parse or discover atc delcaration type',
                'does the parent object class contain: AS3, ADC, DO, Device, Telemetry, or Cloud_Failover?'
            ],
            dec
        }
    })
    // respond back to client with details
    ctx.response.body = resp
});


app.use(async (ctx, next) => {
    // catch any requests to any un-configured endpoints and redirect to /info
    //  https://github.com/ZijianHe/koa-router/issues/371
    try {
      await next()
      if (ctx.status === 404) {
        ctx.redirect('/info');
        ctx.status = 301;
      }
    } catch (err) {
      // handle error
      ctx.app.emit('error', err, ctx);
    }
  })

// add in routes
app.use(router.routes());

// Generic error handling middleware.
app.use(async (ctx: Koa.Context, next: () => Promise<unknown>) => {
    try {
        await next();
    } catch (error: any) {
        ctx.status = error.statusCode || error.status;
        error.status = ctx.status;
        ctx.body = { error };
        ctx.app.emit('error', error, ctx);
    }
});

// Application error logging.
app.on('error', err => console.error('koa-err: ', err));

// get the cert/key from settings
const { cert, key } = getCert(settings)

// start the server with tls
export const koaServer = https.createServer({ cert, key}, app.callback()).listen(settings.port, () => {
    log.info(`started ${settings.pjson.name} service on https port: ${settings.port}`)
})