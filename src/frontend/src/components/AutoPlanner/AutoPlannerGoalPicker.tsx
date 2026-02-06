import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Zap } from 'lucide-react';
import { GOAL_TEMPLATES } from '../../lib/goalTemplates';
import { generatePlan } from '../../lib/autoPlanner/generatePlan';
import type { GeneratedPlan } from '../../lib/autoPlanner/generatePlan';
import { Type__1 } from '../../backend';

interface AutoPlannerGoalPickerProps {
  onPlanGenerated: (plan: GeneratedPlan) => void;
}

export default function AutoPlannerGoalPicker({ onPlanGenerated }: AutoPlannerGoalPickerProps) {
  const [goalInput, setGoalInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate generation delay for better UX
    setTimeout(() => {
      let plan: GeneratedPlan;

      if (selectedTemplate) {
        const template = GOAL_TEMPLATES.find((t) => t.id === selectedTemplate);
        if (template) {
          plan = generatePlan(template.title, template.timeFrame);
        } else {
          plan = generatePlan(goalInput || 'My Goal', Type__1.days90);
        }
      } else {
        plan = generatePlan(goalInput || 'My Goal', Type__1.days90);
      }

      setIsGenerating(false);
      onPlanGenerated(plan);
    }, 800);
  };

  const canGenerate = goalInput.trim().length > 0 || selectedTemplate.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="goal-input">Enter Your Goal</Label>
        <Input
          id="goal-input"
          placeholder="e.g., Learn to code, Run a 5K, Build an emergency fund..."
          value={goalInput}
          onChange={(e) => {
            setGoalInput(e.target.value);
            setSelectedTemplate('');
          }}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-border" />
        <span className="text-sm text-muted-foreground">OR</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-select">Choose from Templates</Label>
        <Select
          value={selectedTemplate}
          onValueChange={(value) => {
            setSelectedTemplate(value);
            const template = GOAL_TEMPLATES.find((t) => t.id === value);
            if (template) {
              setGoalInput(template.title);
            }
          }}
        >
          <SelectTrigger id="template-select">
            <SelectValue placeholder="Select a goal template..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" disabled>
              Select a template
            </SelectItem>
            {GOAL_TEMPLATES.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!canGenerate || isGenerating}
        className="w-full bg-brand hover:bg-brand/90 text-brand-foreground"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Zap className="h-5 w-5 mr-2 animate-pulse" />
            Generating Plan...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Plan
          </>
        )}
      </Button>
    </div>
  );
}
