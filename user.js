const colname = 'users';
const user = {
    getUser: function () {
        return (req, res, next) => {
            const session = req.data.session;
            if (session === {}) {
                req.data.user = {};
                next();
            } else {
                const col = req.data.db.collection(colname);
                col.find({openid: session.openid})
                    .next()
                    .then(doc => {
                        if (doc) {
                            req.data.user = doc;
                        }
                        else {
                            req.data.user = this.newUser(session);
                        }
                        next();
                    })
                    .catch(log("getUser: "));
            }
        };
    },

    newUser: function (session) {
        return session;
    },

    upsertToDb: function () {
        return (req, res, next) => {
            const col = req.data.db.collection(colname);
            col.upsert(req.data.user, {w: 1, upsert: 1}, function () {
                next();
            });
        };
    }
};


module.exports = user;