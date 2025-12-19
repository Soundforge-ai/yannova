import { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
}

export interface StepItem {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface BenefitItem {
  id: string;
  text: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  date: string;
  status: 'Nieuw' | 'Contact Gehad' | 'Offerte Verzonden' | 'Afgerond';
  notes?: string[];
}

export type ProjectType = 'gevelwerken' | 'renovatie' | 'isolatie' | 'ramen-deuren';

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  images: string[];
  completedDate: string;
  location: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  projectType: string;
  reviewText: string;
  rating?: number;
  date: string;
}