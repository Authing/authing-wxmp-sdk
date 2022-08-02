<div align=center>
  <img width="250" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<br />

<div align=center>
  <span>English</span> | 
  <a href="https://github.com/Authing/authing-wxmp-sdk/blob/master/README-zh_CN.md">简体中文</a>
</div>

<br />
<div align=center>Authing wechat webpage authorization SDK, five minutes to access wechat webpage authorization login.</div>
<br/>
<div align="center">
  <a href="https://badge.fury.io/js/@authing%2Fwxmp"><img src="https://badge.fury.io/js/@authing%2Fwxmp.svg" alt="npm version" height="18"></a>
  <a href="https://npmcharts.com/compare/@authing/wxmp" target="_blank"><img src="https://img.shields.io/npm/dm/@authing/wxmp" alt="download"></a>
  <a href="https://standardjs.com" target="_blank"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="standardjs"></a>
  <a href="https://github.com/Authing/wxmp" target="_blank"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
  <a href="javascript:;" target="_blank"><img src="https://img.shields.io/badge/node-%3E=12-green.svg" alt="Node"></a>
</div>
<br/>

## Development

- Wechat official account: go to [wechat public platform](https://mp.weixin.qq.com/) to register
- **Must be service account**
- **Must pass wechat authentication**

Get the developer ID (appid) and developer password (appsecret) on the development - > basic configuration page of the wechat public platform background.

Settings in the background of wechat public platform - > official account settings - > function settings page settings **web authorization domain name**

Domain name fill in the unified callback domain name of Authing：`core.authing.cn`。

![](./images/mpverify.jpg)

For security verification, wechat server needs to do a request verification with authing server. Developers need to download txt files and record **file name** and **text content**。

Finally, create a **wechat social identity source** on the authoring console **connect to the identity source** - > **social login**:

![](./images/wechatmp2.png)

![](./images/wechatmp3.png)

Select **login method** as **wechat web page authorization login**, and fill in the following information:

![](./images/wechatmp4.png)

- Unique ID: This is the unique ID of this connection and cannot be modified after setting.
- Display name: the authing login form will display a {display name} login button.
- Appid: appid provided by wechat.
- Appsecret: appsecret provided by wechat.
- Txt Filename：Txt file name previously recorded
- Txt Content：Txt content recorded previously
- Redirect：Your business callback link is required. The configured callback address supports the use of wildcards. For example, the callback address you configured is `https://*.example.com/*`，The following callback addresses are also allowed： `https://forum.example.com/t/topic/1234`。

## Install

CDN：

```javascript
<script src="https://cdn.authing.co/packages/authing-wxmp-sdk/1.3.1/authing-wxmp-sdk.min.js"></script>
```

Use `AuthingWxmp` in browser

use npm / yarn：

```
npm install --save @authing/wxmp
```

or

```
yarn add @authing/wxmp
```

import AuthingWxmp：

```javascript
import AuthingWxmp from "@authing/wxmp";
```

## Init

Four parameters are required for initialization：

- `identifier`: The only sign of this social identity source, which you filled in when you created the wechat identity source on the authoring console.
- `appId`: Authing APP ID.
- `host`: Authing application domain，etc: `https://my-awesome-app.authing.cn`.
- `redirectUrl`: The specified callback link is optional, and the callback address configured by the console is used by default. The configured callback address supports the use of wildcards. For example, the callback address you configured in the authoring console is `https://*.example.com/*`，You can specify the callback address as `https://forum.example.com/t/topic/1234`.


Example：

```javascript
const authingWx = new AuthingWxmp({
    identifier: "wechat-mp-service",
    appId: "YOUR_APP_ID",
    host: "https://my-awesome-app.authing.cn",
    redirectUrl: 'http://localhost:8080'
})
```

## Wechat authorization

```javascript
const authingWx = new AuthingWxmp({
    identifier: "",
    appId: "YOUR_APP_ID",
    host: "https://my-awesome-app.authing.cn",
    redirectUrl: 'http://localhost:8080'
})

// Jump to wechat authorization page
window.location = authingWx.getAuthorizationUrl();
```

## Get user information

```javascript
// Get user information after jumping back to the business callback link
// If authingwx is not initialized on the callback page, it needs to be initialized first. Refer to the above for the specific initialization method

const { ok, userinfo, message } = authingWx.getUserInfo();
if (ok) {
  // do with userinfo
  console.log(userinfo);
} else if (message) {
  alert(message);
}
```

## Full API list

- checkWechatUA
- getAuthorizationUrl
- getUserInfo

### checkWechatUA

> Determine whether the current environment is a wechat client.

Example：

```javascript
if (!authingWx.checkWechatUA()) {
  alert("Please open it in wechat client!");
}
```

### getAuthorizationUrl

> Get wechat authorization link

Example：

```javascript
// Click the login button to jump to the wechat webpage authorization page
loginBtn.onclick = function () {
  window.location = authingWx.getAuthorizationUrl();
};
```

### getUserInfo

> Get user information from the search part of the current page URL

params：

- search：Search part of browser page link, optional, default value `window.location.search`。

Example：

```javascript
const { ok, userinfo, message } = authingWx.getUserInfo();
if (ok) {
  // do with userinfo
  console.log(userinfo);
} else if (message) {
  alert(message);
}
```

## Authorization process

1. The developer guides the user to jump to the authorization link set by authoring

- When the user opens the web page through wechat client, the browser will automatically jump.
- When the user opens the wechat client page, click the login button and jump

2. Authing and wechat server complete OAuth authentication and authorization

- Authoring eliminates the complicated acquisition authorization for developers_ Code, get access_ Token, the process of exchanging user information, and real zero line code access.
- Please see [official wechat document](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)。

3. Authing carries the user information to jump back to the **business jump link** set by the developer in **authing background**, and the data carried is `code`、`message`、`data`：

- `code`
  - 200：get user info successfully
  - other：Failed to get user information
- `message`: Error prompt information (when getting user information fails)
- `data`: User information (when successful in obtaining user information)

4. Developers use tokens to maintain login status

The 'token' returned in the user information is the login certificate, which the developer should keep properly, and **subsequent requests need to carry this token**.

Set the authorization request header to "bearer" + token, for example：

```
Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVuaW9uaWQiOiJvaVBiRHVHNFM3bXNyS0hQS0RjOE1FQ1NlOGpNIiwiaWQiOiI1ZGMxMGJjYjZmOTRjMTc4YzZmZmZmYjkiLCJjbGllbnRJZCI6IjVkYTdlZGFiNTAzOTZjMWFkOTYyMzc4YSJ9LCJpYXQiOjE1NzI5NTY0MjUsImV4cCI6MTU3NDI1MjQyNX0.OTgl72WZS8So3R5DbWCJ7I_Bd0LaZa4S0TAVMg9qaYQ"
```

If using node.js [axios](https://github.com/axios/axios)：

```javascript
axios.get(SOME_SERVICE_URL, {
  headers: {
    Authorization: `Bearer ${userinfo.token}`,
  },
});
```

When the end user accesses the developer's interface with this token, **the developer needs to judge whether this token is legal and in login status**, authing provides several methods for this purpose：[validate user token](https://docs.authing.cn/v2/guides/faqs/how-to-validate-user-token.html)。The data returned by Authoring contains information such as whether the user is logged in and the user ID under login. Then the developer can process the request according to the needs of specific business.

1. Summarize the above process

- The developer guides the user to jump to the wechat authorization page
- The end user agrees to authorize.
- Authing and wechat complete user information interaction according to OAuth protocol.
- Authing sends the user information (including token) to the business callback link customized by the developer.
- The subsequent requests of the end user will carry the token.
- Developers call on the back end [Methods provided by Authing](https://docs.authing.cn/v2/guides/faqs/how-to-validate-user-token.html) Verify the legitimacy and login status of the token。
- Process the request according to the login status returned by authoring and the developer's own business logic。

## Contribution

- Fork it
- Create your feature branch (git checkout -b my-new-feature)
- Commit your changes (git commit -am 'Add some feature')
- Push to the branch (git push -u origin my-new-feature)
- Create new Pull Request

## License

[License](https://github.com/Authing/authing-wxmp-sdk/blob/master/LICENSE)

Copyright (c) 2019 Authing
