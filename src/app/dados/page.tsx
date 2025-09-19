import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, User, Users, TrendingUp, CheckCircle, ClipboardCheck } from 'lucide-react';

const kpis = [
    {
      title: 'Visitantes',
      value: '0',
      description: 'Visitantes que acessaram o funil',
      icon: <Eye className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Leads Adquiridos',
      value: '0',
      description: 'Iniciaram alguma interação com o funil',
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Taxa de Interação',
      value: '0.0%',
      description: 'Visitantes que interagiram com o funil',
      icon: <TrendingUp className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Leads Qualificados',
      value: '0',
      description: '+50% de etapas interagidas',
      icon: <CheckCircle className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Fluxos Completos',
      value: '0',
      description: 'Passaram da última etapa do funil',
      icon: <ClipboardCheck className="h-6 w-6 text-muted-foreground" />,
    },
];

export default function DashboardPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50">
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Dashboard de Comportamento</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {kpis.slice(0, 3).map((kpi) => (
                        <Card key={kpi.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                                {kpi.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{kpi.value}</div>
                                <p className="text-xs text-muted-foreground">{kpi.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="grid gap-4 mt-4 md:grid-cols-2">
                    {kpis.slice(3).map((kpi) => (
                        <Card key={kpi.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                                {kpi.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{kpi.value}</div>
                                <p className="text-xs text-muted-foreground">{kpi.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
