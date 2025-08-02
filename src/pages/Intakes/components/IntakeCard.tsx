import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  TrendingUp,
  XCircle
} from 'lucide-react';
import React from 'react';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { DEFAULT_INTAKES } from '../../../constants/intakes';
import { getCardColorClasses } from '../../../lib/utils';
import type { Intake } from '../../../types/question';

interface IntakeCardProps {
  intake: Intake;
  onEdit: (intake: Intake) => void;
  onDelete: (intake: Intake) => void;
}

export const IntakeCard: React.FC<IntakeCardProps> = ({ intake, onEdit, onDelete }) => {
  const isPreseeded = (intake: Intake) => {
    return DEFAULT_INTAKES.some((defaultIntake) => defaultIntake.name === intake.name);
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'JANUARY':
        return 'January';
      case 'APRIL_MAY':
        return 'April/May';
      case 'SEPTEMBER':
        return 'September';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'JANUARY':
        return 'bg-blue-100 text-blue-800';
      case 'APRIL_MAY':
        return 'bg-green-100 text-green-800';
      case 'SEPTEMBER':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'JANUARY':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'APRIL_MAY':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'SEPTEMBER':
        return <BarChart3 className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const colorClasses = getCardColorClasses(intake.name);

  return (
    <Card className={`relative border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50 hover:shadow-xl transition-all duration-200 ${colorClasses.border}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {intake.displayName}
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={getTypeColor(intake.type)}>
                <div className="flex items-center gap-1">
                  {getTypeIcon(intake.type)}
                  {getTypeDisplayName(intake.type)}
                </div>
              </Badge>
              <div className="flex items-center gap-1">
                {getStatusIcon(intake.isActive)}
                <span className="text-xs text-gray-500">
                  {intake.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(intake)}
              className="hover:bg-white/80"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {!isPreseeded(intake) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(intake)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <span>{intake.questionCount} questions</span>
        </div>
        {isPreseeded(intake) && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-yellow-800">
              This is a default intake and cannot be deleted.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}; 