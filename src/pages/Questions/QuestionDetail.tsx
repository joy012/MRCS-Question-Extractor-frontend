import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Edit,
  Save,
  Tag,
  Target,
  Trash2,
  Users,
  X
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { Skeleton } from '../../components/ui/skeleton';
import { Textarea } from '../../components/ui/textarea';
import { useDeleteQuestionMutation, useGetQuestionQuery, useUpdateQuestionMutation } from '../../services/queries/useQuestions';
import type { Question, QuestionStatus, UpdateQuestionData } from '../../types';

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Question>>({});

  // API hooks
  const { data: question, isLoading, error } = useGetQuestionQuery(id!);
  const updateMutation = useUpdateQuestionMutation();
  const deleteMutation = useDeleteQuestionMutation();

  // Initialize edit form when question loads
  React.useEffect(() => {
    if (question && !isEditing) {
      setEditForm(question);
    }
  }, [question, isEditing]);

  // Memoized computed values
  const confidence = useMemo(() => question?.aiMetadata?.confidence || 0, [question?.aiMetadata?.confidence]);
  const statusColor = useMemo(() => {
    switch (question?.status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  }, [question?.status]);

  // Handlers
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditForm(question || {});
  }, [question]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditForm(question || {});
  }, [question]);

  const handleSave = useCallback(async () => {
    if (!id || !editForm) return;

    try {
      const updateData: UpdateQuestionData = {
        question: editForm.question,
        options: editForm.options,
        correctAnswer: editForm.correctAnswer,
        categories: editForm.categories?.map(cat => cat._id),
        year: editForm.year,
        explanation: editForm.explanation,
        status: editForm.status,
      };

      await updateMutation.mutateAsync({ id, data: updateData });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  }, [id, editForm, updateMutation]);

  const handleDelete = useCallback(async () => {
    if (!id) return;

    try {
      await deleteMutation.mutateAsync(id);
      navigate('/questions');
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  }, [id, deleteMutation, navigate]);

  const handleApprove = useCallback(async () => {
    if (!id) return;

    try {
      const updateData: UpdateQuestionData = {
        status: 'approved' as QuestionStatus,
      };

      await updateMutation.mutateAsync({ id, data: updateData });
    } catch (error) {
      console.error('Failed to approve question:', error);
    }
  }, [id, updateMutation]);

  const handleReject = useCallback(async () => {
    if (!id) return;

    try {
      const updateData: UpdateQuestionData = {
        status: 'rejected' as QuestionStatus,
      };

      await updateMutation.mutateAsync({ id, data: updateData });
    } catch (error) {
      console.error('Failed to reject question:', error);
    }
  }, [id, updateMutation]);

  const handleCopy = useCallback(() => {
    if (!question) return;

    const questionText = `Question: ${question.question}\n\nA) ${question.options.A}\nB) ${question.options.B}\nC) ${question.options.C}\nD) ${question.options.D}\nE) ${question.options.E}\n\nCorrect Answer: ${question.correctAnswer}`;
    navigator.clipboard.writeText(questionText);
  }, [question]);

  const updateEditForm = useCallback((field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateOption = useCallback((key: 'A' | 'B' | 'C' | 'D' | 'E', value: string) => {
    setEditForm(prev => ({
      ...prev,
      options: {
        A: prev.options?.A || '',
        B: prev.options?.B || '',
        C: prev.options?.C || '',
        D: prev.options?.D || '',
        E: prev.options?.E || '',
        [key]: value,
      }
    }));
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Question Not Found</h3>
          <p className="text-muted-foreground">
            {error?.message || 'The requested question could not be found.'}
          </p>
        </div>
        <Button asChild>
          <Link to="/questions">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Questions
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/questions">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Question Details</h1>
            <p className="text-muted-foreground">
              Year {question.year} • ID: {question.id.slice(-8)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              {question.status === 'pending' && (
                <>
                  <Button variant="default" size="sm" onClick={handleApprove}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleReject}>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Question</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this question? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Content */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Question Content
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${statusColor} border`}
                  >
                    {question.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {question.status === 'rejected' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {question.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                  </Badge>
                  {confidence > 0 && (
                    <Badge variant="secondary">
                      {Math.round(confidence)}% confidence
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Text */}
              <div className="space-y-3">
                <Label htmlFor="question-text" className="text-sm font-medium">Question</Label>
                {isEditing ? (
                  <Textarea
                    id="question-text"
                    value={editForm.question || ''}
                    onChange={(e) => updateEditForm('question', e.target.value)}
                    className="min-h-[120px] resize-none"
                    placeholder="Enter the question text..."
                  />
                ) : (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">{question.question}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Answer Options */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Answer Options</Label>
                {(['A', 'B', 'C', 'D', 'E'] as const).map((option) => (
                  <div key={option} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={question.correctAnswer === option ? "default" : "outline"}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${question.correctAnswer === option ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}
                      >
                        {option}
                      </Badge>
                      {question.correctAnswer === option && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Correct Answer
                        </Badge>
                      )}
                    </div>
                    {isEditing ? (
                      <Textarea
                        value={editForm.options?.[option] || ''}
                        onChange={(e) => updateOption(option, e.target.value)}
                        placeholder={`Enter option ${option}...`}
                        className="ml-11 resize-none"
                      />
                    ) : (
                      <div className="ml-11 p-3 bg-muted/30 rounded-lg border">
                        <p className="text-foreground">{question.options[option]}</p>
                      </div>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <div className="ml-11 space-y-2">
                    <Label htmlFor="correct-answer" className="text-sm font-medium">Correct Answer</Label>
                    <Select
                      value={editForm.correctAnswer || ''}
                      onValueChange={(value) => updateEditForm('correctAnswer', value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                        <SelectItem value="E">E</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Explanation */}
              <Separator />
              <div className="space-y-3">
                <Label htmlFor="explanation" className="text-sm font-medium">Explanation (Optional)</Label>
                {isEditing ? (
                  <Textarea
                    id="explanation"
                    value={editForm.explanation || ''}
                    onChange={(e) => updateEditForm('explanation', e.target.value)}
                    placeholder="Add an explanation for this question..."
                    className="resize-none"
                  />
                ) : question.explanation ? (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">{question.explanation}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">No explanation provided</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Categories and Metadata */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Tag className="h-6 w-6 text-primary" />
                Categories & Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Categories */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Medical Categories</Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Category editing will be implemented with multi-select component
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {question.categories.map((category) => (
                      <Badge key={category._id} variant="secondary" className="text-xs">
                        {category.displayName}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Exam Year */}
              <div className="space-y-3">
                <Label htmlFor="exam-year" className="text-sm font-medium">Exam Year</Label>
                {isEditing ? (
                  <Input
                    id="exam-year"
                    type="number"
                    min="2000"
                    max="2030"
                    value={editForm.year || ''}
                    onChange={(e) => updateEditForm('year', parseInt(e.target.value))}
                    className="w-32"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{question.year}</span>
                  </div>
                )}
              </div>

              {/* Intake */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Intake</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{question.intake.displayName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Status & Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge
                    variant="outline"
                    className={`${statusColor} border`}
                  >
                    {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                  </Badge>
                </div>

                {confidence > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Confidence</span>
                      <span className="text-sm font-medium">{Math.round(confidence)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Extraction Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                AI Extraction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Extracted</span>
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Modified</span>
                  <span>{new Date(question.updatedAt).toLocaleDateString()}</span>
                </div>

                {question.aiMetadata?.extractedBy && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span>{question.aiMetadata.extractedBy}</span>
                  </div>
                )}

                {question.aiMetadata?.aiModel && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AI Model</span>
                    <span>{question.aiMetadata.aiModel}</span>
                  </div>
                )}

                {question.aiMetadata?.processingTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Time</span>
                    <span>{question.aiMetadata.processingTime}ms</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to={`/questions?year=${question.year}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {question.year} Questions
                </Link>
              </Button>

              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to={`/questions?intake=${question.intake._id}`}>
                  <Users className="w-4 h-4 mr-2" />
                  {question.intake.displayName} Questions
                </Link>
              </Button>

              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Question
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail; 