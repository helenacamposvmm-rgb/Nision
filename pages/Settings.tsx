import React from "react";
import { Settings as SettingsIcon, Shield, User, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";

const Settings: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10">
          <SettingsIcon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil
            </CardTitle>
            <CardDescription>Atualize suas informações pessoais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="Seu nome" defaultValue="Admin User" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" defaultValue="admin@promptpronto.com" />
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>Gerencie sua senha e autenticação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Autenticação de dois fatores</p>
                <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança.</p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;