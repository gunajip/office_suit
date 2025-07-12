import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Download, Eye, Calendar, TrendingUp } from "lucide-react";

export default function Payroll() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const payrollData = [
    {
      id: 1,
      period: "January 2024",
      basicSalary: user.role === 'hr' ? 75000 : user.role === 'it' ? 65000 : 50000,
      allowances: 2000,
      deductions: 8500,
      overtime: 500,
      bonus: 1000,
      netPay: user.role === 'hr' ? 70000 : user.role === 'it' ? 60000 : 45000,
      status: "paid",
      payDate: "2024-01-31"
    },
    {
      id: 2,
      period: "December 2023",
      basicSalary: user.role === 'hr' ? 75000 : user.role === 'it' ? 65000 : 50000,
      allowances: 2000,
      deductions: 8500,
      overtime: 0,
      bonus: 5000,
      netPay: user.role === 'hr' ? 73500 : user.role === 'it' ? 63500 : 48500,
      status: "paid",
      payDate: "2023-12-31"
    },
    {
      id: 3,
      period: "November 2023",
      basicSalary: user.role === 'hr' ? 75000 : user.role === 'it' ? 65000 : 50000,
      allowances: 2000,
      deductions: 8500,
      overtime: 1000,
      bonus: 0,
      netPay: user.role === 'hr' ? 69500 : user.role === 'it' ? 59500 : 44500,
      status: "paid",
      payDate: "2023-11-30"
    }
  ];

  const currentPayroll = payrollData[0];
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">
            View your salary details and payslips
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {/* Current Salary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Salary
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(currentPayroll.basicSalary / 12)}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(currentPayroll.basicSalary)} annually
              </p>
            </CardContent>
          </Card>

          {/* Last Payslip */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Last Net Pay
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(currentPayroll.netPay / 12)}</div>
              <p className="text-xs text-muted-foreground">
                {currentPayroll.period}
              </p>
            </CardContent>
          </Card>

          {/* YTD Earnings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                YTD Earnings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(currentPayroll.netPay / 12)}</div>
              <p className="text-xs text-muted-foreground">
                As of {currentPayroll.payDate}
              </p>
            </CardContent>
          </Card>

          {/* Next Pay Date */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Next Pay Date
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Feb 29</div>
              <p className="text-xs text-muted-foreground">
                2024
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Payslip Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Current Payslip Breakdown</CardTitle>
            <CardDescription>{currentPayroll.period}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Earnings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-green-600">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Basic Salary</span>
                    <span className="text-sm font-medium">{formatCurrency(currentPayroll.basicSalary / 12)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Allowances</span>
                    <span className="text-sm font-medium">{formatCurrency(currentPayroll.allowances)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Overtime</span>
                    <span className="text-sm font-medium">{formatCurrency(currentPayroll.overtime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bonus</span>
                    <span className="text-sm font-medium">{formatCurrency(currentPayroll.bonus)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Earnings</span>
                    <span className="text-green-600">
                      {formatCurrency((currentPayroll.basicSalary / 12) + currentPayroll.allowances + currentPayroll.overtime + currentPayroll.bonus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-red-600">Deductions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Income Tax</span>
                    <span className="text-sm font-medium">{formatCurrency(currentPayroll.deductions * 0.6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Social Security</span>
                    <span className="text-sm font-medium">{formatCurrency(currentPayroll.deductions * 0.25)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Health Insurance</span>
                    <span className="text-sm font-medium">{formatCurrency(currentPayroll.deductions * 0.15)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Deductions</span>
                    <span className="text-red-600">{formatCurrency(currentPayroll.deductions)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Net Pay */}
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-lg font-semibold">Net Pay</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(currentPayroll.netPay / 12)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payroll History */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll History</CardTitle>
            <CardDescription>Your recent payslips and payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payrollData.map((payroll) => (
                <div key={payroll.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{payroll.period}</p>
                      <p className="text-sm text-muted-foreground">Paid on {payroll.payDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Gross Pay</p>
                      <p className="font-medium">{formatCurrency((payroll.basicSalary / 12) + payroll.allowances + payroll.overtime + payroll.bonus)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Deductions</p>
                      <p className="font-medium text-red-600">{formatCurrency(payroll.deductions)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Net Pay</p>
                      <p className="font-medium text-green-600">{formatCurrency(payroll.netPay / 12)}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}