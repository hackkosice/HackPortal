import { Hacker, Prisma, User, Organizer } from "@prisma/client";
import { prismaMock } from "@/services/jest/prisma-singleton";

type CreateMockUserOptions = {
  user?: Partial<User> | null;
  hacker?: Partial<Hacker> | null;
  organizer?: Partial<Organizer> | null;
};
export const createMockUser = (options?: CreateMockUserOptions) => {
  const { user, hacker, organizer } = options ?? {};
  const mockedUser = new Promise((resolve) =>
    resolve(
      user === null
        ? null
        : {
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
            hacker: hacker
              ? {
                  id: 1,
                  userId: 1,
                  hackathonId: 1,
                  teamId: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  ...hacker,
                }
              : null,
            organizer: organizer
              ? {
                  id: 1,
                  userId: 1,
                  currentApplicationForReviewId: null,
                  isAdmin: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  ...organizer,
                }
              : null,
            ...user,
          }
    )
  ) as Prisma.Prisma__UserClient<
    (User & { hacker: Hacker | null } & { organizer: Organizer | null }) | null
  >;
  prismaMock.user.findFirst.mockReturnValue(mockedUser);
  prismaMock.user.findUnique.mockReturnValue(mockedUser);
};
