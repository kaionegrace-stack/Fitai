import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Calendar, TrendingUp, Brain } from "lucide-react";
import { UsersORM, UsersSubscriptionTier, type UsersModel } from "@/sdk/database/orm/orm_users";

interface SubscriptionGateProps {
	user: UsersModel;
	onboardingData: { age?: number; goals?: string[]; experience?: string };
	onDecision: (upgraded: boolean) => void;
}

const PREMIUM_FEATURES = [
	{ icon: Brain, label: "AI-Personalized Workout Plans", description: "Custom plans based on your goals" },
	{ icon: Crown, label: "Full Course Library Access", description: "100+ premium workout programs" },
	{ icon: TrendingUp, label: "Advanced Progress Analytics", description: "Detailed insights and trends" },
	{ icon: Calendar, label: "Unlimited Workout Scheduling", description: "Plan your entire month" },
	{ icon: Sparkles, label: "Priority Support", description: "Get help when you need it" },
];

export function SubscriptionGate({ user, onboardingData, onDecision }: SubscriptionGateProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

	async function handleUpgrade() {
		setIsLoading(true);
		try {
			const usersOrm = UsersORM.getInstance();
			const updatedUser = {
				...user,
				is_premium_user: true,
				subscription_tier: selectedPlan === "yearly"
					? UsersSubscriptionTier.Gold
					: UsersSubscriptionTier.Silver,
			};
			await usersOrm.setUsersById(user.id, updatedUser);
			onDecision(true);
		} catch (error) {
			console.error("Upgrade error:", error);
		} finally {
			setIsLoading(false);
		}
	}

	function handleSkip() {
		onDecision(false);
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-4xl space-y-6">
				<div className="text-center space-y-4">
					<div className="flex justify-center">
						<div className="rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-3">
							<Sparkles className="h-8 w-8 text-white" />
						</div>
					</div>
					<h1 className="text-4xl font-bold text-white">
						Unlock Your AI-Powered Workout Plan
					</h1>
					<p className="text-xl text-zinc-400 max-w-2xl mx-auto">
						Based on your profile, we can create a personalized workout plan designed specifically for your goals
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-4">
					<Card
						className={`cursor-pointer transition-all ${
							selectedPlan === "monthly"
								? "ring-2 ring-blue-600 border-blue-600"
								: "hover:border-zinc-600"
						}`}
						onClick={() => setSelectedPlan("monthly")}
					>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Monthly</CardTitle>
								<Badge variant="outline">Popular</Badge>
							</div>
							<div className="text-3xl font-bold">$29<span className="text-lg text-zinc-500">/mo</span></div>
							<CardDescription>Perfect for getting started</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{PREMIUM_FEATURES.slice(0, 3).map((feature) => {
									const Icon = feature.icon;
									return (
										<div key={feature.label} className="flex items-start gap-2">
											<Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
											<div>
												<div className="text-sm font-medium">{feature.label}</div>
												<div className="text-xs text-zinc-500">{feature.description}</div>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>

					<Card
						className={`cursor-pointer transition-all relative ${
							selectedPlan === "yearly"
								? "ring-2 ring-purple-600 border-purple-600"
								: "hover:border-zinc-600"
						}`}
						onClick={() => setSelectedPlan("yearly")}
					>
						<div className="absolute -top-3 left-1/2 -translate-x-1/2">
							<Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
								Save 40%
							</Badge>
						</div>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Yearly</CardTitle>
								<Crown className="h-5 w-5 text-yellow-500" />
							</div>
							<div className="text-3xl font-bold">
								$179
								<span className="text-lg text-zinc-500">/year</span>
							</div>
							<CardDescription>Best value - $14.92/month</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{PREMIUM_FEATURES.map((feature) => {
									const Icon = feature.icon;
									return (
										<div key={feature.label} className="flex items-start gap-2">
											<Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
											<div>
												<div className="text-sm font-medium">{feature.label}</div>
												<div className="text-xs text-zinc-500">{feature.description}</div>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</div>

				<Card className="bg-blue-950/30 border-blue-900">
					<CardContent className="pt-6">
						<div className="flex items-start gap-4">
							<Brain className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
							<div>
								<h3 className="font-semibold text-lg mb-2">Your Personalized Plan Preview</h3>
								<p className="text-zinc-400 text-sm">
									Based on your profile (Age: ~{onboardingData.age}, Goals: {onboardingData.goals?.join(", ")},
									Experience: {onboardingData.experience}), our AI will create a custom {" "}
									{onboardingData.experience === "beginner" ? "foundational" :
									 onboardingData.experience === "advanced" ? "intensive" : "progressive"} program
									with progressive overload, recovery planning, and nutrition guidance.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="flex gap-3">
					<Button variant="outline" onClick={handleSkip} className="flex-1">
						Continue with Free
					</Button>
					<Button
						onClick={handleUpgrade}
						disabled={isLoading}
						className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
					>
						{isLoading ? "Processing..." : `Upgrade to ${selectedPlan === "yearly" ? "Yearly" : "Monthly"}`}
					</Button>
				</div>

				<p className="text-center text-xs text-zinc-500">
					This is a demo app. Payment processing not implemented. Clicking "Upgrade" will simulate a premium subscription.
				</p>
			</div>
		</div>
	);
}
