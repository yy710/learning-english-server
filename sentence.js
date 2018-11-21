class Sentence {
    constructor() {
        //this.col = db.collection(colName);
        this.data = {
            id: 1,
            tag: ["Dinosaurs Before Dark"],
            title: null,
            text: ["“Help! A monster!” said Annie.“Yeah, sure,” said Jack. “A real monster in Frog Creek, <text style='color:red;'>Pennsylvania</text>.”"],
            audio: {
                src: "https://www.all2key.cn/learning-english/audio/01intoWoods.mp3",
                startTime: 21,
                endTime: 31.5
            },
            image: "https://www.all2key.cn/learning-english/images/001.png",
            lastId: 0,
            nextId: 0
        }
    }

    getTitle(){
        this.data.title = this.data.tag[0] + ' #' + this.data.id;
        return this;
    }

    getLast(tag) {
        return this;
        /*
        this.col.findOne({tag: tag, nextId: 0}).next().then(doc=>{
            this.data = doc;
            this.data.text[1] = punctuation(this.data.text[0]);
            return this;
        });
        */
    }

    getNext(){
        return this;
    }

    setNext(s){
        this.data.nextId = s.data.id;
        s.data.lastId = this.data.id;
        this.save();
        return s;
    }

    save(){
        //return this.col.insertOne(this.data).then(r=>this).catch(console.log);
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