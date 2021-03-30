const jwt = require('jsonwebtoken');
const { accessTokenSecret } = require("../config/secretkeys");
const { refreshTokenSecret } = require("../config/secretkeys");

module.exports = {
    userAuthentication: (req, res, next) => {
        if (req.session.loggedInUser) {
            const token = req.session.loggedInUser.accessToken;
            jwt.verify(token, accessTokenSecret, (err, user) => {
                if (err) {
                    return res.redirect('/admin/login');
                }
                next();
            });
        }
        else {
            return res.redirect('/admin/login');
        }
    },
};