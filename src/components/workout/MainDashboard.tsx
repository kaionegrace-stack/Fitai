import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Calendar, TrendingUp, User, LogOut, Crown } from "lucide-react";
import { type UsersModel } from "@/sdk/database/orm/orm_users";
import { OverviewTab } from "./dashboard/OverviewTab";
import { CoursesTab } from "./dashboard/CoursesTab";
import { CalendarTab } from "./dashboard/CalendarTab";
import { ProgressTab } from "./dashboard/ProgressTab";
import { ProfileTab } from "./dashboard/ProfileTab";

interface MainDashboardProps {
	user: UsersModel;
	onLogout: () => void;
}

export function MainDashboard({ user, onLogout }: MainDashboardProps) {
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
			{/* Header */}
			<header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<h1 className="text-2xl font-bold text-white">FitAI</h1>
							{user.is_premium_user && (
								<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/30">
									<Crown className="h-4 w-4 text-yellow-500" />
									<span className="text-sm font-semibold text-yellow-500">Premium</span>
								</div>
							)}
						</div>
						<div className="flex items-center gap-4">
							<div className="hidden sm:block text-right">
								<div className="text-sm font-medium text-white">{user.username}</div>
								<div className="text-xs text-zinc-500">{user.email}</div>
							</div>
							<Button variant="outline" size="sm" onClick={onLogout}>
								<LogOut className="h-4 w-4 mr-2" />
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
						<TabsTrigger value="overview" className="flex items-center gap-2">
							<Home className="h-4 w-4" />
							<span className="hidden sm:inline">Overview</span>
						</TabsTrigger>
						<TabsTrigger value="courses" className="flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							<span className="hidden sm:inline">Courses</span>
						</TabsTrigger>
						<TabsTrigger value="calendar" className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							<span className="hidden sm:inline">Calendar</span>
						</TabsTrigger>
						<TabsTrigger value="progress" className="flex items-center gap-2">
							<TrendingUp className="h-4 w-4" />
							<span className="hidden sm:inline">Progress</span>
						</TabsTrigger>
						<TabsTrigger value="profile" className="flex items-center gap-2">
							<User className="h-4 w-4" />
							<span className="hidden sm:inline">Profile</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						<OverviewTab user={user} />
					</TabsContent>

					<TabsContent value="courses" className="space-y-6">
						<CoursesTab user={user} />
					</TabsContent>

					<TabsContent value="calendar" className="space-y-6">
						<CalendarTab user={user} />
					</TabsContent>

					<TabsContent value="progress" className="space-y-6">
						<ProgressTab user={user} />
					</TabsContent>

					<TabsContent value="profile" className="space-y-6">
						<ProfileTab user={user} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
