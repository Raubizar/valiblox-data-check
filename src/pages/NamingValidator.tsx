
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/NamingValidator/HeroSection";
import { ProcessSteps } from "@/components/NamingValidator/ProcessSteps";
import { ValidationResults } from "@/components/NamingValidator/ValidationResults";
import { HowItWorks } from "@/components/NamingValidator/HowItWorks";
import { FeaturesSection } from "@/components/NamingValidator/FeaturesSection";

const NamingValidator = () => {
  const [templateUploaded, setTemplateUploaded] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  // Mock data for demonstration
  const complianceData = {
    totalFiles: 7,
    compliantFiles: 7,
    compliancePercentage: 100
  };

  const validationResults = [
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_F0_E_ELPS_DR_20000_Electrical Services - Earthing & Bonding - Ground Floor Layout - Office.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_L0_E_ELPS_DR_30005_Electrical Services - Earthing & Bonding - Foundation Floor Layout - Suite 1.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_L0_E_ELPS_DR_30000_Electrical Services - Earthing & Bonding - Ground Floor Layout - Suite 1.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_L1_E_ELPS_DR_30001_Electrical Services - Earthing & Bonding - First Floor Layout - Suite 1.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_L2_E_ELPS_DR_30002_Electrical Services - Earthing & Bonding - Second Floor Layout - Suite 1.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_F4_E_ELPS_DR_20004_Electrical Services - Earthing & Bonding - Roof Layout - Office.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_P1_E_ELPS_DR_30004_Electrical Services - Earthing & Bonding - First Floor Layout - Office.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    }
  ];

  const handleTemplateUpload = () => {
    setTemplateUploaded(true);
  };

  const handleFilesSelect = () => {
    setFilesSelected(true);
    setValidationComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection validationComplete={validationComplete} />

          <ProcessSteps 
            onTemplateUpload={handleTemplateUpload}
            onFilesSelect={handleFilesSelect}
            templateUploaded={templateUploaded}
          />

          {validationComplete && (
            <ValidationResults 
              complianceData={complianceData}
              validationResults={validationResults}
            />
          )}

          {!validationComplete && <HowItWorks />}

          <FeaturesSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NamingValidator;
