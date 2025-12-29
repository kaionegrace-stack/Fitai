import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Target } from "lucide-react";
import { type UsersModel } from "@/sdk/database/orm/orm_users";

interface ProgressTabProps {
	user: UsersModel;
}

export function ProgressTab({ user }: ProgressTabProps) {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold text-white mb-2">Progress & Analytics</h2>
				<p className="text-zinc-400">Track your fitness journey</p>
			</div>

			<div className="grid md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Activity className="h-4 w-4 text-blue-500" />
							Total Workouts
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0</div>
						<p className="text-xs text-zinc-500 mt-1">All time</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-green-500" />
							Consistency
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0%</div>
						<p className="text-xs text-zinc-500 mt-1">This month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Target className="h-4 w-4 text-purple-500" />
							Goals Met
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0</div>
						<p className="text-xs text-zinc-500 mt-1">This week</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Progress Analytics</CardTitle>
					<CardDescription>Start logging workouts to see your progress</CardDescription>
				</CardHeader>
				<CardContent className="text-center py-12">
					<Activity className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
					<p className="text-zinc-400">No workout data yet. Complete your first workout to start tracking progress!</p>
				</CardContent>
			</Card>
		</div>
	);
}
