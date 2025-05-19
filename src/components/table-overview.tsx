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
	Loader2,
	Trash,
} from "lucide-react";
import { Button } from "./ui/button";
import { db_offline_placeholders, empty_folder_placeholders, fetch_success_placeholders, loading_placeholders } from "@/assets/punny_placeholders";
import type { File } from "@/db/schema";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getFilesAndFolders } from "@/api/folders";
import { toast } from "sonner";
import { useRandomPlaceholder } from "@/hooks/useRandomPlaceholder";


interface TableOverviewProps {
	selectedRootFolder: File | null;
}

export function TableOverview({ selectedRootFolder }: TableOverviewProps) {
	const [filesAndFolders, setFilesAndFolders] = useState<File[]>([]);
	const [loading, setLoading] = useState(true);
	const {user, isLoaded} = useUser();
	const emptyFolderPlaceholder = useRandomPlaceholder(empty_folder_placeholders, [selectedRootFolder?.id]);


	const fetchChildren = useCallback(async () => {
		console.log("Fetching children")
		if (!user?.id) return;
		setLoading(true);

		try {
			const userId = user.id;
			console.log(selectedRootFolder?.id);
			const children = await getFilesAndFolders({ userId, parentFolderId: selectedRootFolder?.id }); // Bug - Sometimes fetches the root folders
			setFilesAndFolders(children);
			toast("Fetch successful", {
				description: fetch_success_placeholders[Math.floor(Math.random() * fetch_success_placeholders.length)],
			});

		} catch (error) {
			console.error("Error getting files:", error);
			toast("There was an error getting your files", {
				description:
					db_offline_placeholders[Math.floor(Math.random() * db_offline_placeholders.length)],
				action: {
					label: "Try Again",
					onClick: fetchChildren,
				},
			});
		} finally {
			setLoading(false);
		}
	}, [user?.id, selectedRootFolder?.id]);

	useEffect(() => {
		if (!isLoaded || !user?.id) return;

		if (selectedRootFolder) fetchChildren();

	}, [isLoaded, user?.id, selectedRootFolder, fetchChildren]);

	if (!selectedRootFolder) {
		return (
			<div className="font-medium mt-40 text-center">
				Fold me once, shame on you. Fold me twice—well, just pick a folder
				already!
			</div>
		);
	}

	// Loading
	if (selectedRootFolder && loading) {
		return (
			<div className="flex flex-col items-center mt-40 text-center gap-2 font-medium">
				<Loader2 size={30} className="animate-spin" />
				<span>{loading_placeholders[Math.floor(Math.random() * loading_placeholders.length)]}</span>
			</div>
		)
	}

	// Empty folder
	if (selectedRootFolder && !loading && filesAndFolders.length === 0) {
		return (
			<div className="font-medium mt-40 text-center">{emptyFolderPlaceholder}</div>
		);
	}

	// Content
	if (selectedRootFolder && !loading && filesAndFolders.length > 0) {
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
					{filesAndFolders.map((data) => (
						<TableRow key={data.name}>
							<TableCell className="flex items-center gap-2">
								<Folder />
								{data.name}
							</TableCell>
							<TableCell>{data.type}</TableCell>
							<TableCell>{data.createdAt.toISOString()}</TableCell>
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
}
