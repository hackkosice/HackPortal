import {
  Application,
  ApplicationStatus,
  Hacker,
  Prisma,
  User,
} from "@prisma/client";
import { prismaMock } from "@/services/jest/prisma-singleton";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";

type CreateMockApplicationStatus = {
  application?: Partial<Application> | null;
  user?: Partial<User>;
  hacker?: Partial<Hacker>;
  applicationStatus?: Partial<ApplicationStatus>;
};
export const createMockApplication = (
  options?: CreateMockApplicationStatus
) => {
  const { user, hacker, application, applicationStatus } = options ?? {};
  const mockedApplication = new Promise((resolve) =>
    resolve(
      application === null
        ? null
        : {
            id: 1,
            hackerId: 1,
            statusId: 1,
            status: {
              id: 1,
              name: ApplicationStatusEnum.open,
              ...applicationStatus,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            hacker: {
              id: 1,
              userId: 1,
              hackathonId: 1,
              teamId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              user: {
                id: 1,
                name: null,
                password: null,
                email: "",
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationLastRequest: null,
                forgotPasswordToken: null,
                forgotPasswordLastRequest: null,
                image: null,
                ...user,
              },
              ...hacker,
            },
            ...application,
          }
    )
  ) as Prisma.Prisma__ApplicationClient<
    | (Application & { hacker: Hacker & { user: User } } & {
        status: ApplicationStatus;
      })
    | null
  >;
  prismaMock.application.findFirst.mockReturnValue(mockedApplication);
  prismaMock.application.findUnique.mockReturnValue(mockedApplication);
};

export const createMockApplicationStatus = () => {
  prismaMock.applicationStatus.findFirst.mockImplementation((args) => {
    return new Promise((resolve) =>
      resolve({
        id: 1,
        name: args?.where?.name as string,
      })
    ) as Prisma.Prisma__ApplicationStatusClient<ApplicationStatus>;
  });
  prismaMock.applicationStatus.findUnique.mockImplementation((args) => {
    return new Promise((resolve) =>
      resolve({
        id: 1,
        name: args?.where?.name as string,
      })
    ) as Prisma.Prisma__ApplicationStatusClient<ApplicationStatus>;
  });
};
