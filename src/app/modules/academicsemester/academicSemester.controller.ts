import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { academicSemesterService } from './academicSemester.service';

const insertIntoDB= catchAsync(async (req: Request,res: Response) =>{
    const result = await academicSemesterService.insertIntoDB(req.body);

        sendResponse<AcademicSemester>(res, {
            statusCode: 201,
            success: true,
            message: 'Academic Semester created successfully',
            data: result,
        })
})
 
export const academicDepartmentController = {
    insertIntoDB,
};