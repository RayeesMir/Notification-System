var path = require('path');
var _ = require('lodash');
var JWT = require("jsonwebtoken");

var config = require(path.resolve('./config'))

function Helpers() {
    this.TimeUnits = config.getTimeUnits();
    //instead of dev NODE_ENV is to be passed
    this.tokenSettings = config.getTokenSettings('dev');
    //	Custom Error codes And messages
    this.errors = {
        401: "Unauthorized User",
        404: "Not Found",
        420: "User Already Subscribed",
        423: "Invalid Credientials",
        430: "User Already Registered With This Email",
        431: "User Already Registered With This Mobile",
        500: "Internal Server Error"
    };

}

Helpers.prototype = {
    /**
     *    Search error Message for given error code
     * @param code
     * @returns {String "Error Message"}
     */
    findError: function (code) {
        return this.errors[code];
    },
    /**
     * Generates Error object for give code
     * @param code
     * @param msg
     * @returns {Error Object}
     */
    generateError: function (code, msg) {
        var errMsg;
        if (code)
            errMsg = this.findError(code)
        else
            errMsg = this.findError(500);
        var err = new Error();
        err.code = code;
        if (msg)
            err.message = msg;
        else if (errMsg)
            err.message = errMsg;
        else
            err.message = "Internal Server Error";

        return err;
    },
    /**
     *  Validates parameters Passed in body|header|params|query
     * @param request
     * @param params
     * @param location
     * @returns {Promise}
     */
    validator: function (request, params, location) {
        return new Promise(function (resolve, reject) {
            var errMsgs = [];
            var data = {};
            var hasError = false;
            _.forEach(params, function (param) {
                if (typeof request[location][param] == 'undefined') {
                    errMsgs.push({
                        error: "Required param " + param + " is missing."
                    });
                    hasError = true;
                } else
                    data[param] = request[location][param];
            });
            if (hasError) {
                var err = new Error();
                err.message = errMsgs;
                err.code = 409;
                reject(err);
            } else
                resolve(data);
        });
    },
    /**
     * Access Token Validator external Interface
     * @param token
     * @returns {Promise}
     */
    validateToken: function (token) {
        var tokenSettings = this.tokenSettings;
        return this._tokenValidator(token, tokenSettings.secret)
    },
    /**
     * Access Token Validator
     * @param token
     * @param secret
     * @returns {Promise}
     * @private
     */
    _tokenValidator: function (token, secret) {
        return new Promise(function (resolve, reject) {
            JWT.verify(token, secret, function (error, decoded) {
                if (error)
                    reject(error);
                else {
                    var user = decoded.user ? decoded.user : decoded._doc;
                    resolve(user);
                }
            })
        })
    },
    /**
     * Access Token Generator external Interface
     * @param data
     * @returns {Promise}
     */
    generateToken: function (data) {
        var tokenSettings = this.tokenSettings;
        return this.makeToken(data, tokenSettings.secret, tokenSettings.time, tokenSettings.unit);
    },
    makeToken: function (data, secret, time, unit) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!(unit in self.TimeUnits))
                reject(self.generateError(500, "Invalid Time Units"));
            var accessTime = time + self.TimeUnits[unit].toUpperCase();
            JWT.sign(data, secret, {
                expiresIn: accessTime
            }, function (error, token) {
                if (error)
                    reject(this.generateError(500));
                else
                    resolve({
                        user: data,
                        token: token
                    });
            });

        });
    },
    /**
     * Combined Method For token validation and input Validation
     * @param request
     * @param params
     * @param location
     * @returns {Promise}
     */
    interceptor: function (request, params, location) {
        var self = this;
        var data = {};
        return new Promise(function (resolve, reject) {
            self.validator(request, ["x-access-token"], "headers")
                .then(function (data) {
                    return self.validateToken(data['x-access-token'])
                })
                .then(function (user) {
                    if (user)
                        data.user = user;
                    return self.validator(request, params, location);
                })
                .then(function (result) {
                    data.input = result;
                    resolve(data);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                })
        });
    },
    /**
     * Method To Send response to clients in case of success
     * @param response
     * @param data
     * @param key
     * @returns {*|{encode, decode, is, equals, pattern}}
     */
    sendSuccess: function (response, data, key) {
        var result = {
            status: "success",
            code: 200
        };
        result.message = {};
        if (key)
            result.message[key] = data;
        else
            result.message = data;
        return response.json(result);

    },
    /**
     * Method to send response to clients in case of errors
     * @param response
     * @param error
     * @returns {*|{encode, decode, is, equals, pattern}}
     */
    sendError: function (response, error) {
        var err;
        if (error instanceof Error) {
            err = error;
            if (!err.code)
                err.code = 500;
        } else
            err = this.generateError(code, message);
        var result = {
            status: "failure",
            code: err.code,
            message: {
                error: err.message
            }
        };
        return response.json(result);
    }
};
module.exports = new Helpers();