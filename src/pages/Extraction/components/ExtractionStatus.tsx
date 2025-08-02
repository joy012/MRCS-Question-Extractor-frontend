import { AlertCircle, CheckCircle, Clock, RefreshCw, Square, XCircle, Activity, Target, Zap } from 'lucide-react';
import React from 'react';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { useToastHelpers } from '../../../components/ui/toast';
import { useStopExtractionMutation } from '../../../services/queries/useExtraction';
import type { ExtractionState } from './types';

interface ExtractionStatusProps {
  extractionState: ExtractionState;
  onClearState: () => void;
}

export const ExtractionStatus: React.FC<ExtractionStatusProps> = ({ 
  extractionState, 
  onClearState 
}) => {
  const stopExtractionMutation = useStopExtractionMutation();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Activity className="h-5 w-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'stopped':
        return <Square className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
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
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className={`border-0 shadow-lg bg-gradient-to-br ${getStatusGradient(extractionState.status)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm">
                {getStatusIcon(extractionState.status)}
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Current Status
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time extraction monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(extractionState.status)} font-semibold`}>
                {extractionState.status.toUpperCase()}
              </Badge>
              {extractionState.status === 'processing' && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-600 font-medium">Live</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Info */}
          {extractionState.selectedPdf && (
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Processing File</p>
                <p className="text-sm text-gray-600">{extractionState.selectedPdf}</p>
              </div>
            </div>
          )}

          {/* Progress Section */}
          {extractionState.status === 'processing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">Progress</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{extractionState.progress}%</span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={extractionState.progress} 
                  className="h-3 bg-blue-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
                  <div className="text-lg font-bold text-gray-900">
                    {extractionState.processedPages}
                  </div>
                  <div className="text-xs text-gray-600">Pages Processed</div>
                </div>
                <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
                  <div className="text-lg font-bold text-gray-900">
                    {extractionState.totalPages}
                  </div>
                  <div className="text-xs text-gray-600">Total Pages</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {extractionState.status === 'processing' && (
              <Button
                variant="destructive"
                size="lg"
                onClick={handleStopExtraction}
                disabled={stopExtractionMutation.isPending}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
              >
                {stopExtractionMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Stopping...
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Extraction
                  </>
                )}
              </Button>
            )}
            {extractionState.status !== 'idle' && (
              <Button
                variant="outline"
                size="lg"
                onClick={onClearState}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300"
              >
                Clear State
              </Button>
            )}
          </div>

          {/* Error Display */}
          {extractionState.error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{extractionState.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 