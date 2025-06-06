import zipfile
import os
from pathlib import Path

def create_naming_sample():
    """Create a sample ZIP file for naming validation demo"""
    sample_dir = Path("c:/Users/ruben/Documents/GitHub/valiblox-data-check/public/sample")
    sample_dir.mkdir(exist_ok=True)
    
    # Create the ZIP file
    zip_path = sample_dir / "naming.zip"
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add a sample naming convention template
        template_content = """Project Code,Discipline,Document Type,Sequential Number,Revision
ABC,STR,DWG,001,01
ABC,STR,DWG,002,01
ABC,STR,DWG,003,01
ABC,MEP,DWG,001,01
ABC,MEP,DWG,002,01
XYZ,ARC,PDF,001,REV01
XYZ,ARC,PDF,002,REV01"""
        
        zipf.writestr("Sample-Naming-Convention.csv", template_content)
        
        # Add sample files with various naming patterns
        sample_files = [
            # Compliant files
            "Structural/ABC-STR-DWG-001-01.dwg",
            "Structural/ABC-STR-DWG-002-01.dwg", 
            "Structural/ABC-STR-DWG-003-01.pdf",
            "MEP/ABC-MEP-DWG-001-01.dwg",
            "MEP/ABC-MEP-DWG-002-01.xlsx",
            "Architecture/XYZ-ARC-PDF-001-REV01.pdf",
            "Architecture/XYZ-ARC-PDF-002-REV01.docx",
            
            # Non-compliant files
            "Structural/ABC_STR_DWG_004_01.dwg",  # Wrong separators
            "MEP/ABC-MEP-003-01.dwg",             # Missing document type
            "Architecture/XYZ-ARC-PDF-003.pdf",   # Missing revision
            "General/RandomFile.txt",             # Completely wrong format
            "Structural/ABC-STR-DWG-005-REV02-EXTRA.dwg",  # Extra parts
        ]
        
        for file_path in sample_files:
            # Create realistic dummy content based on file type
            ext = file_path.split('.')[-1].lower()
            if ext == 'dwg':
                content = b"DWG File - Sample CAD Drawing Content"
            elif ext == 'pdf':
                content = b"PDF File - Sample Document Content"
            elif ext == 'xlsx':
                content = b"XLSX File - Sample Spreadsheet Content"
            elif ext == 'docx':
                content = b"DOCX File - Sample Word Document Content"
            else:
                content = b"Sample file content"
            
            zipf.writestr(file_path, content)
    
    print(f"Created naming sample ZIP: {zip_path}")

def create_deliverables_sample():
    """Create a sample ZIP file for deliverables tracking demo"""
    sample_dir = Path("c:/Users/ruben/Documents/GitHub/valiblox-data-check/public/sample")
    sample_dir.mkdir(exist_ok=True)
    
    # Create the ZIP file
    zip_path = sample_dir / "deliverables.zip"
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add a sample deliverables list (Excel format)
        deliverables_content = """Drawing Number,Title,Discipline,Status
ABC-STR-001,Foundation Plan,Structural,For Construction
ABC-STR-002,Ground Floor Plan,Structural,For Construction
ABC-STR-003,First Floor Plan,Structural,For Construction
ABC-MEP-001,HVAC Layout,MEP,For Review
ABC-MEP-002,Electrical Layout,MEP,For Review
ABC-ARC-001,Site Plan,Architecture,For Construction
ABC-ARC-002,Floor Plans,Architecture,For Construction
ABC-ARC-003,Elevations,Architecture,Draft
ABC-ARC-004,Sections,Architecture,Draft"""
        
        zipf.writestr("Sample-Deliverables-List.csv", deliverables_content)
        
        # Add corresponding files (some matching, some missing, some extra)
        project_files = [
            # Matching files
            "Drawings/ABC-STR-001.dwg",
            "Drawings/ABC-STR-002.dwg", 
            "Drawings/ABC-MEP-001.dwg",
            "Drawings/ABC-MEP-002.dwg",
            "Drawings/ABC-ARC-001.pdf",
            "Drawings/ABC-ARC-002.pdf",
            
            # Extra files (not in deliverables list)
            "Drawings/ABC-STR-004.dwg",
            "Drawings/ABC-MEP-003.dwg",
            "Calculations/Structural-Calc-001.xlsx",
            "Reports/Progress-Report-Week1.docx",
            
            # Files with similar names but slight differences
            "Drawings/ABC-ARC-003-Draft.pdf",
            "Archive/ABC-STR-001-OLD.dwg",
        ]
        
        for file_path in project_files:
            # Create realistic dummy content based on file type
            ext = file_path.split('.')[-1].lower()
            if ext == 'dwg':
                content = b"DWG File - CAD Drawing Content"
            elif ext == 'pdf':
                content = b"PDF File - Technical Drawing Content"
            elif ext == 'xlsx':
                content = b"XLSX File - Engineering Calculations"
            elif ext == 'docx':
                content = b"DOCX File - Project Report Content"
            else:
                content = b"Project file content"
            
            zipf.writestr(file_path, content)
    
    print(f"Created deliverables sample ZIP: {zip_path}")

if __name__ == "__main__":
    create_naming_sample()
    create_deliverables_sample()
    print("Sample ZIP files created successfully!")
