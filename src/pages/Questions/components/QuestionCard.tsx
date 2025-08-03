import { BookOpen, CheckCircle, Edit, Eye, MoreVertical, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu';
import type { QuestionCardProps } from '../types';

// Utility functions
const getVerificationStatus = (isVerified?: boolean) => {
  if (isVerified) return { label: 'Verified', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  return { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' };
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return 'text-emerald-600 bg-emerald-50';
  if (confidence >= 0.6) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

const getCategoryDisplayName = (category: any) => {
  const type = category.type || 'BASIC';
  const displayName = category.displayName || category.name;
  return `${type.charAt(0) + type.slice(1).toLowerCase()}-${displayName}`;
};

const getIntakeDisplayName = (intake: any) => {
  const type = intake.type || 'JANUARY';
  const year = intake.year || new Date().getFullYear();
  return `${type} ${year}`;
};

// Question metadata component
const QuestionMetadata = ({ question, serialNumber }: { question: QuestionCardProps['question']; serialNumber: number }) => {
  const confidence = question.aiMetadata?.confidence || 0;
  const isVerified = question.status === 'APPROVED' || false;
  const status = getVerificationStatus(isVerified);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-bold text-base text-gray-900">#{serialNumber}</span>
        <Badge className={`${status.color} text-xs font-medium`}>
          {status.label}
        </Badge>
        <span className={`${getConfidenceColor(confidence)} text-xs font-medium px-2 py-0.5 rounded-full`}>
          {Math.round(confidence * 100)}% AI
        </span>
      </div>
    </div>
  );
};

// Intake information component
const IntakeInfo = ({ intake }: { intake: QuestionCardProps['question']['intake'] }) => (
  <div className="flex items-center gap-2 mb-2">
    <div className="flex items-center gap-1.5 text-xs text-gray-600">
      <BookOpen className="w-3 h-3" />
      <span className="font-medium">{getIntakeDisplayName(intake)}</span>
    </div>
  </div>
);

// Categories component
const QuestionCategories = ({ categories }: { categories: QuestionCardProps['question']['categories'] }) => (
  <div className="flex flex-wrap gap-1 mb-2">
    {categories.map((category) => (
      <Badge
        key={category.id}
        variant="outline"
        className="text-xs px-1.5 py-0.5 bg-blue-50 border-blue-200 text-blue-700 font-medium"
      >
        {getCategoryDisplayName(category)}
      </Badge>
    ))}
  </div>
);

// Answer options component
const AnswerOptions = ({ question }: { question: QuestionCardProps['question'] }) => {
  const validOptions = Object.entries(question.options).filter(([key]) =>
    ['A', 'B', 'C', 'D', 'E'].includes(key)
  );

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {validOptions.map(([key, value]) => (
        <div
          key={key}
          className={`flex items-start gap-1.5 p-2 rounded border transition-colors ${question.correctAnswer === key
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
        >
          <div
            className={`flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold flex-shrink-0 ${question.correctAnswer === key
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-200 text-gray-700'
              }`}
          >
            {key}
          </div>
          <span className="text-xs text-gray-700 leading-relaxed flex-1 min-w-0">{value}</span>
          {question.correctAnswer === key && (
            <Badge variant="default" className="bg-emerald-500 text-white text-xs px-1 py-0 ml-1 flex-shrink-0">
              Correct
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
};

// Action buttons component
const QuestionActions = ({
  question,
  onApprove,
  onReject
}: QuestionCardProps) => {
  const isVerified = question.status === 'APPROVED' || false;

  return (
    <div className="flex flex-col gap-1 min-w-fit">
      {!isVerified ? (
        <>
          <Button
            size="sm"
            variant="outline"
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 whitespace-nowrap h-7 px-2 text-xs"
            onClick={() => onApprove(question.id)}
          >
            <ThumbsUp className="w-3 h-3 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 whitespace-nowrap h-7 px-2 text-xs"
            onClick={() => onReject(question.id)}
          >
            <ThumbsDown className="w-3 h-3 mr-1" />
            Reject
          </Button>
        </>
      ) : (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 whitespace-nowrap text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      )}
    </div>
  );
};

// Dropdown menu component
const QuestionDropdown = ({ question, onEdit, onDelete }: Pick<QuestionCardProps, 'question' | 'onEdit' | 'onDelete'>) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
        <MoreVertical className="h-3.5 w-3.5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link to={`/questions/${question.id}`}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onEdit(question)}>
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => onDelete(question.id)}
        className="text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Main QuestionCard component
export const QuestionCard = ({ question, onEdit, onDelete, onApprove, onReject, serialNumber }: QuestionCardProps) => {
  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Left Section - Question Info */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-2">
              <QuestionMetadata question={question} serialNumber={serialNumber} />
              <div className='flex flex-row gap-1'>
                <QuestionDropdown question={question} onEdit={onEdit} onDelete={onDelete} />
                <QuestionActions
                  question={question}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onApprove={onApprove}
                  onReject={onReject}
                  serialNumber={serialNumber}
                />
              </div>
            </div>

            {/* Intake Information */}
            <IntakeInfo intake={question.intake} />

            {/* Categories */}
            <QuestionCategories categories={question.categories} />

            {/* Question Text */}
            <div className="mb-2">
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-100">
                {question.question}
              </p>
            </div>

            {/* Answer Options */}
            <AnswerOptions question={question} />
          </div>


        </div>
      </CardContent>
    </Card>
  );
}; 