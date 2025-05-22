import { useSidebar } from "@/components/ui/sidebar";
import { PanelRight } from "lucide-react";
import { Button } from "./ui/button";

export function CustomSidebarTrigger() {
	const { toggleSidebar } = useSidebar();

	return <Button className="rounded-full cursor-pointer" variant="outline" size="icon" onClick={toggleSidebar}><PanelRight size={20} /></Button>;
}
