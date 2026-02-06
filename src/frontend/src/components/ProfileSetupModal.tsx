import { useState, useEffect } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { UserProfile } from '../backend';
import { EMOJI_OPTIONS } from './profile/emojiOptions';

interface ProfileSetupModalProps {
  isSetup: boolean;
  onClose: () => void;
  existingProfile?: UserProfile;
}

export default function ProfileSetupModal({ isSetup, onClose, existingProfile }: ProfileSetupModalProps) {
  const [name, setName] = useState(existingProfile?.name || '');
  const [selectedEmoji, setSelectedEmoji] = useState(existingProfile?.avatar || '🎯');
  const saveProfile = useSaveCallerUserProfile();

  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.name);
      setSelectedEmoji(existingProfile.avatar || '🎯');
    }
  }, [existingProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile.mutate(
        { name: name.trim(), avatar: selectedEmoji },
        {
          onSuccess: () => {
            if (!isSetup) {
              onClose();
            }
          },
        }
      );
    }
  };

  return (
    <Dialog open={true} onOpenChange={isSetup ? undefined : onClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isSetup}>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isSetup ? 'Welcome to LockedIn' : 'Edit Profile'}
          </DialogTitle>
          <DialogDescription>
            {isSetup
              ? "Let's start by setting up your profile. What should we call you?"
              : 'Update your profile information below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Choose Your Avatar</Label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedEmoji === emoji
                      ? 'border-selection bg-selection/10 scale-110 ring-1 ring-selection/20'
                      : 'border-border hover:border-selection/50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground"
              disabled={!name.trim() || saveProfile.isPending}
            >
              {saveProfile.isPending ? 'Saving...' : isSetup ? 'Continue' : 'Save Changes'}
            </Button>
            {!isSetup && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saveProfile.isPending}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
