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
import { ArrowDownToLine, EllipsisVertical, Pen, Trash } from "lucide-react";

interface FolderActionsDropdownProps {
    label: string;
}


export function FolderActionsDropdown({label}: FolderActionsDropdownProps) {
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
					<DropdownMenuItem className="cursor-pointer">
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
