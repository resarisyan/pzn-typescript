import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { UserController } from '../controller/user-controller';
import { ContactController } from '../controller/contact-controller';

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

apiRouter.get('/api/users/me', UserController.me);
apiRouter.patch('/api/users/me', UserController.update);
apiRouter.delete('/api/users/me', UserController.logout);

apiRouter.post('/api/contacts', ContactController.create);
apiRouter.get('/api/contacts/:contactId', ContactController.get);
apiRouter.put('/api/contacts/:contactId', ContactController.update);
apiRouter.delete('/api/contacts/:contactId', ContactController.remove);
apiRouter.get('/api/contacts', ContactController.search);
