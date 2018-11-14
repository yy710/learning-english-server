/**
 * middleware: session
 */
'use strict';

const crypto = require('crypto');
let assert = require('assert');
let https = require('https');
let WXBizDataCrypt = require('./WXBizDataCrypt.js');
let BufferHelper = require('./bufferhelper.js');

class Session {
    constructor() {
        //this.col = null;
        //this.appId = null;
        //this.appSecret = null;
    }

    init(appName, colName = 'sessions') {
        //let that = this;
        return (req, res, next) => {
            const config = req.data.config[appName];
            this.appId = config.appId;
            this.appSecret = config.appSecret;
            this.col = req.data.db.collection(colName);
            next();
        }
    }

    haveSession() {
        return (req, res, next) => {
            const s = req.data.session;
            if (s && s.openid) next(); else res.json({msg: "usr not login!", code: 0});
        };
    }

    /**
     * find session from req.data.collection
     * @returns {Function}
     */
    find() {
        return (req, res, next) => {
            const sid = req.get('sid');
            this.col.find({sid: sid}).limit(1).next(function (err, doc) {
                assert.equal(null, err);
                if (doc) {
                    delete doc._id;
                    req.data.session = doc;
                } else {
                    req.data.session = {};
                }
                console.log("find and set req.data.session =  ", req.data.session);
                next();
            });
        };
    }

    login() {
        return (req, res, next) => {
            const code = req.query.code;
            if (code && this.appId && this.appSecret) {
                code2Session(this.appId, this.appSecret, code).then(r => {
                    let s = req.data.session;
                    s.openid = r.openid;
                    s.session_key = r.session_key;
                    s.sid = createSid();
                    req.data.session = s;
                    //_res.encryptedData = req.query.encryptedData;
                    //_res.iv = req.query.iv;
                    next();
                })
            } else {
                res.json({sid: null, msg: "start session fail！"});
            }
        };
    }

    /**
     * save req.data.session to collection
     * @param collection
     * @returns {Function}
     */
    save() {
        return (req, res, next) => {
            const data = req.data.session;
            this.col.findOneAndReplace({openid: data.openid}, data, {upsert: true})
                .then(r => next())
                .catch(log("dataBase error: "));
        };
    }

    replySid() {
        return (req, res, next) => {
            res.json({sid: req.data.session.sid, msg: "session ok!"});
        };
    }

    /**
     * 解密用户数据
     * @param appName
     * @param req.data.config
     * @param req.data.session.session_key
     * @param req.data.session.iv
     * @param next
     * @return req.data.session
     */
    decryptUserData() {
        return (req, res, next) => {
            const s = req.data.session;
            const pc = new WXBizDataCrypt(this.appId, s.session_key);
            s.decryptedData = pc.decryptData(s.encryptedData, s.iv);
            req.data.session = s;
            next();
        };
    }
}

module.exports = Session;

//-----------------------------------------------------

function httpsGet(url) {
    return new Promise(function (resolve, reject) {
        https.get(url, (res) => {
            let bufferHelper = new BufferHelper();
            res.on('data', (chunk) => {
                //console.log(`BODY: ${chunk}`);
                bufferHelper.concat(chunk);
            });
            res.on('end', () => {
                let html = bufferHelper.toBuffer().toString();
                let _res = JSON.parse(html);
                resolve(_res);
            });
        }).on('error', (e) => {
            console.log(`Got error: ${e.message}`);
            reject(e);
        });
    });
}

function log(title) {
    return data => {
        console.log(title, data);
        return Promise.resolve(data);
    };
}

/**
 * get sid
 * @returns {string}
 */
function createSid() {
    //req.session.sid = Date.now() + Math.round(Math.random() * 1000);
    const buf = crypto.randomBytes(16);
    return buf.toString('hex');
}

/**
 * 获得 openid 及 session_key
 * @param appid
 * @param appsecret
 * @param code
 * @returns {Promise<T | never>}
 * @private
 */
function code2Session(appid, appsecret, code) {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`;
    return httpsGet(url).catch(log("httpsGet catch error: "));
}