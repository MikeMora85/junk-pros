import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { CheckCircle, Circle, Truck, Home, Building2, Sofa, Refrigerator, Tv, Package, Trees, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

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
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(1);
  const [completedTabs, setCompletedTabs] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
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

  const { data: company, isLoading } = useQuery({
    queryKey: ["/api/business/profile"],
    enabled: !!user,
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        phone: company.phone || "",
        website: company.website || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
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
        teamMembers: company.teamMembers || [],
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
      return apiRequest("/api/business/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business/profile"] });
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const payload = {
      ...formData,
      services: formData.selectedServices,
      yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
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

  if (isLoading) {
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
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
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                data-testid="input-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your Junk Removal Co."
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                data-testid="input-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                data-testid="input-website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                data-testid="input-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main St"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  data-testid="input-city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Phoenix"
                />
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  data-testid="input-state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Arizona"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="hours">Business Hours</Label>
              <Input
                id="hours"
                data-testid="input-hours"
                value={formData.hours}
                onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                placeholder="Mon-Fri 8AM-6PM, Sat 9AM-3PM"
              />
            </div>

            <div>
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                data-testid="input-availability"
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
              <Label htmlFor="specialties">Additional Specialties (one per line)</Label>
              <Textarea
                id="specialties"
                data-testid="input-specialties"
                value={formData.specialties.join("\n")}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specialties: e.target.value.split("\n").filter(s => s.trim())
                }))}
                placeholder="Estate cleanouts&#10;Hoarding cleanup&#10;Foreclosure cleanups"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="insurance">Insurance Information</Label>
              <Input
                id="insurance"
                data-testid="input-insurance"
                value={formData.insuranceInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, insuranceInfo: e.target.value }))}
                placeholder="Fully Licensed & Insured - $1M Liability"
              />
            </div>

            <div>
              <Label htmlFor="years">Years in Business</Label>
              <Input
                id="years"
                data-testid="input-years"
                type="number"
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
              <Label htmlFor="about">About Us</Label>
              <Textarea
                id="about"
                data-testid="input-about"
                value={formData.aboutUs}
                onChange={(e) => setFormData(prev => ({ ...prev, aboutUs: e.target.value }))}
                placeholder="Tell customers about your business, your mission, and what makes you unique..."
                rows={6}
              />
            </div>

            <div>
              <Label>Why Choose Us? (Add up to 5 reasons)</Label>
              {formData.whyChooseUs.map((reason, index) => (
                <div key={index} style={{ marginBottom: "12px" }}>
                  <Input
                    data-testid={`input-why-${index}`}
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
                <Button
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    whyChooseUs: [...prev.whyChooseUs, ""]
                  }))}
                  data-testid="button-add-reason"
                  variant="outline"
                >
                  Add Another Reason
                </Button>
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
              <Label htmlFor="minimum">Minimum Service Fee</Label>
              <Input
                id="minimum"
                data-testid="input-minimum"
                value={formData.minimumPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumPrice: e.target.value }))}
                placeholder="$99"
              />
            </div>

            <div>
              <Label htmlFor="singleItem">Single Item Minimum</Label>
              <Input
                id="singleItem"
                data-testid="input-single-item"
                value={formData.singleItemMinimum}
                onChange={(e) => setFormData(prev => ({ ...prev, singleItemMinimum: e.target.value }))}
                placeholder="$75"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <Label htmlFor="quarter">1/4 Load Price</Label>
                <Input
                  id="quarter"
                  data-testid="input-quarter"
                  value={formData.quarterLoadPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, quarterLoadPrice: e.target.value }))}
                  placeholder="$150"
                />
              </div>

              <div>
                <Label htmlFor="half">1/2 Load Price</Label>
                <Input
                  id="half"
                  data-testid="input-half"
                  value={formData.halfLoadPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, halfLoadPrice: e.target.value }))}
                  placeholder="$250"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <Label htmlFor="threequarter">3/4 Load Price</Label>
                <Input
                  id="threequarter"
                  data-testid="input-threequarter"
                  value={formData.threeQuarterLoadPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, threeQuarterLoadPrice: e.target.value }))}
                  placeholder="$350"
                />
              </div>

              <div>
                <Label htmlFor="full">Full Load Price</Label>
                <Input
                  id="full"
                  data-testid="input-full"
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
              <Switch
                checked={formData.priceSheetVisible}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, priceSheetVisible: checked }))}
                data-testid="toggle-pricing"
              />
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
              <Switch
                checked={formData.addOnCostsVisible}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, addOnCostsVisible: checked }))}
                data-testid="toggle-addon"
              />
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
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            data-testid="button-save"
            variant="outline"
            style={{
              fontSize: "16px",
              padding: "12px 32px"
            }}
          >
            {updateMutation.isPending ? "Saving..." : "Save Progress"}
          </Button>

          <Button
            onClick={handleGoLive}
            disabled={updateMutation.isPending}
            data-testid="button-go-live"
            style={{
              fontSize: "16px",
              padding: "12px 32px",
              backgroundColor: "#fbbf24",
              color: "#000",
              fontWeight: "700"
            }}
          >
            Go to Live Page
          </Button>
        </div>
      </div>
    </div>
  );
}
