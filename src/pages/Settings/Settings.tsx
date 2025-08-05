import {
  Activity,
  AlertTriangle,
  BarChart3,
  Database,
  HardDrive,
  Settings as SettingsIcon,
  Trash2
} from 'lucide-react';

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
import { useGetQuestionStatisticsQuery } from '../../services/queries/useQuestions';
import {
  useDeleteQuestionsMutation,
  useResetDatabaseMutation
} from '../../services/queries/useSettings';

const Settings = () => {
  // API hooks
  const { data: questionStats } = useGetQuestionStatisticsQuery();
  const resetDatabaseMutation = useResetDatabaseMutation();
  const deleteQuestionsMutation = useDeleteQuestionsMutation();

  const handleResetDatabase = () => {
    resetDatabaseMutation.mutate();
  };

  const handleDeleteQuestions = () => {
    deleteQuestionsMutation.mutate();
  };

  return (
    <div className="space-y-8 w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border border-orange-100/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                  <SettingsIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    System Settings
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage database, system configuration, and data management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Statistics */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Database className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Database Statistics</CardTitle>
              <CardDescription className="text-gray-600">
                Current database usage and statistics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {questionStats?.total?.toLocaleString() || '0'}
              </div>
              <p className="text-sm text-gray-600">Total Questions</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {questionStats?.byStatus?.APPROVED?.toLocaleString() || '0'}
              </div>
              <p className="text-sm text-gray-600">Approved Questions</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                <HardDrive className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ~{((questionStats?.total || 0) * 0.0006148282).toFixed(1)} MB
              </div>
              <p className="text-sm text-gray-600">Storage Usage</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Storage Usage</span>
              <span className="text-gray-900 font-medium">~{((questionStats?.total || 0) * 0.0006148282).toFixed(1)} MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((questionStats?.total || 0) / 1000 * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              Estimated database size based on current questions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-red-900">Danger Zone</CardTitle>
              <CardDescription className="text-red-700">
                Irreversible actions that will permanently delete data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delete Questions Only */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-red-200/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Delete Questions Only</h4>
                  <p className="text-sm text-gray-600">
                    Delete all questions but keep categories and intakes
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={deleteQuestionsMutation.isPending}
                    className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleteQuestionsMutation.isPending ? 'Deleting...' : 'Delete Questions'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Delete All Questions
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <p>
                        This action will permanently delete all questions from the database.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg">
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
                      <p className="text-red-600 font-medium">
                        ⚠️ This action cannot be undone. Are you sure?
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteQuestions}
                      className="bg-red-600 text-white hover:bg-red-700"
                      disabled={deleteQuestionsMutation.isPending}
                    >
                      {deleteQuestionsMutation.isPending ? 'Deleting...' : 'Yes, Delete Questions'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="border-t border-red-200 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-red-200/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Database className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Reset Full Database</h4>
                    <p className="text-sm text-gray-600">
                      Delete everything and reset to initial state
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="lg"
                      disabled={resetDatabaseMutation.isPending}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {resetDatabaseMutation.isPending ? 'Resetting...' : 'Reset Database'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Reset Full Database
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <p>
                          This action will permanently delete ALL data from the database and reset to initial state.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg">
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
                        <p className="text-red-600 font-medium">
                          ⚠️ This action cannot be undone. Are you absolutely sure?
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResetDatabase}
                        className="bg-red-600 text-white hover:bg-red-700"
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

          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-900">Warning</AlertTitle>
            <AlertDescription className="text-red-800">
              These actions will permanently delete data and cannot be undone. Make sure you have backed up any important information before proceeding.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings; 