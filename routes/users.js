import { Router } from 'express';
import { getAllUsers, getUserById, updateUserInfo, updateAvatar, getCurrentUser } from '../controllers/users.js';

const userRoutes = Router();
// import bodyParser from 'body-parser';
// const jsonParser = json();

userRoutes.get('/', getAllUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:userId', getUserById);
// userRoutes.post('/', createUser);
userRoutes.patch('/me', updateUserInfo);
userRoutes.patch('/me/avatar', updateAvatar);

export default userRoutes;
