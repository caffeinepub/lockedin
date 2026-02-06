import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import AutoPlannerGoalPicker from './AutoPlannerGoalPicker';
import AutoPlannerReview from './AutoPlannerReview';
import type { GeneratedPlan } from '../../lib/autoPlanner/generatePlan';

type AutoPlannerStep = 'input' | 'review';

export default function AutoPlannerView() {
  const [step, setStep] = useState<AutoPlannerStep>('input');
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

  const handlePlanGenerated = (plan: GeneratedPlan) => {
    setGeneratedPlan(plan);
    setStep('review');
  };

  const handleBack = () => {
    setStep('input');
    setGeneratedPlan(null);
  };

  const handleSaveComplete = () => {
    setStep('input');
    setGeneratedPlan(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent-gold" />
              Auto Planner
            </CardTitle>
            <CardDescription>
              Enter or select a goal, and we'll generate a structured plan with milestones, tasks, and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AutoPlannerGoalPicker onPlanGenerated={handlePlanGenerated} />
          </CardContent>
        </Card>
      )}

      {step === 'review' && generatedPlan && (
        <AutoPlannerReview
          plan={generatedPlan}
          onBack={handleBack}
          onSaveComplete={handleSaveComplete}
        />
      )}
    </div>
  );
}
