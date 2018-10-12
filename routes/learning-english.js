let express = require('express');
let router = express.Router();
let multer = require('multer');
let upload = multer({dest: '../uploads/'});
let fs = require('fs');

/* GET home page. */
router.post('/upload', upload.single('record'), function (req, res, next) {
    //debug
    console.log("req.file: ", req.file);
    console.log("req.body: ", req.body);

    fs.readFile(req.file.path, (err, data) => {
        if (err) {
            throw err;
        } else {
            let buf = Buffer.from(data);
            let base64 = buf.toString('base64');
            fs.writeFile(req.file.destination + 'voice.txt', base64, err => {
                if (err) throw err;
            });

            //----------------------------------------------------------------


            /**
             * soe
             */
            const tencentcloud = require("tencentcloud-sdk-nodejs");

            //导入对应产品模块的client models。
            const SoeClient = tencentcloud.soe.v20180724.Client;
            const models = tencentcloud.soe.v20180724.Models;

            const Credential = tencentcloud.common.Credential;
            const ClientProfile = tencentcloud.common.ClientProfile;
            const HttpProfile = tencentcloud.common.HttpProfile;

            // 实例化一个认证对象，入参需要传入腾讯云账户secretId，secretKey
            let cred = new Credential("AKIDHUXQ8fUCE8sRp2NtZ4NWWLzRnz2uo7Sc", "75sUvAE6nJdopeIm5C8tTsAMNDsOjtvr");

            // 实例化一个http选项，可选的，没有特殊需求可以跳过。
            let httpProfile = new HttpProfile();
            httpProfile.reqMethod = "POST";
            httpProfile.reqTimeout = 30;
            httpProfile.endpoint = "soe.tencentcloudapi.com";

            // 实例化一个client选项，可选的，没有特殊需求可以跳过。
            let clientProfile = new ClientProfile();
            clientProfile.signMethod = "HmacSHA256";
            clientProfile.httpProfile = httpProfile;

            // 实例化要请求产品的client对象。clientProfile可选。
            let client = new SoeClient(cred, "ap-guangzhou", clientProfile);

            // 实例化一个请求对象,并填充参数
            req = new models.InitOralProcessRequest();
            req.SessionId = "stress_test_956938";
            req.RefText = "again";
            req.WorkMode = 0;
            req.EvalMode = 0;
            req.ScoreCoeff = 3.5;

            // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
            client.InitOralProcess(req, function (err, response) {
                if (err) {
                    console.log(err);
                    return;
                }
                // 请求正常返回，打印response对象
                console.log(response.to_json_string());

                // 实例化一个请求对象,并填充参数
                req = new models.TransmitOralProcessRequest();
                req.SessionId = "stress_test_956938";
                req.VoiceFileType = 1;
                req.SeqId = 0;
                req.VoiceEncodeType = 1;
                req.IsEnd = 0;
                req.UserVoiceData = base64;

                // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
                client.TransmitOralProcess(req, function (err, response) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    // 请求正常返回，打印response对象
                    console.log(response.to_json_string());
                });
            });

            //----------------------------------------------------------------
        }
    });

    res.json({test: 'ok!'});
});

module.exports = router;