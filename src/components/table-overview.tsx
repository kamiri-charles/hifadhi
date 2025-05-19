import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Download,
	EllipsisVertical,
	Folder,
	Trash,
} from "lucide-react";
import { Button } from "./ui/button";

const testData = [
	{
    name: "Sub Folder 1",
    type: "folder",
    created: "1/1/2025",
    size: "0kb",
  },
];

interface TableOverviewProps {
	selectedRootFolderId: string | null;
}

export function TableOverview({ selectedRootFolderId }: TableOverviewProps) {
	if (selectedRootFolderId && testData.length > 0) {
		return (
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[200px]">Name</TableHead>
						<TableHead className="w-[100px]">Type</TableHead>
						<TableHead className="w-[100px]">Created</TableHead>
						<TableHead>Size</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{testData.map((data) => (
						<TableRow key={data.name}>
							<TableCell className="flex items-center gap-2">
								<Folder />
								{data.name}
							</TableCell>
							<TableCell>{data.type}</TableCell>
							<TableCell>{data.created}</TableCell>
							<TableCell>{data.size}</TableCell>
							<TableCell className="text-right">
								<Button
									className="rounded-full cursor-pointer"
									variant="ghost"
									size="icon"
								>
									<Download />
								</Button>
								<Button
									className="rounded-full cursor-pointer"
									variant="ghost"
									size="icon"
								>
									<Trash />
								</Button>
								<Button
									className="rounded-full cursor-pointer"
									variant="ghost"
									size="icon"
								>
									<EllipsisVertical />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}

	if (selectedRootFolderId && testData.length === 0) {
		return (
			<div className="font-medium mt-20 text-center">
				This folder is running on pure potential energy.
			</div>
		);
	}

	if (!selectedRootFolderId) {
		return (
			<div className="font-medium mt-40 text-center">
				Fold me once, shame on you. Fold me twice—well, just pick a folder
				already!
			</div>
		);
	}
}
