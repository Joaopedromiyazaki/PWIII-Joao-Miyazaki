/**
 * Middleware de logging de requisicoes HTTP.
 * Loga metodo, rota, status e tempo de resposta.
 */
function logger(req, res, next) {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] ${req.method} ${req.originalUrl} — ${res.statusCode} (${duration}ms)`);
    });

    next();
}

module.exports = logger;
