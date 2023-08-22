import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicSemesterService } from './academicSemester.service';
import { academicSemesterFilterableFields } from './acadmicSemester.constant';

const insertIntoDB= catchAsync(async (req: Request,res: Response) =>{
    const result = await academicSemesterService.insertIntoDB(req.body);

        sendResponse<AcademicSemester>(res, {
            statusCode: 201,
            success: true,
            message: 'Academic Semester created successfully',
            data: result,
        })
})

const getAllFromDB= catchAsync(async (req: Request,res: Response) =>{
    const filters = pick(req.query, academicSemesterFilterableFields);
    const options=pick(req.query, ['sortBy','sortOrder', 'limit', 'page']);
    console.log(filters);
    const result= await academicSemesterService.getAllSemesters(filters,options);

    sendResponse<AcademicSemester[]>(res, {
        statusCode: 200,
        success: true,
        message: 'Academic Semester fetched successfully',
        meta: result.meta,
        data: result.data
    })
})

const getDataById= catchAsync(async (req: Request,res: Response) =>{
    const result= await academicSemesterService.getDataById(req.params.id);

    sendResponse<AcademicSemester>(res, {
        statusCode: 200,
        success: true,
        message: 'Academic Semester fetched successfully',
        data: result
    })
})

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await academicSemesterService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await academicSemesterService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester delete successfully',
    data: result,
  });
});
 
export const academicSemesterController = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    updateOneInDB,
    deleteByIdFromDB
};