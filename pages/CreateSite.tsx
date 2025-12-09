import React, { useState, useEffect } from "react";
import { Copy, Check, Sparkles, Wand2, Save, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { SitePromptData, Project } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
import { AnimatedShinyText } from "../components/ui/animated-shiny-text";
import { cn } from "../lib/utils";

const CreateSite: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [description, setDescription] = useState("");
  
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Load project if passed via state (Edit mode)
  useEffect(() => {
    if (location.state && (location.state as any).project) {
      const project = (location.state as any).project as Project;
      // Use description if available, otherwise fallback to niche (legacy support)
      setDescription(project.formData.description || project.formData.niche || "");
      setGeneratedPrompt(project.prompt);
      setProjectName(project.name);
      setProjectId(project.id);
    }
  }, [location.state]);

  const generatePrompt = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    
    try {
      // Initialize Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Atue como um Engenheiro de Prompts Sênior e Especialista em Criação de Conteúdo para Web.
        
        Sua tarefa é receber uma solicitação do usuário e transformá-la em um PROMPT MESTRE altamente detalhado e estruturado.
        O prompt gerado será usado posteriormente em LLMs para criar sites, landing pages ou campanhas.
        
        O prompt de saída deve conter:
        1. **Role**: Defina o papel da IA (ex: Copywriter Sênior, Designer UX).
        2. **Objetivo Claro**: O que deve ser feito.
        3. **Contexto e Detalhes**: Expanda a ideia do usuário. Se ele foi breve, infira um público-alvo e tom de voz adequados ao nicho.
        4. **Estrutura Recomendada**: Liste as seções ideais para o tipo de página solicitada (ex: Hero, Prova Social, Benefícios, FAQ, CTA).
        5. **Instruções de Estilo**: Sugestões de design e copy.

        A resposta deve ser APENAS o prompt gerado, pronto para copiar e usar.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `O que eu preciso: ${description}` }]
          }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.75,
        }
      });

      if (response.text) {
        setGeneratedPrompt(response.text);
      } else {
         throw new Error("No response text");
      }

    } catch (error) {
      console.error("Error generating prompt:", error);
      // Fallback simulation if API fails (or key is missing in dev)
      const fallbackPrompt = `
# Prompt Mestre Otimizado

## Role
Atue como um Especialista em Web Design e Estrategista Digital Sênior.

## Objetivo
Desenvolver o conteúdo textual e a estrutura visual para: ${description}

## Perfil do Público e Tom
- **Público**: Baseado na solicitação, foque no cliente ideal para este nicho.
- **Tom de Voz**: Profissional, Persuasivo e Claro.

## Estrutura Sugerida para a Página
1. **Hero Section**: Headline impactante + Subheadline explicativa + CTA Principal.
2. **Problema/Solução**: Aborde as dores do cliente e apresente sua oferta como solução.
3. **Benefícios**: Lista de vantagens competitivas.
4. **Prova Social**: Espaço para depoimentos ou logos de clientes.
5. **CTA Final**: Chamada para ação clara e direta.

## Instruções Adicionais
Utilize técnicas de copywriting AIDA (Atenção, Interesse, Desejo, Ação) para maximizar a conversão.
`;
      setGeneratedPrompt(fallbackPrompt.trim());
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const saveProject = () => {
    if (!projectName.trim()) {
      alert("Por favor, dê um nome ao projeto antes de salvar.");
      return;
    }

    const projects: Project[] = JSON.parse(localStorage.getItem("prompt_projects") || "[]");
    
    const newProject: Project = {
      id: projectId || Date.now().toString(),
      name: projectName,
      date: new Date().toLocaleDateString("pt-BR"),
      prompt: generatedPrompt,
      formData: {
        description: description
      }
    };

    let updatedProjects;
    if (projectId) {
      // Update existing
      updatedProjects = projects.map(p => p.id === projectId ? newProject : p);
    } else {
      // Create new
      updatedProjects = [newProject, ...projects];
    }

    localStorage.setItem("prompt_projects", JSON.stringify(updatedProjects));
    setProjectId(newProject.id);
    alert("Projeto salvo com sucesso!");
    navigate("/my-projects");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Gerador de Prompts com IA
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descreva o que você precisa e a IA criará um prompt perfeito e detalhado para você.
        </p>
      </div>

      <Card className="border-2 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-semibold">
              O que você precisa?
            </Label>
            <Textarea
              id="description"
              placeholder="Ex: Quero um prompt para criar uma campanha de marketing para e-commerce de roupas femininas, incluindo público-alvo, tom de voz, tipos de anúncios e hashtags..."
              className="h-32 text-base resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Seja o mais específico possível. Quanto mais detalhes você fornecer, melhor será o prompt gerado.
            </p>
          </div>
          
          <Button 
            className="w-full h-12 text-base gap-2 rounded-xl" 
            size="lg"
            onClick={generatePrompt}
            isLoading={isGenerating}
            disabled={!description.trim()}
          >
            {!isGenerating && <Wand2 size={20} />}
            Gerar Prompt com IA
          </Button>
        </CardContent>
      </Card>

      {generatedPrompt && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <Card className="bg-muted/30 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">Resultado Gerado</CardTitle>
                <CardDescription>Aqui está seu prompt detalhado.</CardDescription>
              </div>
              <Button 
                size="sm" 
                variant={hasCopied ? "default" : "outline"} 
                onClick={copyToClipboard}
              >
                {hasCopied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                {hasCopied ? "Copiado!" : "Copiar"}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="w-full rounded-lg bg-card p-6 text-sm text-foreground whitespace-pre-wrap overflow-y-auto border shadow-sm max-h-[500px] font-mono leading-relaxed">
                {generatedPrompt}
              </pre>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4 p-6 bg-card rounded-2xl border shadow-sm items-end">
             <div className="w-full space-y-2">
                <Label htmlFor="projectName">Nome do Projeto</Label>
                <Input 
                  id="projectName"
                  placeholder="Dê um nome para salvar..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
             </div>
             
             <div className="flex w-full md:w-auto gap-3 shrink-0 items-center">
                <Button 
                  variant="secondary" 
                  className="flex-1 md:w-auto gap-2" 
                  onClick={saveProject}
                >
                  <Save size={16} />
                  Salvar
                </Button>

                <a
                  href="https://lovable.dev/?via=uinsight&gad_source=1&gad_campaignid=23167670371&gbraid=0AAAAAqtaHh_crJ-t7KmEuUlSLHUYrgnxh&gclid=Cj0KCQiA6NTJBhDEARIsAB7QHD2Ne1Mu-AJo0OUFZ5BFfCGWqnTS2LF9egT-15NFnTL89vHfmr19tLAaAhqDEALw_wcB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                    "h-10 px-4 flex items-center justify-center"
                  )}
                >
                  <AnimatedShinyText className="inline-flex items-center justify-center transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span className="font-medium whitespace-nowrap">✨ Criar Site</span>
                    <ExternalLink className="ml-2 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                  </AnimatedShinyText>
                </a>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSite;