'use strict';

import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';

import Logger from 'f5-conx-core/dist/logger';
import { validate } from '.';

// import pjson from '../package.json'

const log = new Logger('F5_DECLARATION_VALIDATOR_REST_LOG')
log.console = true;

const app = new Koa();
const router = new Router();

const p = process.env;

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

// app.use(async (ctx, next) => {
//     // redirect any undefined paths to info
//     if (ctx.response.status === 404 && ctx.request.path !== '/info') {
//         return ctx.redirect('/info')
//     }
//     await next();
// });

// router.get('/', async (ctx) => {
//     ctx.body = 'Hello World!';
// });

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
    const diagnostics = await validate(dec)
    // set valid flag
    const valid = diagnostics.length > 0 ? false : true;
    // respond back to client with details
    ctx.response.body = {
        valid,
        diagnostics
    }
});

app.use(router.routes());

app.listen(3000);

console.log('Server running on port 3000');