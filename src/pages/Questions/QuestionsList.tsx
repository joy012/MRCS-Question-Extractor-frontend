import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const QuestionsList = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Questions Management</CardTitle>
          <CardDescription>
            Browse, search, and manage your question bank
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Questions management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionsList; 