import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell } from "lucide-react";
import { UsersORM, UsersExperienceLevel, UsersSubscriptionTier, type UsersModel } from "@/sdk/database/orm/orm_users";

interface AuthScreenProps {
	onAuthComplete: (user: UsersModel) => void;
}

export function AuthScreen({ onAuthComplete }: AuthScreenProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const formData = new FormData(e.currentTarget);
		const username = formData.get("username") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const usersOrm = UsersORM.getInstance();

			const existingUsers = await usersOrm.getUsersByUsername(username);
			if (existingUsers.length > 0) {
				setError("Username already exists");
				setIsLoading(false);
				return;
			}

			const newUser = await usersOrm.insertUsers([
				{
					username,
					email,
					password,
					experience_level: UsersExperienceLevel.Beginner,
					is_premium_user: false,
					subscription_tier: UsersSubscriptionTier.Free,
				} as UsersModel,
			]);

			if (newUser.length > 0) {
				onAuthComplete(newUser[0]);
			}
		} catch (err) {
			setError("Failed to create account. Please try again.");
			console.error("Sign up error:", err);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const formData = new FormData(e.currentTarget);
		const username = formData.get("username") as string;
		const password = formData.get("password") as string;

		try {
			const usersOrm = UsersORM.getInstance();
			const users = await usersOrm.getUsersByUsername(username);

			if (users.length === 0 || users[0].password !== password) {
				setError("Invalid username or password");
				setIsLoading(false);
				return;
			}

			onAuthComplete(users[0]);
		} catch (err) {
			setError("Failed to sign in. Please try again.");
			console.error("Sign in error:", err);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<div className="flex justify-center mb-4">
						<div className="rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-3">
							<Dumbbell className="h-8 w-8 text-white" />
						</div>
					</div>
					<h1 className="text-4xl font-bold text-white mb-2">FitAI</h1>
					<p className="text-zinc-400">Your Personal AI Workout Coach</p>
				</div>

				<Tabs defaultValue="signin" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="signin">Sign In</TabsTrigger>
						<TabsTrigger value="signup">Sign Up</TabsTrigger>
					</TabsList>

					<TabsContent value="signin">
						<Card>
							<CardHeader>
								<CardTitle>Welcome back</CardTitle>
								<CardDescription>Sign in to continue your fitness journey</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSignIn} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="signin-username">Username</Label>
										<Input
											id="signin-username"
											name="username"
											type="text"
											required
											placeholder="Enter your username"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="signin-password">Password</Label>
										<Input
											id="signin-password"
											name="password"
											type="password"
											required
											placeholder="Enter your password"
										/>
									</div>
									{error && <p className="text-sm text-red-500">{error}</p>}
									<Button type="submit" className="w-full" disabled={isLoading}>
										{isLoading ? "Signing in..." : "Sign In"}
									</Button>
								</form>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="signup">
						<Card>
							<CardHeader>
								<CardTitle>Create account</CardTitle>
								<CardDescription>Start your fitness transformation today</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSignUp} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="signup-username">Username</Label>
										<Input
											id="signup-username"
											name="username"
											type="text"
											required
											placeholder="Choose a username"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="signup-email">Email</Label>
										<Input
											id="signup-email"
											name="email"
											type="email"
											required
											placeholder="Enter your email"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="signup-password">Password</Label>
										<Input
											id="signup-password"
											name="password"
											type="password"
											required
											placeholder="Create a password"
										/>
									</div>
									{error && <p className="text-sm text-red-500">{error}</p>}
									<Button type="submit" className="w-full" disabled={isLoading}>
										{isLoading ? "Creating account..." : "Create Account"}
									</Button>
								</form>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
