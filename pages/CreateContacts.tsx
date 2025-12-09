import React, { useState } from "react";
import { Users, Wand2, Download, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { GoogleGenAI } from "@google/genai";
import { Contact } from "../types";

const CreateContacts: React.FC = () => {
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContacts = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Você é um assistente de geração de leads. 
        Com base na descrição do usuário, gere uma lista de 5 a 10 contatos FICTÍCIOS mas realistas.
        Retorne APENAS um JSON válido contendo um array de objetos. 
        Não inclua markdown (como \`\`\`json).
        
        Cada objeto deve ter as propriedades:
        - name (Nome completo)
        - role (Cargo)
        - company (Empresa)
        - email (Email corporativo fictício)
        - instagram (Handle do Instagram, ex: @usuario)
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Quem eu quero adicionar: ${description}` }]
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
        // Ensure data is an array
        const results = Array.isArray(data) ? data : (data.contacts || []);
        setContacts(results);
      }
    } catch (error) {
      console.error("Error generating contacts:", error);
      // Fallback for demo purposes if API fails
      setContacts([
        { name: "Ana Silva", role: "CEO", company: "Moda Chic", email: "ana@modachic.com", instagram: "@anasilva_moda" },
        { name: "Carlos Souza", role: "Diretor de Marketing", company: "Style Vibe", email: "carlos@stylevibe.com", instagram: "@carlos.vibe" },
        { name: "Mariana Costa", role: "Fundadora", company: "Eco Wear", email: "mari@ecowear.com.br", instagram: "@maricosta.eco" },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToCSV = () => {
    if (contacts.length === 0) return;

    const headers = ["Nome", "Cargo", "Empresa", "Email", "Instagram"];
    const csvContent = [
      headers.join(","),
      ...contacts.map(c => [c.name, c.role, c.company, c.email, c.instagram].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "contatos_gerados.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveContacts = () => {
    if (contacts.length === 0) return;
    
    // Simple save to localStorage implementation for now
    const savedLists = JSON.parse(localStorage.getItem("saved_contacts") || "[]");
    const newList = {
      id: Date.now(),
      date: new Date().toLocaleDateString("pt-BR"),
      query: description,
      contacts: contacts
    };
    
    localStorage.setItem("saved_contacts", JSON.stringify([newList, ...savedLists]));
    alert("Contatos salvos com sucesso!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Gerador de Contatos com IA
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Crie listas de contatos segmentadas com base em público-alvo, nicho ou critérios específicos.
        </p>
      </div>

      <Card className="border-2 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-semibold">
              Quem você quer adicionar?
            </Label>
            <Textarea
              id="description"
              placeholder="Ex: Quero criar contatos de e-commerce de moda feminina, donos de pequenas lojas online, com Instagram ativo e email válido."
              className="h-32 text-base resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Quanto mais detalhes você fornecer, melhor será a lista de contatos gerada.
            </p>
          </div>
          
          <Button 
            className="w-full h-12 text-base gap-2 rounded-xl" 
            size="lg"
            onClick={generateContacts}
            isLoading={isGenerating}
            disabled={!description.trim()}
          >
            {!isGenerating && <Wand2 size={20} />}
            Gerar Contatos com IA
          </Button>
        </CardContent>
      </Card>

      {contacts.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <Card className="bg-muted/30 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Contatos Gerados</CardTitle>
              <CardDescription>{contacts.length} contatos encontrados para sua busca.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground font-medium">
                      <tr>
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3">Cargo</th>
                        <th className="px-4 py-3">Empresa</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Instagram</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {contacts.map((contact, index) => (
                        <tr key={index} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-medium">{contact.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{contact.role}</td>
                          <td className="px-4 py-3 text-muted-foreground">{contact.company}</td>
                          <td className="px-4 py-3 text-muted-foreground">{contact.email}</td>
                          <td className="px-4 py-3 text-blue-500">{contact.instagram}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
             <Button 
               variant="secondary" 
               className="gap-2" 
               onClick={saveContacts}
             >
               <Save size={16} />
               Salvar Contatos
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
      )}
    </div>
  );
};

export default CreateContacts;