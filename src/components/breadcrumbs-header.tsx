import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { File } from "@/db/schema";
import { type Dispatch, type SetStateAction } from "react";

interface BreadcrumbsHeaderProps {
	folderTrail: File[];
	setCurrentFolder: Dispatch<SetStateAction<File | null>>;
	trashOpen: boolean;
}

export function BreadcrumbsHeader({
	folderTrail,
	setCurrentFolder,
	trashOpen,
}: BreadcrumbsHeaderProps) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{trashOpen ? (
					<BreadcrumbItem>
						<BreadcrumbPage>Trash</BreadcrumbPage>
					</BreadcrumbItem>
				) : (
					folderTrail.map((folder, index) => (
						<BreadcrumbItem key={folder.id}>
							{index < folderTrail.length - 1 ? (
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
