// Environnement.js

const security = {
    grant_type: process.env.REACT_APP_GRANT_TYPE,
    scope: process.env.REACT_APP_SCOPE,
    verifier_code: process.env.REACT_APP_VERIFIER_CODE,
    app_id: process.env.REACT_APP_APP_ID,
    ntk_sub_id:process.env.REACT_APP_NTK_ID,
    ntk_sol_id:process.env.REACT_APP_NTK_SOL,
    ntk_sub_cmp:process.env.REACT_APP_NTK_CMP,
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    serverTokenEndpoint: process.env.REACT_APP_SERVER_TOKEN_ENDPOINT,
    serverAuthorizeEndpoint: process.env.REACT_APP_SERVER_AUTHORIZE_ENDPOINT,
    serverLogoutEndpoint: process.env.REACT_APP_SERVER_LOGOUT_ENDPOINT
};

const hosts = {
    api: "https://api-provinces.numibit.com",
    image: "https://api-provinces.numibit.com/images",
    oauth_api: process.env.REACT_APP_OAUTH_API_HOST,
    oauth_exposed: process.env.REACT_APP_OAUTH_EXPOSED_HOST,
    location_api: process.env.REACT_APP_LOCATION_API_HOST,
    location_exposed: process.env.REACT_APP_LOCATION_EXPOSED_HOST
};

export { security, hosts};