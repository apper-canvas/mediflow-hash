import doctorsData from "@/services/mockData/doctors.json";

class DoctorService {
  constructor() {
    this.doctors = [...doctorsData];
  }

  async getAll() {
    await this.delay();
    return [...this.doctors];
  }

  async getById(id) {
    await this.delay();
    return this.doctors.find(doctor => doctor.Id === id);
  }

  async create(doctorData) {
    await this.delay();
    const newDoctor = {
      ...doctorData,
      Id: this.getNextId()
    };
    this.doctors.push(newDoctor);
    return newDoctor;
  }

  async update(id, doctorData) {
    await this.delay();
    const index = this.doctors.findIndex(doctor => doctor.Id === id);
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    this.doctors[index] = { ...this.doctors[index], ...doctorData };
    return this.doctors[index];
  }

  async delete(id) {
    await this.delay();
    const index = this.doctors.findIndex(doctor => doctor.Id === id);
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    this.doctors.splice(index, 1);
    return true;
  }

  getNextId() {
    return Math.max(...this.doctors.map(d => d.Id), 0) + 1;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const doctorService = new DoctorService();