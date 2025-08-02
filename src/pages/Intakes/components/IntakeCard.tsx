import { Calendar, CheckCircle, Edit, Trash2, XCircle } from 'lucide-react';
import React from 'react';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
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

  const colorClasses = getCardColorClasses(intake.name);

  return (
    <Card className={`relative ${colorClasses.border}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              {intake.displayName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className={getTypeColor(intake.type)}>
                {getTypeDisplayName(intake.type)}
              </Badge>
              {getStatusIcon(intake.isActive)}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(intake)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {!isPreseeded(intake) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(intake)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{intake.questionCount} questions</span>
        </div>
        {isPreseeded(intake) && (
          <Alert className="mt-3">
            <AlertDescription>This is a default intake and cannot be deleted.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}; 