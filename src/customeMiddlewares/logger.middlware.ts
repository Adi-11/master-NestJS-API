import { Request, Response } from 'express';

export function logger(req: Request, res: Response, next: Function) {
  var today = new Date();
  var date =
    today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
  var time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

  console.log(`-${date}, ${time} [Request] ====> ${req.url}`);
  next();
}
