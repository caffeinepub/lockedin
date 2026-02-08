import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCreateGoalFromTemplate } from '../hooks/useQueries';
import { BookOpen, Dumbbell, Briefcase, DollarSign, Heart, Sparkles, Loader2 } from 'lucide-react';
import type { GoalTemplate } from '../lib/goalTemplates';
import { GOAL_TEMPLATES } from '../lib/goalTemplates';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils/errors';
import { useQueryClient } from '@tanstack/react-query';

interface GoalLibraryModalProps {
  onClose: () => void;
  onSkip?: () => void;
}

export default function GoalLibraryModal({ onClose, onSkip }: GoalLibraryModalProps) {
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const createGoalFromTemplate = useCreateGoalFromTemplate();
  const queryClient = useQueryClient();

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
    
    if (templates.length === 0) return;

    setIsCreating(true);
    let successCount = 0;
    let failedTemplates: string[] = [];

    try {
      for (const template of templates) {
        try {
          await createGoalFromTemplate.mutateAsync(template);
          successCount++;
        } catch (error) {
          failedTemplates.push(template.title);
          console.error(`Failed to create goal from template ${template.title}:`, error);
        }
      }

      // Refresh goals list
      await queryClient.invalidateQueries({ queryKey: ['goals'] });

      // Show appropriate success/error messages
      if (successCount === templates.length) {
        toast.success(`Successfully added ${successCount} ${successCount === 1 ? 'goal' : 'goals'}!`);
        onClose();
      } else if (successCount > 0) {
        toast.warning(`Added ${successCount} of ${templates.length} goals. ${failedTemplates.length} failed.`);
        if (failedTemplates.length > 0) {
          toast.error(`Failed to create: ${failedTemplates.join(', ')}`);
        }
      } else {
        toast.error('Failed to create any goals. Please try again.');
      }
    } catch (error) {
      toast.error(`Error creating goals: ${getErrorMessage(error)}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    // Only close if open is false (user clicked overlay or pressed Escape) and not creating
    if (!open && !isCreating) {
      handleSkip();
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
        } ${isCreating ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={() => !isCreating && toggleGoal(template.id)}
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
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={() => !isCreating && toggleGoal(template.id)}
              disabled={isCreating}
            />
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
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl w-[calc(100vw-2rem)] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 shrink-0">
          <DialogTitle className="text-xl sm:text-2xl">Welcome to LockedIn! 🎯</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Choose from popular goals to get started quickly. Each goal comes with pre-defined milestones, tasks, and tracking metrics.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
          <div className="px-4 sm:px-6 pb-3 shrink-0">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id} 
                    className="gap-1 text-xs sm:text-sm px-2 sm:px-3"
                    disabled={isCreating}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <span className="sm:hidden">{category.label.slice(0, 4)}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent 
              key={category.id} 
              value={category.id} 
              className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <ScrollArea className="flex-1 px-4 sm:px-6" type="always">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 pb-4 pr-4">
                  {GOAL_TEMPLATES.filter(
                    (t) => category.id === 'all' || t.category === category.id
                  ).map(renderGoalCard)}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <div className="p-4 sm:p-6 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shrink-0">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {selectedGoals.size} {selectedGoals.size === 1 ? 'goal' : 'goals'} selected
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={handleSkip} 
              disabled={isCreating}
              className="flex-1 sm:flex-none"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleAddGoals}
              disabled={selectedGoals.size === 0 || isCreating}
              className="bg-brand hover:bg-brand/90 text-brand-foreground flex-1 sm:flex-none"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                `Add ${selectedGoals.size > 0 ? selectedGoals.size : ''} ${selectedGoals.size === 1 ? 'Goal' : 'Goals'}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
