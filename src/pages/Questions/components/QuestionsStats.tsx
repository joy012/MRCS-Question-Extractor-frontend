import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import type { QuestionsStatsTypes } from '../types';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  iconColor: string;
  isLoading?: boolean;
}

const StatsCard = ({ title, value, subtitle, icon, iconColor, isLoading }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className={iconColor}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          typeof value === 'number' ? value.toLocaleString() : value
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          subtitle
        )}
      </p>
    </CardContent>
  </Card>
);

export const QuestionsStats = ({ totalQuestions, verifiedCount, pendingCount, isLoading }: QuestionsStatsTypes) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Questions"
        value={totalQuestions}
        subtitle={`${totalQuestions} total questions`}
        icon={<BookOpen className="h-4 w-4" />}
        iconColor="text-primary"
        isLoading={isLoading}
      />

      <StatsCard
        title="Approved"
        value={verifiedCount}
        subtitle={`${totalQuestions > 0 ? Math.round((verifiedCount / totalQuestions) * 100) : 0}% of total`}
        icon={<CheckCircle className="h-4 w-4" />}
        iconColor="text-green-600"
        isLoading={isLoading}
      />

      <StatsCard
        title="Pending Review"
        value={pendingCount}
        subtitle="Need review"
        icon={<Clock className="h-4 w-4" />}
        iconColor="text-yellow-600"
        isLoading={isLoading}
      />
    </div>
  );
}; 