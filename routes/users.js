import { Router } from 'express';
import {
  getAllUsers, getUserById, updateUserInfo, updateAvatar, getCurrentUser,
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
// import bodyParser from 'body-parser';
// const jsonParser = json();

userRoutes.get('/', getAllUsers);
// userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:id', celebrateParamsRouteMe, readOne);

// userRoutes.get('/:userId', getUserById);
// userRoutes.post('/', createUser);
userRoutes.patch('/me', celebrateBodyProfile, updateUserInfo);
userRoutes.patch('/me/avatar', celebrateBodyAvatar, updateAvatar);

export default userRoutes;
