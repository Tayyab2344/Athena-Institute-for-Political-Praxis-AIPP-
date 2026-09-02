"use client";

import { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPathway?: string;
}

export default function ContactModal({ isOpen, onClose, defaultPathway = "General Inquiry" }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    pathway: defaultPathway,
    message: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1817]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#4A121A]/20 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
        
        <div className="p-6 md:p-8 bg-[#4A121A] text-[#FAF8F5] flex items-start justify-between">
          <div>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] opacity-80 block mb-1">
              ATHENA INSTITUTE FOR POLITICAL PRAXIS
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal">
              Get Involved & Contact
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FAF8F5]/10 text-[#FAF8F5] transition-colors"
            aria-label="Close contact modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-6 flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-full bg-[#4A121A]/10 border border-[#4A121A]/20 flex items-center justify-center text-[#4A121A]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl text-[#1A1817]">Thank You for Reaching Out</h4>
            <p className="text-sm font-sans text-[#5C5755] max-w-sm font-light">
              Your inquiry has been logged with the AIPP External Affairs Taskforce. Our team will review your message promptly.
            </p>
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold hover:bg-[#6A1B27] transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-5">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ambassador / Dr. / Ms. Full Name"
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@institution.org"
                  className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                  Pathway
                </label>
                <select
                  value={formData.pathway}
                  onChange={(e) => setFormData({ ...formData, pathway: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
                >
                  <option value="Volunteer">Volunteer</option>
                  <option value="Contribute">Contribute Research</option>
                  <option value="Collaborate">Institutional Collaboration</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Organization / Affiliation
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Ministry, Institute, University, or NGO"
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] mb-1.5">
                Message / Statement of Purpose
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly describe how you wish to collaborate or contribute to AIPP..."
                className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold tracking-wider hover:bg-[#6A1B27] transition-colors flex items-center justify-center gap-2"
              >
                <span>Submit Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
