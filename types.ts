import React from 'react';

export interface ProjectFormData {
  description?: string; // Generic or for Site
  // Legacy Site fields
  niche?: string;
  audience?: string;
  
  // Contract specific
  contractType?: string;
  clauses?: string;
  terms?: string; // Deadlines/Payment
  confidentiality?: string;

  // Find Clients specific
  location?: string;
  channels?: string;
  criteria?: string;

  // Approach specific
  target?: string;
  tone?: string;
  objective?: string;
  details?: string;
  
  // Generic fallback
  [key: string]: string | undefined;
}

// Alias for backward compatibility if needed, though we'll use ProjectFormData
export type SitePromptData = ProjectFormData;

export type ProjectType = 'site' | 'contract' | 'client_list' | 'approach';

export interface Project {
  id: string;
  name: string;
  date: string;
  prompt: string; // The generated content
  formData: ProjectFormData;
  type?: ProjectType;
  // For client lists, we might want to store the structured data specifically if needed, 
  // but 'prompt' can store the JSON string for now.
  structuredData?: any; 
}

export interface Contact {
  name: string;
  role: string;
  company: string;
  email: string;
  instagram: string;
}

export interface Client {
  businessName: string;
  niche: string;
  location: string;
  contactName: string;
  email: string;
  instagram: string;
}

export type Theme = 'dark' | 'light';

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}