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
import { ArrowDownToLine, EllipsisVertical, Trash } from "lucide-react";
import { RenamePopover } from "./rename-popover";

interface FolderActionsDropdownProps {
    label: string;
	fileId: string;
	currentName: string;
}

export function FolderActionsDropdown({label, fileId, currentName}: FolderActionsDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuAction className="cursor-pointer">
					<EllipsisVertical />
				</SidebarMenuAction>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48">
				<DropdownMenuLabel>{label}</DropdownMenuLabel>
				<DropdownMenuGroup>
					<RenamePopover fileId={fileId} currentName={currentName} />
					<DropdownMenuItem className="cursor-pointer">
						Download
						<DropdownMenuShortcut>
							<ArrowDownToLine />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer">
						Delete
						<DropdownMenuShortcut>
							<Trash />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
