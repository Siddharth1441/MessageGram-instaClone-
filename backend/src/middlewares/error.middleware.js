function notFoundHandler(req, res) {
    res.status(404).json({
        message:`Route not found: ${req.method} ${req.originalUrl}`
    })
}

function errorHandler(err, req, res, next) {
    const status = err.statusCode || err.status || 500

    if (err.code === 11000) {
        return res.status(409).json({
            message:"Duplicate record",
            fields:Object.keys(err.keyPattern || {})
        })
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({
            message:"Validation failed",
            errors:Object.values(err.errors).map(error => error.message)
        })
    }

    res.status(status).json({
        message:status === 500 ? "Internal server error" : err.message
    })
}

module.exports = {
    notFoundHandler,
    errorHandler
}
