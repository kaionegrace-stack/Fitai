import { useState, useEffect } from "react";
import { AuthScreen } from "./workout/AuthScreen";
import { OnboardingFlow } from "./workout/OnboardingFlow";
import { MainDashboard } from "./workout/MainDashboard";
import { SubscriptionGate } from "./workout/SubscriptionGate";
import { UsersORM, type UsersModel } from "@/sdk/database/orm/orm_users";

type AppScreen = "auth" | "onboarding" | "subscription-gate" | "dashboard";

export function WorkoutApp() {
	const [currentScreen, setCurrentScreen] = useState<AppScreen>("auth");
	const [currentUser, setCurrentUser] = useState<UsersModel | null>(null);
	const [onboardingData, setOnboardingData] = useState<{
		age?: number;
		goals?: string[];
		experience?: string;
	}>({});

	useEffect(() => {
		checkExistingUser();
	}, []);

	async function checkExistingUser() {
		try {
			const usersOrm = UsersORM.getInstance();
			const allUsers = await usersOrm.getAllUsers();
			if (allUsers.length > 0) {
				setCurrentUser(allUsers[0]);
				setCurrentScreen("dashboard");
			}
		} catch (error) {
			console.error("Error checking existing user:", error);
		}
	}

	function handleAuthComplete(user: UsersModel) {
		setCurrentUser(user);
		setCurrentScreen("onboarding");
	}

	function handleOnboardingComplete(data: {
		age?: number;
		goals?: string[];
		experience?: string;
	}) {
		setOnboardingData(data);
		if (currentUser?.is_premium_user) {
			setCurrentScreen("dashboard");
		} else {
			setCurrentScreen("subscription-gate");
		}
	}

	function handleSubscriptionDecision(upgraded: boolean) {
		setCurrentScreen("dashboard");
	}

	function handleLogout() {
		setCurrentUser(null);
		setCurrentScreen("auth");
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
			{currentScreen === "auth" && (
				<AuthScreen onAuthComplete={handleAuthComplete} />
			)}
			{currentScreen === "onboarding" && currentUser && (
				<OnboardingFlow
					user={currentUser}
					onComplete={handleOnboardingComplete}
				/>
			)}
			{currentScreen === "subscription-gate" && currentUser && (
				<SubscriptionGate
					user={currentUser}
					onboardingData={onboardingData}
					onDecision={handleSubscriptionDecision}
				/>
			)}
			{currentScreen === "dashboard" && currentUser && (
				<MainDashboard user={currentUser} onLogout={handleLogout} />
			)}
		</div>
	);
}
