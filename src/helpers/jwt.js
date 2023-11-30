const expressJwt  = require('express-jwt');

function authJwt(){
    const secret = process.env.secret;
    // const secret = "feranmi"
    const api = process.env.API_URL

    return expressJwt({
        secret,
        algorithms: ["HS256"],
        isRevoked:isRevoked
    }).unless({
        path:[
            `${api}/users/login`,
            `${api}/users/register`,
            `${api}/users/(.*)`,
            `${api}/users/change/password/(.*)`,
            `${api}/user/verify-code`,
            {url:/\/api\/v1\/users\/change\/password(.*)/,methods:['POST','OPTIONS']},
            {url:/\/api\/v1\/users(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/users(.*)/,methods:['POST','OPTIONS']},
            {url:/\/api\/v1\/users\/singleUser(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/product(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/wallet\/createWallet(.*)/,methods:['POST','OPTIONS']},
            {url:/\/api\/v1\/wallet(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/cart(.*)/,methods:['POST','OPTIONS']},
            {url:/\/api\/v1\/cart(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/cart(.*)/,methods:['DELETE','OPTIONS']},
            {url:/\/api\/v1\/order(.*)/,methods:['POST','OPTIONS']},
            {url:/\/api\/v1\/order(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/admin\/getFaqs(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/admin\/getAllCompany(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/admin\/getFaqs(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/admin\/getPaymentChargesSummary(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/admin\/flutterwave-public-key(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/user\/send-verification-code(.*)/,methods:['POST','OPTIONS']},
            {url:/\/api\/v1\/users(.*)/,methods:['PUT','OPTIONS']},
            {url:/\/api\/v1\/users\/resend-mail(.*)/,methods:['PUT','OPTIONS']},
            {url:/\/api\/v1\/company(.*)/,methods:['PUT','OPTIONS']},
            {url:/\/api\/v1\/company(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/company(.*)/,methods:['POST','OPTIONS']},
            {url:/\/api\/v1\/company\/verify-code(.*)/,methods:['POST','OPTIONS']},
            {url:/\/api\/v1\/company\/login(.*)/,methods:['POST','OPTIONS']},

        ]
    })
}
async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null, true)
    }
    done();
}
module.exports = authJwt;