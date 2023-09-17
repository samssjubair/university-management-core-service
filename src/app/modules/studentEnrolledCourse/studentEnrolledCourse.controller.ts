import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentEnrolledCourseFilterableFields } from './studentEnrolledCourse.constants';
import { StudentEnrolledCourseService } from './studentEnrolledCourse.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentEnrolledCourseService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'StudentEnrolledCourse created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentEnrolledCourseFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await StudentEnrolledCourseService.getAllFromDB(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'StudentEnrolledCourses fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentEnrolledCourseService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'StudentEnrolledCourse fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentEnrolledCourseService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'StudentEnrolledCourse updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentEnrolledCourseService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'StudentEnrolledCourse deleted successfully',
    data: result,
  });
});

const getMyCourseMarks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const user = (req as any).user;

  const result = await StudentEnrolledCourseMarkService.getMyCourseMarks(
    filters,
    options,
    user
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student course marks fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});


export const StudentEnrolledCourseController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
    getMyCourseMarks,
};
