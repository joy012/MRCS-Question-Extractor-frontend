import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToastHelpers } from '../../components/ui/toast';
import { useClearExtractionStateMutation, useGetExtractionLogsQuery, useGetExtractionStatusQuery } from '../../services/queries/useExtraction';
import {
  ExtractionHeader,
  ExtractionLogs,
  ExtractionStatus
} from './components';

const ExtractionMonitor: React.FC = () => {
  const { data: extractionState = null } = useGetExtractionStatusQuery();
  const { data: logs = { logs: [] } } = useGetExtractionLogsQuery();
  const clearExtractionMutation = useClearExtractionStateMutation();
  const { success, error } = useToastHelpers();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClearState = async () => {
    try {
      await clearExtractionMutation.mutateAsync();
      success('Success', 'Extraction state cleared');
    } catch (err: any) {
      console.error('Failed to clear extraction state:', err);
      error('Error', 'Failed to clear extraction state');
    }
  };

  // Loading state
  if (!extractionState) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Extraction Monitor</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isProcessing = extractionState.status === 'processing';

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <ExtractionHeader
        isProcessing={isProcessing}
        onRefresh={handleRefresh}
      />

      {/* Current Status */}
      <ExtractionStatus
        extractionState={extractionState}
        onClearState={handleClearState}
      />


      {/* Logs */}
      <ExtractionLogs
        logs={logs.logs}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default ExtractionMonitor; 