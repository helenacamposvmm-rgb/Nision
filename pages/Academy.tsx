import React from "react";
import { GraduationCap, Users, ArrowRight, BookOpen, MessageCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const Academy: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-8 items-center">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
            <Sparkles size={12} className="mr-1" />
            Novo
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Academy AI
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Aprenda estratégias, técnicas e ferramentas de marketing digital e inteligência artificial diretamente com a nossa comunidade exclusiva.
          </p>
        </div>
        <div className="hidden md:block p-4 bg-primary/5 rounded-full">
            <GraduationCap size={64} className="text-primary/40" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main CTA Card */}
        <Card className="md:col-span-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-6 w-6 text-primary" />
              Comunidade Exclusiva
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Junte-se a especialistas e outros usuários para trocar experiências, prompts valiosos e estratégias de crescimento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border">
                    <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
                        <MessageCircle size={18} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm">Networking</h4>
                        <p className="text-xs text-muted-foreground">Conecte-se com profissionais.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border">
                    <div className="p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 rounded-md">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm">Conteúdo Diário</h4>
                        <p className="text-xs text-muted-foreground">Dicas e tutoriais exclusivos.</p>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8 shadow-md hover:shadow-lg transition-all" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    Entrar no Grupo de Network <ArrowRight size={18} />
                </a>
                </Button>
                <p className="text-xs text-muted-foreground mt-3 ml-1">
                    * Acesso gratuito para membros da plataforma.
                </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Card / Sidebar */}
        <Card className="flex flex-col justify-between">
            <CardHeader>
                <CardTitle className="text-lg">Próximas Aulas</CardTitle>
                <CardDescription>Conteúdo chegando em breve.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="h-2 w-full bg-muted rounded overflow-hidden">
                        <div className="h-full bg-primary/50 w-3/4"></div>
                    </div>
                    <p className="text-sm font-medium">Dominando o Gemini 2.5</p>
                </div>
                <div className="space-y-3">
                    <div className="h-2 w-full bg-muted rounded overflow-hidden">
                        <div className="h-full bg-primary/30 w-1/2"></div>
                    </div>
                    <p className="text-sm font-medium">Automação de Leads</p>
                </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
                <Button variant="outline" className="w-full" disabled>
                    Ver Calendário
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Academy;