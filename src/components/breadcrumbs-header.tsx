import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { File } from "@/db/schema";
import type { Dispatch, SetStateAction } from "react";

interface BreadcrumbsHeaderProps {
  folderTrail: File[];
  setCurrentFolder: Dispatch<SetStateAction<File | null>>;
}

export function BreadcrumbsHeader({folderTrail, setCurrentFolder}: BreadcrumbsHeaderProps) {
  return (
		<Breadcrumb>
			<BreadcrumbList>
				{folderTrail.map((folder, index) => (
					<BreadcrumbItem key={folder.id}>
						{index < folderTrail.length - 1 ? (
							<>
								<BreadcrumbLink onClick={() => setCurrentFolder(folder)} href="#">{folder.name}</BreadcrumbLink>
								<BreadcrumbSeparator />
							</>
						) : (
							<BreadcrumbPage>{folder.name}</BreadcrumbPage>
						)}
					</BreadcrumbItem>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
