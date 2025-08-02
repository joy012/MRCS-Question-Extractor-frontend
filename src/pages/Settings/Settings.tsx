import { useMutation } from '@tanstack/react-query';
import {
  AlertTriangle,
  Database,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { SettingsService } from '../../api/settings';

import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useQuestionStatistics } from '../../hooks/useQuestions';

const Settings = () => {
  // API hooks
  const { data: questionStats } = useQuestionStatistics();

  // Reset database mutation
  const resetDatabaseMutation = useMutation({
    mutationFn: SettingsService.resetDatabase,
    onSuccess: (data) => {
      toast.success('Database reset successfully. The application will restart.');
      console.log('Reset details:', data.details);
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error: any) => {
      toast.error('Failed to reset database. Please try again.');
      console.error('Reset database error:', error);
    },
  });

  // Delete questions only mutation
  const deleteQuestionsMutation = useMutation({
    mutationFn: SettingsService.deleteQuestions,
    onSuccess: (data) => {
      toast.success('Questions deleted successfully.');
      console.log('Delete details:', data.details);
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error: any) => {
      toast.error('Failed to delete questions. Please try again.');
      console.error('Delete questions error:', error);
    },
  });

  const handleResetDatabase = () => {
    resetDatabaseMutation.mutate();
  };

  const handleDeleteQuestions = () => {
    deleteQuestionsMutation.mutate();
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage database and system settings
          </p>
        </div>
      </div>

      {/* Database Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Database Statistics
          </CardTitle>
          <CardDescription>
            Current database usage and statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {questionStats?.total?.toLocaleString() || '0'}
              </div>
              <p className="text-sm text-muted-foreground">Total Questions</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {questionStats?.byStatus?.approved?.toLocaleString() || '0'}
              </div>
              <p className="text-sm text-muted-foreground">Approved Questions</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Usage</span>
              <span>~{(questionStats?.total || 0) * 0.001} MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${Math.min((questionStats?.total || 0) / 1000 * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated database size based on current questions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that will permanently delete data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Delete Questions Only */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Delete Questions Only</h4>
                <p className="text-sm text-muted-foreground">
                  Delete all questions but keep categories and intakes
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deleteQuestionsMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleteQuestionsMutation.isPending ? 'Deleting...' : 'Delete Questions'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Delete All Questions
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <p>
                        This action will permanently delete all questions from the database.
                      </p>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">What will be deleted:</p>
                        <ul className="text-sm space-y-1">
                          <li>• All extracted questions</li>
                          <li>• Question metadata and AI confidence scores</li>
                          <li>• Question status and verification data</li>
                        </ul>
                        <p className="text-sm font-medium mt-2 mb-1">What will be preserved:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Preseeded medical categories</li>
                          <li>• Preseeded intakes</li>
                          <li>• System settings and configuration</li>
                        </ul>
                      </div>
                      <p className="text-destructive font-medium">
                        ⚠️ This action cannot be undone. Are you sure?
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteQuestions}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={deleteQuestionsMutation.isPending}
                    >
                      {deleteQuestionsMutation.isPending ? 'Deleting...' : 'Yes, Delete Questions'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Reset Full Database</h4>
                  <p className="text-sm text-muted-foreground">
                    Delete everything and reset to initial state
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={resetDatabaseMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {resetDatabaseMutation.isPending ? 'Resetting...' : 'Reset Database'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Reset Full Database
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <p>
                          This action will permanently delete ALL data from the database and reset to initial state.
                        </p>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm font-medium mb-2">What will be reset:</p>
                          <ul className="text-sm space-y-1">
                            <li>• All extracted questions</li>
                            <li>• All categories (will be reseeded)</li>
                            <li>• All intakes (will be reseeded)</li>
                            <li>• All extraction progress and metadata</li>
                            <li>• All system data</li>
                          </ul>
                          <p className="text-sm font-medium mt-2 mb-1">What will be restored:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Default medical categories</li>
                            <li>• Default intakes (January, April/May, September)</li>
                            <li>• Clean database structure</li>
                          </ul>
                        </div>
                        <p className="text-destructive font-medium">
                          ⚠️ This action cannot be undone. Are you absolutely sure?
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResetDatabase}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={resetDatabaseMutation.isPending}
                      >
                        {resetDatabaseMutation.isPending ? 'Resetting...' : 'Yes, Reset Database'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              These actions will permanently delete data and cannot be undone. Make sure you have backed up any important information before proceeding.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings; 