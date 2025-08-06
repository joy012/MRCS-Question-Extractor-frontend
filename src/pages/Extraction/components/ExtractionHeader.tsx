import { BarChart3, Play, RefreshCw, Shield, TrendingUp } from 'lucide-react';
import React from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useToastHelpers } from '../../../components/ui/toast';
import { useGetPdfsQuery, useStartExtractionMutation } from '../../../services/queries/useExtraction';

interface ExtractionHeaderProps {
  isProcessing: boolean;
  onRefresh: () => void;
}

export const ExtractionHeader: React.FC<ExtractionHeaderProps> = ({
  isProcessing,
  onRefresh
}) => {
  const { data: availablePdfs = [] } = useGetPdfsQuery();
  const startExtractionMutation = useStartExtractionMutation();
  const { success, error } = useToastHelpers();

  const [showStartDialog, setShowStartDialog] = React.useState(false);
  const [selectedPdf, setSelectedPdf] = React.useState('');

  const handleStartExtraction = async () => {
    if (!selectedPdf) {
      error('Error', 'Please select a PDF file');
      return;
    }

    try {
      await startExtractionMutation.mutateAsync({
        filename: selectedPdf,
      });
      success('Success', 'Extraction started successfully');
      setShowStartDialog(false);
      setSelectedPdf('');
    } catch (err: any) {
      console.error('Failed to start extraction:', err);
      error('Error', 'Failed to start extraction');
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Extraction Monitor
                </h1>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
              <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <DialogTrigger asChild>
                  <Button
                    disabled={isProcessing}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Start Extraction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Start Extraction</DialogTitle>
                    <DialogDescription className="text-gray-600 text-sm">
                      Select a PDF file to extract questions from. The system will automatically process the entire PDF and only update unverified questions if the new extraction is better.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="pdf" className="text-sm font-medium text-gray-700">PDF File</Label>
                      <Select
                        value={selectedPdf}
                        onValueChange={setSelectedPdf}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a PDF file" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePdfs.map((pdf) => (
                            <SelectItem key={pdf} value={pdf}>
                              {pdf}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowStartDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleStartExtraction}
                      disabled={startExtractionMutation.isPending || !selectedPdf}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {startExtractionMutation.isPending ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Start Extraction
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Available PDFs</span>
              </div>
            </div>
          </CardHeader>
          <div className="px-4 pb-3">
            <div className="text-lg font-bold text-gray-900">{availablePdfs.length}</div>
            <p className="text-xs text-gray-500">Ready for extraction</p>
          </div>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">System Status</span>
              </div>
            </div>
          </CardHeader>
          <div className="px-4 pb-3">
            <div className="text-lg font-bold text-gray-900">
              {isProcessing ? 'Active' : 'Ready'}
            </div>
            <p className="text-xs text-gray-500">
              {isProcessing ? 'Processing in progress' : 'Ready to start'}
            </p>
          </div>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                  <Shield className="h-3 w-3 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">AI Model</span>
              </div>
            </div>
          </CardHeader>
          <div className="px-4 pb-3">
            <div className="text-lg font-bold text-gray-900">Llama 3.1</div>
            <p className="text-xs text-gray-500">Advanced AI model</p>
          </div>
        </Card>
      </div>
    </div>
  );
}; 