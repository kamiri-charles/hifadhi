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
	Pen,
	Trash,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { toggleTrashed } from "@/api/general";
import { useUser } from "@clerk/clerk-react";
import type { ItemType } from "@/db/schema";

interface FolderActionsDropdownProps {
	label: string;
	fileId: string;
	trashOpen?: boolean;
	parentId?: string | null;
	itemInstance?: ItemType;
	setRenameDialogOpen?: Dispatch<SetStateAction<boolean>>;
	setContextedItem?: Dispatch<SetStateAction<ItemType | null>>;
	setSidebarRefreshKey?: Dispatch<SetStateAction<number>>;
	setContentRefreshKey?: Dispatch<SetStateAction<number>>;
	setCurrentFolder?: Dispatch<SetStateAction<ItemType | null>>;
}

export function FolderActionsDropdown({
	label,
	fileId,
	trashOpen,
	parentId,
	itemInstance,
	setRenameDialogOpen,
	setContextedItem,
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
		<DropdownMenu onOpenChange={() => {
			if (itemInstance && setContextedItem) setContextedItem(itemInstance)
		}}>
			<DropdownMenuTrigger asChild>
				<SidebarMenuAction className="cursor-pointer">
					<EllipsisVertical />
				</SidebarMenuAction>
			</DropdownMenuTrigger>
			{!trashOpen ? (
				<DropdownMenuContent className="w-48">
					<DropdownMenuLabel>{label}</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={() => {
								if (setRenameDialogOpen) {
									requestAnimationFrame(() => setRenameDialogOpen(true));
								};
							}}
						>
							Rename
							<DropdownMenuShortcut>
								<Pen />
							</DropdownMenuShortcut>
						</DropdownMenuItem>

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
