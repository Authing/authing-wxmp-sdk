const defaultOpts = {
    host: {
        oauth: "https://oauth.authing.cn/"
    },
    userPoolId: null
}

class AuthingWxmp {
    constructor(options) {
        this.opts = Object.assign({}, defaultOpts, options)
        if (!this.opts.userPoolId) {
            throw new Error('userPoolId not provided');
        }
        if (!this.opts.host || (this.opts.host && !this.opts.host.oauth)) {
            throw new Error('oauth server not provided');
        }
    }
}

AuthingWxmp.prototype.checkWechatUA = function () {
    const ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/MicroMessenger/i) == 'micromessenger';
}

AuthingWxmp.prototype.getAuthorizationUrl = function () {
    const host = this.opts.host.oauth
    const userPoolId = this.opts.userPoolId
    return `${host}/oauth/wechatmp/url/${userPoolId}`
}

AuthingWxmp.prototype.getUserInfo = function (search) {
    const urlParams = new URLSearchParams(search);
    let code = urlParams.get('code')
        , message = urlParams.get('message')
        , userinfo = urlParams.get('data')
    const ok = code == 200 ? true : false
    if (userinfo) {
        userinfo = JSON.parse(userinfo)
    }
    return {
        ok,
        message,
        userinfo
    }
}

module.exports = AuthingWxmp