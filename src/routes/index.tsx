import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	CheckCircle2,
	Check,
	LayoutTemplate,
	Network,
	Globe,
	ShieldCheck,
} from "lucide-react";
import { authClient } from "../lib/auth-client";
import { getSession } from "../lib/server/session";
import { Header, Footer } from "../components/layout-components";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "../components/ui/card";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: sessionData, isLoading } = useQuery({
		queryKey: ["session"],
		queryFn: async () => await getSession(),
	});

	const logoutMutation = useMutation({
		mutationFn: async () => {
			await authClient.signOut();
		},
		onSuccess: () => {
			queryClient.setQueryData(["session"], null);
			navigate({ to: "/login" });
		},
	});

	const user = sessionData?.user;

	type PricingTier = {
		name: string;
		price: string;
		description: string;
		features: string[];
		buttonText: string;
		popular: boolean;
	};

	const pricingTiers: PricingTier[] = [
		{
			name: "Starter",
			price: "$29",
			description: "Perfect for small setups or initial pilots.",
			features: [
				"Up to 3 team members",
				"50 documents / month",
				"5 active templates",
				"BL + Quotation types",
				"Basic white-labeling (Logo)",
				"30 days storage retention",
			],
			buttonText: "Start Free Trial",
			popular: false,
		},
		{
			name: "Professional",
			price: "$99",
			description: "Everything you need to scale your output capacity.",
			features: [
				"Up to 15 team members",
				"500 documents / month",
				"Unlimited templates",
				"All 5 document types",
				"Full branding engine",
				"1 year storage retention",
			],
			buttonText: "Start Free Trial",
			popular: true,
		},
		{
			name: "Enterprise",
			price: "Custom",
			description: "Unlimited power for core logistics leaders.",
			features: [
				"Unlimited team members",
				"Unlimited documents",
				"Unlimited templates",
				"All 5 types + custom builders",
				"Custom PDF fonts",
				"Priority support",
			],
			buttonText: "Contact Us",
			popular: false,
		},
	];

	return (
		<div className="flex flex-col min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground">
			<Header
				user={user}
				isLoading={isLoading}
				onLogout={() => logoutMutation.mutate()}
				navigate={navigate}
			/>

			<main className="flex-1">
				{/* Simple & Clear Hero Section */}
				<section className="w-full relative py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden bg-background">
					<div className="container mx-auto px-4 md:px-6 z-10 flex flex-col items-center text-center">
						<div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
							<span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
							CargoSlate v1.1 is now live
						</div>

						<h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase leading-none tracking-tight mb-6 max-w-4xl text-foreground">
							Simplify Your{" "}
							<span className="text-primary">Maritime Documents</span>
						</h1>

						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl text-center">
							Ditch messy spreadsheets and manual processes. Create, automate,
							and centralize bills of lading, packing lists, and manifests with
							confidence.
						</p>

						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								to={user ? "/dashboard" : "/register"}
								className="rounded-md h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold shadow-md flex items-center justify-center gap-2 group"
							>
								{user ? "View Dashboard" : "Start For Free"}
								<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
							</Link>
							<Link
								to="/login"
								className="rounded-md h-12 px-8 border border-border flex items-center justify-center text-sm font-semibold hover:bg-muted bg-background"
							>
								Learn More
							</Link>
						</div>
					</div>
				</section>

				{/* Problem / Mission Statement Section */}
				<section className="w-full border-t border-border bg-background py-20">
					<div className="container mx-auto px-4 md:px-6">
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div>
								<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
									The Problem with Traditional Documentation
								</h2>
								<div className="space-y-4 text-muted-foreground">
									<p>
										Freight and logistics documentation today is fragmented, repetitive, and dangerously error-prone:
									</p>
									<p className="flex items-start gap-2">
										<ShieldCheck className="h-5 w-5 text-destructive mt-0.5" />
										<span>Manual data re-entry leads to critical cargo delays and costly inspection fees.</span>
									</p>
									<p className="flex items-start gap-2">
										<ShieldCheck className="h-5 w-5 text-destructive mt-0.5" />
										<span>Clerks use inconsistent Word templates causing unreliable brand appearances to clients.</span>
									</p>
									<p className="flex items-start gap-2">
										<ShieldCheck className="h-5 w-5 text-destructive mt-0.5" />
										<span>No audit trail existing over who created, modified, or approved legal manifest statements.</span>
									</p>
								</div>
							</div>
							<div className="bg-muted p-8 rounded-2xl border border-border/50">
								<h3 className="text-2xl font-bold mb-4 text-foreground">Our Mission: Unified Operations</h3>
								<p className="text-muted-foreground mb-6">
									CargoSlate turns templates and calculated logistics fields into the default baseline for shipping desk-work. By controlling whitespace, caching inputs, and anchoring role guidelines properly, absolute fidelity is maintained effortlessly.
								</p>
								<div className="flex items-center gap-4 text-sm font-semibold text-primary">
									<span className="flex items-center gap-1"><Globe className="h-4 w-4" /> Global Sandbox Ready</span>
									<span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> 100% Immutable Auditing</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Feature grid explains exact benefits simply */}
				<section className="w-full border-t border-border bg-muted/30 py-20">
					<div className="container mx-auto px-4 md:px-6">
						<div className="flex flex-col items-center text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
								Streamline Every Shipment
							</h2>
							<p className="text-muted-foreground max-w-2xl">
								Our features are built to eliminate simple delays and human
								errors from your documentation cycles.
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							<Card className="rounded-xl shadow-sm border-border/50 hover:shadow-md transition-shadow">
								<CardHeader>
									<div className="p-3 bg-primary/10 w-fit rounded-lg mb-4 text-primary">
										<LayoutTemplate className="h-6 w-6" />
									</div>
									<CardTitle className="text-xl font-bold">
										Dynamic Templates
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-sm font-normal text-muted-foreground leading-relaxed">
										Build exact layout guidelines like Bills of Lading in
										minutes without design skills. Use drag-and-drop mechanics
										making generation safe and simple.
									</CardDescription>
								</CardContent>
							</Card>

							<Card className="rounded-xl shadow-sm border-border/50 hover:shadow-md transition-shadow">
								<CardHeader>
									<div className="p-3 bg-primary/10 w-fit rounded-lg mb-4 text-primary">
										<Network className="h-6 w-6" />
									</div>
									<CardTitle className="text-xl font-bold">
										Safe Organization Workspace
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-sm font-normal text-muted-foreground leading-relaxed">
										Manage team access under one clean board. Role capabilities
										let managers review and clerks upload safely preserving
										tenant integrity.
									</CardDescription>
								</CardContent>
							</Card>

							<Card className="rounded-xl shadow-sm border-border/50 hover:shadow-md transition-shadow">
								<CardHeader>
									<div className="p-3 bg-primary/10 w-fit rounded-lg mb-4 text-primary">
										<CheckCircle2 className="h-6 w-6" />
									</div>
									<CardTitle className="text-xl font-bold">
										Secured PDF Outputs
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-sm font-normal text-muted-foreground leading-relaxed">
										Instantly save perfect layout representations ready to
										download or securely anchor onto central collaboration
										points.
									</CardDescription>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Pricing Section Grid */}
				<section className="w-full border-t border-border bg-background py-20">
					<div className="container mx-auto px-4 md:px-6">
						<div className="flex flex-col items-center text-center mb-16">
							<h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
								Simple, Predictable Pricing
							</h2>
							<p className="text-muted-foreground max-w-2xl">
								No setup fees. All tiers fully include a 14-day free trial on initial activation.
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
							{pricingTiers.map((tier) => (
								<Card 
									key={tier.name} 
									className={`rounded-xl border-border flex flex-col justify-between relative ${tier.popular ? "border-primary shadow-md ring-1 ring-primary/20" : "shadow-sm"}`}
								>
									{tier.popular && (
										<div className="absolute top-0 right-6 transform -translate-y-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-semibold">
											Most Popular
										</div>
									)}
									<CardHeader>
										<CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
										<CardDescription className="text-sm mt-1">{tier.description}</CardDescription>
										<div className="mt-4 flex items-baseline gap-1">
											<span className="text-4xl font-bold tracking-tight text-foreground">{tier.price}</span>
											{tier.price !== "Custom" && <span className="text-muted-foreground text-sm">/ month</span>}
										</div>
									</CardHeader>
									<CardContent className="flex-1">
										<ul className="space-y-3 text-sm text-foreground/80">
											{tier.features.map((feature) => (
												<li key={feature} className="flex items-start gap-2">
													<Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
													<span>{feature}</span>
												</li>
											))}
										</ul>
									</CardContent>
									<CardFooter className="pt-6">
										<Button className="w-full font-semibold" variant={tier.popular ? "default" : "outline"} render={<Link to="/register" />} nativeButton={false}>
											{tier.buttonText}
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* Clear Action Section */}
				<section className="w-full bg-primary text-primary-foreground py-20">
					<div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
						<h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
							Ready to automate your desk work?
						</h2>
						<p className="text-primary-foreground/80 max-w-lg mb-8">
							Establish a clean workspace environment in under two minutes for
							free.
						</p>
						<Link
							to="/register"
							className="rounded-md h-12 px-10 text-sm font-semibold shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center justify-center"
						>
							Create Setup Today
						</Link>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
