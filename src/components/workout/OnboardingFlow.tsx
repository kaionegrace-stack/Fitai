import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Target, Zap, TrendingUp } from "lucide-react";
import { UsersORM, UsersExperienceLevel, type UsersModel } from "@/sdk/database/orm/orm_users";

interface OnboardingFlowProps {
	user: UsersModel;
	onComplete: (data: { age?: number; goals?: string[]; experience?: string }) => void;
}

const FITNESS_GOALS = [
	{ id: "strength", label: "Build Strength", icon: TrendingUp },
	{ id: "cardio", label: "Improve Cardio", icon: Zap },
	{ id: "flexibility", label: "Increase Flexibility", icon: Target },
	{ id: "fatLoss", label: "Lose Fat", icon: Target },
	{ id: "health", label: "Overall Health", icon: Target },
];

const AGE_RANGES = [
	{ value: "18-25", label: "18-25 years" },
	{ value: "26-35", label: "26-35 years" },
	{ value: "36-45", label: "36-45 years" },
	{ value: "46-55", label: "46-55 years" },
	{ value: "56+", label: "56+ years" },
];

const EXPERIENCE_LEVELS = [
	{ value: "beginner", label: "Beginner", description: "New to fitness" },
	{ value: "intermediate", label: "Intermediate", description: "Some experience" },
	{ value: "advanced", label: "Advanced", description: "Experienced athlete" },
];

export function OnboardingFlow({ user, onComplete }: OnboardingFlowProps) {
	const [step, setStep] = useState(1);
	const [ageRange, setAgeRange] = useState("");
	const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
	const [experience, setExperience] = useState("");

	function handleGoalToggle(goalId: string) {
		setSelectedGoals((prev) =>
			prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
		);
	}

	async function handleComplete() {
		try {
			const usersOrm = UsersORM.getInstance();

			let experienceLevel = UsersExperienceLevel.Beginner;
			if (experience === "intermediate") experienceLevel = UsersExperienceLevel.Intermediate;
			if (experience === "advanced") experienceLevel = UsersExperienceLevel.Advanced;

			const updatedUser = {
				...user,
				age: parseInt(ageRange.split("-")[0]) || 25,
				fitness_goals: selectedGoals,
				experience_level: experienceLevel,
			};

			await usersOrm.setUsersById(user.id, updatedUser);

			onComplete({
				age: updatedUser.age,
				goals: selectedGoals,
				experience,
			});
		} catch (error) {
			console.error("Error updating user profile:", error);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<div className="flex items-center justify-between mb-2">
						<div className="text-sm text-zinc-500">Step {step} of 3</div>
						<div className="flex gap-2">
							{[1, 2, 3].map((s) => (
								<div
									key={s}
									className={`h-2 w-12 rounded-full ${
										s <= step ? "bg-blue-600" : "bg-zinc-700"
									}`}
								/>
							))}
						</div>
					</div>
					<CardTitle className="text-2xl">
						{step === 1 && "What's your age range?"}
						{step === 2 && "What are your fitness goals?"}
						{step === 3 && "What's your experience level?"}
					</CardTitle>
					<CardDescription>
						{step === 1 && "Help us personalize your workout plan"}
						{step === 2 && "Select all that apply"}
						{step === 3 && "We'll match the intensity to your level"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{step === 1 && (
						<RadioGroup value={ageRange} onValueChange={setAgeRange}>
							<div className="space-y-3">
								{AGE_RANGES.map((range) => (
									<div key={range.value} className="flex items-center space-x-3">
										<RadioGroupItem value={range.value} id={range.value} />
										<Label htmlFor={range.value} className="flex-1 cursor-pointer">
											{range.label}
										</Label>
									</div>
								))}
							</div>
						</RadioGroup>
					)}

					{step === 2 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{FITNESS_GOALS.map((goal) => {
								const Icon = goal.icon;
								return (
									<div
										key={goal.id}
										onClick={() => handleGoalToggle(goal.id)}
										className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
											selectedGoals.includes(goal.id)
												? "border-blue-600 bg-blue-600/10"
												: "border-zinc-700 hover:border-zinc-600"
										}`}
									>
										<Checkbox
											checked={selectedGoals.includes(goal.id)}
											onCheckedChange={() => handleGoalToggle(goal.id)}
										/>
										<Icon className="h-5 w-5 text-blue-500" />
										<Label className="flex-1 cursor-pointer">{goal.label}</Label>
									</div>
								);
							})}
						</div>
					)}

					{step === 3 && (
						<RadioGroup value={experience} onValueChange={setExperience}>
							<div className="space-y-3">
								{EXPERIENCE_LEVELS.map((level) => (
									<div
										key={level.value}
										className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
											experience === level.value
												? "border-blue-600 bg-blue-600/10"
												: "border-zinc-700 hover:border-zinc-600"
										}`}
										onClick={() => setExperience(level.value)}
									>
										<RadioGroupItem value={level.value} id={level.value} className="mt-1" />
										<div className="flex-1">
											<Label htmlFor={level.value} className="cursor-pointer font-semibold">
												{level.label}
											</Label>
											<p className="text-sm text-zinc-500 mt-1">{level.description}</p>
										</div>
									</div>
								))}
							</div>
						</RadioGroup>
					)}

					<div className="flex gap-3 pt-4">
						{step > 1 && (
							<Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
								Back
							</Button>
						)}
						{step < 3 ? (
							<Button
								onClick={() => setStep(step + 1)}
								disabled={
									(step === 1 && !ageRange) ||
									(step === 2 && selectedGoals.length === 0)
								}
								className="flex-1"
							>
								Continue
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						) : (
							<Button
								onClick={handleComplete}
								disabled={!experience}
								className="flex-1"
							>
								Complete Setup
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
