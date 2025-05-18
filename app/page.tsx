import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-4">
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            ExpertInTheCity
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            Connect with experts in your city and get personalized advice from
            professionals you can trust.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" variant="default" className="gap-2">
            <Link href="/login">
              Admin Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="https://expertinthecity.vercel.app/home">
              Visit Main Site
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
          <div className="space-y-2">
            <h3 className="font-semibold">Expert Verification</h3>
            <p className="text-sm text-muted-foreground">
              Rigorous verification process for all experts to ensure quality
              advice
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Real-time Chat</h3>
            <p className="text-sm text-muted-foreground">
              Connect instantly with experts through our secure messaging
              platform
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Local Expertise</h3>
            <p className="text-sm text-muted-foreground">
              Find experts in your city for personalized, local insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
