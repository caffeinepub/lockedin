import { useState } from 'react';
import { useCreateGoal } from '../hooks/useQueries';
import { Type__1 } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Lightbulb } from 'lucide-react';

type Step = 'goal' | 'timeframe' | 'motivation';

const timeFrameOptions = [
  { value: Type__1.days30, label: '30 Days', description: 'Short-term sprint' },
  { value: Type__1.days90, label: '90 Days', description: 'Quarterly goal' },
  { value: Type__1.months6to12, label: '6-12 Months', description: 'Medium-term objective' },
  { value: Type__1.years1to5, label: '1-5 Years', description: 'Long-term vision' },
];

const goalSuggestions = [
  'Launch my first product or service',
  'Grow monthly revenue to $10k',
  'Build an audience of 10,000 followers',
  'Complete a professional certification',
  'Establish a consistent content creation routine',
  'Hire and onboard my first team member',
  'Develop a new skill or expertise',
  'Scale operations to serve 100 customers',
];

interface GoalDefinitionFlowProps {
  onComplete?: () => void;
}

export default function GoalDefinitionFlow({ onComplete }: GoalDefinitionFlowProps) {
  const [step, setStep] = useState<Step>('goal');
  const [goalDescription, setGoalDescription] = useState('');
  const [timeFrame, setTimeFrame] = useState<Type__1>(Type__1.days90);
  const [motivation, setMotivation] = useState('');

  const createGoal = useCreateGoal();

  const handleSubmit = () => {
    createGoal.mutate(
      {
        description: goalDescription,
        timeFrame,
        motivation,
      },
      {
        onSuccess: () => {
          setStep('goal');
          setGoalDescription('');
          setMotivation('');
          if (onComplete) {
            onComplete();
          }
        },
      }
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Define Your Goal</CardTitle>
        <CardDescription>
          {step === 'goal' && 'What do you want to achieve?'}
          {step === 'timeframe' && 'When do you want to achieve it?'}
          {step === 'motivation' && 'Why does this matter to you now?'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 'goal' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Your Goal</Label>
              <Input
                id="goal"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                placeholder="e.g., Launch my first product, Grow revenue to $10k/month"
                autoFocus
              />
            </div>

            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-accent-gold" />
                <span className="text-sm font-medium">Goal Ideas</span>
              </div>
              <div className="grid gap-2">
                {goalSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setGoalDescription(suggestion)}
                    className="text-left text-sm p-2 rounded hover:bg-accent/50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep('timeframe')}
              disabled={!goalDescription.trim()}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 'timeframe' && (
          <div className="space-y-4">
            <RadioGroup value={timeFrame} onValueChange={(value) => setTimeFrame(value as Type__1)}>
              <div className="space-y-3">
                {timeFrameOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setTimeFrame(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            <div className="flex gap-3">
              <Button onClick={() => setStep('goal')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep('motivation')} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'motivation' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivation">Why Now?</Label>
              <Textarea
                id="motivation"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Explain why this goal matters to you right now... What impact will achieving this have on your business or life?"
                rows={4}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep('timeframe')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!motivation.trim() || createGoal.isPending}
                className="flex-1"
              >
                {createGoal.isPending ? 'Creating...' : 'Create Goal'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
