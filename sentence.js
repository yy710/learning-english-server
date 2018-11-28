const data = [
    {
        id: 0,
        tag: ["Dinosaurs Before Dark"],
        title: null,
        text: ["“Help! A monster!” said Annie.“Yeah, sure,” said Jack. “A real monster in Frog Creek, Pennsylvania.”"],
        audio: {
            src: "https://www.all2key.cn/learning-english/audio/01intoWoods.mp3",
            startTime: 21,
            endTime: 31.5
        },
        image: "https://www.all2key.cn/learning-english/images/001.png",
        previousId: 0,
        nextId: 1
    },
    {
        id: 1,
        tag: ["Dinosaurs Before Dark"],
        title: null,
        text: ["“Run,Jack!” said Annie, She ran up the road."],
        audio: {
            src: "https://www.all2key.cn/learning-english/audio/01intoWoods.mp3",
            startTime: 32,
            endTime: 35
        },
        image: "https://www.all2key.cn/learning-english/images/001.png",
        previousId: 0,
        nextId: 2
    },
    {
        id: 2,
        tag: ["Dinosaurs Before Dark"],
        title: null,
        text: ["Oh, brother.This is what he got for spending time with his seven-year-old sister, Annie loved pretend stuff. But Jack was eight and a half. He liked real things."],
        audio: {
            src: "https://www.all2key.cn/learning-english/audio/01intoWoods.mp3",
            startTime: 35,
            endTime: 45
        },
        image: "https://www.all2key.cn/learning-english/images/001.png",
        previousId: 1,
        nextId: 0
    },
    {
        id: 3,
        tag: ["Dinosaurs Before Dark"],
        title: null,
        text: ["“Watch out, Jack! The monster’s coming! Race you!” “No, thanks,” said Jack."],
        audio: {
            src: "https://www.all2key.cn/learning-english/audio/01intoWoods.mp3",
            startTime: 45,
            endTime: 50
        },
        image: "https://www.all2key.cn/learning-english/images/001.png",
        previousId: 2,
        nextId: 4
    },
    {
        id: 4,
        tag: ["Dinosaurs Before Dark"],
        title: null,
        text: ["Annie raced alone into the woods. Jack looked at the sky. The sun was about to set."],
        audio: {
            src: "https://www.all2key.cn/learning-english/audio/01intoWoods.mp3",
            startTime: 50,
            endTime: 55
        },
        image: "https://www.all2key.cn/learning-english/images/001.png",
        previousId: 3,
        nextId: 5
    },
    {
        id: 5,
        tag: ["Dinosaurs Before Dark"],
        title: null,
        text: ["“Come on, Annie! It’s time to go home!” But Annie had disappeared. Jack waited. No Annie."],
        audio: {
            src: "https://www.all2key.cn/learning-english/audio/01intoWoods.mp3",
            startTime: 55,
            endTime: 60
        },
        image: "https://www.all2key.cn/learning-english/images/001.png",
        previousId: 4,
        nextId: 0
    }
];

class Sentence {
    constructor() {
        //this.col = db.collection(colName);
    }

    getTitle() {
        data.forEach(item => {
            item.title = item.tag[0] + ' #' + item.id;
        });
        return this;
    }

    getPrevious(currentId, num) {
        let s = data.slice(currentId - num + 1, currentId + 1);
        return s;
        /*
        this.col.findOne({tag: tag, nextId: 0}).next().then(doc=>{
            this.data = doc;
            this.data.text[1] = punctuation(this.data.text[0]);
            return this;
        });
        */
    }

    getNext(currentId, num) {
        let s = data.slice(currentId + 1, currentId + num + 1);
        return s;
    }

    setNext(s) {
        this.data.nextId = s.data.id;
        s.data.lastId = this.data.id;
        this.save();
        return s;
    }

    save() {
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