import { Folder, MoreHorizontal, Plus } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";

// Menu items.
const items = [
	{title: "New Folder", icon: Folder}
	
];

interface AppSidebarProps {
	identifier: string
}

export function AppSidebar({identifier}: AppSidebarProps) {
	return (
		<Sidebar className="mt-16" collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{identifier}</SidebarGroupLabel>
					<SidebarGroupAction title="New Folder">
						<Plus /> <span className="sr-only">New Folder</span>
					</SidebarGroupAction>
					<SidebarGroupContent>
						{items.length > 0 ? (
							<SidebarMenu>
								{items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive>
											<div>
												<item.icon />
												<span>{item.title}</span>
											</div>
										</SidebarMenuButton>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<SidebarMenuAction>
													<MoreHorizontal />
												</SidebarMenuAction>
											</DropdownMenuTrigger>
											<DropdownMenuContent side="right" align="start">
												<DropdownMenuItem>
													<span>Rename</span>
												</DropdownMenuItem>
												<DropdownMenuItem>
													<span>Delete</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						) : (
							<div className="flex flex-col items-center justify-center gap-2 mt-40">
								<span>Folder? I hardly know her!</span>
								<Button className="bg-indigo-800 text-white py-2 cursor-pointer hover:bg-blue-600">
									New Folder
								</Button>
							</div>
						)}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
