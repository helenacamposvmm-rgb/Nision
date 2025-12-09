import React, { useState, useEffect } from "react";
import { MessageSquare, Wand2, Copy, Save, Send, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { GoogleGenAI } from "@google/genai";
import { Project } from "../types";
import { useLocation } from "react-router-dom";

const GenerateApproach: React.FC = () => {
  const location = useLocation();

  const [target, setTarget] = useState("");
  const [tone, setTone] = useState("");
  const [objective, setObjective] = useState("");
  const [details, setDetails] = useState("");
  
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && (location.state as any).project) {
      const project = (location.state as any).project as Project;
      setTarget(project.formData.target || "");
      setTone(project.formData.tone || "");
      setObjective(project.formData.objective || "");
      setDetails(project.formData.details || "");
      
      setGeneratedMessage(project.prompt);
      setProjectName(project.name);
      setProjectId(project.id);
    }
  }, [location.state]);

  const generateMessage = async () => {
    if (!target.trim()) {
      alert("Por favor, defina o tipo de cliente.");
      return;
    }
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Atue como um Especialista em Copywriting e Vendas (SDR/Closer).
        Sua missão é criar uma mensagem de abordagem fria ou morna, altamente persuasiva e personalizada.
        
        A mensagem deve ser pronta para enviar (WhatsApp, Email ou LinkedIn), com assunto (se email) e corpo.
      `;

      const promptContent = `
        Cliente/Lead Alvo: ${target}
        Tom de Voz: ${tone}
        Objetivo da Abordagem: ${objective}
        Detalhes Específicos: ${details}
        
        Escreva a mensagem de abordagem.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: promptContent }]
          }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      if (response.text) {
        setGeneratedMessage(response.text);
      }
    } catch (error) {
      console.error("Error generating message:", error);
      setGeneratedMessage("Erro ao gerar mensagem. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const saveProject = () => {
    if (!projectName.trim()) {
      alert("Dê um nome para salvar a abordagem.");
      return;
    }

    const projects: Project[] = JSON.parse(localStorage.getItem("prompt_projects") || "[]");
    
    const newProject: Project = {
      id: projectId || Date.now().toString(),
      name: projectName,
      date: new Date().toLocaleDateString("pt-BR"),
      prompt: generatedMessage,
      formData: {
        target,
        tone,
        objective,
        details
      },
      type: 'approach'
    };

    let updatedProjects;
    if (projectId) {
      updatedProjects = projects.map(p => p.id === projectId ? newProject : p);
    } else {
      updatedProjects = [newProject, ...projects];
    }

    localStorage.setItem("prompt_projects", JSON.stringify(updatedProjects));
    setProjectId(newProject.id);
    alert("Abordagem salva com sucesso!");
  };

  const sendWhatsApp = () => {
    const text = encodeURIComponent(generatedMessage);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const sendEmail = () => {
    // Basic clean up to try and find a subject line if present in the text
    const lines = generatedMessage.split('\n');
    let subject = "Proposta de Parceria";
    let body = generatedMessage;
    
    // Very naive heuristic: check if first line looks like a subject
    if (lines[0].toLowerCase().includes("assunto:")) {
        subject = lines[0].replace(/assunto:/i, '').trim();
        body = lines.slice(1).join('\n').trim();
    }
    
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Gerador de Abordagem
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Crie mensagens irresistíveis para conectar com seus leads.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Configurar Abordagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target">1. Quem você quer abordar?</Label>
                <Input 
                  id="target" 
                  placeholder="Ex: Dono de restaurante, Diretor de Marketing..." 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">2. Qual o tom da mensagem?</Label>
                <Input 
                  id="tone" 
                  placeholder="Ex: Amigável, Formal, Persuasivo..." 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">3. Qual o objetivo?</Label>
                <Input 
                  id="objective" 
                  placeholder="Ex: Agendar reunião, Vender serviço..." 
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">4. Detalhes específicos?</Label>
                <Textarea 
                  id="details" 
                  placeholder="Ex: Mencionar que vi o post recente deles..." 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <Button 
                className="w-full mt-2 gap-2" 
                size="lg"
                onClick={generateMessage}
                isLoading={isGenerating}
                disabled={!target.trim()}
              >
                {!isGenerating && <Wand2 size={18} />}
                Gerar Abordagem com IA
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {generatedMessage ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="bg-white text-black border shadow-sm h-full">
                <CardHeader className="border-b bg-gray-50/50 p-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Mensagem Gerada</CardTitle>
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={copyToClipboard}
                            className="text-gray-600 hover:text-black"
                        >
                            {hasCopied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                            {hasCopied ? "Copiado" : "Copiar"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6 h-[400px] overflow-y-auto">
                  <div className="prose prose-sm max-w-none font-sans whitespace-pre-wrap leading-relaxed text-gray-800">
                    {generatedMessage}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4 p-4 bg-card rounded-xl border shadow-sm">
                <div className="w-full space-y-2">
                    <Label htmlFor="projectName">Nome da Abordagem</Label>
                    <Input 
                      id="projectName"
                      placeholder="Ex: Abordagem Restaurantes Fria"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="secondary" 
                      className="flex-1 gap-2" 
                      onClick={saveProject}
                    >
                      <Save size={16} />
                      Salvar
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 gap-2 border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-900/30" 
                      onClick={sendWhatsApp}
                    >
                      <Send size={16} />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 gap-2" 
                      onClick={sendEmail}
                    >
                      <Send size={16} />
                      Email
                    </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground text-center">
              <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="text-lg font-medium">Sua mensagem aparecerá aqui</h3>
              <p className="text-sm max-w-xs mt-2">Configure os parâmetros ao lado para gerar uma abordagem personalizada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateApproach;