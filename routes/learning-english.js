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
            const randomSessionId = "stress_test_" + Math.round(Math.random()*1000000);
            console.log("sessionId: ", randomSessionId); //debug

            // 实例化一个请求对象,并填充参数
            let req1 = new models.InitOralProcessRequest();
            req1.SessionId = randomSessionId;
            req1.RefText = "Everyday is new";
            req1.WorkMode = 1;//语音输入模式，0: 流式分片，1：非流式一次性评估
            req1.EvalMode = 1;//评估模式，0：词模式，1：句子模式
            req1.ScoreCoeff = 2.5;//评价苛刻指数，1.0为最小年龄段，4.0为最高年龄段

            // 通过client对象调用发音评估初始化接口，需要传入请求对象以及响应回调函数
            client.InitOralProcess(req1, function (err, response) {
                if (err) {
                    console.log(err);
                    return;
                }
                // 请求正常返回，打印response对象
                console.log(response.to_json_string());

                // 实例化一个请求对象,并填充参数
                let req2 = new models.TransmitOralProcessRequest();
                req2.SessionId = randomSessionId;
                req2.VoiceFileType = 3;//语音文件类型，1：raw，2：wav，3：mp3（16k采样率16bit编码单声道）
                req2.SeqId = 1; //流模式数据包序号，从1开始，非流模式无意义
                req2.VoiceEncodeType = 1;//语音编码类型，1：pcm
                req2.IsEnd = 1; //传输完毕标志，0：未完毕，1：传输完毕开始评估，非流模式无意义
                req2.UserVoiceData = base64; //base64格式编码数据包，流模式下大小可以按需设置，但必须>=4K

                // 通过client对象调用发音数据传输接口，需要传入请求对象以及响应回调函数
                client.TransmitOralProcess(req2, function (err, response) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    // 请求正常返回，打印response对象
                    console.log(response.to_json_string());
                    res.json(response);
                });
            });

            //----------------------------------------------------------------
        }
    });
});

module.exports = router;