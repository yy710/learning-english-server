/**
 * https://cloud.tencent.com/document/api/884/19309
 * 腾讯云智聆口语评测（Smart Oral Evaluation）英语口语评测服务
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

let soe = function (refText, base64Data) {
    return new Promise(function (resolve, reject) {
        // 实例化一个发音评估初始化接口请求对象,并填充参数
        let reqInit = new models.InitOralProcessRequest();
        // create random sessionId
        const sessionId = "stress_test_" + Math.round(Math.random() * 1000000);
        console.log("sessionId: ", sessionId);

        reqInit.SessionId = sessionId; //语音段唯一标识，一段语音一个SessionId
        reqInit.RefText = refText; //被评估语音对应的文本
        reqInit.WorkMode = 1; //语音输入模式，0流式分片，1非流式一次性评估
        reqInit.EvalMode = 1; //评估模式，0:词模式, 1:句子模式，当为词模式评估时，能够提供每个音节的评估信息，当为句子模式时，能够提供完整度和流利度信息。
        reqInit.ScoreCoeff = 3.5; //评价苛刻指数，取值为[1.0 - 4.0]范围内的浮点数，用于平滑不同年龄段的分数，1.0为小年龄段，4.0为最高年龄段

        // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
        client.InitOralProcess(reqInit, function (err, response) {
            if (err) {
                reject(err);
            }
            // 请求正常返回，打印response对象
            console.log(response.to_json_string());

            // 实例化一个发音数据传输接口请求对象,并填充参数
            let reqTran = new models.TransmitOralProcessRequest();
            reqTran.SessionId = sessionId; //语音段唯一标识，一个完整语音一个SessionId
            reqTran.VoiceFileType = 3; //语音文件类型 1:raw, 2:wav, 3:mp3(mp3格式目前仅支持16k采样率16bit编码单声道)
            reqTran.SeqId = 0; //流式数据包的序号，从1开始，当IsEnd字段为1后后续序号无意义，非流式模式下无意义
            reqTran.VoiceEncodeType = 1; //语音编码类型 1:pcm
            reqTran.IsEnd = 0; //是否传输完毕标志，若为0表示未完毕，若为1则传输完毕开始评估，非流式模式下无意义
            reqTran.UserVoiceData = base64Data; //当前数据包数据, 流式模式下数据包大小可以按需设置，数据包大小必须 >= 4K，编码格式要求为BASE64。

            // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
            client.TransmitOralProcess(reqTran, function (err, response) {
                if (err) {
                    reject(err);
                }
                // 请求正常返回，打印response对象
                console.log(response.to_json_string());
                resolve(response);
            });
        });
    });
};

module.exports = soe;