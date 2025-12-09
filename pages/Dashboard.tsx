import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  BarChart3, 
  History, 
  PenTool 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Bem-vindo de volta. Crie e gerencie seus prompts de alta performance.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prompts Gerados</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites Criados</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 novos esta semana</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <History className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">+0.4% média global</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Tool */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <PenTool className="h-5 w-5 text-primary" />
              Criar Landing Page
            </CardTitle>
            <CardDescription>
              Utilize nossa IA avançada para gerar prompts estruturados para landing pages de alta conversão.
              Ideal para agências e freelancers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                Framework AIDA
              </span>
              <span className="flex items-center gap-1">
                <span className="block h-2 w-2 rounded-full bg-blue-500"></span>
                Copywriting Otimizado
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/create-site">
              <Button size="lg" className="gap-2">
                Começar Agora <ArrowRight size={16} />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Histórico Recente</CardTitle>
            <CardDescription>Seus últimos prompts gerados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">SaaS Financeiro</p>
                    <p className="text-xs text-muted-foreground">Landing Page • Dark Theme</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">Ver</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
