import type { Response } from "express";

class SendResponse {
  static SuccessResponse(res: Response, data: unknown, message: string) {
    res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static ErrorResponse(res: Response, error: unknown, message: string) {
    res.status(500).json({
      success: false,
      message,
      error,
    });
  }
}

export default SendResponse;
