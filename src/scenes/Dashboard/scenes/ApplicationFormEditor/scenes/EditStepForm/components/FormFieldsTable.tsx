"use client";

import React, { useContext, useState } from "react";
import { FormFieldData } from "@/server/getters/dashboard/stepInfo";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DocumentDuplicateIcon,
  EllipsisHorizontalCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import deleteFormField from "@/server/actions/dashboard/applicationFormEditor/deleteFormField";
import NewFieldDialog from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldDialog";
import { FormFieldTypesData } from "@/server/getters/dashboard/formFieldTypes";
import { OptionListsData } from "@/server/getters/dashboard/optionListManager/getOptionLists";
import duplicateFormField from "@/server/actions/dashboard/applicationFormEditor/duplicateFormField";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";

type FormFieldsTableProps = {
  formFields: FormFieldData[];
  formFieldTypes: FormFieldTypesData;
  optionLists: OptionListsData;
};

const FormFieldsTableContext = React.createContext<{
  formFieldTypes: FormFieldTypesData;
  optionLists: OptionListsData;
}>({
  formFieldTypes: [],
  optionLists: [],
});

const ActionsCell = ({ formField }: { formField: FormFieldData }) => {
  const [
    isDeleteConfirmationDialogOpened,
    setIsDeleteConfirmationDialogOpened,
  ] = useState(false);
  const [isNewFieldDialogOpened, setIsNewFieldDialogOpened] = useState(false);
  const {
    id,
    name,
    label,
    required,
    optionList,
    type,
    description,
    shouldBeShownInList,
  } = formField;
  const { formFieldTypes, optionLists } = useContext(FormFieldsTableContext);

  return (
    <>
      <ConfirmationDialog
        question={`Are you sure you want to delete form field "${label}"? It may contain already filled values!`}
        onAnswer={async (answer) => {
          if (answer) {
            await deleteFormField({ fieldId: id, force: true });
          }
          setIsDeleteConfirmationDialogOpened(false);
        }}
        isManuallyOpened={isDeleteConfirmationDialogOpened}
      />
      <NewFieldDialog
        formFieldTypes={formFieldTypes}
        optionLists={optionLists}
        isOpened={isNewFieldDialogOpened}
        onOpenChange={setIsNewFieldDialogOpened}
        mode="edit"
        formFieldId={id}
        initialData={{
          label,
          description: description ?? "",
          shouldBeShownInList,
          typeId: formFieldTypes
            .find((fieldType) => fieldType.value === type)
            ?.id.toString() as string,
          required,
          optionListId: optionList?.id ? optionList?.id.toString() : undefined,
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label={`Open menu ${name} form field`}
          >
            <span className="sr-only">Open menu</span>
            <EllipsisHorizontalCircleIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setIsNewFieldDialogOpened(true);
            }}
          >
            <PencilSquareIcon className="h-4 w-4 mr-1" />
            Edit field
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={async () => {
              await duplicateFormField({ formFieldId: id });
            }}
          >
            <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
            Duplicate field
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              setIsDeleteConfirmationDialogOpened(true);
            }}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const formFieldColumns: ColumnDef<FormFieldData>[] = [
  {
    header: "",
    accessorKey: "position",
  },
  {
    header: "Label",
    cell: ({ row }) => {
      const { label } = row.original;
      return <MarkDownRenderer markdown={label} />;
    },
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "Required",
    accessorKey: "required",
  },
  {
    header: "Shown in list",
    accessorKey: "shouldBeShownInList",
  },
  {
    header: "Tooltip",
    cell: ({ row }) => {
      const { description } = row.original;
      if (!description) {
        return null;
      }
      return (
        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>
              <QuestionMarkCircleIcon className="h-5 w-5 text-hkOrange cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>{description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    header: "Option list",
    cell: ({ row }) => {
      const { optionList } = row.original;
      if (!optionList) {
        return null;
      }
      return (
        <Link
          href={`/option-lists/${optionList.id}/edit`}
          className="text-hkOrange"
        >
          {optionList.name}
        </Link>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return <ActionsCell formField={row.original} />;
    },
  },
];
const FormFieldsTable = ({
  formFields,
  formFieldTypes,
  optionLists,
}: FormFieldsTableProps) => {
  return (
    <FormFieldsTableContext.Provider value={{ formFieldTypes, optionLists }}>
      <DataTable columns={formFieldColumns} data={formFields} />
    </FormFieldsTableContext.Provider>
  );
};

export default FormFieldsTable;
