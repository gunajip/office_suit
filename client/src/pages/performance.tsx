import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Award } from "lucide-react";

export default function Performance() {
  const topPerformers = [
    { name: "Sarah Wilson", department: "Marketing", score: 95, rank: 1 },
    { name: "John Davis", department: "Development", score: 92, rank: 2 },
    { name: "Lisa Chen", department: "Design", score: 90, rank: 3 },
    { name: "Mike Rodriguez", department: "Sales", score: 88, rank: 4 },
    { name: "Emma Thompson", department: "HR", score: 87, rank: 5 },
  ];

  const performanceReviews = [
    { name: "Sarah Wilson", email: "sarah.wilson@company.com", department: "Marketing", score: 95, reviewDate: "2024-01-10" },
    { name: "John Davis", email: "john.davis@company.com", department: "Development", score: 92, reviewDate: "2024-01-08" },
    { name: "Lisa Chen", email: "lisa.chen@company.com", department: "Design", score: 90, reviewDate: "2024-01-05" },
    { name: "Mike Rodriguez", email: "mike.rodriguez@company.com", department: "Sales", score: 88, reviewDate: "2024-01-03" },
    { name: "Emma Thompson", email: "emma.thompson@company.com", department: "HR", score: 87, reviewDate: "2024-01-01" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return rank;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">Performance analytics chart would be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">Integration with charting library like Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer) => (
                <div key={performer.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">
                        {getRankIcon(performer.rank)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                      <p className="text-xs text-gray-500">{performer.department}</p>
                    </div>
                  </div>
                  <Badge className={getScoreColor(performer.score)}>
                    {performer.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Performance Reviews</CardTitle>
            <Button>
              New Review
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceReviews.map((review) => (
                  <tr key={review.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 text-sm font-medium">
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{review.name}</div>
                          <div className="text-sm text-gray-500">{review.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {review.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getScoreColor(review.score)}>
                        {review.score}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
