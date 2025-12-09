import React, { useState, useEffect } from "react";
import { FileText, Wand2, Save, Printer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { GoogleGenAI } from "@google/genai";
import { useLocation } from "react-router-dom";
import { Project } from "../types";

const CreateContracts: React.FC = () => {
  const location = useLocation();

  const [contractType, setContractType] = useState("");
  const [clauses, setClauses] = useState("");
  const [terms, setTerms] = useState("");
  const [confidentiality, setConfidentiality] = useState("");
  
  const [generatedContract, setGeneratedContract] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && (location.state as any).project) {
      const project = (location.state as any).project as Project;
      setContractType(project.formData.contractType || "");
      setClauses(project.formData.clauses || "");
      setTerms(project.formData.terms || "");
      setConfidentiality(project.formData.confidentiality || "");
      
      setGeneratedContract(project.prompt);
      setProjectName(project.name);
      setProjectId(project.id);
    }
  }, [location.state]);

  const generateContract = async () => {
    if (!contractType.trim()) {
      alert("Por favor, informe pelo menos o tipo de contrato.");
      return;
    }
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Atue como um Advogado Especialista em Contratos Comerciais e Digitais.
        Redija um contrato profissional, completo e juridicamente válido (sob a lei brasileira/geral) com base nas informações fornecidas.
        
        O contrato deve ser bem estruturado com títulos, cláusulas numeradas e espaços para preenchimento (identificados por [colchetes]) onde necessário.
      `;

      const promptContent = `
        Tipo de Contrato: ${contractType}
        Cláusulas Específicas: ${clauses}
        Prazos e Pagamento: ${terms}
        Confidencialidade/Exclusividade: ${confidentiality}
        
        Gere o contrato completo.
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
          temperature: 0.5,
        }
      });

      if (response.text) {
        setGeneratedContract(response.text);
      }
    } catch (error) {
      console.error("Error generating contract:", error);
      setGeneratedContract("Erro ao gerar contrato. Por favor, tente novamente.\n\nDetalhes do erro: " + String(error));
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProject = () => {
    if (!projectName.trim()) {
      alert("Por favor, dê um nome ao contrato antes de salvar.");
      return;
    }

    const projects: Project[] = JSON.parse(localStorage.getItem("prompt_projects") || "[]");
    
    const newProject: Project = {
      id: projectId || Date.now().toString(),
      name: projectName,
      date: new Date().toLocaleDateString("pt-BR"),
      prompt: generatedContract,
      formData: {
        contractType,
        clauses,
        terms,
        confidentiality
      },
      type: 'contract'
    };

    let updatedProjects;
    if (projectId) {
      updatedProjects = projects.map(p => p.id === projectId ? newProject : p);
    } else {
      updatedProjects = [newProject, ...projects];
    }

    localStorage.setItem("prompt_projects", JSON.stringify(updatedProjects));
    setProjectId(newProject.id);
    alert("Contrato salvo com sucesso em Meus Projetos!");
  };

  const exportPDF = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Contrato - Prompt Pronto</title>');
      printWindow.document.write(`
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; color: #000; }
          h1, h2, h3 { color: #000; }
          pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; }
          .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
        </style>
      `);
      printWindow.document.write('</head><body>');
      printWindow.document.write('<pre>' + generatedContract + '</pre>');
      printWindow.document.write('<div class="footer">Gerado via Prompt Pronto</div>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Gerador de Contratos com IA
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Responda as perguntas abaixo para criar um contrato sob medida.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Detalhes do Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">1. Qual tipo de contrato você precisa?</Label>
                <Input 
                  id="type" 
                  placeholder="Ex: Prestação de serviços de marketing" 
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clauses">2. Quais cláusulas específicas incluir?</Label>
                <Textarea 
                  id="clauses" 
                  placeholder="Ex: Não concorrência, direitos autorais..." 
                  value={clauses}
                  onChange={(e) => setClauses(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">3. Prazos e condições de pagamento?</Label>
                <Textarea 
                  id="terms" 
                  placeholder="Ex: Pagamento 50% na entrada, entrega em 30 dias..." 
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidentiality">4. Confidencialidade ou exclusividade?</Label>
                <Input 
                  id="confidentiality" 
                  placeholder="Ex: Multa por vazamento de dados" 
                  value={confidentiality}
                  onChange={(e) => setConfidentiality(e.target.value)}
                />
              </div>

              <Button 
                className="w-full mt-2 gap-2" 
                size="lg"
                onClick={generateContract}
                isLoading={isGenerating}
                disabled={!contractType.trim()}
              >
                {!isGenerating && <Wand2 size={18} />}
                Gerar Contrato com IA
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {generatedContract ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="bg-white text-black border shadow-sm print:shadow-none h-full">
                <CardHeader className="border-b bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Pré-visualização</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={exportPDF} title="Imprimir/PDF">
                        <Printer size={16} className="text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 h-[500px] overflow-y-auto">
                  <div className="prose prose-sm max-w-none font-serif whitespace-pre-wrap leading-relaxed text-gray-800">
                    {generatedContract}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border shadow-sm items-end">
                <div className="w-full space-y-2">
                    <Label htmlFor="projectName">Nome do Projeto</Label>
                    <Input 
                      id="projectName"
                      placeholder="Nome para salvar..."
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      variant="secondary" 
                      className="flex-1 sm:w-auto gap-2" 
                      onClick={saveProject}
                    >
                      <Save size={16} />
                      Salvar
                    </Button>
                    <Button 
                      className="flex-1 sm:w-auto gap-2" 
                      onClick={exportPDF}
                    >
                      <Printer size={16} />
                      Exportar PDF
                    </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground text-center">
              <FileText className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="text-lg font-medium">Seu contrato aparecerá aqui</h3>
              <p className="text-sm max-w-xs mt-2">Preencha as informações ao lado e clique em gerar para visualizar o documento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContracts;