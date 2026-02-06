import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden lockedin-bg">
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center mb-8">
              <img
                src="/assets/logoo-removebg-preview.png"
                alt="LockedIn"
                className="h-24 w-auto"
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Plan it. Track it.
              <br />
              <span className="bg-gradient-to-r from-brand via-brand to-link bg-clip-text text-transparent">
                Stay LockedIn.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              A strategic planning and accountability assistant that transforms your goals into
              concrete, trackable actions. Perfect for entrepreneurs, creators, and professionals.
            </p>

            <div className="pt-8">
              <Button
                size="lg"
                onClick={handleLogin}
                disabled={loginStatus === 'logging-in'}
                className="text-lg px-8 py-6 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loginStatus === 'logging-in' ? 'Connecting...' : 'Get Started'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 border border-border/50 hover:border-brand/30 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10">
                <Target className="h-8 w-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold">Define Your Goals</h3>
              <p className="text-muted-foreground">
                Break down your vision into clear milestones and actionable tasks with structured
                planning. Manage multiple goals simultaneously.
              </p>
              <img 
                src="/assets/generated/illustration-goals.dim_512x512.png" 
                alt="Goals planning" 
                className="w-24 h-24 mx-auto opacity-70"
              />
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 border border-border/50 hover:border-link/30 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-link/10">
                <CheckCircle2 className="h-8 w-8 text-link" />
              </div>
              <h3 className="text-xl font-semibold">Track Daily Progress</h3>
              <p className="text-muted-foreground">
                Daily check-ins keep you accountable and help identify patterns in your execution
                across all your goals.
              </p>
              <img 
                src="/assets/generated/illustration-reviews.dim_512x512.png" 
                alt="Daily tracking" 
                className="w-24 h-24 mx-auto opacity-70"
              />
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 border border-border/50 hover:border-brand/30 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10">
                <TrendingUp className="h-8 w-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold">Review & Adjust</h3>
              <p className="text-muted-foreground">
                Weekly reviews provide insights on your progress and help you stay aligned with your
                goals and business objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 p-12 rounded-2xl bg-gradient-to-br from-brand/5 to-link/5 border border-brand/20 hover:border-brand/30 transition-colors">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Lock In?</h2>
            <p className="text-lg text-muted-foreground">
              Join LockedIn today and transform your goals into reality with structured planning and
              daily accountability. Built for ambitious professionals and entrepreneurs.
            </p>
            <Button
              size="lg"
              onClick={handleLogin}
              disabled={loginStatus === 'logging-in'}
              className="text-lg px-8 py-6 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {loginStatus === 'logging-in' ? 'Connecting...' : 'Start Your Journey'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
