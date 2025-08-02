import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { Category, Intake } from '../../../types/question';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { questionSchema, type QuestionFormData } from './types';

interface QuestionFormProps {
  defaultValues?: Partial<QuestionFormData>;
  onSubmit: (data: QuestionFormData) => void;
  categories: Category[];
  intakes: Intake[];
  isEdit?: boolean;
  isLoading?: boolean;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  defaultValues,
  onSubmit,
  categories,
  intakes,
}) => {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: '',
      options: {
        A: '',
        B: '',
        C: '',
        D: '',
        E: '',
      },
      correctAnswer: 'A',
      description: '',
      year: new Date().getFullYear(),
      intake: '',
      categories: [],
      explanation: '',
      status: 'PENDING',
      ...defaultValues,
    },
  });

  const handleSubmit = (data: QuestionFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form id="question-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the question text..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="options.A"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option A</FormLabel>
                <FormControl>
                  <Input placeholder="Enter option A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="options.B"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option B</FormLabel>
                <FormControl>
                  <Input placeholder="Enter option B" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="options.C"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option C</FormLabel>
                <FormControl>
                  <Input placeholder="Enter option C" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="options.D"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option D</FormLabel>
                <FormControl>
                  <Input placeholder="Enter option D" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="options.E"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option E</FormLabel>
                <FormControl>
                  <Input placeholder="Enter option E" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="correctAnswer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correct Answer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="E">E</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2024"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="intake"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intake</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intake" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {intakes.map((intake) => (
                      <SelectItem key={intake._id} value={intake._id}>
                        {intake.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(category._id)}
                        onChange={(e) => {
                          const currentCategories = field.value || [];
                          if (e.target.checked) {
                            field.onChange([...currentCategories, category._id]);
                          } else {
                            field.onChange(currentCategories.filter(id => id !== category._id));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{category.displayName}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional context or description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explanation or solution..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}; 