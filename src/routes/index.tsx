import { createFileRoute } from "@tanstack/react-router";
import { WorkoutApp } from "@/components/WorkoutApp";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return <WorkoutApp />;
}
