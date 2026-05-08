exports.successResponse = (res, data = null, message = "Success", meta = null, status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
      meta,
      error: null
    });
  };
  
  exports.errorResponse = (res, message = "Error", error = null, status = 500) => {
    return res.status(status).json({
      success: false,
      message,
      data: null,
      meta: null,
      error
    });
  };