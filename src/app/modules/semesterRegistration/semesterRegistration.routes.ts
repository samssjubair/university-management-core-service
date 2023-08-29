import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistraion.validations';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();

router.get('/', SemesterRegistrationController.getAllFromDB);
router.get('/:id', SemesterRegistrationController.getByIdFromDB);

router.post(
  '/',
  validateRequest(SemesterRegistrationValidation.create),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.insertIntoDB
);

router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.deleteByIdFromDB
);

router.patch(
  '/:id',
  validateRequest(SemesterRegistrationValidation.update),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.updateOneInDB
);

export const semesterRegistrationRoutes = router;
