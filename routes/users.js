import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUserInfo, updateAvatar } from '../controllers/users.js';
const userRoutes = Router();
// import bodyParser from 'body-parser';
// const jsonParser = json();

userRoutes.get('/', getAllUsers);
userRoutes.get('/:userId', getUserById);
userRoutes.post('/', createUser);
userRoutes.patch('/me', updateUserInfo);
userRoutes.patch('/me/avatar', updateAvatar);

// router.post('/', jsonParser, createUser);
// router.patch('/me', jsonParser, updateUserInfo);
// router.patch('/me/avatar', jsonParser, updateAvatar);

export default userRoutes;