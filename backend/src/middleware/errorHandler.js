const errorHandling = (err, req, res, next) => {
    res.status(err.statusCode).json({ 
        status: err.statusCode,
        message: "Something went wrong",
        error: err.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
}

export default errorHandling;
