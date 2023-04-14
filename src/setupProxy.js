const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api1', {
            target: "https://be.instaloans.co.ke/api",
            changeOrigin: true,
            pathRewrite: {
                "^/api1": "",
            },
            headers: {
                Connection: "keep-alive"
            }
        })
    );
    app.use(
        createProxyMiddleware('/api2', {
            target: "https://pharmacop-backend-proxy.fly.dev",
            changeOrigin: true,
            pathRewrite: {
                "^/api2": "",
            },
            headers: {
                Connection: "keep-alive"
            }
        })

    )
}