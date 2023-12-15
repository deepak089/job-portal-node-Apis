// custom error

exports.errorMiddleware = (err, req, res, next) => {

    const defaultError = {
        statusCode: 500,
        message: err
    };

    // missing error
    if (err.name === 'ValidationError') {
        defaultError.statusCode = 400;
        defaultError.message = Object.values(err.errors).map(item => item.message).join(',');
    }
    // deuplicate error
    if (err.code && err.code === 11000) {
        defaultError.statusCode = 400;
        defaultError.message = `${Object.keys(err.keyValue)} field has to be unique`;
    }

    res.status(defaultError.statusCode).send({
        message: defaultError.message,
    })
}