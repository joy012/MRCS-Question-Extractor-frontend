import { AlertCircle, CheckCircle, Clock, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { ExtractionState } from './types';

interface ExtractionStatisticsProps {
  extractionState: ExtractionState;
}

export const ExtractionStatistics: React.FC<ExtractionStatisticsProps> = ({
  extractionState
}) => {
  // Only show statistics if not idle
  if (extractionState.status === 'idle') {
    return null;
  }

  const stats = [
    {
      label: 'Extracted',
      value: extractionState.extractedQuestions || 0,
      icon: TrendingUp,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Verified',
      value: extractionState.verifiedQuestions || 0,
      icon: CheckCircle,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100/50',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600'
    },
    {
      label: 'Updated',
      value: extractionState.updatedQuestions || 0,
      icon: Zap,
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100/50',
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-600'
    },
    {
      label: 'Skipped',
      value: extractionState.skippedQuestions || 0,
      icon: AlertCircle,
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100/50',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Extraction Analytics</h2>
          <p className="text-xs text-gray-600">Real-time performance metrics</p>
        </div>
      </div>

      {/* Compact Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className={`border-0 shadow-md bg-gradient-to-br ${stat.bgGradient} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                      <IconComponent className={`h-4 w-4 ${stat.iconColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium text-gray-700">
                        {stat.label}
                      </CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${stat.gradient}`}></div>
                    <span className="text-xs text-gray-500 font-medium">
                      {stat.label.toLowerCase()} questions
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Compact Summary Card */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">
                Performance Summary
              </CardTitle>
              <p className="text-xs text-gray-600">
                Overall extraction performance metrics
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
              <div className="text-xl font-bold text-gray-900">
                {((extractionState.extractedQuestions / Math.max(extractionState.extractedQuestions + extractionState.skippedQuestions, 1)) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600 mt-1">Success Rate</div>
            </div>
            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
              <div className="text-xl font-bold text-gray-900">
                {extractionState.processedPages}
              </div>
              <div className="text-xs text-gray-600 mt-1">Pages Processed</div>
            </div>
            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
              <div className="text-xl font-bold text-gray-900">
                {extractionState.failedPages.length}
              </div>
              <div className="text-xs text-gray-600 mt-1">Failed Pages</div>
            </div>
            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
              <div className="text-xl font-bold text-gray-900">
                {extractionState.extractedQuestions > 0 ? Math.round(extractionState.extractedQuestions / extractionState.processedPages) : 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Avg/Page</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 