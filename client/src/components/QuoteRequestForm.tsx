import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, X, CheckCircle } from 'lucide-react';

interface QuoteRequestFormProps {
  companyId: number;
  companyName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function QuoteRequestForm({ companyId, companyName, onSuccess, onCancel }: QuoteRequestFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    message: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const submitQuote = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit quote');
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  if (submitted) {
    return (
      <div style={{
        marginTop: '16px',
        padding: '24px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '2px solid #fbbf24',
        textAlign: 'center',
      }}>
        <CheckCircle size={48} color="#fbbf24" style={{ marginBottom: '12px' }} />
        <h4 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: '#000',
          margin: '0 0 8px 0' 
        }}>
          Quote Request Sent!
        </h4>
        <p style={{ 
          fontSize: '14px', 
          color: '#374151',
          margin: '0 0 16px 0' 
        }}>
          {companyName} has received your request and will contact you shortly at {formData.customerPhone || formData.customerEmail}.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ customerName: '', customerEmail: '', customerPhone: '', message: '' });
            setPhotos([]);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
          data-testid="button-send-another"
        >
          Send Another Request
        </button>
      </div>
    );
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).slice(0, 5 - photos.length);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email is invalid';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('companyId', companyId.toString());
    formDataToSubmit.append('customerName', formData.customerName);
    formDataToSubmit.append('customerEmail', formData.customerEmail);
    formDataToSubmit.append('customerPhone', formData.customerPhone);
    formDataToSubmit.append('message', formData.message);
    
    photos.forEach((photo) => {
      formDataToSubmit.append('photos', photo);
    });

    submitQuote.mutate(formDataToSubmit);
  };

  return (
    <div style={{
      marginTop: '16px',
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: '2px solid #fbbf24',
    }}>
      <h5 style={{
        fontSize: '16px',
        fontWeight: '700',
        margin: '0 0 16px 0',
        color: '#111827',
      }}>
        Request a Quote from {companyName}
      </h5>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Your Name *"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: errors.customerName ? '1px solid #ef4444' : '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            data-testid="input-quote-name"
          />
          {errors.customerName && (
            <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.customerName}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <input
            type="email"
            placeholder="Your Email *"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: errors.customerEmail ? '1px solid #ef4444' : '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            data-testid="input-quote-email"
          />
          {errors.customerEmail && (
            <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.customerEmail}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <input
            type="tel"
            placeholder="Your Phone *"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: errors.customerPhone ? '1px solid #ef4444' : '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            data-testid="input-quote-phone"
          />
          {errors.customerPhone && (
            <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.customerPhone}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <textarea
            placeholder="Describe what you need removed (optional)"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
            data-testid="input-quote-message"
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
          }}>
            Add Photos (up to 5)
          </label>
          
          {photos.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '8px',
              marginBottom: '8px',
            }}>
              {photos.map((photo, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    data-testid={`button-remove-photo-${index}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {photos.length < 5 && (
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              border: '2px dashed #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: '#f9fafb',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            >
              <Upload size={20} color="#6b7280" />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Upload Photos
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
                data-testid="input-photo-upload"
              />
            </label>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={submitQuote.isPending}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: submitQuote.isPending ? '#9ca3af' : '#fbbf24',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: submitQuote.isPending ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
            data-testid="button-submit-quote"
          >
            {submitQuote.isPending ? 'Sending...' : 'Send Quote Request'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              style={{
                padding: '12px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
              data-testid="button-cancel-quote"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
