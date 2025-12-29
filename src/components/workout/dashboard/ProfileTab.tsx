import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Crown, Target, Zap } from "lucide-react";
import { type UsersModel, UsersExperienceLevel, UsersSubscriptionTier } from "@/sdk/database/orm/orm_users";

interface ProfileTabProps {
	user: UsersModel;
}

export function ProfileTab({ user }: ProfileTabProps) {
	const experienceLabels = {
		[UsersExperienceLevel.Beginner]: "Beginner",
		[UsersExperienceLevel.Intermediate]: "Intermediate",
		[UsersExperienceLevel.Advanced]: "Advanced",
	};

	const tierLabels = {
		[UsersSubscriptionTier.Free]: "Free",
		[UsersSubscriptionTier.Silver]: "Silver",
		[UsersSubscriptionTier.Gold]: "Gold",
		[UsersSubscriptionTier.Platinum]: "Platinum",
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold text-white mb-2">Profile</h2>
				<p className="text-zinc-400">Your fitness profile and preferences</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Account Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<div className="text-sm text-zinc-500 mb-1">Username</div>
							<div className="font-medium">{user.username}</div>
						</div>
						<div>
							<div className="text-sm text-zinc-500 mb-1">Email</div>
							<div className="font-medium">{user.email}</div>
						</div>
						<div>
							<div className="text-sm text-zinc-500 mb-1">Age</div>
							<div className="font-medium">{user.age || "Not set"}</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Crown className="h-5 w-5 text-yellow-500" />
							Subscription
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<div className="text-sm text-zinc-500 mb-1">Status</div>
							<Badge variant={user.is_premium_user ? "default" : "outline"} className={user.is_premium_user ? "bg-gradient-to-r from-yellow-600 to-orange-600" : ""}>
								{user.is_premium_user ? "Premium" : "Free"}
							</Badge>
						</div>
						<div>
							<div className="text-sm text-zinc-500 mb-1">Tier</div>
							<div className="font-medium">{tierLabels[user.subscription_tier as keyof typeof tierLabels] || "Free"}</div>
						</div>
						{!user.is_premium_user && (
							<div className="pt-2">
								<p className="text-sm text-zinc-400">Upgrade to Premium for AI-powered personalized workout plans and full course library access.</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Zap className="h-5 w-5 text-blue-500" />
							Experience Level
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Badge variant="outline" className="text-lg py-2 px-4">
							{experienceLabels[user.experience_level as keyof typeof experienceLabels] || "Beginner"}
						</Badge>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="h-5 w-5 text-purple-500" />
							Fitness Goals
						</CardTitle>
					</CardHeader>
					<CardContent>
						{user.fitness_goals && user.fitness_goals.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{user.fitness_goals.map((goal) => (
									<Badge key={goal} variant="secondary">
										{goal}
									</Badge>
								))}
							</div>
						) : (
							<p className="text-sm text-zinc-500">No goals set</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
