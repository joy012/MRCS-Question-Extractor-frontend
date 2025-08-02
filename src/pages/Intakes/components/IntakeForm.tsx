import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  ToggleLeft,
  Type,
  Zap
} from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
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
      <form id="intake-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Name (Slug)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., january-2024"
                      disabled={isEdit}
                      className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
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
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Display Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., January 2024"
                      className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Intake Type Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Intake Type</h3>
          </div>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Type
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200">
                      <SelectValue placeholder="Select intake type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="JANUARY" className="hover:bg-blue-50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        January
                      </div>
                    </SelectItem>
                    <SelectItem value="APRIL_MAY" className="hover:bg-green-50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        April/May
                      </div>
                    </SelectItem>
                    <SelectItem value="SEPTEMBER" className="hover:bg-purple-50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        September
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <ToggleLeft className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Status</h3>
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-gray-50/50 to-green-50/50 rounded-xl border border-gray-200/50">
                <div className="space-y-1">
                  <FormLabel className="text-sm font-medium text-gray-900">Active</FormLabel>
                  <p className="text-xs text-gray-500">
                    Enable this intake for question organization
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-green-600"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}; 