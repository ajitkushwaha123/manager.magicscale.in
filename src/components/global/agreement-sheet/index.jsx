"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function AgreementSheet({ onSubmit }) {
  const [open, setOpen] = React.useState(false);

  const [client, setClient] = React.useState({
    name: "Yadav Hotel",
    address:
      "A-11 NILOTHI MOR SHIVRAM PARK NANGLI NAJAFGARH NEW DELHI 110041, NAJAFGARH, South West, Delhi-110041",
    representative: "Shri Chand Yadav",
  });

  const today = new Date();
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  const [agreement, setAgreement] = React.useState({
    date: today,
    start: threeDaysLater,
    end: new Date(
      new Date(threeDaysLater).setMonth(threeDaysLater.getMonth() + 1)
    ),
  });

  const handleSave = () => {
    onSubmit?.({ client, agreement });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-[#1b1cfe] hover:bg-[#1516d9] text-white">
          Edit Agreement Details
        </Button>
      </SheetTrigger>

      <SheetContent
        className="flex flex-col h-full px-4 pb-20" // enough bottom space for sticky buttons
      >
        {/* Header */}
        <SheetHeader className="pb-3">
          <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Agreement Details
          </SheetTitle>
          <SheetDescription>
            Set the client and agreement duration below.
          </SheetDescription>
        </SheetHeader>

        <Separator className="mb-5" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-8">
          {/* Client Section */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
              Client Information
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  value={client.name}
                  onChange={(e) =>
                    setClient({ ...client, name: e.target.value })
                  }
                  placeholder="Enter client name"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={client.address}
                  onChange={(e) =>
                    setClient({ ...client, address: e.target.value })
                  }
                  placeholder="Enter address"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="representative">Representative</Label>
                <Input
                  id="representative"
                  value={client.representative}
                  onChange={(e) =>
                    setClient({ ...client, representative: e.target.value })
                  }
                  placeholder="Representative name"
                />
              </div>
            </div>
          </section>

          {/* Agreement Section */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
              Agreement Duration
            </h3>

            {/* Agreement Date */}
            <div className="flex flex-col space-y-1.5">
              <Label>Agreement Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !agreement.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {agreement.date
                      ? format(agreement.date, "PPP")
                      : "Pick agreement date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Calendar
                    mode="single"
                    selected={agreement.date}
                    onSelect={(date) =>
                      date && setAgreement({ ...agreement, date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Duration Range */}
            <div className="mt-4 flex flex-col space-y-1.5">
              <Label>Duration Range</Label>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">
                  Select the start date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {agreement.start
                        ? format(agreement.start, "PPP")
                        : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 w-auto">
                    <Calendar
                      mode="single"
                      selected={agreement.start}
                      onSelect={(date) =>
                        date && setAgreement({ ...agreement, start: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <label className="text-sm text-muted-foreground">
                  Select the end date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {agreement.end
                        ? format(agreement.end, "PPP")
                        : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 w-auto">
                    <Calendar
                      mode="single"
                      selected={agreement.end}
                      onSelect={(date) =>
                        date && setAgreement({ ...agreement, end: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky footer with actions */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background px-4 py-3 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-1/2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="w-1/2 bg-[#1b1cfe] hover:bg-[#1516d9] text-white"
          >
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
