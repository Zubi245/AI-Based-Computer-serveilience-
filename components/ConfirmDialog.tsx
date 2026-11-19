'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
}: ConfirmDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={isOpen ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-2xl p-8 shadow-card"
      >
        <div className="flex items-start gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              danger ? 'bg-danger/20' : 'bg-warning/20'
            }`}
          >
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-danger' : 'text-warning'}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-800/50 hover:bg-navy-800 text-gray-300 border border-navy-700/50 rounded-lg transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              danger
                ? 'bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30'
                : 'bg-info/20 hover:bg-info/30 text-info border border-info/30'
            }`}
          >
            {confirmText}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 hover:bg-navy-800/50 rounded-lg transition-all"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </motion.div>
    </motion.div>
  );
}
