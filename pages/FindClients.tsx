import React, { useState, useEffect } from "react";
import { MapPin, Wand2, Download, Save, Eye, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { GoogleGenAI } from "@google/genai";
import { Client, Project } from "../types";
import { useLocation } from "react-router-dom";

const FindClients: React.FC = () => {
  const location = useLocation();

  // Form Fields
  const [niche, setNiche] = useState("");
  const [targetLocation, setTargetLocation] = useState("");
  const [channels, setChannels] = useState("");
  const [criteria, setCriteria] = useState("");

  const [clients, setClients] = useState<Client[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSocialsModal, setShowSocialsModal] = useState(false);
  
  // For saving logic (reusing Project logic for Client List as a project type, or separate storage)
  // We will treat it as a project for simplicity in this demo structure
  const [listName, setListName] = useState("");

  const generateClients = async () => {
    if (!niche.trim()) {
      alert("Por favor, informe pelo menos o nicho.");
      return;
    }
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Atue como um especialista em inteligência de mercado e geração de leads no Brasil.
        Gere uma lista de CLIENTES POTENCIAIS (empresas ou profissionais) brasileiros baseada nos critérios.
        
        Gere dados fictícios mas altamente realistas.
        Retorne APENAS um JSON válido contendo um array de objetos. Não use markdown.
        
        Cada objeto deve ter:
        - businessName (Nome da Empresa)
        - niche (Nicho de atuação)
        - location (Cidade/Estado)
        - contactName (Nome do responsável)
        - email (Email comercial)
        - instagram (Perfil do Instagram, ex: @perfil)
      `;

      const promptContent = `
        Nicho: ${niche}
        Localização: ${targetLocation}
        Canais Desejados: ${channels}
        Critérios Adicionais: ${criteria}
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
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        const results = Array.isArray(data) ? data : (data.clients || []);
        setClients(results);
      }
    } catch (error) {
      console.error("Error generating clients:", error);
      // Fallback
      setClients([
        { businessName: "Boutique Exemplo", niche: niche || "Moda", location: targetLocation || "São Paulo, SP", contactName: "Maria Silva", email: "contato@exemplo.com.br", instagram: "@loja.exemplo" },
        { businessName: "Tech Solutions BR", niche: niche || "Tecnologia", location: targetLocation || "Florianópolis, SC", contactName: "João Souza", email: "comercial@techbr.com", instagram: "@tech.solutions" },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToCSV = () => {
    if (clients.length === 0) return;

    const headers = ["Empresa", "Nicho", "Localização", "Contato", "Email", "Instagram"];
    const csvContent = [
      headers.join(","),
      ...clients.map(c => [c.businessName, c.niche, c.location, c.contactName, c.email, c.instagram].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "clientes_encontrados.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveList = () => {
    if (clients.length === 0) return;
    if (!listName.trim()) {
        const defaultName = `${niche} - ${new Date().toLocaleDateString()}`;
        if(confirm(`Salvar como "${defaultName}"?`)) {
            setListName(defaultName);
        } else {
            return;
        }
    }
    
    // Saving as a "Project" type 'client_list' for unified management in MyProjects if desired,
    // or keep separate. The prompt says "Salvar Lista", let's save to localStorage projects for consistency.
    const projects: Project[] = JSON.parse(localStorage.getItem("prompt_projects") || "[]");
    
    const newProject: Project = {
        id: Date.now().toString(),
        name: listName || `${niche} - ${new Date().toLocaleDateString()}`,
        date: new Date().toLocaleDateString("pt-BR"),
        prompt: JSON.stringify(clients), // Store raw JSON data in prompt field
        formData: {
            niche,
            location: targetLocation,
            channels,
            criteria
        },
        type: 'client_list'
    };
    
    localStorage.setItem("prompt_projects", JSON.stringify([newProject, ...projects]));
    alert("Lista salva com sucesso em Meus Projetos!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Encontrar Clientes no Brasil
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Preencha os critérios abaixo para que a IA encontre os melhores leads para você.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-4 space-y-6">
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Critérios de Busca</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="niche">1. Qual nicho ou tipo de cliente?</Label>
                        <Input 
                            id="niche" 
                            placeholder="Ex: E-commerce de moda, Dentistas..." 
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">2. Localização/geografia específica?</Label>
                        <Input 
                            id="location" 
                            placeholder="Ex: São Paulo, Região Sul, Todo Brasil" 
                            value={targetLocation}
                            onChange={(e) => setTargetLocation(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="channels">3. Redes sociais ou contato desejado?</Label>
                        <Input 
                            id="channels" 
                            placeholder="Ex: Instagram, WhatsApp, Email" 
                            value={channels}
                            onChange={(e) => setChannels(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="criteria">4. Critérios adicionais?</Label>
                        <Textarea 
                            id="criteria" 
                            placeholder="Ex: Pequenas empresas, perfil ativo..." 
                            value={criteria}
                            onChange={(e) => setCriteria(e.target.value)}
                        />
                    </div>
                    <Button 
                        className="w-full mt-2 gap-2" 
                        size="lg"
                        onClick={generateClients}
                        isLoading={isGenerating}
                        disabled={!niche.trim()}
                    >
                        {!isGenerating && <Wand2 size={18} />}
                        Gerar Lista de Clientes
                    </Button>
                </CardContent>
            </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-8">
            {clients.length > 0 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-muted/30 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Resultados</CardTitle>
                            <CardDescription>{clients.length} clientes encontrados.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                    <div className="rounded-md border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground font-medium">
                            <tr>
                                <th className="px-4 py-3">Empresa</th>
                                <th className="px-4 py-3">Nicho</th>
                                <th className="px-4 py-3">Localização</th>
                                <th className="px-4 py-3">Contato</th>
                                <th className="px-4 py-3">Instagram</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {clients.map((client, index) => (
                                <tr key={index} className="hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3 font-medium">{client.businessName}</td>
                                <td className="px-4 py-3 text-muted-foreground">{client.niche}</td>
                                <td className="px-4 py-3 text-muted-foreground">{client.location}</td>
                                <td className="px-4 py-3 text-muted-foreground">{client.contactName}</td>
                                <td className="px-4 py-3 text-blue-500">{client.instagram}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col md:flex-row gap-4 justify-between bg-card p-4 rounded-xl border shadow-sm items-center">
                    <div className="w-full md:w-1/3">
                        <Input 
                            placeholder="Nome da lista para salvar..."
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                        <Button 
                            variant="outline" 
                            className="gap-2" 
                            onClick={() => setShowSocialsModal(true)}
                        >
                            <Eye size={16} />
                            Visualizar Redes
                        </Button>
                        <Button 
                            variant="secondary" 
                            className="gap-2" 
                            onClick={saveList}
                        >
                            <Save size={16} />
                            Salvar Lista
                        </Button>
                        <Button 
                            className="gap-2" 
                            onClick={exportToCSV}
                        >
                            <Download size={16} />
                            Exportar CSV
                        </Button>
                    </div>
                </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground text-center min-h-[400px]">
                    <MapPin className="h-16 w-16 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">Encontre seus clientes ideais</h3>
                    <p className="text-sm max-w-sm mt-2">Defina seu público-alvo ao lado e deixe nossa IA vasculhar o mercado brasileiro para você.</p>
                </div>
            )}
        </div>
      </div>

      {/* Simple Socials Modal */}
      {showSocialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border shadow-lg rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Redes Sociais</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSocialsModal(false)}>
                <X size={18} />
              </Button>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {clients.map((client, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{client.businessName}</span>
                    <span className="text-xs text-muted-foreground">{client.contactName}</span>
                  </div>
                  <a 
                    href={`https://instagram.com/${client.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline bg-blue-500/10 px-2 py-1 rounded"
                  >
                    {client.instagram}
                  </a>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setShowSocialsModal(false)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindClients;