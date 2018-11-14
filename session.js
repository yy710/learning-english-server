/**
 * middleware: session
 */
'use strict';

const crypto = require('crypto');
//let session = {db: null, col: 'sessions'};
let assert = require('assert');
let https = require('https');
let WXBizDataCrypt = require('./WXBizDataCrypt.js');
let BufferHelper = require('./bufferhelper.js');

let session = {
    col: {},
    config: {},

    init: (req, res, next) => {
        this.col = req.data.db.collection('sessions');
        this.config = {aaa: 123}; //req.data.config['learningEnglish'];
        req.data.s = this;
        next();
    },

    login: (req, res, next) => {
        const code = req.query.code;
        if (code && this.config.appId && this.config.appSecret) {
            this._code2Session(this.config.appId, this.config.appSecret, code).then(r => {
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
            res.json({sid: null, msg: "session fail！"});
        }
    },

    /**
     * save req.data.session to collection
     * @param collection
     * @returns {Function}
     */
    save: (req, res, next) => {
        const data = req.data.session;
        this.col.findOneAndReplace({openid: data.openid}, data, {upsert: true})
            .then(next)
            .catch(log("dataBase error: "));
    },

    /**
     * find session from req.data.collection
     * @returns {Function}
     */
    find: (req, res, next) => {
        const sid = req.get('sid');
        this.col.find({sid: sid}).limit(1).next(function (err, doc) {
            assert.equal(null, err);
            if (doc) {
                delete doc._id;
                req.data.session = doc;
            } else {
                req.data.session = {};
            }
            console.log("set req.data.session =  ", req.data.session);
            next();
        });
    },

    reply: (req, res, next) => {
        res.json({sid: req.data.session.sid, msg: "session ok!"});
    },


    /**
     * 获得 openid 及 session_key
     * @param appid
     * @param appsecret
     * @param code
     * @returns {Promise<T | never>}
     * @private
     */
    _code2Session: function (appid, appsecret, code) {
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`;
        return httpsGet(url).then(log("session.code2Session() return: ")).catch(log("httpsGet catch error: "));
    },


    /**
     * 解密用户数据
     * @param appName
     * @param req.data.config
     * @param req.data.session.session_key
     * @param req.data.session.iv
     * @param next
     * @return req.data.session
     */
    decryptUserData: (req, res, next) => {
        const s = req.data.session;
        const pc = new WXBizDataCrypt(this.config.appId, s.session_key);
        s.decryptedData = pc.decryptData(s.encryptedData, s.iv);
        req.data.session = s;
        next();
    },
};


module.exports = session;

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