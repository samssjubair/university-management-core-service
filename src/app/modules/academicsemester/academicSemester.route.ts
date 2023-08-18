import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicDepartmentController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router= express.Router();

router.post('/',validateRequest(AcademicSemesterValidation.create), academicDepartmentController.insertIntoDB);

export const academicSemesterRouter= router;