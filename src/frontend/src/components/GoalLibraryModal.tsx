import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCreateGoalFromTemplate } from '../hooks/useQueries';
import { BookOpen, Dumbbell, Briefcase, DollarSign, Heart, Sparkles } from 'lucide-react';
import type { GoalTemplate } from '../lib/goalTemplates';
import { GOAL_TEMPLATES } from '../lib/goalTemplates';

interface GoalLibraryModalProps {
  onClose: () => void;
  onSkip?: () => void;
}

export default function GoalLibraryModal({ onClose, onSkip }: GoalLibraryModalProps) {
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());
  const createGoalFromTemplate = useCreateGoalFromTemplate();

  const categories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
    { id: 'productivity', label: 'Productivity', icon: Briefcase },
    { id: 'money', label: 'Money', icon: DollarSign },
    { id: 'mentalHealth', label: 'Mental Health', icon: Heart },
  ];

  const toggleGoal = (goalId: string) => {
    const newSelected = new Set(selectedGoals);
    if (newSelected.has(goalId)) {
      newSelected.delete(goalId);
    } else {
      newSelected.add(goalId);
    }
    setSelectedGoals(newSelected);
  };

  const handleAddGoals = async () => {
    const templates = GOAL_TEMPLATES.filter((t) => selectedGoals.has(t.id));
    
    for (const template of templates) {
      await createGoalFromTemplate.mutateAsync(template);
    }
    
    onClose();
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onClose();
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.icon : Sparkles;
  };

  const renderGoalCard = (template: GoalTemplate) => {
    const Icon = getCategoryIcon(template.category);
    const isSelected = selectedGoals.has(template.id);

    return (
      <Card
        key={template.id}
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-selection border-selection' : 'hover:border-brand/30'
        }`}
        onClick={() => toggleGoal(template.id)}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5 text-brand" />
                <CardTitle className="text-lg">{template.title}</CardTitle>
              </div>
              <CardDescription className="line-clamp-2">{template.description}</CardDescription>
            </div>
            <Checkbox checked={isSelected} onCheckedChange={() => toggleGoal(template.id)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline">{template.timeFrameLabel}</Badge>
            <Badge variant="secondary">{template.milestones.length} milestones</Badge>
            <Badge variant="secondary">{template.weeklyTasks.length} weekly tasks</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Includes:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {template.milestones.slice(0, 2).map((m, i) => (
                <li key={i} className="line-clamp-1">{m.desc}</li>
              ))}
              {template.milestones.length > 2 && (
                <li className="text-xs">+{template.milestones.length - 2} more milestones</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl">Welcome to LockedIn! 🎯</DialogTitle>
          <DialogDescription>
            Choose from popular goals to get started quickly. Each goal comes with pre-defined milestones, tasks, and tracking metrics.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="flex-1">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="gap-1">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <ScrollArea className="h-[400px] px-6 py-4">
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid gap-4 md:grid-cols-2">
                  {GOAL_TEMPLATES.filter(
                    (t) => category.id === 'all' || t.category === category.id
                  ).map(renderGoalCard)}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>

        <div className="p-6 pt-4 border-t flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {selectedGoals.size} {selectedGoals.size === 1 ? 'goal' : 'goals'} selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkip} disabled={createGoalFromTemplate.isPending}>
              Skip for now
            </Button>
            <Button
              onClick={handleAddGoals}
              disabled={selectedGoals.size === 0 || createGoalFromTemplate.isPending}
              className="bg-brand hover:bg-brand/90 text-brand-foreground"
            >
              {createGoalFromTemplate.isPending
                ? 'Adding goals...'
                : `Add ${selectedGoals.size} ${selectedGoals.size === 1 ? 'Goal' : 'Goals'}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
