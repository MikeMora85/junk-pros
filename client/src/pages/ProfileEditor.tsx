import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { CheckCircle, Circle, Truck, Home, Building2, Sofa, Refrigerator, Tv, Package, Trees, Dumbbell } from "lucide-react";
import type { Company } from "@shared/schema";

const SERVICE_ICONS = [
  { id: "residential", icon: Home, label: "Residential" },
  { id: "commercial", icon: Building2, label: "Commercial" },
  { id: "furniture", icon: Sofa, label: "Furniture" },
  { id: "appliances", icon: Refrigerator, label: "Appliances" },
  { id: "electronics", icon: Tv, label: "Electronics" },
  { id: "yard-waste", icon: Trees, label: "Yard Waste" },
  { id: "construction", icon: Dumbbell, label: "Construction" },
  { id: "moving", icon: Truck, label: "Moving/Hauling" },
  { id: "general", icon: Package, label: "General Junk" },
];

interface TabConfig {
  id: number;
  title: string;
  description: string;
}

const TABS: TabConfig[] = [
  { id: 1, title: "Basic Information", description: "Company name, contact, and location" },
  { id: 2, title: "Services & Specialties", description: "What services do you offer?" },
  { id: 3, title: "About Your Business", description: "Tell customers about your company" },
  { id: 4, title: "Pricing", description: "Set your pricing and minimums" },
  { id: 5, title: "Team & Gallery", description: "Show your team and work photos" },
  { id: 6, title: "Visibility Settings", description: "Control what customers see" },
];

export default function ProfileEditor() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState(1);
  const [completedTabs, setCompletedTabs] = useState<Set<number>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    contactEmail: "",
    website: "",
    address: "",
    city: "",
    state: "",
    logoUrl: "",
    selectedServices: [] as string[],
    specialties: [] as string[],
    aboutUs: "",
    whyChooseUs: [""],
    yearsInBusiness: "",
    insuranceInfo: "",
    minimumPrice: "",
    quarterLoadPrice: "",
    halfLoadPrice: "",
    threeQuarterLoadPrice: "",
    fullLoadPrice: "",
    singleItemMinimum: "",
    priceSheetVisible: true,
    addOnCostsVisible: true,
    teamMembers: [] as any[],
    galleryImages: [] as string[],
    hours: "",
    availability: "",
  });

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ["/api/business/profile"],
    enabled: !!user,
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        phone: company.phone || "",
        contactEmail: company.contactEmail || "",
        website: company.website || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        logoUrl: company.logoUrl || "",
        selectedServices: company.services || [],
        specialties: company.specialties || [],
        aboutUs: company.aboutUs || "",
        whyChooseUs: company.whyChooseUs || [""],
        yearsInBusiness: company.yearsInBusiness?.toString() || "",
        insuranceInfo: company.insuranceInfo || "",
        minimumPrice: company.minimumPrice || "",
        quarterLoadPrice: company.quarterLoadPrice || "",
        halfLoadPrice: company.halfLoadPrice || "",
        threeQuarterLoadPrice: company.threeQuarterLoadPrice || "",
        fullLoadPrice: company.fullLoadPrice || "",
        singleItemMinimum: company.singleItemMinimum || "",
        priceSheetVisible: company.priceSheetVisible ?? true,
        addOnCostsVisible: company.addOnCostsVisible ?? true,
        teamMembers: (company.teamMembers as any[]) || [],
        galleryImages: company.galleryImages || [],
        hours: company.hours || "",
        availability: company.availability || "",
      });
      checkCompletedTabs(company);
    }
  }, [company]);

  const checkCompletedTabs = (data: any) => {
    const completed = new Set<number>();
    
    if (data.name && data.phone && data.address && data.city && data.state) {
      completed.add(1);
    }
    if (data.services?.length > 0) {
      completed.add(2);
    }
    if (data.aboutUs) {
      completed.add(3);
    }
    if (data.minimumPrice || data.quarterLoadPrice) {
      completed.add(4);
    }
    if (data.teamMembers?.length > 0 || data.galleryImages?.length > 0) {
      completed.add(5);
    }
    completed.add(6);
    
    setCompletedTabs(completed);
  };

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Sending update with data:", data);
      const result = await apiRequest("/api/business/profile", {
        method: "PATCH",
        body: data,
      });
      console.log("Update successful, result:", result);
      return result;
    },
    onSuccess: async (data) => {
      console.log("Mutation success, invalidating cache and refetching");
      await queryClient.invalidateQueries({ queryKey: ["/api/business/profile"] });
      await queryClient.refetchQueries({ queryKey: ["/api/business/profile"] });
      setToastMessage("Profile updated successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      setToastMessage(`Failed to update profile: ${error.message || 'Unknown error'}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    },
  });

  const handleSave = () => {
    const payload = {
      name: formData.name,
      phone: formData.phone,
      contactEmail: formData.contactEmail || null,
      website: formData.website,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      logoUrl: formData.logoUrl || null,
      services: formData.selectedServices,
      specialties: formData.specialties.filter(s => s.trim()),
      aboutUs: formData.aboutUs || null,
      whyChooseUs: formData.whyChooseUs.filter(r => r.trim()),
      yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
      insuranceInfo: formData.insuranceInfo || null,
      minimumPrice: formData.minimumPrice || null,
      quarterLoadPrice: formData.quarterLoadPrice || null,
      halfLoadPrice: formData.halfLoadPrice || null,
      threeQuarterLoadPrice: formData.threeQuarterLoadPrice || null,
      fullLoadPrice: formData.fullLoadPrice || null,
      singleItemMinimum: formData.singleItemMinimum || null,
      priceSheetVisible: formData.priceSheetVisible,
      addOnCostsVisible: formData.addOnCostsVisible,
      hours: formData.hours || null,
      availability: formData.availability || null,
      teamMembers: formData.teamMembers.length > 0 ? formData.teamMembers : null,
      galleryImages: formData.galleryImages.length > 0 ? formData.galleryImages : null,
    };
    updateMutation.mutate(payload);
    checkCompletedTabs(payload);
  };

  const handleGoLive = () => {
    handleSave();
    if (company) {
      navigate(`/${company.state.toLowerCase()}/${company.city.toLowerCase()}`);
    }
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(s => s !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  if (isAuthLoading || isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "18px", color: "#666" }}>Loading your profile...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#000",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "#000",
          color: "#fff",
          padding: "16px 24px",
          borderRadius: "8px",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "24px",
        borderBottom: "4px solid #fbbf24"
      }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0" }}>
          Edit Your Profile
        </h1>
        <p style={{ margin: 0, color: "#d1d5db" }}>
          Complete each section to make your profile live
        </p>
      </div>

      {/* Yellow Numbered Tabs */}
      <div style={{
        backgroundColor: "#fbbf24",
        padding: "0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`tab-${tab.id}`}
            style={{
              width: "100%",
              padding: "20px 24px",
              border: "none",
              borderBottom: "2px solid #000",
              backgroundColor: activeTab === tab.id ? "#f59e0b" : "#fbbf24",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              transition: "all 0.2s"
            }}
          >
            {/* Number Circle */}
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#000",
              color: "#fbbf24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "700",
              flexShrink: 0
            }}>
              {tab.id}
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#000",
                marginBottom: "4px"
              }}>
                {tab.title}
              </div>
              <div style={{ fontSize: "14px", color: "#000", opacity: 0.7 }}>
                {tab.description}
              </div>
            </div>

            {/* Checkmark */}
            {completedTabs.has(tab.id) ? (
              <CheckCircle size={32} color="#16a34a" strokeWidth={3} data-testid={`checkmark-${tab.id}`} />
            ) : (
              <Circle size={32} color="#000" strokeWidth={2} opacity={0.3} />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: "40px 24px", maxWidth: "900px", margin: "0 auto" }}>
        {/* Tab 1: Basic Information */}
        {activeTab === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#000", margin: 0 }}>
              Basic Information
            </h2>
            
            <div>
              <label style={labelStyle} htmlFor="name">Company Name *</label>
              <input
                id="name"
                data-testid="input-name"
                style={inputStyle}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your Junk Removal Co."
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                data-testid="input-phone"
                style={inputStyle}
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>

            {company?.subscriptionTier === 'featured' && (
              <div>
                <label style={labelStyle} htmlFor="contactEmail">
                  Contact Email 
                  <span style={{ 
                    marginLeft: "8px", 
                    fontSize: "12px", 
                    color: "#16a34a", 
                    fontWeight: "700",
                    backgroundColor: "#dcfce7",
                    padding: "2px 8px",
                    borderRadius: "4px"
                  }}>
                    FEATURED ONLY
                  </span>
                </label>
                <input
                  id="contactEmail"
                  data-testid="input-contact-email"
                  type="email"
                  style={inputStyle}
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="contact@yourcompany.com"
                />
                <p style={{ 
                  fontSize: "13px", 
                  color: "#666", 
                  marginTop: "6px",
                  marginBottom: 0
                }}>
                  This email will be displayed to customers. Different from your login email.
                </p>
              </div>
            )}

            <div>
              <label style={labelStyle} htmlFor="logoUrl">
                Company Logo URL
                <span style={{ 
                  marginLeft: "8px", 
                  fontSize: "11px", 
                  color: "#666", 
                  fontWeight: "400"
                }}>
                  (Displayed on quick view and expanded profile)
                </span>
              </label>
              <input
                id="logoUrl"
                data-testid="input-logo-url"
                style={inputStyle}
                value={formData.logoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                placeholder="https://yoursite.com/logo.png"
              />
              {formData.logoUrl && (
                <div style={{ 
                  marginTop: "12px", 
                  padding: "12px", 
                  border: "2px solid #e5e7eb", 
                  borderRadius: "8px",
                  backgroundColor: "#f9fafb"
                }}>
                  <p style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "#000" }}>Logo Preview:</p>
                  <img 
                    src={formData.logoUrl} 
                    alt="Company logo preview" 
                    style={{ 
                      maxWidth: "200px", 
                      maxHeight: "100px", 
                      objectFit: "contain",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4px",
                      padding: "8px",
                      backgroundColor: "#fff"
                    }} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle} htmlFor="website">Website</label>
              <input
                id="website"
                data-testid="input-website"
                style={inputStyle}
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="address">Street Address *</label>
              <input
                id="address"
                data-testid="input-address"
                style={inputStyle}
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main St"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle} htmlFor="city">City *</label>
                <input
                  id="city"
                  data-testid="input-city"
                  style={inputStyle}
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Phoenix"
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="state">State *</label>
                <input
                  id="state"
                  data-testid="input-state"
                  style={inputStyle}
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Arizona"
                />
              </div>
            </div>

            <div>
              <label style={labelStyle} htmlFor="hours">Business Hours</label>
              <input
                id="hours"
                data-testid="input-hours"
                style={inputStyle}
                value={formData.hours}
                onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                placeholder="Mon-Fri 8AM-6PM, Sat 9AM-3PM"
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="availability">Availability</label>
              <input
                id="availability"
                data-testid="input-availability"
                style={inputStyle}
                value={formData.availability}
                onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                placeholder="Same Day Service Available"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Services & Specialties */}
        {activeTab === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#000", margin: 0 }}>
              Services & Specialties
            </h2>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#000" }}>
                Select Your Service Types
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "16px"
              }}>
                {SERVICE_ICONS.map((service) => {
                  const Icon = service.icon;
                  const isSelected = formData.selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      data-testid={`service-${service.id}`}
                      style={{
                        padding: "20px",
                        border: `3px solid ${isSelected ? "#fbbf24" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        backgroundColor: isSelected ? "#fef3c7" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                        transition: "all 0.2s",
                        position: "relative"
                      }}
                    >
                      <Icon size={40} color={isSelected ? "#000" : "#666"} />
                      <div style={{
                        fontSize: "14px",
                        fontWeight: isSelected ? "600" : "500",
                        color: "#000",
                        textAlign: "center"
                      }}>
                        {service.label}
                      </div>
                      {isSelected && (
                        <CheckCircle
                          size={24}
                          color="#16a34a"
                          style={{ position: "absolute", top: "8px", right: "8px" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={labelStyle} htmlFor="specialties">Additional Specialties (one per line)</label>
              <textarea
                id="specialties"
                data-testid="input-specialties"
                style={{ ...inputStyle, minHeight: "120px", fontFamily: "inherit", resize: "vertical" }}
                value={formData.specialties.join("\n")}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specialties: e.target.value.split("\n").filter(s => s.trim())
                }))}
                placeholder="Estate cleanouts&#10;Hoarding cleanup&#10;Foreclosure cleanups"
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="insurance">Insurance Information</label>
              <input
                id="insurance"
                data-testid="input-insurance"
                style={inputStyle}
                value={formData.insuranceInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, insuranceInfo: e.target.value }))}
                placeholder="Fully Licensed & Insured - $1M Liability"
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="years">Years in Business</label>
              <input
                id="years"
                data-testid="input-years"
                type="number"
                style={inputStyle}
                value={formData.yearsInBusiness}
                onChange={(e) => setFormData(prev => ({ ...prev, yearsInBusiness: e.target.value }))}
                placeholder="5"
              />
            </div>
          </div>
        )}

        {/* Tab 3: About Your Business */}
        {activeTab === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#000", margin: 0 }}>
              About Your Business
            </h2>

            <div>
              <label style={labelStyle} htmlFor="about">About Us</label>
              <textarea
                id="about"
                data-testid="input-about"
                style={{ ...inputStyle, minHeight: "180px", fontFamily: "inherit", resize: "vertical" }}
                value={formData.aboutUs}
                onChange={(e) => setFormData(prev => ({ ...prev, aboutUs: e.target.value }))}
                placeholder="Tell customers about your business, your mission, and what makes you unique..."
              />
            </div>

            <div>
              <label style={labelStyle}>Why Choose Us? (Add up to 5 reasons)</label>
              {formData.whyChooseUs.map((reason, index) => (
                <div key={index} style={{ marginBottom: "12px" }}>
                  <input
                    data-testid={`input-why-${index}`}
                    style={inputStyle}
                    value={reason}
                    onChange={(e) => {
                      const newReasons = [...formData.whyChooseUs];
                      newReasons[index] = e.target.value;
                      setFormData(prev => ({ ...prev, whyChooseUs: newReasons }));
                    }}
                    placeholder={`Reason ${index + 1}`}
                  />
                </div>
              ))}
              {formData.whyChooseUs.length < 5 && (
                <button
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    whyChooseUs: [...prev.whyChooseUs, ""]
                  }))}
                  data-testid="button-add-reason"
                  style={{
                    padding: "10px 20px",
                    border: "2px solid #000",
                    borderRadius: "6px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}
                >
                  Add Another Reason
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Pricing */}
        {activeTab === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#000", margin: 0 }}>
              Pricing
            </h2>

            <div>
              <label style={labelStyle} htmlFor="minimum">Minimum Service Fee</label>
              <input
                id="minimum"
                data-testid="input-minimum"
                style={inputStyle}
                value={formData.minimumPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumPrice: e.target.value }))}
                placeholder="$99"
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="singleItem">Single Item Minimum</label>
              <input
                id="singleItem"
                data-testid="input-single-item"
                style={inputStyle}
                value={formData.singleItemMinimum}
                onChange={(e) => setFormData(prev => ({ ...prev, singleItemMinimum: e.target.value }))}
                placeholder="$75"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle} htmlFor="quarter">1/4 Load Price</label>
                <input
                  id="quarter"
                  data-testid="input-quarter"
                  style={inputStyle}
                  value={formData.quarterLoadPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, quarterLoadPrice: e.target.value }))}
                  placeholder="$150"
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="half">1/2 Load Price</label>
                <input
                  id="half"
                  data-testid="input-half"
                  style={inputStyle}
                  value={formData.halfLoadPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, halfLoadPrice: e.target.value }))}
                  placeholder="$250"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle} htmlFor="threequarter">3/4 Load Price</label>
                <input
                  id="threequarter"
                  data-testid="input-threequarter"
                  style={inputStyle}
                  value={formData.threeQuarterLoadPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, threeQuarterLoadPrice: e.target.value }))}
                  placeholder="$350"
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="full">Full Load Price</label>
                <input
                  id="full"
                  data-testid="input-full"
                  style={inputStyle}
                  value={formData.fullLoadPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullLoadPrice: e.target.value }))}
                  placeholder="$450"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Team & Gallery */}
        {activeTab === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#000", margin: 0 }}>
              Team & Gallery
            </h2>

            <div style={{
              padding: "24px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <p style={{ margin: 0, color: "#666" }}>
                Team member and gallery management coming soon
              </p>
            </div>
          </div>
        )}

        {/* Tab 6: Visibility Settings */}
        {activeTab === 6 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#000", margin: 0 }}>
              Visibility Settings
            </h2>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              backgroundColor: "#fff"
            }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#000", marginBottom: "4px" }}>
                  Show Pricing on Profile
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Display your pricing information to customers
                </div>
              </div>
              <label style={{ position: "relative", display: "inline-block", width: "60px", height: "34px" }}>
                <input
                  type="checkbox"
                  checked={formData.priceSheetVisible}
                  onChange={(e) => setFormData(prev => ({ ...prev, priceSheetVisible: e.target.checked }))}
                  data-testid="toggle-pricing"
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: formData.priceSheetVisible ? "#fbbf24" : "#ccc",
                  transition: "0.4s",
                  borderRadius: "34px"
                }}>
                  <span style={{
                    position: "absolute",
                    height: "26px",
                    width: "26px",
                    left: formData.priceSheetVisible ? "30px" : "4px",
                    bottom: "4px",
                    backgroundColor: "white",
                    transition: "0.4s",
                    borderRadius: "50%"
                  }} />
                </span>
              </label>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              backgroundColor: "#fff"
            }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#000", marginBottom: "4px" }}>
                  Show Additional Costs
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Display add-on fees and extra charges
                </div>
              </div>
              <label style={{ position: "relative", display: "inline-block", width: "60px", height: "34px" }}>
                <input
                  type="checkbox"
                  checked={formData.addOnCostsVisible}
                  onChange={(e) => setFormData(prev => ({ ...prev, addOnCostsVisible: e.target.checked }))}
                  data-testid="toggle-addon"
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: formData.addOnCostsVisible ? "#fbbf24" : "#ccc",
                  transition: "0.4s",
                  borderRadius: "34px"
                }}>
                  <span style={{
                    position: "absolute",
                    height: "26px",
                    width: "26px",
                    left: formData.addOnCostsVisible ? "30px" : "4px",
                    bottom: "4px",
                    backgroundColor: "white",
                    transition: "0.4s",
                    borderRadius: "50%"
                  }} />
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          marginTop: "48px",
          display: "flex",
          gap: "16px",
          justifyContent: "flex-end",
          paddingTop: "24px",
          borderTop: "2px solid #e5e7eb"
        }}>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            data-testid="button-save"
            style={{
              fontSize: "16px",
              padding: "12px 32px",
              border: "2px solid #000",
              borderRadius: "8px",
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: "600",
              cursor: updateMutation.isPending ? "not-allowed" : "pointer",
              opacity: updateMutation.isPending ? 0.6 : 1
            }}
          >
            {updateMutation.isPending ? "Saving..." : "Save Progress"}
          </button>

          <button
            onClick={handleGoLive}
            disabled={updateMutation.isPending}
            data-testid="button-go-live"
            style={{
              fontSize: "16px",
              padding: "12px 32px",
              backgroundColor: "#fbbf24",
              color: "#000",
              fontWeight: "700",
              border: "none",
              borderRadius: "8px",
              cursor: updateMutation.isPending ? "not-allowed" : "pointer",
              opacity: updateMutation.isPending ? 0.6 : 1
            }}
          >
            Go to Live Page
          </button>
        </div>
      </div>
    </div>
  );
}
