import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { medicalRecordService } from '@/services/api/medicalRecordService';
import { toast } from 'react-toastify';

const MEDICATION_TEMPLATES = [
  {
    id: 1,
    name: "Hypertension Standard",
    medications: [
      { medication: "Lisinopril", dosage: "10mg daily", duration: "90 days" },
      { medication: "Amlodipine", dosage: "5mg daily", duration: "90 days" }
    ]
  },
  {
    id: 2,
    name: "Diabetes Management",
    medications: [
      { medication: "Metformin", dosage: "500mg twice daily", duration: "90 days" },
      { medication: "Glipizide", dosage: "5mg daily", duration: "90 days" }
    ]
  },
  {
    id: 3,
    name: "Respiratory Care",
    medications: [
      { medication: "Albuterol inhaler", dosage: "2 puffs every 4-6 hours as needed", duration: "30 days" },
      { medication: "Prednisone", dosage: "20mg daily for 5 days", duration: "5 days" }
    ]
  },
  {
    id: 4,
    name: "Pain Management",
    medications: [
      { medication: "Ibuprofen", dosage: "400mg every 6 hours as needed", duration: "14 days" },
      { medication: "Acetaminophen", dosage: "650mg every 6 hours as needed", duration: "14 days" }
    ]
  },
  {
    id: 5,
    name: "Cholesterol Treatment",
    medications: [
      { medication: "Atorvastatin", dosage: "20mg daily", duration: "90 days" },
      { medication: "Omega-3", dosage: "1000mg daily", duration: "90 days" }
    ]
  }
];

const COMMON_MEDICATIONS = [
  "Lisinopril", "Amlodipine", "Metformin", "Atorvastatin", "Omeprazole",
  "Levothyroxine", "Albuterol inhaler", "Prednisone", "Ibuprofen", 
  "Acetaminophen", "Amoxicillin", "Azithromycin", "Hydrochlorothiazide",
  "Losartan", "Gabapentin", "Sertraline", "Escitalopram", "Pantoprazole",
  "Vitamin D3", "Prenatal vitamins", "Aspirin", "Clopidogrel", "Warfarin",
  "Insulin", "Glipizide", "Furosemide", "Carvedilol", "Simvastatin"
];

const PrescriptionForm = ({ patientId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    doctorId: 1,
    prescriptions: [{ medication: '', dosage: '', duration: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeAutoComplete, setActiveAutoComplete] = useState(-1);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const autoCompleteRefs = useRef([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrescriptionChange = (index, field, value) => {
    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions[index] = { ...newPrescriptions[index], [field]: value };
    
    // Handle medication autocomplete
    if (field === 'medication') {
      if (value.trim()) {
        const filtered = COMMON_MEDICATIONS.filter(med =>
          med.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredMedications(filtered);
        setActiveAutoComplete(index);
      } else {
        setFilteredMedications([]);
        setActiveAutoComplete(-1);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      prescriptions: newPrescriptions
    }));
  };

  const selectMedication = (index, medication) => {
    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions[index].medication = medication;
    setFormData(prev => ({
      ...prev,
      prescriptions: newPrescriptions
    }));
    setActiveAutoComplete(-1);
    setFilteredMedications([]);
  };

  const addPrescription = () => {
    setFormData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { medication: '', dosage: '', duration: '' }]
    }));
    // Add new ref for autocomplete
    autoCompleteRefs.current.push(React.createRef());
  };

  const removePrescription = (index) => {
    if (formData.prescriptions.length > 1) {
      const newPrescriptions = formData.prescriptions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        prescriptions: newPrescriptions
      }));
      // Remove ref
      autoCompleteRefs.current.splice(index, 1);
    }
  };

  const applyTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: [...template.medications]
    }));
    setShowTemplates(false);
    toast.success(`Applied ${template.name} template`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.diagnosis.trim()) {
      toast.error('Diagnosis is required');
      return;
    }

    if (!formData.treatment.trim()) {
      toast.error('Treatment is required');
      return;
    }

    // Validate prescriptions
    const validPrescriptions = formData.prescriptions.filter(p => 
      p.medication.trim() && p.dosage.trim() && p.duration.trim()
    );

    setLoading(true);
    try {
      const recordData = {
        ...formData,
        patientId: parseInt(patientId),
        prescriptions: validPrescriptions
      };

      await medicalRecordService.create(recordData);
      toast.success('Prescription record created successfully');
      onSuccess && onSuccess();
    } catch (error) {
      toast.error('Failed to create prescription record');
      console.error('Error creating prescription:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize refs array
  useEffect(() => {
    autoCompleteRefs.current = formData.prescriptions.map(() => React.createRef());
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">New Prescription</h2>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <ApperIcon name="FileText" size={16} />
            Templates
          </Button>
          <Button variant="secondary" size="sm" onClick={onCancel}>
            <ApperIcon name="X" size={16} />
            Cancel
          </Button>
        </div>
      </div>

      {/* Templates Section */}
      {showTemplates && (
        <div className="mb-6 p-4 bg-surface rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MEDICATION_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => applyTemplate(template)}
              >
                <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                <p className="text-sm text-gray-600">
                  {template.medications.length} medication{template.medications.length !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Visit Date"
            type="date"
            value={formData.visitDate}
            onChange={(e) => handleInputChange('visitDate', e.target.value)}
            required
          />
        </div>

        <Input
          label="Diagnosis"
          value={formData.diagnosis}
          onChange={(e) => handleInputChange('diagnosis', e.target.value)}
          placeholder="Enter diagnosis..."
          required
        />

        <Input
          label="Treatment Plan"
          value={formData.treatment}
          onChange={(e) => handleInputChange('treatment', e.target.value)}
          placeholder="Enter treatment plan..."
          required
        />

        {/* Prescriptions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="form-label">Prescriptions</label>
            <Button type="button" variant="secondary" size="sm" onClick={addPrescription}>
              <ApperIcon name="Plus" size={16} />
              Add Medication
            </Button>
          </div>

          <div className="space-y-4">
            {formData.prescriptions.map((prescription, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                  {formData.prescriptions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePrescription(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Input
                      label="Medication Name"
                      value={prescription.medication}
                      onChange={(e) => handlePrescriptionChange(index, 'medication', e.target.value)}
                      placeholder="Start typing medication name..."
                      autoComplete="off"
                    />
                    
                    {/* Autocomplete Dropdown */}
                    {activeAutoComplete === index && filteredMedications.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                        {filteredMedications.map((med) => (
                          <div
                            key={med}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => selectMedication(index, med)}
                          >
                            {med}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Input
                    label="Dosage"
                    value={prescription.dosage}
                    onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                    placeholder="e.g., 10mg daily"
                  />
                  
                  <Input
                    label="Duration"
                    value={prescription.duration}
                    onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                    placeholder="e.g., 30 days"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              'Create Prescription'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;