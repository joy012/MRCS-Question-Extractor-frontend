import { CheckCircle, Edit, Eye, MoreVertical, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
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
  if (isVerified) return { label: 'Verified', color: 'bg-green-100 text-green-800 border-green-200' };
  return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return 'text-green-600';
  if (confidence >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

// Question metadata component
const QuestionMetadata = ({ question, serialNumber }: { question: QuestionCardProps['question']; serialNumber: number }) => {
  const confidence = question.extractionMetadata?.confidence || 0;
  const isVerified = question.extractionMetadata?.manuallyVerified || false;
  const status = getVerificationStatus(isVerified);

  return (
    <div className="flex items-center gap-4">
      <span className="font-bold text-lg text-gray-900">#{serialNumber}</span>
      <div className="flex items-center gap-2">
        {question.pageNumber && (
          <Badge variant="outline" className="text-xs">
            Page {question.pageNumber}
          </Badge>
        )}
        {question.examYear && (
          <Badge variant="outline" className="text-xs">
            {question.examYear}
          </Badge>
        )}
        <Badge className={`${status.color} text-xs`}>
          {status.label}
        </Badge>
        <span className={`${getConfidenceColor(confidence)} text-xs font-medium bg-gray-50 px-2 py-1 rounded`}>
          {Math.round(confidence * 100)}% AI Confidence
        </span>
      </div>
    </div>
  );
};

// Categories component
const QuestionCategories = ({ categories }: { categories: QuestionCardProps['question']['categories'] }) => (
  <div className="flex flex-wrap gap-1 mb-3">
    {categories.map((category) => (
      <Badge key={category._id} variant="outline" className="text-xs px-2 py-1 bg-gray-50">
        {category.displayName.replace(/_/g, ' ')}
      </Badge>
    ))}
  </div>
);

// Answer options component
const AnswerOptions = ({ question }: { question: QuestionCardProps['question'] }) => {
  // Filter out _id from options and only show A, B, C, D
  const validOptions = Object.entries(question.options).filter(([key]) =>
    ['A', 'B', 'C', 'D'].includes(key)
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      {validOptions.map(([key, value]) => (
        <div
          key={key}
          className={`flex items-start gap-2 p-2 rounded-lg border transition-colors ${question.correctAnswer === key
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
        >
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${question.correctAnswer === key
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700'
              }`}
          >
            {key}
          </div>
          <span className="text-xs text-gray-700 leading-relaxed flex-1 min-w-0">{value}</span>
          {question.correctAnswer === key && (
            <Badge variant="default" className="bg-green-500 text-white text-xs px-1 py-0 ml-1 flex-shrink-0">
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
  const isVerified = question.extractionMetadata?.manuallyVerified || false;

  return (
    <div className="flex flex-col gap-2 min-w-fit">
      {!isVerified ? (
        <>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 whitespace-nowrap"
            onClick={() => onApprove(question._id)}
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 whitespace-nowrap"
            onClick={() => onReject(question._id)}
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </>
      ) : (
        <Badge className="bg-green-100 text-green-800 border-green-200 whitespace-nowrap">
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
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link to={`/questions/${question._id}`}>
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
        onClick={() => onDelete(question._id)}
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
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Left Section - Question Info */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-3">
              <QuestionMetadata question={question} serialNumber={serialNumber} />
              <QuestionDropdown question={question} onEdit={onEdit} onDelete={onDelete} />
            </div>

            {/* Categories */}
            <QuestionCategories categories={question.categories} />

            {/* Question Text */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                {question.question}
              </p>
            </div>

            {/* Answer Options */}
            <AnswerOptions question={question} />
          </div>

          {/* Right Section - Action Buttons */}
          <QuestionActions
            question={question}
            onEdit={onEdit}
            onDelete={onDelete}
            onApprove={onApprove}
            onReject={onReject}
            serialNumber={serialNumber}
          />
        </div>
      </CardContent>
    </Card>
  );
}; 