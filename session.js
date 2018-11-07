/**
 * middleware: session
 */
'use strict';

const crypto = require('crypto');
let session = {db: null, col: 'sessions'};
let assert = require('assert');
let https = require('https');
let WXBizDataCrypt = require('./WXBizDataCrypt.js');
let BufferHelper = require('./bufferhelper.js');

/**
 * 获得 openid 及 session_key
 * @returns {Function}
 * @param appid
 * @param appsecret
 */
session.code2Session = function (appid, appsecret) {
    return function (req, res, next) {
        const code = req.query.code;
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`;
        httpsGet(url)
            .then(log("code2Session() return: "))
            .then(_res => {
                let s = req.data.session;
                s.openid = _res.openid;
                s.session_key = _res.session_key;
                s.sid = createSid();
                req.data.session = s;
                //_res.encryptedData = req.query.encryptedData;
                //_res.iv = req.query.iv;
                next();
            }).catch(console.log);
    };
};

/**
 * 解密用户数据
 * @param req
 * @param res
 * @param next
 */
session.decryptUserData = function (appid) {
    return function (req, res, next) {
        const s = req.data.session;
        const pc = new WXBizDataCrypt(appid, s.session_key);
        s.decryptedData = pc.decryptData(s.encryptedData, s.iv);
        req.data.session = s;
        next();
    };
};

session.save = function (req, res, next) {
    //delete req.session.encryptedData;
    const db = req.data.db;
    db.collection('sessions')
        .insertOne(req.data.session, function (err, res) {
            assert.equal(null, err);
            assert.equal(1, res.insertedCount);
            next();
        });
};

session.find = function (req, res, next) {
    const sid = req.query.sid;
    const db = req.data.db;
    db.collection('sessions').find({sid: sid}).limit(1).next(function (err, doc) {
        assert.equal(null, err);
        //console.log("from session.js/session.find(): ", doc);
        //res.send({valid: !!doc});
        req.data.session = doc;//approve
        next();
    });
};

session.getMember = function (req, res, next) {
    req.db.collection('members')
        .find({openid: req.data.session.openid})
        .next()
        .then(doc => {
            req.data.member = doc;
            next();
        })
        .catch(log("getMember: "));
};

session.reply = function (req, res, next) {
    res.json({sid: req.data.session.sid, msg: "session ok!"});
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