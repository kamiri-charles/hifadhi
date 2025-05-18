import { useEffect } from "react"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { BreadcrumbsHeader } from "@/components/breadcrumbs-header"
import Navbar from "@/components/navbar"

const Dashboard = () => {
  const nav = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isSignedIn) nav("/sign-in");
  }, []);
  return (
    <div className="flex mt-16 h-full">
        <Navbar />
        <AppSidebar identifier={user?.username || user?.primaryEmailAddress?.emailAddress || "user"} />

        <div className="flex-1 h-full p-4">
          <BreadcrumbsHeader />
        </div>


    </div>
  )
}

export default Dashboard