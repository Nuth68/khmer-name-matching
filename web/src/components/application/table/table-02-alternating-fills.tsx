import { useMemo, useState } from "react";

import type { SortDescriptor } from "react-aria-components";
import customers from "@/components/application/table/customers.json";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { DropdownIconSimple } from "@/components/base/dropdown/dropdown-icon-simple";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";

export const Table02AlternatingFills = () => {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });

  const sortedItems = useMemo(() => {
    return [...customers.items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];

      // Compare numbers or booleans
      if (
        (typeof first === "number" && typeof second === "number") ||
        (typeof first === "boolean" && typeof second === "boolean")
      ) {
        return sortDescriptor.direction === "descending"
          ? (second as number) - (first as number)
          : (first as number) - (second as number);
      }

      // Compare strings
      if (typeof first === "string" && typeof second === "string") {
        let cmp = first.localeCompare(second);
        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }
        return cmp;
      }

      return 0;
    });
  }, [sortDescriptor]);

  return (
    <TableCard.Root>
      <TableCard.Header
        title="Customers"
        description="These companies have purchased in the last 12 months."
        contentTrailing={
          <div className="absolute top-5 right-4 md:right-6">
            <DropdownIconSimple />
          </div>
        }
      />
      <Table
        aria-label="Team members"
        selectionMode="none"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <Table.Header className="bg-primary">
          <Table.Head id="name" label="Company" isRowHeader allowsSorting />
          <Table.Head id="status" label="Status" allowsSorting />
          <Table.Head id="aboutTitle" label="About" allowsSorting />
          <Table.Head id="users" label="Users" className="md:hidden xl:table-cell" />
          <Table.Head id="licenseUse" label="License use" allowsSorting className="min-w-55" />
          <Table.Head id="actions" />
        </Table.Header>
        <Table.Body items={sortedItems}>
          {(item) => (
            <Table.Row id={item.name} key={item.name} className="odd:bg-secondary">
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <Avatar src={item.logoUrl} alt={item.name} size="md" />
                  <div className="whitespace-nowrap">
                    <p className="text-sm font-medium text-primary">{item.name}</p>
                    <p className="text-sm text-tertiary">{item.website}</p>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <BadgeWithDot
                  size="sm"
                  color={item.status === "Customer" ? "success" : "gray"}
                  type="modern"
                >
                  {item.status}
                </BadgeWithDot>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap">
                <p className="text-sm font-medium text-primary">{item.aboutTitle}</p>
                <p className="text-sm text-tertiary">{item.aboutDescription}</p>
              </Table.Cell>
              <Table.Cell className="pr-0 md:hidden xl:table-cell">
                <div className="flex -space-x-1">
                  <Avatar
                    className="ring-[1.5px] ring-bg-primary"
                    size="xs"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="Olivia Rhye"
                  />
                  <Avatar
                    className="ring-[1.5px] ring-bg-primary"
                    size="xs"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Phoenix Baker"
                  />
                  <Avatar
                    className="ring-[1.5px] ring-bg-primary"
                    size="xs"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
                    alt="Lana Steiner"
                  />
                  <Avatar
                    className="ring-[1.5px] ring-bg-primary"
                    size="xs"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Demi Wilkinson"
                  />
                  <Avatar
                    className="ring-[1.5px] ring-bg-primary"
                    size="xs"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                    alt="Candice Wu"
                  />
                  <Avatar
                    size="xs"
                    className="ring-[1.5px] ring-bg-primary"
                    placeholder={<span className="text-xs font-semibold text-quaternary">+5</span>}
                  />
                </div>
              </Table.Cell>
              <Table.Cell>
                <ProgressBar labelPosition="right" value={item.licenseUse} />
              </Table.Cell>
              <Table.Cell className="px-4">
                <div className="flex items-center justify-end">
                  <DropdownIconSimple />
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableCard.Root>
  );
};

export default Table02AlternatingFills;
