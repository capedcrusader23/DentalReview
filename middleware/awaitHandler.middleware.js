const awaitHandlerFactory = (middleware) => async (req, res, next) => {
    try {
        middleware(req,res,next)
    } catch (err) {
        next(err);
    }
};

module.exports = awaitHandlerFactory;