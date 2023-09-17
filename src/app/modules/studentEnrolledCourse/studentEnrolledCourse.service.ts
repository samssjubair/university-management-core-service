/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Prisma,
    StudentEnrolledCourse,
    StudentEnrolledCourseMark,
    StudentEnrolledCourseStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IStudentEnrolledCourseMarkFilterRequest } from '../studentEnrolledCourseMark/studentEnrolledCourseMark.interface';
import {
    studentEnrolledCourseRelationalFields,
    studentEnrolledCourseRelationalFieldsMapper,
    studentEnrolledCourseSearchableFields,
} from './studentEnrolledCourse.constants';
import { IStudentEnrolledCourseFilterRequest } from './studentEnrolledCourse.interface';

const insertIntoDB = async (
  data: StudentEnrolledCourse
): Promise<StudentEnrolledCourse> => {
  // Use Prisma to find the first record in the 'studentEnrolledCourse' table that matches certain conditions.
  const isCourseOngoingOrCompleted =
    await prisma.studentEnrolledCourse.findFirst({
      where: {
        OR: [
          // Check if the 'status' property of the record is equal to 'ONGOING'.
          {
            status: StudentEnrolledCourseStatus.ONGOING,
          },
          // Check if the 'status' property of the record is equal to 'COMPLETED'.
          {
            status: StudentEnrolledCourseStatus.COMPLETED,
          },
        ],
      },
    });

  // If there is a course that is ongoing or completed, throw an error with a specific message.
  if (isCourseOngoingOrCompleted) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isCourseOngoingOrCompleted.status?.toLowerCase()} registration`
    );
  }

  // Use Prisma to create a new record in the 'studentEnrolledCourse' table with the provided 'data'.
  // Include related data from the 'academicSemester', 'student', and 'course' tables in the result.
  const result = await prisma.studentEnrolledCourse.create({
    data,
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: IStudentEnrolledCourseFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourse[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  if (!filterData.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    if (currentAcademicSemester) {
      filterData.academicSemesterId = currentAcademicSemester.id;
    }
  }

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: studentEnrolledCourseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (studentEnrolledCourseRelationalFields.includes(key)) {
          return {
            [studentEnrolledCourseRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.StudentEnrolledCourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.studentEnrolledCourse.findMany({
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.studentEnrolledCourse.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (
  id: string
): Promise<StudentEnrolledCourse | null> => {
  const result = await prisma.studentEnrolledCourse.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<StudentEnrolledCourse>
): Promise<StudentEnrolledCourse> => {
  const result = await prisma.studentEnrolledCourse.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<StudentEnrolledCourse> => {
  const result = await prisma.studentEnrolledCourse.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });
  return result;
};

const getMyCourseMarks = async (
  filters: IStudentEnrolledCourseMarkFilterRequest,
  options: IPaginationOptions,
  authUser: any
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } = paginationHelpers.calculatePagination(options);

  const student = await prisma.student.findFirst({
    where: {
      studentId: authUser.id,
    },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const marks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: student.id,
      },
      academicSemester: {
        id: filters.academicSemesterId,
      },
      studentEnrolledCourse: {
        course: {
          id: filters.courseId,
        },
      },
    },
    include: {
      studentEnrolledCourse: {
        include: {
          course: true,
        },
      },
    },
  });

  return {
    meta: {
      total: marks.length,
      page,
      limit,
    },
    data: marks,
  };
};

export const StudentEnrolledCourseService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
    getMyCourseMarks,
};
