import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Login() {
  const [activeTab, setActiveTab] = useState<'admin' | 'business'>('business');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiRequest('/api/auth/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: activeTab
        })
      });

      if (response.success && response.token) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.token);
        
        // Invalidate user cache
        await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
        
        // Redirect to admin dashboard for admins
        if (activeTab === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Back Button */}
      <div style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        zIndex: 100,
      }}>
        <button
          onClick={handleBack}
          style={{
            backgroundColor: '#fbbf24',
            color: '#000',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          data-testid="button-back"
        >
          <ArrowLeft size={18} color="#000" />
        </button>
      </div>

      {/* Login Container */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: '#fbbf24',
            padding: '32px 24px',
            textAlign: 'center',
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#000',
              margin: '0',
            }}>
              Welcome Back
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#000',
              margin: '8px 0 0 0',
            }}>
              Sign in to manage your account
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #e5e7eb',
          }}>
            <button
              onClick={() => setActiveTab('business')}
              style={{
                flex: 1,
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                color: activeTab === 'business' ? '#000' : '#6b7280',
                backgroundColor: activeTab === 'business' ? '#fff' : '#f9fafb',
                border: 'none',
                borderBottom: activeTab === 'business' ? '3px solid #fbbf24' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              data-testid="tab-business"
            >
              Business Owner
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              style={{
                flex: 1,
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                color: activeTab === 'admin' ? '#000' : '#6b7280',
                backgroundColor: activeTab === 'admin' ? '#fff' : '#f9fafb',
                border: 'none',
                borderBottom: activeTab === 'admin' ? '3px solid #fbbf24' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              data-testid="tab-admin"
            >
              Administrator
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ padding: '32px 24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '8px',
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#fbbf24'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                data-testid="input-email"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#fbbf24'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                data-testid="input-password"
              />
            </div>

            {error && (
              <div style={{
                padding: '12px',
                marginBottom: '20px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                borderRadius: '8px',
                fontSize: '14px',
              }} data-testid="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '700',
                color: '#000',
                backgroundColor: isLoading ? '#e5e5e5' : '#fbbf24',
                border: '2px solid #000',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }
              }}
              data-testid="button-submit"
            >
              {isLoading ? 'Signing in...' : (activeTab === 'admin' ? 'Sign In as Admin' : 'Sign In as Business')}
            </button>

            <div style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
            }}>
              Don't have an account?{' '}
              <a
                href="/add-business"
                style={{
                  color: '#000',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                data-testid="link-signup"
              >
                Sign up here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
