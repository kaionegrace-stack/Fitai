import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar as CalendarIcon, Check } from "lucide-react";
import { type UsersModel } from "@/sdk/database/orm/orm_users";
import { ScheduledWorkoutsORM, type ScheduledWorkoutsModel } from "@/sdk/database/orm/orm_scheduled_workouts";

interface CalendarTabProps {
	user: UsersModel;
}

export function CalendarTab({ user }: CalendarTabProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
	const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkoutsModel[]>([]);

	useEffect(() => {
		loadSchedule();
	}, []);

	async function loadSchedule() {
		try {
			const scheduledOrm = ScheduledWorkoutsORM.getInstance();
			const workouts = await scheduledOrm.getAllScheduledWorkouts();
			const userWorkouts = workouts.filter(w => w.user_id === user.id);
			setScheduledWorkouts(userWorkouts);
		} catch (error) {
			console.error("Error loading schedule:", error);
		}
	}

	async function addWorkout() {
		if (!selectedDate) return;
		try {
			const scheduledOrm = ScheduledWorkoutsORM.getInstance();
			await scheduledOrm.insertScheduledWorkouts([{
				user_id: user.id,
				scheduled_date: selectedDate.toISOString().split('T')[0],
				workout_type: "Custom Workout",
				is_completed: false,
				reminder_sent: false,
			} as ScheduledWorkoutsModel]);
			loadSchedule();
		} catch (error) {
			console.error("Error adding workout:", error);
		}
	}

	async function toggleComplete(workoutId: string, currentStatus: boolean) {
		try {
			const scheduledOrm = ScheduledWorkoutsORM.getInstance();
			const workouts = await scheduledOrm.getScheduledWorkoutsById(workoutId);
			if (workouts.length > 0) {
				const workout = workouts[0];
				await scheduledOrm.setScheduledWorkoutsById(workoutId, {
					...workout,
					is_completed: !currentStatus,
				});
				loadSchedule();
			}
		} catch (error) {
			console.error("Error toggling workout:", error);
		}
	}

	const selectedDateWorkouts = scheduledWorkouts.filter(
		w => selectedDate && w.scheduled_date === selectedDate.toISOString().split('T')[0]
	);

	const workoutDates = scheduledWorkouts.map(w => new Date(w.scheduled_date));

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold text-white mb-2">Workout Calendar</h2>
				<p className="text-zinc-400">Schedule and track your workouts</p>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Calendar</CardTitle>
						<CardDescription>Select a date to view or schedule workouts</CardDescription>
					</CardHeader>
					<CardContent className="flex justify-center">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={setSelectedDate}
							className="rounded-md border"
							modifiers={{
								scheduled: workoutDates,
							}}
							modifiersClassNames={{
								scheduled: "bg-blue-500/20 font-bold",
							}}
						/>
					</CardContent>
				</Card>

				<div className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>
										{selectedDate?.toLocaleDateString('en-US', {
											weekday: 'long',
											month: 'long',
											day: 'numeric'
										})}
									</CardTitle>
									<CardDescription>
										{selectedDateWorkouts.length} workout{selectedDateWorkouts.length !== 1 ? 's' : ''} scheduled
									</CardDescription>
								</div>
								<Button onClick={addWorkout} size="sm">
									<CalendarIcon className="mr-2 h-4 w-4" />
									Add Workout
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							{selectedDateWorkouts.length === 0 ? (
								<div className="text-center py-8 text-zinc-500">
									<CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
									<p>No workouts scheduled for this day</p>
								</div>
							) : (
								selectedDateWorkouts.map((workout) => (
									<div
										key={workout.id}
										className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
									>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => toggleComplete(workout.id, workout.is_completed)}
											className={workout.is_completed ? "text-green-500" : "text-zinc-500"}
										>
											<Check className="h-5 w-5" />
										</Button>
										<div className="flex-1">
											<div className={`font-medium ${workout.is_completed ? "line-through text-zinc-500" : ""}`}>
												{workout.workout_type}
											</div>
										</div>
										{workout.is_completed && (
											<Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
												Completed
											</Badge>
										)}
									</div>
								))
							)}
						</CardContent>
					</Card>

					<Card className="bg-blue-950/20 border-blue-900">
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Bell className="h-4 w-4" />
								Workout Reminders
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-zinc-400">
								Browser notifications for scheduled workouts are enabled. You'll receive reminders 30 minutes before each workout.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
