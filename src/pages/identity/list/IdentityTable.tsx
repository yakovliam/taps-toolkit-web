import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Ban,
  Check,
  ChevronDown,
  CirclePlus,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Identity } from "@/gen";
import { useNavigate } from "react-router";
import { useState } from "react";

const formatCentsToDollars = (cents: number) =>
  (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

type IdentityTableProps = {
  data: Identity[];
};

const IdentityTable = ({ data }: IdentityTableProps) => {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Identity>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "uid",
      header: "UID",
      cell: ({ row }) => (
        <Button
          variant={"link"}
          className="m-0 p-0"
          onClick={() => {
            navigate(`/identity/${row.original.id}`);
          }}
        >
          {row.getValue("uid")}
          <ExternalLink />
        </Button>
      ),
    },
    {
      accessorKey: "usdBalance",
      header: "USD Balance",
      cell: ({ row }) => (
        <div>{formatCentsToDollars(row.getValue("usdBalance"))}</div>
      ),
    },
    {
      accessorKey: "gemsBalance",
      header: "Gems Balance",
      cell: ({ row }) => <div>{row.getValue("gemsBalance")}</div>,
    },
    {
      accessorKey: "banned",
      header: "Banned",
      cell: ({ row }) => (
        <div>
          {row.getValue("banned") ? (
            <Badge variant="destructive">
              Banned
              <Ban className="ml-2 h-4 w-4" />
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-300 text-green-800">
              Not banned
              <Check className="ml-2 h-4 w-4" />
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "deleted",
      header: "Deleted",
      cell: ({ row }) => <div>{row.getValue("deleted") ? "Yes" : "No"}</div>,
    },
    {
      accessorKey: "deviceUid",
      header: "Device UID",
      cell: ({ row }) => (
        <Button
          variant={"link"}
          className="m-0 p-0"
          onClick={() => {
            navigate(`/device/${row.getValue("deviceUid")}`);
          }}
        >
          {row.getValue("deviceUid")}
          <ExternalLink />
        </Button>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {}}>Cash out</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/identity/${row.original.id}/elo`);
                }}
              >
                Calculate ELO
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex space-between items-center py-4">
        <div className="w-full">
          <Input
            placeholder="Filter by uid"
            value={(table.getColumn("uid")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("uid")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="ml-auto"
            onClick={() => {
              navigate("/identity/import");
            }}
          >
            Import Identity <CirclePlus />
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IdentityTable;
