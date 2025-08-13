import medicalRecordsData from "@/services/mockData/medicalRecords.json";

class MedicalRecordService {
  constructor() {
    this.medicalRecords = [...medicalRecordsData];
  }

  async getAll() {
    await this.delay();
    return [...this.medicalRecords];
  }

  async getById(id) {
    await this.delay();
    return this.medicalRecords.find(record => record.Id === id);
  }

  async getByPatientId(patientId) {
    await this.delay();
    return this.medicalRecords.filter(record => record.patientId === patientId);
  }

  async create(recordData) {
    await this.delay();
    const newRecord = {
      ...recordData,
      Id: this.getNextId()
    };
    this.medicalRecords.push(newRecord);
    return newRecord;
  }

  async update(id, recordData) {
    await this.delay();
    const index = this.medicalRecords.findIndex(record => record.Id === id);
    if (index === -1) {
      throw new Error("Medical record not found");
    }
    this.medicalRecords[index] = { ...this.medicalRecords[index], ...recordData };
    return this.medicalRecords[index];
  }

  async delete(id) {
    await this.delay();
    const index = this.medicalRecords.findIndex(record => record.Id === id);
    if (index === -1) {
      throw new Error("Medical record not found");
    }
    this.medicalRecords.splice(index, 1);
    return true;
  }
async createPrescription(patientId, prescriptionData) {
    await this.delay();
    
    const recordData = {
      patientId: parseInt(patientId),
      visitDate: prescriptionData.visitDate || new Date().toISOString().split('T')[0],
      diagnosis: prescriptionData.diagnosis,
      treatment: prescriptionData.treatment,
      doctorId: prescriptionData.doctorId || 1,
      prescriptions: prescriptionData.prescriptions || []
    };

    return this.create(recordData);
  }

  async getCommonMedications() {
    await this.delay();
    
    // Extract unique medications from all records
    const medications = new Set();
    this.medicalRecords.forEach(record => {
      if (record.prescriptions) {
        record.prescriptions.forEach(prescription => {
          medications.add(prescription.medication);
        });
      }
    });
    
    return Array.from(medications).sort();
  }

  getNextId() {
    return Math.max(...this.medicalRecords.map(r => r.Id), 0) + 1;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const medicalRecordService = new MedicalRecordService();