import { cn } from '@/lib/utils';
import { BookOpen, Brain, Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
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
const IntakeInfo = ({ intake, year }: { intake: string, year: number }) => (
  <div className="flex items-center gap-2 mb-2">
    <div className="flex items-center gap-1.5 text-xs text-gray-600">
      <BookOpen className="w-3 h-3" />
      <span className="font-medium">{intake} {year}</span>
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

// AI Explanation Dialog Component
const AiExplanationDialog = ({
  question,
  isOpen,
  onClose
}: {
  question: QuestionCardProps['question'];
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!min-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Explanation
          </DialogTitle>
          <DialogDescription>
            AI-generated explanation for this medical question
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* AI Explanation */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[]}
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold mt-6 mb-3 text-gray-900">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold mt-5 mb-2 text-gray-800">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-medium mt-4 mb-2 text-gray-800">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-sm font-medium mt-3 mb-1 text-gray-800">{children}</h4>,
                  p: ({ children }) => <p className="mb-3 text-sm leading-relaxed whitespace-pre-wrap">{children}</p>,
                  ul: ({ children }) => <ul className="mb-4 ml-6 space-y-1 list-disc text-sm">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-4 ml-6 space-y-1 list-decimal text-sm">{children}</ol>,
                  li: ({ children }) => <li className="text-sm leading-relaxed mb-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                  code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto mb-3">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-3">{children}</blockquote>,
                  hr: () => <hr className="my-4 border-gray-300" />,
                  br: () => <br />,
                }}
              >
                {question.explanation || 'No explanation available'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main QuestionCard component
export const QuestionCard = ({ question, onEdit, onDelete, serialNumber }: QuestionCardProps) => {
  const [isExplanationDialogOpen, setIsExplanationDialogOpen] = useState(false);
  const hasExplanation = question.explanation && question.explanation.trim() !== '';

  return (
    <>
      <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200 group">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            {/* Left Section - Question Info */}
            <div className="flex-1 min-w-0">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-2">
                <QuestionMetadata question={question} serialNumber={serialNumber} />
                <div className='flex flex-row gap-1'>
                  {/* AI Explanation Icon */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 hover:bg-purple-50 relative ${hasExplanation
                            ? 'text-purple-600 hover:text-purple-700'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                          onClick={() => hasExplanation && setIsExplanationDialogOpen(true)}

                        >
                          <Brain className={cn("h-4 w-4", hasExplanation ? 'text-purple-600' : 'text-gray-400')} />

                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {hasExplanation ? 'Has AI Explanation' : 'No AI Explanation'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <QuestionDropdown question={question} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </div>

              {/* Intake Information */}
              <IntakeInfo intake={question.intake.displayName} year={question.year} />

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

      {/* AI Explanation Dialog */}
      <AiExplanationDialog
        question={question}
        isOpen={isExplanationDialogOpen}
        onClose={() => setIsExplanationDialogOpen(false)}
      />
    </>
  );
}; 