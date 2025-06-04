import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "./ui/sidebar";
import {
	ArchiveRestore,
	ArrowDownToLine,
	EllipsisVertical,
	Loader2,
	Trash,
} from "lucide-react";
import { RenamePopover } from "./rename-popover";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { toggleTrashed } from "@/api/general";
import { useUser } from "@clerk/clerk-react";
import type { File } from "@/db/schema";

interface FolderActionsDropdownProps {
	label: string;
	fileId: string;
	currentName: string;
	trashOpen?: boolean;
	parentId?: string | null;
	setSidebarRefreshKey?: Dispatch<SetStateAction<number>>;
	setContentRefreshKey?: Dispatch<SetStateAction<number>>;
	setCurrentFolder?: Dispatch<SetStateAction<File | null>>;
}

export function FolderActionsDropdown({
	label,
	fileId,
	currentName,
	trashOpen,
	parentId,
	setSidebarRefreshKey,
	setContentRefreshKey,
	setCurrentFolder,
}: FolderActionsDropdownProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [isRestoring, setIsRestoring] = useState(false);
	const { user } = useUser();

	const handleDelete = async () => {
		if (!user?.id) return toast.error("User not authenticated.");

		setIsDeleting(true);
		try {
			await toggleTrashed({ userId: user.id, itemId: fileId });
			toast.success("Moved to trash.");
			if (setSidebarRefreshKey) setSidebarRefreshKey((k: number) => k + 1);
			if (setContentRefreshKey) setContentRefreshKey((k: number) => k + 1);
			if (setCurrentFolder) setCurrentFolder(null);
		} catch (err) {
			console.error(err);
			toast.error("Failed to delete file.");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleRestore = async () => {
		if (!user?.id) return toast.error("User not authenticated.");

		setIsRestoring(true);
		try {
			await toggleTrashed({ userId: user.id, itemId: fileId });
			toast.success("Restore successful");
			if (!parentId && setSidebarRefreshKey) setSidebarRefreshKey((k: number) => k + 1);
			if (setContentRefreshKey) setContentRefreshKey((k: number) => k + 1);
			if (setCurrentFolder) setCurrentFolder(null);
		} catch (err) {
			console.error(err);
			toast.error("Failed to restore file.");
		} finally {
			setIsRestoring(false);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuAction className="cursor-pointer">
					<EllipsisVertical />
				</SidebarMenuAction>
			</DropdownMenuTrigger>
			{!trashOpen ? (
				<DropdownMenuContent className="w-48">
					<DropdownMenuLabel>{label}</DropdownMenuLabel>
					<DropdownMenuGroup>
						<RenamePopover
							fileId={fileId}
							currentName={currentName}
							setSidebarRefreshKey={setSidebarRefreshKey}
							setContentRefreshKey={setContentRefreshKey}
						/>
						<DropdownMenuItem className="cursor-pointer">
							Download
							<DropdownMenuShortcut>
								<ArrowDownToLine />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							<span>{isDeleting ? "Deleting..." : "Delete"}</span>

							<DropdownMenuShortcut>
								{isDeleting ? <Loader2 className="animate-spin" /> : <Trash />}
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			) : (
				<DropdownMenuContent className="w-48">
					<DropdownMenuLabel>{label}</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={handleRestore}
							disabled={isRestoring}
						>
							Restore
							<DropdownMenuShortcut>
								<ArchiveRestore />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem
							className="cursor-pointer"
							disabled={isDeleting}
							variant="destructive"
						>
							<span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>

							<DropdownMenuShortcut>
								{isDeleting ? <Loader2 className="animate-spin" /> : <Trash />}
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			)}
		</DropdownMenu>
	);
}
