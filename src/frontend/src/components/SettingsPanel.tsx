import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Copy, LogOut, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { EMOJI_OPTIONS } from './profile/emojiOptions';

export default function SettingsPanel() {
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const queryClient = useQueryClient();

  const [name, setName] = useState(userProfile?.name || '');
  const [selectedEmoji, setSelectedEmoji] = useState(userProfile?.avatar || '🎯');

  const principal = identity?.getPrincipal().toString() || '';

  const handleCopyPrincipal = async () => {
    try {
      await navigator.clipboard.writeText(principal);
      toast.success('Principal copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy principal');
    }
  };

  const handleSaveProfile = () => {
    if (name.trim()) {
      saveProfile.mutate({ name: name.trim(), avatar: selectedEmoji });
    }
  };

  const handleSignOut = async () => {
    await clear();
    queryClient.clear();
    toast.success('Signed out successfully');
  };

  const hasProfileChanges = 
    name.trim() !== userProfile?.name || 
    selectedEmoji !== userProfile?.avatar;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-brand" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>
            Update your profile information and avatar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label>Avatar Emoji</Label>
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
          <Button
            onClick={handleSaveProfile}
            disabled={!hasProfileChanges || !name.trim() || saveProfile.isPending}
            className="bg-brand hover:bg-brand/90 text-brand-foreground"
          >
            {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Account Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand" />
            <CardTitle>Account</CardTitle>
          </div>
          <CardDescription>
            Manage your account settings and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Internet Identity Principal</Label>
            <div className="flex gap-2">
              <Input
                id="principal"
                value={principal}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                onClick={handleCopyPrincipal}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your unique identifier on the Internet Computer
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Sign Out</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Sign out of your account and clear all cached data
            </p>
            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
