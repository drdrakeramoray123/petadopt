function getUrlPath(req, res, next) {
    res.locals.active = req.originalUrl;
    next();
}

module.exports = getUrlPath;
