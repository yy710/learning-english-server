class User{
    constructor(){

    }

    getUser(){
        return function(req, res, next){
            const col = req.data.collection;
            col.find({openid: req.data.session.openid})
                .next()
                .then(doc => {
                    req.data.member = doc;
                    next();
                })
                .catch(log("getMember: "));
        };
    }

}