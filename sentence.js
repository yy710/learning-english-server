class Sentence {
    constructor() {
        this.data = {
            id: 1,
            title: "Dinosaurs Before Dark #01",
            text: ["“Help! A monster!” said Annie.“Yeah, sure,” said Jack. “A real monster in Frog Creek, Pennsylvania.”"],
            audio: {
                src: "https://www.all2key.cn/learning-english/audio/01intoWoods.mp3",
                startTime: 21,
                endTime: 31.5
            },
            image: "https://www.all2key.cn/learning-english/images/001.png"
        }
    }

    get() {
        this.data.text[1] = punctuation(this.data.text[0]);
        return this.data;
    }
}

module.exports = Sentence;

function punctuation(str) {
    return str.replace(/[\ |\~|\“|\”|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, " ")//替换所有标点为空格
        .replace(/\s+/g, ' ')//合并多个空格
        .trim();//去除头尾空格
}

function ResetBlank() {
    var regEx = /\s+/g;
    return this.replace(regEx, ' ');
}