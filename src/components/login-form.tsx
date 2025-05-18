import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { SignIn } from "@clerk/clerk-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<SignIn />
					
					<div className="bg-muted relative hidden md:block">
            
						<img
							src="https://picsum.photos/600/400"
							alt="Image"
							className="absolute inset-0 h-full w-full object-cover"
						/>
					</div>
				</CardContent>
			</Card>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
				and <a href="#">Privacy Policy</a>.
			</div>
		</div>
	);
}
