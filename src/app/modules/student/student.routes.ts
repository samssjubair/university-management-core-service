import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validations';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.STUDENT),
  StudentController.getAllFromDB
);

router.get('/:id', StudentController.getByIdFromDB);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.STUDENT),
  validateRequest(StudentValidation.create),
  StudentController.insertIntoDB
);

router.patch(
    '/:id',
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.STUDENT),
    validateRequest(StudentValidation.update),
    StudentController.updateIntoDb
)

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.STUDENT),
    StudentController.deleteFromDB
)

export const studentRoutes = router;