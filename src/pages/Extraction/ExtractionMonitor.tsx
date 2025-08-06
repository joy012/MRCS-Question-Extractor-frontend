import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useGetExtractionLogsQuery, useGetExtractionStatusQuery } from '../../services/queries/useExtraction';
import {
  ExtractionHeader,
  ExtractionLogs,
  ExtractionStatus
} from './components';

const ExtractionMonitor: React.FC = () => {
  const { data: extractionState = null } = useGetExtractionStatusQuery();
  const { data: logs = { logs: [] } } = useGetExtractionLogsQuery();

  const handleRefresh = () => {
    window.location.reload();
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