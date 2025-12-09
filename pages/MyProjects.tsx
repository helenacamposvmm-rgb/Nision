import React, { useEffect, useState } from "react";
import { FolderOpen, Calendar, Edit2, Trash2, Plus, Search, FileText, PenTool, MapPin, MessageSquare, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Project, ProjectType } from "../types";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

const MyProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("prompt_projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem("prompt_projects", JSON.stringify(updated));
    }
  };

  const handleEdit = (project: Project) => {
    switch (project.type) {
        case 'contract':
            navigate("/create-contracts", { state: { project } });
            break;
        case 'client_list':
            navigate("/find-clients", { state: { project } });
            break;
        case 'approach':
            navigate("/generate-approach", { state: { project } });
            break;
        case 'site':
        default:
            navigate("/create-site", { state: { project } });
            break;
    }
  };

  const getIcon = (type?: ProjectType) => {
    switch (type) {
        case 'contract': return <FileText size={13} />;
        case 'client_list': return <MapPin size={13} />;
        case 'approach': return <MessageSquare size={13} />;
        default: return <PenTool size={13} />;
    }
  };

  const getLabel = (type?: ProjectType) => {
    switch (type) {
        case 'contract': return 'Contrato';
        case 'client_list': return 'Lista';
        case 'approach': return 'Abordagem';
        default: return 'Site';
    }
  };

  const getColorClass = (type?: ProjectType) => {
    switch (type) {
        case 'contract': return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30";
        case 'client_list': return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 border-green-200 dark:border-green-500/30";
        case 'approach': return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-500/30";
        default: return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30";
    }
  };

  const filteredProjects = projects.filter(p => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const matchesName = p.name.toLowerCase().includes(term);
    const matchesDescription = p.formData.description?.toLowerCase().includes(term);
    const matchesNiche = p.formData.niche?.toLowerCase().includes(term);
    const matchesType = getLabel(p.type).toLowerCase().includes(term);

    return matchesName || matchesDescription || matchesNiche || matchesType;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <FolderOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Projetos</h1>
            <p className="text-muted-foreground">
              Gerencie seus contratos, listas e prompts salvos.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/create-site")}>
            <Plus className="mr-2 h-4 w-4" /> Novo
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, nicho ou descrição..." 
            className="pl-9 pr-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <FolderOpen className="h-12 w-12 mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto salvo</h3>
            <p className="mb-4 max-w-sm">
              Você ainda não salvou nenhum projeto. Use as ferramentas para criar seu primeiro conteúdo.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate("/create-site")}>
                Criar Site
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredProjects.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Search className="h-10 w-10 mb-3 opacity-20" />
            <p>Nenhum projeto encontrado para "{searchTerm}".</p>
            <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2 text-primary">
                Limpar busca
            </Button>
         </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="flex flex-col hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
              <CardHeader className="p-5 pb-0">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold leading-tight truncate pr-2 pb-1 group-hover:text-primary transition-colors" title={project.name}>
                          {project.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 text-xs mb-2">
                          <Calendar className="h-3 w-3 opacity-70" />
                          <span>{project.date}</span>
                        </CardDescription>
                    </div>
                    <div className={cn(
                        "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wide font-medium border transition-colors",
                        getColorClass(project.type)
                    )}>
                        {getIcon(project.type)}
                        <span className="hidden sm:inline">{getLabel(project.type)}</span>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-5 pt-2">
                <div className="rounded-lg bg-muted/40 p-4 text-xs font-mono text-muted-foreground line-clamp-4 h-24 overflow-hidden text-ellipsis border border-transparent group-hover:border-border/60 transition-colors leading-relaxed">
                  {/* Show preview of content based on type */}
                  {project.type === 'client_list' 
                    ? "Lista de clientes gerada..." 
                    : project.prompt}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t p-4 bg-muted/20 mt-auto gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 h-8 px-2 text-xs font-medium bg-neutral-200/50 dark:bg-black text-neutral-600 dark:text-neutral-400 hover:bg-red-500/10 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Excluir
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 h-8 text-xs font-medium bg-transparent border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white transition-colors"
                  onClick={() => handleEdit(project)}
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                  Editar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;