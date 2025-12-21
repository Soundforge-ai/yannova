import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { Lead } from '../types';

interface ContactCTAProps {
  onSubmitLead: (lead: Omit<Lead, 'id' | 'date' | 'status'>) => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  project?: string;
}

const ContactCTA: React.FC<ContactCTAProps> = ({ onSubmitLead }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Naam is verplicht';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Naam moet minimaal 2 karakters bevatten';
    }

    const phoneRegex = /^(\+32|0)[1-9][0-9]{7,8}$/;
    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Telefoonnummer is verplicht';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Ongeldig Belgisch telefoonnummer';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'E-mailadres is verplicht';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ongeldig e-mailadres';
    }

    if (!formData.project.trim()) {
      newErrors.project = 'Projectbeschrijving is verplicht';
    } else if (formData.project.trim().length < 10) {
      newErrors.project = 'Beschrijf uw project in minimaal 10 karakters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmitLead(formData);
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', project: '' });
    setIsSubmitting(false);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClasses = (fieldName: keyof FormErrors) =>
    `w-full px-4 py-3 rounded-md border transition-all focus:outline-none ${
      errors[fieldName]
        ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400'
        : 'border-gray-300 focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent'
    }`;

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-3/5 p-10 lg:p-16 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              Klaar om uw project te starten?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Vraag vandaag nog uw vrijblijvende offerte aan. Wij nemen zo snel mogelijk contact met u op.
            </p>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center" role="alert">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Bedankt voor uw aanvraag!</h3>
                <p className="text-green-700">We nemen spoedig contact met u op.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="sr-only">Naam</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Naam *"
                      className={inputClasses('name')}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="sr-only">Telefoonnummer</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Telefoonnummer *"
                      className={inputClasses('phone')}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">E-mailadres</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-mailadres *"
                    className={inputClasses('email')}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="project" className="sr-only">Projectbeschrijving</label>
                  <textarea
                    id="project"
                    rows={4}
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    placeholder="Beschrijf uw project *"
                    className={inputClasses('project')}
                    aria-invalid={!!errors.project}
                  />
                  {errors.project && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.project}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-accent hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-4 px-8 rounded-md w-full md:w-auto transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verzenden...
                    </>
                  ) : (
                    'Verstuur aanvraag'
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="lg:w-2/5 bg-brand-primary p-10 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20">
              <img src="/images/003a3c82-53d0-4c81-8d96-4ae5ad333f15.png" className="w-full h-full object-cover" alt="" loading="lazy" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8 border-b border-white/20 pb-4">Contactgegevens</h3>
              <address className="space-y-6 not-italic">
                <div className="flex items-start gap-4">
                  <MapPin className="text-brand-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Hoofdkantoor</p>
                    <p className="text-gray-300">De Beemdekens 39<br />2980 Zoersel, België</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="text-brand-accent flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Bel ons</p>
                    <a href="tel:+32489960001" className="text-gray-300 hover:text-white">+32 489 96 00 01</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="text-brand-accent flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Mail ons</p>
                    <a href="mailto:info@yannova.be" className="text-gray-300 hover:text-white">info@yannova.be</a>
                  </div>
                </div>
              </address>
            </div>
            <p className="relative z-10 mt-12 text-sm text-gray-400">
              Wij zijn actief in heel België voor particulieren en zelfstandigen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
