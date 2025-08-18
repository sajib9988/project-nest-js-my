import { Response } from 'express';

interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
}

export function sendResponse<T>(
  res: Response,
  {
    success = true,
    message = 'Request successful',
    data,
    meta,
  }: IApiResponse<T>
) {
  return res.status(success ? 200 : 400).json({
    success,
    message,
    data,
    meta,
  });
}
