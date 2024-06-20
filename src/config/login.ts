export default {
  tokenName: 'HuaYi-token', // cookie中存储的token key
  tokenExpires: 0.5, // token 过期时间
  tokenDomain: typeof window === 'undefined' ? '' : window.location.hostname, // token 存储cookie域名
  user:{}
};
