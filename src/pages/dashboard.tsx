import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { BreadcrumbsHeader } from "@/components/breadcrumbs-header"
import Navbar from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { TableOverview } from "@/components/table-overview"

const Dashboard = () => {
  const nav = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [selectedParentFolder, setSelectedParentFolder] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) nav("/sign-in");
  }, []);
  return (
    <div className="flex mt-16 h-full">
        <Navbar />
        <AppSidebar identifier={user?.username || user?.primaryEmailAddress?.emailAddress || "user"} selectedParentFolder={selectedParentFolder} setSelectedParentFolder={setSelectedParentFolder} />

        <div className="flex-1 h-full p-4">
          <BreadcrumbsHeader selectedParentFolder={selectedParentFolder} />

          <div className="flex justify-end gap-1">
            <Input placeholder="Search" className="w-xs" />
            <Button className="cursor-pointer rounded-full" variant="ghost" size="icon"><Search></Search></Button>
          </div>

          <TableOverview selectedParentFolder={selectedParentFolder} />
        </div>


    </div>
  )
}

export default Dashboard