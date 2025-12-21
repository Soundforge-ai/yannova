import { LucideIcon } from 'lucide-react';

export interface NavItem {
    label: string;
    href: string;
}

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

export interface Project {
    id: string;
    title: string;
    description: string;
    type: 'gevelwerken' | 'renovatie' | 'isolatie' | 'ramen-deuren' | 'tuinaanleg';
    images: string[];
    completedDate: string;
    location: string;
}

export interface Testimonial {
    id: string;
    customerName: string;
    projectType: string;
    reviewText: string;
    rating: number;
    date: string;
}
