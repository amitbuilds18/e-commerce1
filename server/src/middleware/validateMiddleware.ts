import { Request, Response, NextFunction } from "express";

type Validator = (value: any) => string | null;

export const validateBody = (validator: Validator) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const error = validator(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }
    next();
  };
};

export const validateParams = (validator: Validator) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const error = validator(req.params);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }
    next();
  };
};
