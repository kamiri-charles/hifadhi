import { Folder, MoreHorizontal } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

// Menu items.
const items = [
	{
		title: "Folder 1",
		icon: Folder,
	},
	
];

export function AppSidebar() {
	return (
		<Sidebar className="mt-16" collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>username</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
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
                                                <span>Edit Project</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <span>Delete Project</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
									
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
