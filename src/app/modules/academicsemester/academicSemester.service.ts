/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicSemester, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { RedisClient } from "../../../shared/redis";
import { IAcademicSemesterFilter } from "./academicSemester.interface";
import {
  AcademicSemesterSearchAbleFields,
  EVENT_ACADEMIC_SEMESTER_CREATED,
  EVENT_ACADEMIC_SEMESTER_DELETED,
  academicSemesterTitleCodeMapper,
} from './acadmicSemester.constant';


const insertIntoDB = async (
  academicSemesterData: AcademicSemester
): Promise<AcademicSemester> => {
  if (
    academicSemesterTitleCodeMapper[academicSemesterData.title] !==
    academicSemesterData.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }
  const result = await prisma.academicSemester.create({
    data: academicSemesterData
  });

  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_CREATED,
      JSON.stringify(result)
    );
  }

  return result;
};

const getAllSemesters = async (filters: IAcademicSemesterFilter,options: IPaginationOptions): Promise<IGenericResponse<AcademicSemester[]>> => {
    const {page,limit,skip}= paginationHelpers.calculatePagination(options);
    const {searchTerms, ...filterData}= filters;
    console.log(searchTerms);

    const andCondition=[];

    if(searchTerms){
        andCondition.push({
          OR: AcademicSemesterSearchAbleFields.map(key => ({
            [key]: {
              contains: searchTerms,
              mode: 'insensitive',
            },
          })),
        });
    }

    if(Object.keys(filterData).length){
        andCondition.push({
            AND: Object.keys(filterData).map((key)=>({
                [key]: {
                    equals:  (filterData as any)[key]
                }
            }))
        })
    }
    
    const whereConditions: Prisma.AcademicSemesterWhereInput = andCondition.length>0 ? {AND: andCondition} : {};
    

    const result= await prisma.academicSemester.findMany({
        where: whereConditions,
        skip,
        take:limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }

    });

    const total = await prisma.academicSemester.count();
    return {
        meta:{
            total,
            page,
            limit
        },
        data:result
    }
}

const getDataById= async (id: string): Promise<AcademicSemester | null> =>{
    const result= await prisma.academicSemester.findUnique({
        where:{
            id
        }
    });

    return result;

}

const updateOneInDB = async (
  id: string,
  payload: Partial<AcademicSemester>
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.delete({
    where: {
      id,
    },
  });
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_DELETED,
      JSON.stringify(result)
    );
  }
  return result;
};

export const academicSemesterService = {
    insertIntoDB,
    getAllSemesters,
    getDataById,
    updateOneInDB,
    deleteByIdFromDB
};
