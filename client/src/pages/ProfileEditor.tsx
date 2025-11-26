import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { CheckCircle, Truck, Home, Building2, Sofa, Refrigerator, Tv, Package, Trees, Dumbbell, X, Upload, Plus } from "lucide-react";
import type { Company } from "@shared/schema";
import { ObjectUploader } from "../components/ObjectUploader";
import type { UploadResult } from "@uppy/core";

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

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday"
};

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
});

interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

interface BusinessHours {
  [key: string]: DaySchedule;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
}

interface FeaturedReview {
  id: string;
  reviewerName: string;
  reviewText: string;
}

export default function ProfileEditor() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, navigate] = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  
  const logoPathRef = useRef<string>('');
  const teamPhotoPathRef = useRef<string>('');
  const galleryPathsRef = useRef<string[]>([]);
  
  // Check subscription tier to limit editing for Basic/FREE tier
  const [subscriptionTier, setSubscriptionTier] = useState<string>('basic');

  const getDefaultBusinessHours = (): BusinessHours => ({
    monday: { open: "09:00", close: "17:00", closed: false },
    tuesday: { open: "09:00", close: "17:00", closed: false },
    wednesday: { open: "09:00", close: "17:00", closed: false },
    thursday: { open: "09:00", close: "17:00", closed: false },
    friday: { open: "09:00", close: "17:00", closed: false },
    saturday: { open: "09:00", close: "17:00", closed: true },
    sunday: { open: "09:00", close: "17:00", closed: true },
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    contactEmail: "",
    website: "",
    address: "",
    city: "",
    state: "",
    logoUrl: "",
    videoUrl: "",
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
    trailerSize: "",
    priceSheetVisible: true,
    addOnCostsVisible: true,
    teamMembers: [] as TeamMember[],
    galleryImages: [] as string[],
    hours: "",
    availability: "",
    businessHours: getDefaultBusinessHours(),
    paymentMethods: [] as string[],
    googleRanking: "",
    googleReviewCount: "",
    googleFeaturedReviews: [] as FeaturedReview[],
    faqs: [] as { question: string; answer: string; }[],
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    gmbUrl: "",
    showFacebook: false,
    showInstagram: false,
    showYoutube: false,
    showGmb: false,
    offersInPersonEstimates: true,
    amenities: [] as string[],
    itemsNotTaken: [] as string[],
  });

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ["/api/business/profile"],
    enabled: !!user,
  });

  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (company && !formInitialized) {
      // Set subscription tier for conditional rendering
      setSubscriptionTier(company.subscriptionTier || 'basic');
      
      setFormData({
        name: company.name || "",
        phone: company.phone || "",
        contactEmail: company.contactEmail || "",
        website: company.website || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        logoUrl: company.logoUrl || "",
        videoUrl: company.videoUrl || "",
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
        trailerSize: company.trailerSize || "",
        priceSheetVisible: company.priceSheetVisible ?? true,
        addOnCostsVisible: company.addOnCostsVisible ?? true,
        teamMembers: (company.teamMembers as TeamMember[]) || [],
        galleryImages: company.galleryImages || [],
        hours: company.hours || "",
        availability: company.availability || "",
        businessHours: (company.businessHours as BusinessHours) || getDefaultBusinessHours(),
        paymentMethods: company.paymentMethods || [],
        googleRanking: company.googleRanking?.toString() || "",
        googleReviewCount: company.googleReviewCount?.toString() || "",
        googleFeaturedReviews: (company.googleFeaturedReviews as FeaturedReview[]) || [],
        faqs: (company.faqs as { question: string; answer: string; }[]) || [],
        facebookUrl: company.facebookUrl || "",
        instagramUrl: company.instagramUrl || "",
        youtubeUrl: company.youtubeUrl || "",
        gmbUrl: company.gmbUrl || "",
        showFacebook: !!company.facebookUrl,
        showInstagram: !!company.instagramUrl,
        showYoutube: !!company.youtubeUrl,
        showGmb: !!company.gmbUrl,
        offersInPersonEstimates: company.offersInPersonEstimates ?? true,
        amenities: (company as any).amenities || [],
        itemsNotTaken: (company as any).itemsNotTaken || [],
      });
      setFormInitialized(true);
    }
  }, [company, formInitialized]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('📤 SENDING to API:', {
        galleryImages: data.galleryImages?.length || 0,
        googleFeaturedReviews: data.googleFeaturedReviews?.length || 0,
        teamMembers: data.teamMembers?.length || 0,
        businessHours: data.businessHours ? JSON.stringify(data.businessHours) : 'null'
      });
      const result = await apiRequest("/api/business/profile", {
        method: "PATCH",
        body: data,
      });
      console.log('📥 RECEIVED from API:', {
        galleryImages: result.galleryImages?.length || 0,
        googleFeaturedReviews: result.googleFeaturedReviews?.length || 0,
        teamMembers: result.teamMembers?.length || 0,
        businessHours: result.businessHours ? JSON.stringify(result.businessHours) : 'null'
      });
      return result;
    },
    onSuccess: async (updatedCompany) => {
      queryClient.setQueryData(["/api/business/profile"], updatedCompany);
      
      // Invalidate companies cache so city pages show updated data
      await queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      
      console.log('✅ onSuccess - Updated Company Data:', {
        galleryImages: updatedCompany.galleryImages?.length || 0,
        googleFeaturedReviews: updatedCompany.googleFeaturedReviews?.length || 0,
        teamMembers: updatedCompany.teamMembers?.length || 0,
        businessHours: updatedCompany.businessHours ? JSON.stringify(updatedCompany.businessHours) : 'null'
      });
      
      // Update form data with the saved values to reflect any backend transformations
      setFormData({
        name: updatedCompany.name || "",
        phone: updatedCompany.phone || "",
        contactEmail: updatedCompany.contactEmail || "",
        website: updatedCompany.website || "",
        address: updatedCompany.address || "",
        city: updatedCompany.city || "",
        state: updatedCompany.state || "",
        logoUrl: updatedCompany.logoUrl || "",
        videoUrl: updatedCompany.videoUrl || "",
        selectedServices: updatedCompany.services || [],
        specialties: updatedCompany.specialties || [],
        aboutUs: updatedCompany.aboutUs || "",
        whyChooseUs: updatedCompany.whyChooseUs || [""],
        yearsInBusiness: updatedCompany.yearsInBusiness?.toString() || "",
        insuranceInfo: updatedCompany.insuranceInfo || "",
        minimumPrice: updatedCompany.minimumPrice || "",
        quarterLoadPrice: updatedCompany.quarterLoadPrice || "",
        halfLoadPrice: updatedCompany.halfLoadPrice || "",
        threeQuarterLoadPrice: updatedCompany.threeQuarterLoadPrice || "",
        fullLoadPrice: updatedCompany.fullLoadPrice || "",
        singleItemMinimum: updatedCompany.singleItemMinimum || "",
        trailerSize: updatedCompany.trailerSize || "",
        priceSheetVisible: updatedCompany.priceSheetVisible ?? true,
        addOnCostsVisible: updatedCompany.addOnCostsVisible ?? true,
        teamMembers: (updatedCompany.teamMembers as TeamMember[]) || [],
        galleryImages: updatedCompany.galleryImages || [],
        hours: updatedCompany.hours || "",
        availability: updatedCompany.availability || "",
        businessHours: (updatedCompany.businessHours as BusinessHours) || getDefaultBusinessHours(),
        paymentMethods: updatedCompany.paymentMethods || [],
        googleRanking: updatedCompany.googleRanking?.toString() || "",
        googleReviewCount: updatedCompany.googleReviewCount?.toString() || "",
        googleFeaturedReviews: (updatedCompany.googleFeaturedReviews as FeaturedReview[]) || [],
        faqs: (updatedCompany.faqs as { question: string; answer: string; }[]) || [],
        facebookUrl: updatedCompany.facebookUrl || "",
        instagramUrl: updatedCompany.instagramUrl || "",
        youtubeUrl: updatedCompany.youtubeUrl || "",
        gmbUrl: updatedCompany.gmbUrl || "",
        showFacebook: !!updatedCompany.facebookUrl,
        showInstagram: !!updatedCompany.instagramUrl,
        showYoutube: !!updatedCompany.youtubeUrl,
        showGmb: !!updatedCompany.gmbUrl,
        offersInPersonEstimates: updatedCompany.offersInPersonEstimates ?? true,
      });
      
      setToastMessage("Profile updated successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: (error: any) => {
      console.error('❌ MUTATION ERROR:', error);
      setToastMessage(`Failed to update profile: ${error.message || 'Unknown error'}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    },
  });

  const handleManageSubscription = async () => {
    setIsOpeningPortal(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (data.error) {
        if (data.error.includes('configure') || data.details?.includes('portal')) {
          setToastMessage('Stripe Customer Portal not configured. Please set it up in Stripe Dashboard.');
        } else {
          setToastMessage(data.error);
        }
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      setToastMessage('Failed to open subscription portal');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const handleSave = () => {
    console.log('🔵 SAVE BUTTON CLICKED - Handler executing');
    
    // Basic tier: Only save logo, name, phone, website, address, city, state, contactEmail
    const basicPayload = {
      name: formData.name,
      phone: formData.phone,
      contactEmail: formData.contactEmail || null,
      website: formData.website,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      logoUrl: formData.logoUrl || null,
      claimed: true, // Mark as claimed when user edits profile
    };
    
    // Standard & Premium: Full payload
    const fullPayload = {
      ...basicPayload,
      contactEmail: formData.contactEmail || null,
      videoUrl: formData.videoUrl || null,
      services: formData.selectedServices.length > 0 ? formData.selectedServices : null,
      specialties: formData.specialties.filter(s => s.trim()).length > 0 ? formData.specialties.filter(s => s.trim()) : null,
      aboutUs: formData.aboutUs || null,
      whyChooseUs: formData.whyChooseUs.filter(r => r.trim()).length > 0 ? formData.whyChooseUs.filter(r => r.trim()) : null,
      yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
      insuranceInfo: formData.insuranceInfo || null,
      minimumPrice: formData.minimumPrice || null,
      quarterLoadPrice: formData.quarterLoadPrice || null,
      halfLoadPrice: formData.halfLoadPrice || null,
      threeQuarterLoadPrice: formData.threeQuarterLoadPrice || null,
      fullLoadPrice: formData.fullLoadPrice || null,
      singleItemMinimum: formData.singleItemMinimum || null,
      trailerSize: formData.trailerSize || null,
      priceSheetVisible: formData.priceSheetVisible,
      addOnCostsVisible: formData.addOnCostsVisible,
      offersInPersonEstimates: formData.offersInPersonEstimates,
      hours: formData.hours || null,
      availability: formData.availability || null,
      teamMembers: formData.teamMembers.length > 0 ? formData.teamMembers : null,
      galleryImages: formData.galleryImages.length > 0 ? formData.galleryImages : null,
      businessHours: formData.businessHours,
      paymentMethods: formData.paymentMethods.length > 0 ? formData.paymentMethods : null,
      googleRanking: formData.googleRanking ? parseFloat(formData.googleRanking) : null,
      googleReviewCount: formData.googleReviewCount ? parseInt(formData.googleReviewCount) : null,
      googleFeaturedReviews: formData.googleFeaturedReviews.length > 0 ? formData.googleFeaturedReviews : null,
      reviewSnippets: formData.googleFeaturedReviews.length > 0 
        ? formData.googleFeaturedReviews.map(r => r.reviewText)
        : null,
      rating: formData.googleRanking ? parseFloat(formData.googleRanking) : null,
      faqs: formData.faqs.filter(faq => faq.question.trim() && faq.answer.trim()).length > 0 
        ? formData.faqs.filter(faq => faq.question.trim() && faq.answer.trim()) 
        : null,
      facebookUrl: formData.showFacebook && formData.facebookUrl ? formData.facebookUrl : null,
      instagramUrl: formData.showInstagram && formData.instagramUrl ? formData.instagramUrl : null,
      youtubeUrl: formData.showYoutube && formData.youtubeUrl ? formData.youtubeUrl : null,
      gmbUrl: formData.showGmb && formData.gmbUrl ? formData.gmbUrl : null,
      amenities: (formData.amenities || []).filter(a => a.trim()).length > 0 ? (formData.amenities || []).filter(a => a.trim()) : null,
      itemsNotTaken: (formData.itemsNotTaken || []).filter(i => i.trim()).length > 0 ? (formData.itemsNotTaken || []).filter(i => i.trim()) : null,
    };
    
    // Use appropriate payload based on subscription tier
    const payload = subscriptionTier === 'basic' ? basicPayload : fullPayload;
    
    console.log('💾 SAVE PAYLOAD READY:', { 
      tier: subscriptionTier,
      isBasicPayload: subscriptionTier === 'basic',
      logoUrl: payload.logoUrl,
      name: payload.name,
      phone: payload.phone,
      website: payload.website,
      businessHours: subscriptionTier !== 'basic' ? 'INCLUDED' : 'NOT INCLUDED',
    });
    
    if (subscriptionTier !== 'basic') {
      console.log('📅 BusinessHours in payload:', JSON.stringify(fullPayload.businessHours));
    } else {
      console.log('⚠️ BusinessHours NOT in payload - Tier:', subscriptionTier);
    }
    
    console.log('📤 CALLING MUTATION...');
    updateMutation.mutate(payload);
  };

  const handleGoLive = async () => {
    console.log('🟢 GO LIVE BUTTON CLICKED');
    
    // Prepare the payload (same logic as handleSave)
    const basicPayload = {
      name: formData.name,
      phone: formData.phone,
      contactEmail: formData.contactEmail || null,
      website: formData.website,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      logoUrl: formData.logoUrl || null,
      claimed: true,
    };
    
    const fullPayload = {
      ...basicPayload,
      contactEmail: formData.contactEmail || null,
      videoUrl: formData.videoUrl || null,
      services: formData.selectedServices.length > 0 ? formData.selectedServices : null,
      specialties: formData.specialties.filter(s => s.trim()).length > 0 ? formData.specialties.filter(s => s.trim()) : null,
      aboutUs: formData.aboutUs || null,
      whyChooseUs: formData.whyChooseUs.filter(r => r.trim()).length > 0 ? formData.whyChooseUs.filter(r => r.trim()) : null,
      yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
      insuranceInfo: formData.insuranceInfo || null,
      minimumPrice: formData.minimumPrice || null,
      quarterLoadPrice: formData.quarterLoadPrice || null,
      halfLoadPrice: formData.halfLoadPrice || null,
      threeQuarterLoadPrice: formData.threeQuarterLoadPrice || null,
      fullLoadPrice: formData.fullLoadPrice || null,
      singleItemMinimum: formData.singleItemMinimum || null,
      trailerSize: formData.trailerSize || null,
      priceSheetVisible: formData.priceSheetVisible,
      addOnCostsVisible: formData.addOnCostsVisible,
      offersInPersonEstimates: formData.offersInPersonEstimates,
      hours: formData.hours || null,
      availability: formData.availability || null,
      teamMembers: formData.teamMembers.length > 0 ? formData.teamMembers : null,
      galleryImages: formData.galleryImages.length > 0 ? formData.galleryImages : null,
      businessHours: formData.businessHours,
      paymentMethods: formData.paymentMethods.length > 0 ? formData.paymentMethods : null,
      googleRanking: formData.googleRanking ? parseFloat(formData.googleRanking) : null,
      googleReviewCount: formData.googleReviewCount ? parseInt(formData.googleReviewCount) : null,
      googleFeaturedReviews: formData.googleFeaturedReviews.length > 0 ? formData.googleFeaturedReviews : null,
      reviewSnippets: formData.googleFeaturedReviews.length > 0 
        ? formData.googleFeaturedReviews.map(r => r.reviewText)
        : null,
      rating: formData.googleRanking ? parseFloat(formData.googleRanking) : null,
      faqs: formData.faqs.filter(faq => faq.question.trim() && faq.answer.trim()).length > 0 
        ? formData.faqs.filter(faq => faq.question.trim() && faq.answer.trim()) 
        : null,
      facebookUrl: formData.showFacebook && formData.facebookUrl ? formData.facebookUrl : null,
      instagramUrl: formData.showInstagram && formData.instagramUrl ? formData.instagramUrl : null,
      youtubeUrl: formData.showYoutube && formData.youtubeUrl ? formData.youtubeUrl : null,
      gmbUrl: formData.showGmb && formData.gmbUrl ? formData.gmbUrl : null,
      amenities: (formData.amenities || []).filter(a => a.trim()).length > 0 ? (formData.amenities || []).filter(a => a.trim()) : null,
      itemsNotTaken: (formData.itemsNotTaken || []).filter(i => i.trim()).length > 0 ? (formData.itemsNotTaken || []).filter(i => i.trim()) : null,
    };
    
    const payload = subscriptionTier === 'basic' ? basicPayload : fullPayload;
    
    try {
      console.log('💾 Saving before navigation...');
      // Use mutateAsync to wait for the save to complete
      await updateMutation.mutateAsync(payload);
      console.log('✅ Save completed');
      
      // Force refetch the city companies data before navigating
      if (company) {
        console.log('🔄 Refetching city data...');
        await queryClient.refetchQueries({ 
          queryKey: ["/api/companies"],
          type: 'active'
        });
        console.log('✅ Refetch completed');
        
        // Small delay to ensure cache is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Build URL with explicit trimming to avoid any whitespace issues
        const state = company.state.toLowerCase().trim();
        const city = company.city.toLowerCase().trim();
        const targetUrl = `/${state}/${city}#company-${company.id}`;
        console.log('🎯 Navigating to:', targetUrl);
        navigate(targetUrl);
      }
    } catch (error) {
      console.error('❌ Save failed, not navigating:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
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
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#000",
  };

  const sectionHeaderStyle = {
    backgroundColor: "#fbbf24",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    marginBottom: "12px",
  };

  const sectionContentStyle = {
    padding: "0",
    backgroundColor: "#fff",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "100px" }}>
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

      {/* Save Buttons */}
      <div style={{
        position: "sticky",
        top: "10px",
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        zIndex: 50,
        padding: "10px 20px",
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          data-testid="button-save"
          style={{
            padding: "8px 20px",
            backgroundColor: "#fbbf24",
            color: "#000",
            border: "2px solid #fbbf24",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: updateMutation.isPending ? "not-allowed" : "pointer",
            opacity: updateMutation.isPending ? 0.6 : 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
        >
          {updateMutation.isPending ? "Saving..." : "Save"}
        </button>
        
        <button
          onClick={handleGoLive}
          disabled={updateMutation.isPending}
          data-testid="button-go-live"
          style={{
            padding: "8px 20px",
            backgroundColor: "#fbbf24",
            color: "#000",
            border: "2px solid #fbbf24",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: updateMutation.isPending ? "not-allowed" : "pointer",
            opacity: updateMutation.isPending ? 0.6 : 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
        >
          Live
        </button>
        
        <button
          onClick={handleLogout}
          data-testid="button-logout"
          style={{
            padding: "8px 20px",
            backgroundColor: "#fff",
            color: "#000",
            border: "2px solid #000",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
        >
          Logout
        </button>
      </div>

      {/* Continuous Sections */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 16px" }}>
        
        {/* Section 1: Basic Information */}
        <section style={{ marginTop: "20px", backgroundColor: "#fff" }}>
          <div style={sectionHeaderStyle}>
            <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: "700", margin: 0, color: "#000" }}>
              Basic Information
            </h2>
          </div>
          
          <div style={sectionContentStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Logo Upload */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <label style={{ ...labelStyle, alignSelf: "flex-start" }}>Company Logo</label>
                {formData.logoUrl ? (
                  <div style={{ position: "relative", width: "200px" }}>
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      style={{ width: "100%", height: "auto", borderRadius: "8px", border: "2px solid #e5e7eb" }}
                    />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, logoUrl: "" }))}
                      data-testid="button-remove-logo"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        padding: "6px",
                        backgroundColor: "#dc2626",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer"
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={10485760}
                    onGetUploadParameters={async (file) => {
                      const token = localStorage.getItem('auth_token');
                      const fileExt = file.name.split('.').pop() || 'jpg';
                      logoPathRef.current = `/objects/logos/${crypto.randomUUID()}.${fileExt}`;
                      const response = await fetch('/api/objects/upload', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ path: logoPathRef.current }),
                      });
                      return await response.json();
                    }}
                    onComplete={(result: UploadResult<any, any>) => {
                      if (result.successful && result.successful.length > 0 && logoPathRef.current) {
                        setFormData(prev => ({ ...prev, logoUrl: logoPathRef.current }));
                        setToastMessage("Logo uploaded successfully!");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }
                    }}
                    buttonClassName="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg"
                  >
                    <Upload size={20} style={{ marginRight: "8px" }} />
                    Upload Logo
                  </ObjectUploader>
                )}
              </div>

              {/* Business Name */}
              <div>
                <label style={labelStyle}>Business Name *</label>
                <input
                  data-testid="input-name"
                  style={inputStyle}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your Company Name"
                />
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  data-testid="input-phone"
                  style={inputStyle}
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Paid Plans Only - Contact Email, Website, Social Media, Address */}
              {subscriptionTier !== 'basic' && (
              <>
              {/* Contact Email */}
              <div>
                <label style={labelStyle}>Contact Email (Public)</label>
                <input
                  data-testid="input-contact-email"
                  type="email"
                  style={inputStyle}
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="contact@yourcompany.com"
                />
              </div>

              {/* Website */}
              <div>
                <label style={labelStyle}>Website</label>
                <input
                  data-testid="input-website"
                  style={inputStyle}
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              </>
              )}

              {/* Video URL - Standard & Premium only */}
              {subscriptionTier !== 'basic' && (
              <>
              <div>
                <label style={labelStyle}>Video URL (YouTube or Vimeo)</label>
                <input
                  data-testid="input-video-url"
                  style={inputStyle}
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                  Add a video to showcase your services (displays on desktop only)
                </p>
              </div>

              {/* Social Media Links */}
              <div style={{
                padding: "16px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "2px solid #e5e7eb"
              }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#000" }}>
                  Social Media Links
                </h3>
                
                {/* Facebook */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <label style={labelStyle}>Facebook</label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                      <input
                        type="checkbox"
                        checked={formData.showFacebook}
                        onChange={(e) => setFormData(prev => ({ ...prev, showFacebook: e.target.checked }))}
                        data-testid="toggle-facebook"
                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      Show on profile
                    </label>
                  </div>
                  <input
                    data-testid="input-facebook"
                    style={inputStyle}
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebookUrl: e.target.value }))}
                    placeholder="https://facebook.com/yourpage"
                    disabled={!formData.showFacebook}
                  />
                </div>

                {/* Instagram */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <label style={labelStyle}>Instagram</label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                      <input
                        type="checkbox"
                        checked={formData.showInstagram}
                        onChange={(e) => setFormData(prev => ({ ...prev, showInstagram: e.target.checked }))}
                        data-testid="toggle-instagram"
                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      Show on profile
                    </label>
                  </div>
                  <input
                    data-testid="input-instagram"
                    style={inputStyle}
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                    placeholder="https://instagram.com/yourpage"
                    disabled={!formData.showInstagram}
                  />
                </div>

                {/* YouTube */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <label style={labelStyle}>YouTube</label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                      <input
                        type="checkbox"
                        checked={formData.showYoutube}
                        onChange={(e) => setFormData(prev => ({ ...prev, showYoutube: e.target.checked }))}
                        data-testid="toggle-youtube"
                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      Show on profile
                    </label>
                  </div>
                  <input
                    data-testid="input-youtube"
                    style={inputStyle}
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                    placeholder="https://youtube.com/@yourchannel"
                    disabled={!formData.showYoutube}
                  />
                </div>

                {/* Google Business Profile */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <label style={labelStyle}>Google Business Profile</label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                      <input
                        type="checkbox"
                        checked={formData.showGmb}
                        onChange={(e) => setFormData(prev => ({ ...prev, showGmb: e.target.checked }))}
                        data-testid="toggle-gmb"
                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      Show "View on Google" button
                    </label>
                  </div>
                  <input
                    data-testid="input-gmb"
                    style={inputStyle}
                    value={formData.gmbUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, gmbUrl: e.target.value }))}
                    placeholder="https://maps.google.com/?cid=..."
                    disabled={!formData.showGmb}
                  />
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                    Add your Google Business Profile link to show a "View Reviews on Google" button
                  </p>
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={labelStyle}>Street Address *</label>
                <input
                  data-testid="input-address"
                  style={inputStyle}
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street"
                />
              </div>

              {/* City */}
              <div>
                <label style={labelStyle}>City *</label>
                <input
                  data-testid="input-city"
                  style={inputStyle}
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Your City"
                />
              </div>

              {/* State */}
              <div>
                <label style={labelStyle}>State *</label>
                <input
                  data-testid="input-state"
                  style={inputStyle}
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="State"
                />
              </div>

              {/* Business Hours - Standard & Premium only */}
              <div>
                <label style={labelStyle}>Business Hours</label>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "12px",
                  backgroundColor: "#f9fafb",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "2px solid #e5e7eb"
                }}>
                  {DAYS.map((day) => (
                    <div key={day} style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ width: "100px", fontWeight: "600", fontSize: "14px" }}>
                        {DAY_LABELS[day]}
                      </div>
                      <select
                        data-testid={`select-${day}-open`}
                        value={formData.businessHours[day].open}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          businessHours: {
                            ...prev.businessHours,
                            [day]: { ...prev.businessHours[day], open: e.target.value }
                          }
                        }))}
                        disabled={formData.businessHours[day].closed}
                        style={{
                          padding: "8px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          fontSize: "14px",
                          backgroundColor: formData.businessHours[day].closed ? "#f3f4f6" : "#fff"
                        }}
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <span style={{ fontSize: "14px", fontWeight: "600" }}>to</span>
                      <select
                        data-testid={`select-${day}-close`}
                        value={formData.businessHours[day].close}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          businessHours: {
                            ...prev.businessHours,
                            [day]: { ...prev.businessHours[day], close: e.target.value }
                          }
                        }))}
                        disabled={formData.businessHours[day].closed}
                        style={{
                          padding: "8px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          fontSize: "14px",
                          backgroundColor: formData.businessHours[day].closed ? "#f3f4f6" : "#fff"
                        }}
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", cursor: "pointer" }}>
                        <input
                          data-testid={`checkbox-${day}-closed`}
                          type="checkbox"
                          checked={formData.businessHours[day].closed}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            businessHours: {
                              ...prev.businessHours,
                              [day]: { ...prev.businessHours[day], closed: e.target.checked }
                            }
                          }))}
                          style={{ width: "16px", height: "16px", cursor: "pointer" }}
                        />
                        Closed
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods - Standard & Premium only */}
              <div>
                <label style={labelStyle}>Payment Methods Accepted</label>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  marginTop: "12px"
                }}>
                  {[
                    { id: 'Cash', label: 'Cash', icon: '💵' },
                    { id: 'Card', label: 'Card', icon: '💳' },
                    { id: 'Zelle', label: 'Zelle', icon: 'Z' },
                    { id: 'Venmo', label: 'Venmo', icon: 'V' },
                    { id: 'Apple Pay', label: 'Apple', icon: '' },
                    { id: 'Cash App', label: 'CashApp', icon: '$' },
                    { id: 'Check', label: 'Check', icon: '📝' },
                    { id: 'PayPal', label: 'PayPal', icon: 'P' },
                  ].map(({ id, label, icon }) => {
                    const isSelected = formData.paymentMethods.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          paymentMethods: prev.paymentMethods.includes(id)
                            ? prev.paymentMethods.filter(m => m !== id)
                            : [...prev.paymentMethods, id]
                        }))}
                        data-testid={`payment-${id.toLowerCase().replace(' ', '-')}`}
                        style={{
                          padding: "8px 4px",
                          border: `2px solid ${isSelected ? "#fbbf24" : "#e5e7eb"}`,
                          borderRadius: "8px",
                          backgroundColor: isSelected ? "#fef3c7" : "#fff",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.2s"
                        }}
                      >
                        <span style={{ fontSize: "20px" }}>{icon}</span>
                        <span style={{
                          fontSize: "11px",
                          fontWeight: isSelected ? "600" : "500",
                          color: "#000",
                          textAlign: "center"
                        }}>
                          {label}
                        </span>
                        {isSelected && (
                          <CheckCircle size={14} color="#16a34a" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              </>
              )}

              {/* Free Plan Upgrade Message */}
              {subscriptionTier === 'basic' && (
              <div style={{
                padding: "20px",
                backgroundColor: "#fef3c7",
                borderRadius: "12px",
                border: "2px solid #fbbf24",
                marginTop: "8px"
              }}>
                <p style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  margin: 0,
                  color: "#000",
                  fontWeight: "500"
                }}>
                  🆓 <strong>Free Profile:</strong> You can edit your logo, business name, and phone number.
                </p>
                <p style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  margin: "8px 0 0 0",
                  color: "#000",
                  fontWeight: "500"
                }}>
                  💎 <strong>Upgrade to add:</strong> photos, address, reviews, social media links, and more!
                </p>
              </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 2-6: Only for Standard & Premium tiers */}
        {subscriptionTier !== 'basic' && (
        <>
        {/* Section 2: Services & Specialties */}
        <section style={{ marginTop: "24px", backgroundColor: "#fff" }}>
          <div style={sectionHeaderStyle}>
            <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: "700", margin: 0, color: "#000" }}>
              Services & Specialties
            </h2>
          </div>
          
          <div style={sectionContentStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Service Icons */}
              <div>
                <label style={labelStyle}>Select Your Services</label>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "8px",
                  marginTop: "12px"
                }}>
                  {SERVICE_ICONS.map(({ id, icon: Icon, label }) => {
                    const isSelected = formData.selectedServices.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleService(id)}
                        data-testid={`service-${id}`}
                        style={{
                          padding: "12px 8px",
                          border: `2px solid ${isSelected ? "#fbbf24" : "#e5e7eb"}`,
                          borderRadius: "8px",
                          backgroundColor: isSelected ? "#fef3c7" : "#fff",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.2s"
                        }}
                      >
                        <Icon size={24} color={isSelected ? "#000" : "#666"} />
                        <span style={{
                          fontSize: "11px",
                          fontWeight: isSelected ? "600" : "500",
                          color: "#000",
                          textAlign: "center"
                        }}>
                          {label}
                        </span>
                        {isSelected && (
                          <CheckCircle size={14} color="#16a34a" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label style={labelStyle}>Specialties (Optional)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {formData.specialties.map((specialty, index) => (
                    <div key={index} style={{ display: "flex", gap: "8px" }}>
                      <input
                        data-testid={`input-specialty-${index}`}
                        style={{ ...inputStyle, flex: 1 }}
                        value={specialty}
                        onChange={(e) => {
                          const newSpecialties = [...formData.specialties];
                          newSpecialties[index] = e.target.value;
                          setFormData(prev => ({ ...prev, specialties: newSpecialties }));
                        }}
                        placeholder="e.g., Estate Cleanouts"
                      />
                      <button
                        onClick={() => {
                          const newSpecialties = formData.specialties.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, specialties: newSpecialties }));
                        }}
                        data-testid={`button-remove-specialty-${index}`}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#dc2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, specialties: [...prev.specialties, ""] }))}
                    data-testid="button-add-specialty"
                    style={{
                      padding: "12px",
                      backgroundColor: "#fbbf24",
                      color: "#000",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <Plus size={16} />
                    Add Specialty
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: About Your Business */}
        <section style={{ marginTop: "24px", backgroundColor: "#fff" }}>
          <div style={sectionHeaderStyle}>
            <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: "700", margin: 0, color: "#000" }}>
              About Your Business
            </h2>
          </div>
          
          <div style={sectionContentStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* About Us */}
              <div>
                <label style={labelStyle}>About Your Company</label>
                <textarea
                  data-testid="input-about-us"
                  style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
                  value={formData.aboutUs}
                  onChange={(e) => setFormData(prev => ({ ...prev, aboutUs: e.target.value }))}
                  placeholder="Tell customers about your business, experience, and what makes you unique..."
                />
              </div>

              {/* Years in Business */}
              <div>
                <label style={labelStyle}>Years in Business</label>
                <input
                  data-testid="input-years-in-business"
                  type="number"
                  style={inputStyle}
                  value={formData.yearsInBusiness}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearsInBusiness: e.target.value }))}
                  placeholder="e.g., 10"
                />
              </div>

              {/* Insurance Info */}
              <div>
                <label style={labelStyle}>Insurance Information</label>
                <textarea
                  data-testid="input-insurance-info"
                  style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                  value={formData.insuranceInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, insuranceInfo: e.target.value }))}
                  placeholder="e.g., Fully insured and bonded - $2M general liability"
                />
              </div>

              {/* Why Choose Us */}
              <div>
                <label style={labelStyle}>Why Choose Us? (Key Points)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {formData.whyChooseUs.map((reason, index) => (
                    <div key={index} style={{ display: "flex", gap: "8px" }}>
                      <input
                        data-testid={`input-why-choose-${index}`}
                        style={{ ...inputStyle, flex: 1 }}
                        value={reason}
                        onChange={(e) => {
                          const newReasons = [...formData.whyChooseUs];
                          newReasons[index] = e.target.value;
                          setFormData(prev => ({ ...prev, whyChooseUs: newReasons }));
                        }}
                        placeholder="e.g., Same-day service available"
                      />
                      {formData.whyChooseUs.length > 1 && (
                        <button
                          onClick={() => {
                            const newReasons = formData.whyChooseUs.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, whyChooseUs: newReasons }));
                          }}
                          data-testid={`button-remove-reason-${index}`}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#dc2626",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600"
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, whyChooseUs: [...prev.whyChooseUs, ""] }))}
                    data-testid="button-add-reason"
                    style={{
                      padding: "12px",
                      backgroundColor: "#fbbf24",
                      color: "#000",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <Plus size={16} />
                    Add Reason
                  </button>
                </div>
              </div>

              {/* Google Reviews */}
              <div>
                <label style={labelStyle}>Google Reviews</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                  <div>
                    <label style={{ ...labelStyle, fontSize: "13px" }}>Google Rating (0.0 - 5.0)</label>
                    <input
                      data-testid="input-google-rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      style={inputStyle}
                      value={formData.googleRanking}
                      onChange={(e) => setFormData(prev => ({ ...prev, googleRanking: e.target.value }))}
                      placeholder="4.8"
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: "13px" }}>Total Review Count</label>
                    <input
                      data-testid="input-google-review-count"
                      type="number"
                      style={inputStyle}
                      value={formData.googleReviewCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, googleReviewCount: e.target.value }))}
                      placeholder="127"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Reviews */}
              <div>
                <label style={labelStyle}>Featured Reviews (Up to 3)</label>
                {formData.googleFeaturedReviews.map((review, index) => (
                  <div key={review.id} style={{
                    padding: "16px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    border: "2px solid #e5e7eb"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                      <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Review {index + 1}</h4>
                      <button
                        onClick={() => {
                          const newReviews = formData.googleFeaturedReviews.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, googleFeaturedReviews: newReviews }));
                        }}
                        data-testid={`button-remove-review-${index}`}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#dc2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <input
                        data-testid={`input-reviewer-name-${index}`}
                        style={inputStyle}
                        value={review.reviewerName}
                        onChange={(e) => {
                          const newReviews = [...formData.googleFeaturedReviews];
                          newReviews[index].reviewerName = e.target.value;
                          setFormData(prev => ({ ...prev, googleFeaturedReviews: newReviews }));
                        }}
                        placeholder="Reviewer Name"
                      />
                      <textarea
                        data-testid={`input-review-text-${index}`}
                        style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                        value={review.reviewText}
                        onChange={(e) => {
                          const newReviews = [...formData.googleFeaturedReviews];
                          newReviews[index].reviewText = e.target.value;
                          setFormData(prev => ({ ...prev, googleFeaturedReviews: newReviews }));
                        }}
                        placeholder="Review text..."
                      />
                    </div>
                  </div>
                ))}
                {formData.googleFeaturedReviews.length < 3 && (
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        googleFeaturedReviews: [
                          ...prev.googleFeaturedReviews,
                          { id: crypto.randomUUID(), reviewerName: "", reviewText: "" }
                        ]
                      }));
                    }}
                    data-testid="button-add-review"
                    style={{
                      padding: "12px",
                      backgroundColor: "#fbbf24",
                      color: "#000",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%"
                    }}
                  >
                    <Plus size={16} />
                    Add Featured Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Pricing */}
        <section style={{ marginTop: "24px", backgroundColor: "#fff" }}>
          <div style={sectionHeaderStyle}>
            <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: "700", margin: 0, color: "#000" }}>
              Pricing
            </h2>
          </div>
          
          <div style={sectionContentStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* All Pricing in 2-column grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: "13px" }}>Minimum</label>
                  <input
                    data-testid="input-minimum-price"
                    style={inputStyle}
                    value={formData.minimumPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumPrice: e.target.value }))}
                    placeholder="$150"
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: "13px" }}>1/4 Load</label>
                  <input
                    data-testid="input-quarter-load"
                    style={inputStyle}
                    value={formData.quarterLoadPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, quarterLoadPrice: e.target.value }))}
                    placeholder="$200"
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: "13px" }}>1/2 Load</label>
                  <input
                    data-testid="input-half-load"
                    style={inputStyle}
                    value={formData.halfLoadPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, halfLoadPrice: e.target.value }))}
                    placeholder="$350"
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: "13px" }}>3/4 Load</label>
                  <input
                    data-testid="input-three-quarter-load"
                    style={inputStyle}
                    value={formData.threeQuarterLoadPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, threeQuarterLoadPrice: e.target.value }))}
                    placeholder="$500"
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: "13px" }}>Full Load</label>
                  <input
                    data-testid="input-full-load"
                    style={inputStyle}
                    value={formData.fullLoadPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullLoadPrice: e.target.value }))}
                    placeholder="$650"
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: "13px" }}>Single Item</label>
                  <input
                    data-testid="input-single-item-minimum"
                    style={inputStyle}
                    value={formData.singleItemMinimum}
                    onChange={(e) => setFormData(prev => ({ ...prev, singleItemMinimum: e.target.value }))}
                    placeholder="$75"
                  />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ ...labelStyle, fontSize: "13px" }}>Truck Capacity (Cubic Yards)</label>
                  <input
                    data-testid="input-trailer-size"
                    style={inputStyle}
                    value={formData.trailerSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, trailerSize: e.target.value }))}
                    placeholder="e.g., 13 cubic yards"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Team & Gallery */}
        <section style={{ marginTop: "24px", backgroundColor: "#fff" }}>
          <div style={sectionHeaderStyle}>
            <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: "700", margin: 0, color: "#000" }}>
              Team & Gallery
            </h2>
          </div>
          
          <div style={sectionContentStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* Team Members */}
              <div>
                <label style={labelStyle}>Team Members</label>
                {formData.teamMembers.map((member, index) => (
                  <div key={member.id} style={{
                    padding: "20px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    border: "2px solid #e5e7eb"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                      <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Team Member {index + 1}</h4>
                      <button
                        onClick={() => {
                          const newMembers = formData.teamMembers.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, teamMembers: newMembers }));
                        }}
                        data-testid={`button-remove-team-${index}`}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#dc2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* Photo Upload */}
                      <div>
                        <label style={{ ...labelStyle, fontSize: "13px" }}>Photo</label>
                        {member.photoUrl ? (
                          <div style={{ position: "relative", width: "150px" }}>
                            <img
                              src={member.photoUrl}
                              alt={member.name}
                              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                            />
                            <button
                              onClick={() => {
                                const newMembers = [...formData.teamMembers];
                                newMembers[index].photoUrl = "";
                                setFormData(prev => ({ ...prev, teamMembers: newMembers }));
                              }}
                              data-testid={`button-remove-team-photo-${index}`}
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                padding: "6px",
                                backgroundColor: "#dc2626",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                cursor: "pointer"
                              }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <ObjectUploader
                            maxNumberOfFiles={1}
                            maxFileSize={10485760}
                            onGetUploadParameters={async (file) => {
                              const token = localStorage.getItem('auth_token');
                              const fileExt = file.name.split('.').pop() || 'jpg';
                              teamPhotoPathRef.current = `/objects/team/${crypto.randomUUID()}.${fileExt}`;
                              const response = await fetch('/api/objects/upload', {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ path: teamPhotoPathRef.current }),
                              });
                              return await response.json();
                            }}
                            onComplete={(result: UploadResult<any, any>) => {
                              if (result.successful && result.successful.length > 0 && teamPhotoPathRef.current) {
                                const newMembers = [...formData.teamMembers];
                                newMembers[index].photoUrl = teamPhotoPathRef.current;
                                setFormData(prev => ({ ...prev, teamMembers: newMembers }));
                                setToastMessage("Team member photo uploaded!");
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 3000);
                              }
                            }}
                            buttonClassName="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg text-sm"
                          >
                            <Upload size={16} style={{ marginRight: "6px" }} />
                            Upload Photo
                          </ObjectUploader>
                        )}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                        <div>
                          <label style={{ ...labelStyle, fontSize: "13px" }}>Name</label>
                          <input
                            data-testid={`input-team-name-${index}`}
                            style={inputStyle}
                            value={member.name}
                            onChange={(e) => {
                              const newMembers = [...formData.teamMembers];
                              newMembers[index].name = e.target.value;
                              setFormData(prev => ({ ...prev, teamMembers: newMembers }));
                            }}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label style={{ ...labelStyle, fontSize: "13px" }}>Role</label>
                          <input
                            data-testid={`input-team-role-${index}`}
                            style={inputStyle}
                            value={member.role}
                            onChange={(e) => {
                              const newMembers = [...formData.teamMembers];
                              newMembers[index].role = e.target.value;
                              setFormData(prev => ({ ...prev, teamMembers: newMembers }));
                            }}
                            placeholder="Owner / Lead Technician"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ ...labelStyle, fontSize: "13px" }}>Bio</label>
                        <textarea
                          data-testid={`input-team-bio-${index}`}
                          style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                          value={member.bio}
                          onChange={(e) => {
                            const newMembers = [...formData.teamMembers];
                            newMembers[index].bio = e.target.value;
                            setFormData(prev => ({ ...prev, teamMembers: newMembers }));
                          }}
                          placeholder="Brief bio about this team member..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      teamMembers: [
                        ...prev.teamMembers,
                        { id: crypto.randomUUID(), name: "", role: "", bio: "", photoUrl: "" }
                      ]
                    }));
                  }}
                  data-testid="button-add-team-member"
                  style={{
                    padding: "12px",
                    backgroundColor: "#fbbf24",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%"
                  }}
                >
                  <Plus size={16} />
                  Add Team Member
                </button>
              </div>

              {/* Gallery Photos */}
              <div>
                <label style={labelStyle}>Gallery Photos ({formData.galleryImages.length}/10)</label>
                {formData.galleryImages.length >= 10 ? (
                  <div style={{
                    padding: "12px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "8px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontWeight: "500",
                    fontSize: "14px"
                  }}>
                    Maximum 10 photos reached. Remove some to add more.
                  </div>
                ) : (
                  <ObjectUploader
                    maxNumberOfFiles={Math.max(1, 10 - formData.galleryImages.length)}
                    maxFileSize={10485760}
                    onGetUploadParameters={async (file) => {
                      if (formData.galleryImages.length >= 10) {
                        throw new Error("Maximum 10 photos allowed");
                      }
                      const token = localStorage.getItem('auth_token');
                      const fileExt = file.name.split('.').pop() || 'jpg';
                      const path = `/objects/gallery/${crypto.randomUUID()}.${fileExt}`;
                      galleryPathsRef.current.push(path);
                      const response = await fetch('/api/objects/upload', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ path }),
                      });
                      return await response.json();
                    }}
                    onComplete={(result: UploadResult<any, any>) => {
                      console.log('GALLERY UPLOAD COMPLETE');
                      if (result.successful && result.successful.length > 0 && galleryPathsRef.current.length > 0) {
                        const remainingSlots = 10 - formData.galleryImages.length;
                        const newImages = galleryPathsRef.current.slice(0, remainingSlots);
                        if (newImages.length > 0) {
                          setFormData(prev => ({
                            ...prev,
                            galleryImages: [...prev.galleryImages, ...newImages].slice(0, 10)
                          }));
                          setToastMessage(`${newImages.length} image(s) uploaded successfully!`);
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 3000);
                        }
                        galleryPathsRef.current = [];
                      }
                    }}
                    buttonClassName="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg w-full"
                  >
                    <Upload size={18} style={{ marginRight: "8px" }} />
                    Upload Photos
                  </ObjectUploader>
                )}

                {formData.galleryImages.length > 0 && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "12px",
                  }}>
                    {formData.galleryImages.map((url, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          paddingBottom: "100%",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "#f3f4f6"
                        }}
                      >
                        <img
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                        <button
                          onClick={() => {
                            const newImages = formData.galleryImages.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, galleryImages: newImages }));
                          }}
                          data-testid={`button-remove-gallery-${index}`}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            padding: "6px",
                            backgroundColor: "#dc2626",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            zIndex: 10
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: FAQs */}
        <section style={{ marginTop: "24px", backgroundColor: "#fff" }}>
          <div style={sectionHeaderStyle}>
            <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: "700", margin: 0, color: "#000" }}>
              FAQs
            </h2>
          </div>
          
          <div style={sectionContentStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
                Add common questions and answers to help customers learn more about your services
              </p>
              
              {formData.faqs.map((faq, index) => (
                <div key={index} style={{
                  padding: "16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "2px solid #e5e7eb"
                }}>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{...labelStyle, marginBottom: "8px"}}>Question</label>
                    <input
                      data-testid={`input-faq-question-${index}`}
                      style={inputStyle}
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...formData.faqs];
                        newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                        setFormData(prev => ({ ...prev, faqs: newFaqs }));
                      }}
                      placeholder="e.g., Do you offer same-day service?"
                    />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{...labelStyle, marginBottom: "8px"}}>Answer</label>
                    <textarea
                      data-testid={`textarea-faq-answer-${index}`}
                      style={{...inputStyle, minHeight: "80px", resize: "vertical"}}
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...formData.faqs];
                        newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                        setFormData(prev => ({ ...prev, faqs: newFaqs }));
                      }}
                      placeholder="e.g., Yes! We offer same-day junk removal service in most cases. Contact us early in the day for best availability."
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newFaqs = formData.faqs.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, faqs: newFaqs }));
                    }}
                    data-testid={`button-remove-faq-${index}`}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600"
                    }}
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => {
                  setFormData(prev => ({ 
                    ...prev, 
                    faqs: [...prev.faqs, { question: "", answer: "" }] 
                  }));
                }}
                data-testid="button-add-faq"
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#fbbf24",
                  color: "#000",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <Plus size={16} />
                Add FAQ
              </button>
            </div>
          </div>
        </section>

        {/* Section 7: Amenities & Items Not Taken */}
        <section style={{ marginTop: "24px", backgroundColor: "#fff" }}>
          <div style={sectionHeaderStyle}>
            <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: "700", margin: 0, color: "#000" }}>
              Amenities & Restrictions
            </h2>
          </div>
          
          <div style={sectionContentStyle}>
            {/* Amenities */}
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Amenities (What You Offer)</label>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", marginTop: "4px" }}>
                e.g., Free Estimates, Same-Day Service
              </p>
              
              {(formData.amenities || []).map((amenity, index) => (
                <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input
                    data-testid={`input-amenity-${index}`}
                    style={{...inputStyle, flex: 1}}
                    value={amenity}
                    onChange={(e) => {
                      const newAmenities = [...formData.amenities];
                      newAmenities[index] = e.target.value;
                      setFormData(prev => ({ ...prev, amenities: newAmenities }));
                    }}
                    placeholder="e.g., Free Estimates"
                  />
                  <button
                    onClick={() => {
                      const newAmenities = formData.amenities.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, amenities: newAmenities }));
                    }}
                    data-testid={`button-remove-amenity-${index}`}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => {
                  setFormData(prev => ({ 
                    ...prev, 
                    amenities: [...prev.amenities, ""] 
                  }));
                }}
                data-testid="button-add-amenity"
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#fbbf24",
                  color: "#000",
                  border: "2px solid #000",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Plus size={16} />
                Add Amenity
              </button>
            </div>
            
            {/* Items Not Taken */}
            <div>
              <label style={labelStyle}>Items We Don't Take</label>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", marginTop: "4px" }}>
                e.g., Hazardous Materials, Chemicals
              </p>
              
              {(formData.itemsNotTaken || []).map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input
                    data-testid={`input-items-not-taken-${index}`}
                    style={{...inputStyle, flex: 1}}
                    value={item}
                    onChange={(e) => {
                      const newItems = [...formData.itemsNotTaken];
                      newItems[index] = e.target.value;
                      setFormData(prev => ({ ...prev, itemsNotTaken: newItems }));
                    }}
                    placeholder="e.g., Hazardous Materials"
                  />
                  <button
                    onClick={() => {
                      const newItems = formData.itemsNotTaken.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, itemsNotTaken: newItems }));
                    }}
                    data-testid={`button-remove-items-not-taken-${index}`}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => {
                  setFormData(prev => ({ 
                    ...prev, 
                    itemsNotTaken: [...prev.itemsNotTaken, ""] 
                  }));
                }}
                data-testid="button-add-items-not-taken"
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#fbbf24",
                  color: "#000",
                  border: "2px solid #000",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>
          </div>
        </section>

        {/* Section 8: Visibility Settings */}
        <section style={{ marginTop: "24px", marginBottom: "40px", backgroundColor: "#fff" }}>
          <div style={sectionHeaderStyle}>
            <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: "700", margin: 0, color: "#000" }}>
              Visibility Settings
            </h2>
          </div>
          
          <div style={sectionContentStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Show Pricing */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "2px solid #e5e7eb"
              }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px" }}>
                    Show Pricing on Profile
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Display your pricing information to customers
                  </div>
                </div>
                <label style={{ position: "relative", display: "inline-block", width: "56px", height: "28px" }}>
                  <input
                    data-testid="toggle-pricing-visible"
                    type="checkbox"
                    checked={formData.priceSheetVisible}
                    onChange={(e) => setFormData(prev => ({ ...prev, priceSheetVisible: e.target.checked }))}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: formData.priceSheetVisible ? "#16a34a" : "#ccc",
                    borderRadius: "28px",
                    transition: "0.3s"
                  }}>
                    <span style={{
                      position: "absolute",
                      content: "",
                      height: "22px",
                      width: "22px",
                      left: formData.priceSheetVisible ? "30px" : "3px",
                      bottom: "3px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      transition: "0.3s"
                    }} />
                  </span>
                </label>
              </div>

              {/* Show Add-on Costs */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "2px solid #e5e7eb"
              }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px" }}>
                    Show Additional Costs Section
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Display potential additional charges to customers
                  </div>
                </div>
                <label style={{ position: "relative", display: "inline-block", width: "56px", height: "28px" }}>
                  <input
                    data-testid="toggle-addon-costs-visible"
                    type="checkbox"
                    checked={formData.addOnCostsVisible}
                    onChange={(e) => setFormData(prev => ({ ...prev, addOnCostsVisible: e.target.checked }))}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: formData.addOnCostsVisible ? "#16a34a" : "#ccc",
                    borderRadius: "28px",
                    transition: "0.3s"
                  }}>
                    <span style={{
                      position: "absolute",
                      content: "",
                      height: "22px",
                      width: "22px",
                      left: formData.addOnCostsVisible ? "30px" : "3px",
                      bottom: "3px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      transition: "0.3s"
                    }} />
                  </span>
                </label>
              </div>

              {/* Offer In-Person Estimates */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "2px solid #e5e7eb"
              }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px" }}>
                    Offer In-Person Estimates
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Allow customers to request on-site estimates (calendar integration coming soon)
                  </div>
                </div>
                <label style={{ position: "relative", display: "inline-block", width: "56px", height: "28px" }}>
                  <input
                    data-testid="toggle-in-person-estimates"
                    type="checkbox"
                    checked={formData.offersInPersonEstimates ?? true}
                    onChange={(e) => setFormData(prev => ({ ...prev, offersInPersonEstimates: e.target.checked }))}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: (formData.offersInPersonEstimates ?? true) ? "#16a34a" : "#ccc",
                    borderRadius: "28px",
                    transition: "0.3s"
                  }}>
                    <span style={{
                      position: "absolute",
                      content: "",
                      height: "22px",
                      width: "22px",
                      left: (formData.offersInPersonEstimates ?? true) ? "30px" : "3px",
                      bottom: "3px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      transition: "0.3s"
                    }} />
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>
        </>
        )}
        
        {/* Subscription Management Section */}
        <section style={{
          marginTop: "24px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          border: "2px solid #e5e5e5",
          borderRadius: "8px",
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "#000" }}>
            Subscription
          </h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#000", marginBottom: "4px" }}>
                Current Plan: {subscriptionTier === 'basic' ? 'Basic (FREE)' : subscriptionTier === 'standard' ? 'Professional ($10/month)' : 'Featured ($49/month)'}
              </p>
              <p style={{ fontSize: "13px", color: "#666" }}>
                {subscriptionTier === 'basic' 
                  ? 'Upgrade for galleries, pricing tools, reviews, and more!'
                  : 'Manage your subscription, update payment method, or cancel anytime.'}
              </p>
            </div>
            {subscriptionTier === 'basic' ? (
              <a 
                href="/add-business"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#fbbf24",
                  color: "#000",
                  border: "2px solid #000",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                data-testid="button-upgrade-subscription"
              >
                Upgrade Plan
              </a>
            ) : (
              <button
                onClick={handleManageSubscription}
                disabled={isOpeningPortal}
                style={{
                  padding: "10px 20px",
                  backgroundColor: isOpeningPortal ? "#ccc" : "#fff",
                  color: "#000",
                  border: "2px solid #000",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: isOpeningPortal ? "not-allowed" : "pointer",
                }}
                data-testid="button-manage-subscription"
              >
                {isOpeningPortal ? "Opening..." : "Manage Subscription"}
              </button>
            )}
          </div>
        </section>

        {/* Basic Tier Message */}
        {subscriptionTier === 'basic' && (
          <div style={{
            marginTop: "24px",
            padding: "20px",
            backgroundColor: "#fef3c7",
            border: "2px solid #fbbf24",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px", color: "#000" }}>
              FREE Profile
            </h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
              You can edit: Logo, Name, Phone, Address, and Website
            </p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Upgrade to <strong>Professional ($10/month)</strong> or <strong>Featured ($49/month)</strong> for full features including galleries, pricing tools, reviews, and more!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
