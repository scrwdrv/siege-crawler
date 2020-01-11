#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const cheerio = require("cheerio");
const regex = require("simple-regex-toolkit");
const cli_params_1 = require("cli-params");
const fs = require("fs");
const options = parseArgs(), regs = {
    chinese: /(\p{Script=Hani})+/u,
    excludeExtensions: /\.(?:jpg|gif|png|jpeg|bmp|ico|pdf|txt|json|xml|doc|xls|exe|zip|rar|7z|torrent|mp4|mp3|wav|wmv|mov|mkv|srt|avi|webm|ts|js|css)(\/?)$/i
}, t = Date.now();
let result = {
    sent: 0,
    received: 0,
    lost: 0,
    time: [0, Infinity, 0],
    bytes: 0
}, uris = [options.uri], paused = false, history = [];
process.on('SIGINT', () => {
    if (!paused) {
        console.log('exit signal sent, hold on ...');
        paused = true;
        setInterval(() => {
            if (result.sent === result.lost + result.received)
                printResult();
        }, 1000);
    }
});
(function exec() {
    const uri = uris.shift();
    uris.push(uri);
    siege(uri);
    if (options.duration && Date.now() - t > options.duration)
        setInterval(() => {
            if (result.sent === result.lost + result.received)
                printResult();
        }, 1000);
    else if (!paused)
        setTimeout(exec, options.rate);
})();
function printResult() {
    console.log(`\nSent: ${result.sent}, Received: ${result.received}, Lost: ${result.lost} (${(result.lost / result.sent * 100).toFixed(2)}% loss)`);
    console.log(`Data received: ${formatInt(result.bytes)} bytes`);
    console.log(`Response Time(ms): Max = ${result.time[0]}, Min = ${result.time[1]}, Avg = ${(result.time[2] / result.sent).toFixed(2)}`);
    const timestamp = Date.now();
    fs.appendFileSync(`siege-crawler_${timestamp}.log`, ` Status | Time(ms) | URL\n`);
    for (let i = 0, l = history.length; i < l; i++)
        fs.appendFileSync(`siege-crawler_${timestamp}.log`, format(history[i]));
    function format(history) {
        return ` ${' '.repeat(6 - history.status.length)}${history.status} | ${' '.repeat(8 - history.responseTime.toString().length)}${history.responseTime} | ${history.url}\n`;
    }
    process.exit();
}
function siege(uri) {
    history.push({ url: uri, status: null, responseTime: null });
    const index = history.length - 1, t = Date.now();
    result.sent++;
    get(uri, (err, body) => {
        const dt = Date.now() - t;
        history[index].status = err ? 'ERROR' : 'OK';
        history[index].responseTime = dt;
        if (err)
            result.lost++;
        else
            result.received++;
        if (result.time[0] < dt)
            result.time[0] = dt;
        if (result.time[1] > dt)
            result.time[1] = dt;
        result.time[2] += dt;
        if (!body)
            return;
        result.bytes += body.length;
        const $ = cheerio.load(body), URI = new URL(uri);
        let BASE;
        try {
            BASE = new URL(fixUrl($('base').first().attr('href')));
            if (BASE.hostname.toLowerCase() !== URI.hostname)
                BASE = null;
        }
        catch (err) { }
        $('a').each((i, elem) => {
            let href = fixUrl($(elem).attr('href'));
            if (!href)
                return;
            if (regs.chinese.test(href))
                href = encodeURI(href);
            try {
                const target = new URL(href);
                if (target.hostname.toLowerCase() === URI.hostname) {
                    target.hash = '';
                    target.hostname = URI.hostname;
                    if (regs.excludeExtensions.test(target.pathname))
                        return;
                    if (uris.indexOf(target.href) === -1) {
                        if (options.ruleout && options.ruleout.test(target.href))
                            return;
                        uris.push(target.href);
                    }
                }
            }
            catch (err) {
                return;
            }
        });
        function fixUrl(str, specificBase) {
            if (typeof str !== 'string')
                return null;
            const referenceURL = specificBase || BASE || URI;
            str = str.trim();
            switch (true) {
                case /^https?:\/(?!\/)/i.test(str):
                    str = str.replace(/^https?:\/(?!\/)/i, '$&/');
                    break;
                case /^\/\/[\s\S]*$/.test(str):
                    str = referenceURL.protocol + str;
                    break;
                case /^\/(?!\/)[\s\S]*$/.test(str):
                    str = referenceURL.protocol + '//' + referenceURL.hostname + (referenceURL.port ? ':' + referenceURL.port : '') + str;
                    break;
                case /^(?!\/|https?:\/\/)[\s\S]*$/i.test(str):
                    if ((/^[A-Za-z0-9]+:/).test(str))
                        return null;
                    str = referenceURL.protocol + '//' + referenceURL.hostname + (referenceURL.port ? ':' + referenceURL.port : '') + referenceURL.pathname.slice(0, referenceURL.pathname.lastIndexOf('/')) + '/' + str;
                    break;
            }
            return str;
        }
    });
}
function parseArgs() {
    let options = cli_params_1.default([{
            param: 'rate',
            type: 'float',
            optional: true,
            alias: 'r'
        }, {
            param: 'duration',
            type: 'int',
            optional: true,
            alias: 'd'
        }, {
            param: 'ruleout',
            type: 'string',
            optional: true
        }], 'uri');
    if (!options.rate)
        options.rate = 50;
    if (!options.duration)
        options.duration = 0;
    if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(options.uri))
        throw `Invalid URL: ${options.uri}`;
    if (options.ruleout)
        if (regex.isRegex(options.ruleout))
            options.ruleout = regex.from(options.ruleout);
        else
            throw `Invalid ruleout regex: ${options.ruleout}`;
    console.log(`\n[${new URL(options.uri).hostname}] rate: ${options.rate}/sec, duration: ${options.duration} secs, ruleout: ${options.ruleout}`);
    options.rate = 1000 / options.rate;
    options.duration = options.duration * 1000;
    return options;
}
function get(uri, cb) {
    request({
        uri: uri,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
        },
        timeout: 30000
    }, (err, res, body) => {
        if (err)
            return cb(err);
        if (res.statusCode > 399)
            return cb(`Status Code: ${res.statusCode}`);
        cb(null, body);
    });
}
function formatInt(n) {
    let str = n.toString(), r = '';
    for (let i = 0, l = str.length; i < l; i++)
        r += ((l - i) % 3 ? '' : (i ? ',' : '')) + str[i];
    return r;
}
