"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";

interface ReviewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewRequestModal({ isOpen, onClose }: ReviewRequestModalProps) {
  const [formData, setFormData] = useState({
    outletName: "",
    contactName: "",
    email: "",
    currentClassification: "",
    proposedClassification: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Send to your contact email or a form service
    // For now, we'll use mailto as a simple solution
    const subject = encodeURIComponent(`Classification Review Request: ${formData.outletName}`);
    const body = encodeURIComponent(
      `Outlet Name: ${formData.outletName}\n` +
      `Contact Name: ${formData.contactName}\n` +
      `Email: ${formData.email}\n` +
      `Current Classification: ${formData.currentClassification}\n` +
      `Proposed Classification: ${formData.proposedClassification}\n` +
      `Reason for Review:\n${formData.reason}`
    );

    window.location.href = `mailto:mirrorsourcecontact@gmail.com?subject=${subject}&body=${body}`;

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Request a Classification Review</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="text-green-600" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Request Submitted</h3>
            <p className="text-slate-600 mb-6">
              Thank you for reaching out. We&apos;ll review your request and respond within 5-7 business days.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              If you represent a news outlet and believe your classification is inaccurate, please submit a review request below.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Outlet Name *</label>
              <input
                type="text"
                name="outletName"
                required
                value={formData.outletName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., The Daily News"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Classification</label>
                <select
                  name="currentClassification"
                  value={formData.currentClassification}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="Left">Left</option>
                  <option value="Left-Center">Left-Center</option>
                  <option value="Center">Center</option>
                  <option value="Right-Center">Right-Center</option>
                  <option value="Right">Right</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Proposed Classification</label>
                <select
                  name="proposedClassification"
                  value={formData.proposedClassification}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="Left">Left</option>
                  <option value="Left-Center">Left-Center</option>
                  <option value="Center">Center</option>
                  <option value="Right-Center">Right-Center</option>
                  <option value="Right">Right</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Review *</label>
              <textarea
                name="reason"
                required
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Please explain why you believe the current classification is inaccurate, including any supporting evidence..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#2563eb] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Submitting..." : (
                <>
                  <Send size={18} />
                  Submit Review Request
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
