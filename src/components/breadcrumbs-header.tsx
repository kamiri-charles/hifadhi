import { type Dispatch, type SetStateAction } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ItemType } from "@/db/schema";

interface BreadcrumbsHeaderProps {
	trail: ItemType[];
	trashOpen: boolean;
	setCurrentFolder: Dispatch<SetStateAction<ItemType | null>>;
}

export function BreadcrumbsHeader({
	trail,
	trashOpen,
	setCurrentFolder,
}: BreadcrumbsHeaderProps) {

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{trashOpen ? (
					<BreadcrumbItem>
						<BreadcrumbPage>Trash</BreadcrumbPage>
					</BreadcrumbItem>
				) : (
					trail.map((folder, index) => (
						<BreadcrumbItem key={folder.id}>
							{index < trail.length - 1 ? (
								<>
									<BreadcrumbLink
										onClick={() => setCurrentFolder(folder)}
										className="cursor-pointer"
									>
										{folder.name}
									</BreadcrumbLink>
									<BreadcrumbSeparator />
								</>
							) : (
								<BreadcrumbPage>{folder.name}</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					))
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
