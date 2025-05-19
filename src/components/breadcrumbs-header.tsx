import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { File } from "@/db/schema";

interface BreadcrumbsHeaderProps {
  selectedRootFolder: File | null,
}

export function BreadcrumbsHeader({selectedRootFolder}: BreadcrumbsHeaderProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <span>{selectedRootFolder? selectedRootFolder.name: "/"}</span>
        </BreadcrumbItem>
        {/* <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
