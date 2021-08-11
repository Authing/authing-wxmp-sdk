class AuthingWxmp {
    constructor(options) {
        this.opts = options
        if (!this.opts.appId) {
            throw new Error('appId is not provided');
        }
        if (!this.opts.host) {
            throw new Error('host is not provided');
        }
    }
}

AuthingWxmp.prototype.checkWechatUA = function () {
    const ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/MicroMessenger/i) == 'micromessenger';
}

AuthingWxmp.prototype.getAuthorizationUrl = function () {
    const host = this.opts.host
    const redirectUrl = this.opts.redirectUrl
    const queryObject = {
        app_id: this.opts.appId
    }
    if (redirectUrl) {
        queryObject.redirect_url = redirectUrl
    }
    return `${host}/connections/social/wechat:webpage-authorization?${new URLSearchParams(queryObject).toString()}`
}

AuthingWxmp.prototype.getUserInfo = function (search) {
    search = search || window.location.search
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