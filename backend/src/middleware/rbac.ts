import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: { 
    role: string; 
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET as string; 

const rbacMiddleware = (requiredRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]; 

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const decoded: any = jwt.verify(token, JWT_SECRET); 
      req.user = decoded;

      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      
      if (!requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();

    } catch (error) {
      console.error('RBAC Middleware Error:', error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};

export default rbacMiddleware;