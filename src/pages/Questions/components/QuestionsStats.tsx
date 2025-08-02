import {
  BookOpen,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import type { QuestionsStatsTypes } from '../types';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  isLoading?: boolean;
}

const StatsCard = ({ title, value, subtitle, icon, iconColor, bgColor, isLoading }: StatsCardProps) => (
  <Card className={`border-0 shadow-sm ${bgColor}`}>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor.replace('text-', 'bg-').replace('-600', '-500/10')}`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
      </div>
    </CardHeader>
    <div className="px-6 pb-4">
      <div className="text-2xl font-bold text-gray-900">
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          typeof value === 'number' ? value.toLocaleString() : value
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {isLoading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          subtitle
        )}
      </p>
    </div>
  </Card>
);

export const QuestionsStats = ({ totalQuestions, verifiedCount, pendingCount, isLoading }: QuestionsStatsTypes) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Questions"
        value={totalQuestions}
        subtitle={`${totalQuestions} total questions`}
        icon={<BookOpen className="h-4 w-4 text-blue-600" />}
        iconColor="text-blue-600"
        bgColor="bg-gradient-to-br from-blue-50 to-blue-100/50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Approved"
        value={verifiedCount}
        subtitle={`${totalQuestions > 0 ? Math.round((verifiedCount / totalQuestions) * 100) : 0}% of total`}
        icon={<CheckCircle className="h-4 w-4 text-green-600" />}
        iconColor="text-green-600"
        bgColor="bg-gradient-to-br from-green-50 to-green-100/50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Pending Review"
        value={pendingCount}
        subtitle="Need review"
        icon={<Clock className="h-4 w-4 text-yellow-600" />}
        iconColor="text-yellow-600"
        bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100/50"
        isLoading={isLoading}
      />
    </div>
  );
}; 