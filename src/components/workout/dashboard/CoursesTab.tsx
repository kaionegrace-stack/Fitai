import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Crown, Lock, Play } from "lucide-react";
import { type UsersModel } from "@/sdk/database/orm/orm_users";
import { WorkoutCoursesORM, WorkoutCoursesDifficulty, type WorkoutCoursesModel } from "@/sdk/database/orm/orm_workout_courses";
import { UserCourseProgressORM, type UserCourseProgressModel } from "@/sdk/database/orm/orm_user_course_progress";

interface CoursesTabProps {
	user: UsersModel;
}

const SAMPLE_COURSES = [
	{ title: "Beginner Full Body", difficulty: WorkoutCoursesDifficulty.Easy, isFree: true, isPremium: false, description: "Perfect for starting your fitness journey" },
	{ title: "30-Day Core Challenge", difficulty: WorkoutCoursesDifficulty.Medium, isFree: true, isPremium: false, description: "Build core strength in 30 days" },
	{ title: "Advanced Strength Program", difficulty: WorkoutCoursesDifficulty.Hard, isFree: false, isPremium: true, description: "Elite strength training protocol" },
	{ title: "HIIT Cardio Blast", difficulty: WorkoutCoursesDifficulty.Medium, isFree: false, isPremium: true, description: "High-intensity interval training" },
	{ title: "Flexibility & Mobility", difficulty: WorkoutCoursesDifficulty.Easy, isFree: false, isPremium: true, description: "Improve range of motion" },
];

export function CoursesTab({ user }: CoursesTabProps) {
	const [courses, setCourses] = useState<WorkoutCoursesModel[]>([]);
	const [userProgress, setUserProgress] = useState<Record<string, number>>({});

	useEffect(() => {
		loadCourses();
	}, []);

	async function loadCourses() {
		try {
			const coursesOrm = WorkoutCoursesORM.getInstance();
			let allCourses = await coursesOrm.getAllWorkoutCourses();

			if (allCourses.length === 0) {
				const newCourses = await coursesOrm.insertWorkoutCourses(
					SAMPLE_COURSES.map((course, index) => ({
						title: course.title,
						description: course.description,
						difficulty: course.difficulty,
						is_free: course.isFree,
						is_premium: course.isPremium,
						course_content: JSON.stringify({ weeks: 4, sessionsPerWeek: 3 }),
						order: index + 1,
					} as WorkoutCoursesModel))
				);
				allCourses = newCourses;
			}

			setCourses(allCourses);

			const progressOrm = UserCourseProgressORM.getInstance();
			const progress = await progressOrm.getAllUserCourseProgress();
			const userProg = progress.filter(p => p.user_id === user.id);
			const progressMap: Record<string, number> = {};
			userProg.forEach(p => {
				progressMap[p.course_id] = p.completion_percentage || 0;
			});
			setUserProgress(progressMap);
		} catch (error) {
			console.error("Error loading courses:", error);
		}
	}

	async function startCourse(courseId: string) {
		try {
			const progressOrm = UserCourseProgressORM.getInstance();
			await progressOrm.insertUserCourseProgress([{
				user_id: user.id,
				course_id: courseId,
				completion_percentage: 0,
				current_week: 1,
			} as unknown as UserCourseProgressModel]);
			loadCourses();
		} catch (error) {
			console.error("Error starting course:", error);
		}
	}

	const freeCourses = courses.filter(c => c.is_free);
	const premiumCourses = courses.filter(c => c.is_premium);

	const difficultyColors = {
		[WorkoutCoursesDifficulty.Easy]: "bg-green-500/10 text-green-500 border-green-500/20",
		[WorkoutCoursesDifficulty.Medium]: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
		[WorkoutCoursesDifficulty.Hard]: "bg-red-500/10 text-red-500 border-red-500/20",
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold text-white mb-2">Workout Courses</h2>
				<p className="text-zinc-400">Structured programs to achieve your fitness goals</p>
			</div>

			<div className="space-y-6">
				<div>
					<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
						<BookOpen className="h-5 w-5 text-green-500" />
						Free Courses
					</h3>
					<div className="grid md:grid-cols-2 gap-4">
						{freeCourses.map((course) => {
							const progress = userProgress[course.id] || 0;
							const isStarted = progress > 0;

							return (
								<Card key={course.id}>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<CardTitle className="text-lg">{course.title}</CardTitle>
												<CardDescription className="mt-1">{course.description}</CardDescription>
											</div>
											<Badge variant="outline" className={difficultyColors[course.difficulty as keyof typeof difficultyColors] || ""}>
												{course.difficulty === WorkoutCoursesDifficulty.Easy && "Beginner"}
												{course.difficulty === WorkoutCoursesDifficulty.Medium && "Intermediate"}
												{course.difficulty === WorkoutCoursesDifficulty.Hard && "Advanced"}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-3">
										{isStarted && (
											<div>
												<div className="flex items-center justify-between text-sm mb-2">
													<span className="text-zinc-400">Progress</span>
													<span className="font-semibold">{Math.round(progress)}%</span>
												</div>
												<Progress value={progress} className="h-2" />
											</div>
										)}
										<Button
											onClick={() => !isStarted && startCourse(course.id)}
											className="w-full"
											variant={isStarted ? "outline" : "default"}
										>
											{isStarted ? (
												<><Play className="mr-2 h-4 w-4" /> Continue</>
											) : (
												<><Play className="mr-2 h-4 w-4" /> Start Course</>
											)}
										</Button>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>

				<div>
					<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
						<Crown className="h-5 w-5 text-yellow-500" />
						Premium Courses
					</h3>
					<div className="grid md:grid-cols-2 gap-4">
						{premiumCourses.map((course) => {
							const progress = userProgress[course.id] || 0;
							const isStarted = progress > 0;
							const canAccess = user.is_premium_user;

							return (
								<Card key={course.id} className={!canAccess ? "opacity-60" : ""}>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<CardTitle className="text-lg flex items-center gap-2">
													{course.title}
													{!canAccess && <Lock className="h-4 w-4 text-zinc-500" />}
												</CardTitle>
												<CardDescription className="mt-1">{course.description}</CardDescription>
											</div>
											<Badge variant="outline" className={difficultyColors[course.difficulty as keyof typeof difficultyColors] || ""}>
												{course.difficulty === WorkoutCoursesDifficulty.Easy && "Beginner"}
												{course.difficulty === WorkoutCoursesDifficulty.Medium && "Intermediate"}
												{course.difficulty === WorkoutCoursesDifficulty.Hard && "Advanced"}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-3">
										{canAccess && isStarted && (
											<div>
												<div className="flex items-center justify-between text-sm mb-2">
													<span className="text-zinc-400">Progress</span>
													<span className="font-semibold">{Math.round(progress)}%</span>
												</div>
												<Progress value={progress} className="h-2" />
											</div>
										)}
										<Button
											onClick={() => canAccess && !isStarted && startCourse(course.id)}
											className="w-full"
											variant={canAccess ? (isStarted ? "outline" : "default") : "outline"}
											disabled={!canAccess}
										>
											{!canAccess ? (
												<><Lock className="mr-2 h-4 w-4" /> Premium Only</>
											) : isStarted ? (
												<><Play className="mr-2 h-4 w-4" /> Continue</>
											) : (
												<><Play className="mr-2 h-4 w-4" /> Start Course</>
											)}
										</Button>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
