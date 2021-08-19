const ApiError = require("./errors").ApiError;

const handleError = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.getHttpStatusCode()).json({
      success: false,
      message: err.message,
    });
  }
  if(err.code === 11000){
    const value=err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message=`Duplicate field Value: ${value}`
    return res.status(400).json({
      success: false,
      message
    })

  }

  // By default we send a status 500 if something goes wrong
  return res.status(500).json({
    success: false,
    message: err.message || `Something went wrong`,
  });
};

module.exports = handleError;
