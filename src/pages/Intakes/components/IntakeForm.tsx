import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { intakeSchema, type IntakeFormData } from './IntakeForm/types';

interface IntakeFormProps {
  defaultValues?: Partial<IntakeFormData>;
  onSubmit: (data: IntakeFormData) => void;
  isEdit?: boolean;
  isLoading?: boolean;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({
  defaultValues,
  onSubmit,
  isEdit = false,
}) => {
  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      name: '',
      type: 'JANUARY',
      displayName: '',
      isActive: true,
      ...defaultValues,
    },
  });

  const handleSubmit = (data: IntakeFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form id="intake-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (Slug)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., january-2024"
                    disabled={isEdit}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., January 2024"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intake type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="JANUARY">January</SelectItem>
                  <SelectItem value="APRIL_MAY">April/May</SelectItem>
                  <SelectItem value="SEPTEMBER">September</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="rounded"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}; 