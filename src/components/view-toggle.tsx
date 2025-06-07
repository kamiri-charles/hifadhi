import { LayoutDashboard, Table2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Dispatch, SetStateAction } from "react";

interface ViewToggleProps {
	view: string;
	setView: Dispatch<SetStateAction<string>>;
}

export function ViewToggle({ view, setView }: ViewToggleProps) {
	return (
		<ToggleGroup variant="outline" type="single">
			<ToggleGroupItem
				value="table"
				aria-label="Toggle table view"
				className={`${view == "table" ? "bg-accent " : ""}cursor-pointer`}
				onClick={() => setView("table")}
			>
				<Table2 />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="flex"
				aria-label="Toggle flex view"
				className={`${view == "flex" ? "bg-accent " : ""}cursor-pointer`}
				onClick={() => setView("flex")}
			>
				<LayoutDashboard />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
