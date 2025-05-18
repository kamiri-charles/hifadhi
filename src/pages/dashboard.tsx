import { AppSidebar } from "@/components/app-sidebar"
import { BreadcrumbsHeader } from "@/components/breadcrumbs-header"
import Navbar from "@/components/navbar"

const Dashboard = () => {
  return (
    <div className="flex mt-16 h-full">
        <Navbar />
        <AppSidebar />

        <div className="flex-1 h-full p-4">
          <BreadcrumbsHeader />
        </div>


    </div>
  )
}

export default Dashboard