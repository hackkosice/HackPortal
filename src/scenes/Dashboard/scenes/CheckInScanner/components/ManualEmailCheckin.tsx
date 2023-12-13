import React, { useEffect, useState } from "react";
import verifyCheckinCode, {
  VerifyCheckinCodeOutput,
} from "@/server/actions/dashboard/checkIn/verifyCheckinCode";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import callServerAction from "@/services/helpers/server/callServerAction";

type ManualEmailCheckinProps = {
  setHackerInfo: (data: VerifyCheckinCodeOutput) => void;
  hackathonId: number;
};

const checkinEmailFormSchema = z.object({
  email: z.string().min(1),
});

type CheckinEmailForm = z.infer<typeof checkinEmailFormSchema>;
const ManualEmailCheckin = ({
  setHackerInfo,
  hackathonId,
}: ManualEmailCheckinProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<CheckinEmailForm>({
    resolver: zodResolver(checkinEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onCheckinSubmit = async (data: CheckinEmailForm) => {
    const res = await callServerAction(verifyCheckinCode, {
      checkinCode: null,
      email: data.email,
      hackathonId,
    });
    if (!res.success) {
      setError(res.message);
      return;
    }
    setHackerInfo(res.data);
    setIsOpened(false);
  };

  useEffect(() => {
    if (isOpened) {
      form.reset();
      setError(null);
    }
  }, [form, isOpened]);

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PencilSquareIcon className="w-4 h-4 mr-1 text-hkOrange inline" />
          Manual loading
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual check-in</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500">{error}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCheckinSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email of hacker</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-5">
              <Button type="submit">Load</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualEmailCheckin;
