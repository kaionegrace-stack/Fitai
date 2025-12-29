import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, TrendingUp, Calendar, Award, Lock, Zap } from "lucide-react";
import { type UsersModel } from "@/sdk/database/orm/orm_users";
import { PersonalizedWorkoutPlansORM } from "@/sdk/database/orm/orm_personalized_workout_plans";
import { WorkoutSessionsORM } from "@/sdk/database/orm/orm_workout_sessions";
import { UserCourseProgressORM } from "@/sdk/database/orm/orm_user_course_progress";
import { AIWorkoutGenerator } from "../AIWorkoutGenerator";

interface OverviewTabProps {
	user: UsersModel;
}

export function OverviewTab({ user }: OverviewTabProps) {
	const [showAIGenerator, setShowAIGenerator] = useState(false);
	const [workoutPlan, setWorkoutPlan] = useState<any>(null);
	const [weeklyStats, setWeeklyStats] = useState({ completed: 0, total: 7 });
	const [courseProgress, setCourseProgress] = useState<any[]>([]);

	useEffect(() => {
		loadDashboardData();
	}, [user.id]);

	async function loadDashboardData() {
		try {
			const plansOrm = PersonalizedWorkoutPlansORM.getInstance();
			const plans = await plansOrm.getAllPersonalizedWorkoutPlans();
			const userPlans = plans.filter(p => p.user_id === user.id);
			if (userPlans.length > 0) {
				setWorkoutPlan(JSON.parse(userPlans[0].plan_data));
			}

			const sessionsOrm = WorkoutSessionsORM.getInstance();
			const now = new Date();
			const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			const sessions = await sessionsOrm.getAllWorkoutSessions();
			const userSessions = sessions.filter(s => s.user_id === user.id);
			const recentSessions = userSessions.filter(s => new Date(s.date) >= weekAgo);
			setWeeklyStats({ completed: recentSessions.length, total: 7 });

			const progressOrm = UserCourseProgressORM.getInstance();
			const progress = await progressOrm.getAllUserCourseProgress();
			const userProgress = progress.filter(p => p.user_id === user.id);
			setCourseProgress(userProgress.slice(0, 3));
		} catch (error) {
			console.error("Error loading dashboard data:", error);
		}
	}

	if (showAIGenerator && user.is_premium_user) {
		return <AIWorkoutGenerator user={user} onBack={() => setShowAIGenerator(false)} />;
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold text-white mb-2">
					Welcome back, {user.username}!
				</h2>
				<p className="text-zinc-400">
					{user.is_premium_user
						? "Your AI-powered fitness journey continues"
						: "Start your fitness journey today"}
				</p>
			</div>

			{/* AI Workout Plan Card */}
			<Card className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-blue-900">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Brain className="h-8 w-8 text-blue-500" />
							<div>
								<CardTitle className="text-xl">AI-Powered Workout Plan</CardTitle>
								<CardDescription>Personalized for your goals</CardDescription>
							</div>
						</div>
						{!user.is_premium_user && (
							<Lock className="h-5 w-5 text-zinc-500" />
						)}
					</div>
				</CardHeader>
				<CardContent>
					{user.is_premium_user ? (
						<div className="space-y-4">
							{workoutPlan ? (
								<div className="space-y-3">
									<div className="flex items-center gap-2 text-sm text-zinc-400">
										<Sparkles className="h-4 w-4 text-yellow-500" />
										<span>Custom plan generated based on your profile</span>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div className="bg-zinc-900/50 rounded-lg p-3">
											<div className="text-xs text-zinc-500 mb-1">Weekly Focus</div>
											<div className="text-sm font-semibold">{workoutPlan.weeklyFocus || "Progressive Training"}</div>
										</div>
										<div className="bg-zinc-900/50 rounded-lg p-3">
											<div className="text-xs text-zinc-500 mb-1">Intensity</div>
											<div className="text-sm font-semibold">{workoutPlan.intensity || "Moderate"}</div>
										</div>
									</div>
									<Button onClick={() => setShowAIGenerator(true)} className="w-full">
										<Zap className="mr-2 h-4 w-4" />
										View Full Plan
									</Button>
								</div>
							) : (
								<div className="text-center py-6">
									<p className="text-zinc-400 mb-4">No workout plan generated yet</p>
									<Button onClick={() => setShowAIGenerator(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
										<Brain className="mr-2 h-4 w-4" />
										Generate AI Workout Plan
									</Button>
								</div>
							)}
						</div>
					) : (
						<div className="text-center py-6">
							<Lock className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
							<p className="text-zinc-400 mb-4">
								Unlock AI-powered personalized workout plans with Premium
							</p>
							<Button variant="outline">
								Upgrade to Premium
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Stats Grid */}
			<div className="grid md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Calendar className="h-4 w-4 text-blue-500" />
							This Week
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold mb-2">{weeklyStats.completed}/{weeklyStats.total}</div>
						<Progress value={(weeklyStats.completed / weeklyStats.total) * 100} className="h-2" />
						<p className="text-xs text-zinc-500 mt-2">Workouts completed</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-green-500" />
							Streak
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold mb-2">
							{Math.min(weeklyStats.completed, 7)} days
						</div>
						<div className="flex gap-1">
							{Array.from({ length: 7 }).map((_, i) => (
								<div
									key={i}
									className={`h-2 flex-1 rounded-full ${
										i < weeklyStats.completed ? "bg-green-500" : "bg-zinc-800"
									}`}
								/>
							))}
						</div>
						<p className="text-xs text-zinc-500 mt-2">Keep it up!</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Award className="h-4 w-4 text-yellow-500" />
							Achievements
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold mb-2">{courseProgress.length}</div>
						<div className="text-xs text-zinc-500">Courses in progress</div>
					</CardContent>
				</Card>
			</div>

			{/* Active Courses */}
			{courseProgress.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Continue Your Journey</CardTitle>
						<CardDescription>Pick up where you left off</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{courseProgress.map((progress) => (
							<div key={progress.id} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
								<div className="flex-1">
									<div className="font-medium mb-1">Course #{progress.course_id.slice(0, 8)}</div>
									<Progress value={parseFloat(progress.completion_percentage)} className="h-2" />
								</div>
								<div className="text-sm text-zinc-500">
									{Math.round(parseFloat(progress.completion_percentage))}%
								</div>
								<Button size="sm">Continue</Button>
							</div>
						))}
					</CardContent>
				</Card>
			)}

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-2 gap-3">
					<Button variant="outline" className="justify-start">
						<Calendar className="mr-2 h-4 w-4" />
						Schedule Workout
					</Button>
					<Button variant="outline" className="justify-start">
						<TrendingUp className="mr-2 h-4 w-4" />
						Log Progress
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
