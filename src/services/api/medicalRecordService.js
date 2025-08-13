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

  getNextId() {
    return Math.max(...this.medicalRecords.map(r => r.Id), 0) + 1;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const medicalRecordService = new MedicalRecordService();