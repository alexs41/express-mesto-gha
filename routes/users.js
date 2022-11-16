import { Router } from 'express';
import {
  getAllUsers, updateUserInfo, updateAvatar,
} from '../controllers/users.js';

import {
  readOne,
} from '../controllers/users.js';

import {
  celebrateParamsRouteMe,
  celebrateBodyProfile,
  celebrateBodyAvatar
} from '../validators/users.js';

const userRoutes = Router();

userRoutes.get('/', getAllUsers);
userRoutes.get('/:id', celebrateParamsRouteMe, readOne);
userRoutes.patch('/me', celebrateBodyProfile, updateUserInfo);
userRoutes.patch('/me/avatar', celebrateBodyAvatar, updateAvatar);

export default userRoutes;
