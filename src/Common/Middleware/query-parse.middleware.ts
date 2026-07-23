import { Request, Response, NextFunction } from 'express';
import * as qs from 'qs';
export const RequestQueryParser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req['parseQuery'] = qs.parse(req.query as unknown as string);
  next();
};
