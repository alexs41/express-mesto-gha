import { Router } from 'express';
import {
  getAllUsers, updateUserInfo, updateAvatar, getCurrentUser, getUserById,
} from '../controllers/users.js';

import {
  celebrateParamsUserId,
  celebrateBodyProfile,
  celebrateBodyAvatar,
} from '../validators/users.js';

const userRoutes = Router();

userRoutes.get('/', getAllUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:id', celebrateParamsUserId, getUserById);
userRoutes.patch('/me', celebrateBodyProfile, updateUserInfo);
userRoutes.patch('/me/avatar', celebrateBodyAvatar, updateAvatar);

export default userRoutes;
