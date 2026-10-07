import getApplicationsList from "@/server/getters/dashboard/applicationList";
import { prismaMock } from "@/services/jest/prisma-singleton";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import { FormFieldTypeEnum } from "@/services/types/formFields";

jest.mock("@/server/services/helpers/auth/requireOrganizerSession", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    id: 1,
  }),
}));

const createApplicationDb = (
  id: number,
  school: string,
  votes: { value: number }[]
) => ({
  id,
  hacker: {
    id: id + 100,
    team: id === 1 ? { name: "Team 1" } : null,
    user: { email: `hacker${id}@email.com` },
  },
  status: { name: ApplicationStatusEnum.submitted },
  formValues: [
    { value: `Name ${id}`, field: { id: 1 }, option: null, file: null },
    { value: null, field: { id: 2 }, option: { value: school }, file: null },
  ],
  votes: votes.map(({ value }, index) => ({
    voteParameter: { weight: 1 },
    organizerId: index + 1,
    value,
  })),
});

const formFieldsDb = [
  {
    id: 1,
    label: "First name",
    type: { value: FormFieldTypeEnum.text },
    optionList: null,
  },
  {
    id: 2,
    label: "School",
    type: { value: FormFieldTypeEnum.select },
    optionList: { options: [{ value: "TUKE" }, { value: "UPJS" }] },
  },
  {
    id: 3,
    label: "First hackathon",
    type: { value: FormFieldTypeEnum.checkbox },
    optionList: null,
  },
  {
    id: 4,
    label: "Diet",
    type: { value: FormFieldTypeEnum.radio },
    optionList: null,
  },
];

describe("getApplicationsList", () => {
  beforeEach(() => {
    prismaMock.application.findMany.mockResolvedValue([
      createApplicationDb(1, "TUKE", []),
      createApplicationDb(2, "UPJS", [{ value: 5 }]),
    ] as never);
    prismaMock.formField.findMany.mockResolvedValue(formFieldsDb as never);
  });

  it("should return application properties sorted by score", async () => {
    const { applications } = await getApplicationsList(1);

    expect(applications.map(({ properties }) => properties.id)).toEqual([2, 1]);
    expect(applications[1].properties).toMatchObject({
      id: 1,
      hackerId: 101,
      email: "hacker1@email.com",
      team: "Team 1",
      status: ApplicationStatusEnum.submitted,
      "First name": "Name 1",
      School: "TUKE",
      "First hackathon": null,
    });
    expect(applications[0].properties.team).toBe("");
  });

  it("should return filters based on the application form fields", async () => {
    const { filters } = await getApplicationsList(1);

    expect(filters).toEqual([
      { column: "First name", options: null },
      { column: "School", options: ["TUKE", "UPJS"] },
      { column: "First hackathon", options: ["true", "false"] },
      { column: "Diet", options: null },
      { column: "id", options: null },
      { column: "email", options: null },
      { column: "team", options: null },
    ]);
  });
});
