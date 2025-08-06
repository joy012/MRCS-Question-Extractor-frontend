import { cn } from '@/lib/utils';
import { Activity, AlertCircle, CheckCircle, Clock, Play, RefreshCw, Square, Target, XCircle, Zap } from 'lucide-react';
import React from 'react';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { useToastHelpers } from '../../../components/ui/toast';
import { useContinueExtractionMutation, useStopExtractionMutation } from '../../../services/queries/useExtraction';
import type { ExtractionState } from './types';

interface ExtractionStatusProps {
  extractionState: ExtractionState;
}

export const ExtractionStatus: React.FC<ExtractionStatusProps> = ({
  extractionState
}) => {
  const stopExtractionMutation = useStopExtractionMutation();
  const continueExtractionMutation = useContinueExtractionMutation();
  const { success, error } = useToastHelpers();

  const handleStopExtraction = async () => {
    try {
      await stopExtractionMutation.mutateAsync();
      success('Success', 'Extraction stopped successfully');
    } catch (err: any) {
      console.error('Failed to stop extraction:', err);
      error('Error', 'Failed to stop extraction');
    }
  };

  const handleContinueExtraction = async () => {
    try {
      await continueExtractionMutation.mutateAsync();
      success('Success', 'Extraction continued successfully');
    } catch (err: any) {
      console.error('Failed to continue extraction:', err);
      error('Error', 'Failed to continue extraction');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'stopped':
        return <Square className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'stopped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'processing':
        return 'from-blue-50 to-blue-100/50 border-blue-200/50';
      case 'completed':
        return 'from-green-50 to-green-100/50 border-green-200/50';
      case 'failed':
        return 'from-red-50 to-red-100/50 border-red-200/50';
      case 'stopped':
        return 'from-yellow-50 to-yellow-100/50 border-yellow-200/50';
      default:
        return 'from-gray-50 to-gray-100/50 border-gray-200/50';
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact Main Status Card */}
      <Card className={`border-0 shadow-md bg-gradient-to-br ${getStatusGradient(extractionState.status)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm">
                {getStatusIcon(extractionState.status)}
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Current Status
                </CardTitle>
                <p className="text-xs text-gray-600">
                  Real-time extraction monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(extractionState.status)} font-semibold text-xs`}>
                {extractionState.status.toUpperCase()}
              </Badge>
              {extractionState.status === 'processing' && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 font-medium">Live</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {/* Compact File Info */}
          {extractionState.selectedPdf && (
            <div className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
              <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">Processing File</p>
                <p className="text-xs text-gray-600">{extractionState.selectedPdf}</p>
              </div>
            </div>
          )}

          {/* Compact Progress Section */}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-blue-600" />
                <span className="font-medium text-sm text-gray-900">Progress</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{extractionState.progress}%</span>
            </div>

            <div className="relative">
              <Progress
                value={extractionState.progress}
                className={cn('h-2 bg-blue-100', extractionState.status !== 'processing' && 'bg-red-300')}
              />
              <div className={cn('absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20', extractionState.status !== 'processing' && 'bg-red-300')}></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-white/60 backdrop-blur-sm rounded-md border border-white/50">
                <div className="text-sm font-bold text-gray-900">
                  {extractionState.processedPages}
                </div>
                <div className="text-xs text-gray-600">Pages Processed</div>
              </div>
              <div className="text-center p-2 bg-white/60 backdrop-blur-sm rounded-md border border-white/50">
                <div className="text-sm font-bold text-gray-900">
                  {extractionState.extractedQuestions}
                </div>
                <div className="text-xs text-gray-600">Extracted Questions</div>
              </div>
              <div className="text-center p-2 bg-white/60 backdrop-blur-sm rounded-md border border-white/50">
                <div className="text-sm font-bold text-gray-900">
                  {extractionState.totalPages}
                </div>
                <div className="text-xs text-gray-600">Total Pages</div>
              </div>
            </div>
          </div>

          {/* Compact Action Buttons */}
          <div className="flex gap-2">
            {extractionState.status === 'processing' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleStopExtraction}
                disabled={stopExtractionMutation.isPending}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md"
              >
                {stopExtractionMutation.isPending ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Stopping...
                  </>
                ) : (
                  <>
                    <Square className="h-3 w-3 mr-1" />
                    Stop Extraction
                  </>
                )}
              </Button>
            )}
            {extractionState.status === 'stopped' && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleContinueExtraction}
                  disabled={continueExtractionMutation.isPending}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md"
                >
                  {continueExtractionMutation.isPending ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Continuing...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Continue Extraction
                    </>
                  )}
                </Button>
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearState}
                  className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear State
                </Button> */}
              </>
            )}
            {/* {extractionState.status !== 'idle' && extractionState.status !== 'stopped' && extractionState.status !== 'processing' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearState}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear State
              </Button>
            )} */}
          </div>

          {/* Compact Error Display */}
          {extractionState.error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-3 w-3" />
              <AlertDescription className="text-red-800 text-xs">{extractionState.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 