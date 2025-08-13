import appointmentsData from "@/services/mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData];
  }

  async getAll() {
    await this.delay();
    return [...this.appointments];
  }

  async getById(id) {
    await this.delay();
    return this.appointments.find(appointment => appointment.Id === id);
  }

  async create(appointmentData) {
    await this.delay();
    const newAppointment = {
      ...appointmentData,
      Id: this.getNextId()
    };
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  async update(id, appointmentData) {
    await this.delay();
    const index = this.appointments.findIndex(appointment => appointment.Id === id);
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    this.appointments[index] = { ...this.appointments[index], ...appointmentData };
    return this.appointments[index];
  }

  async delete(id) {
    await this.delay();
    const index = this.appointments.findIndex(appointment => appointment.Id === id);
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    this.appointments.splice(index, 1);
    return true;
  }

  getNextId() {
    return Math.max(...this.appointments.map(a => a.Id), 0) + 1;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}

export const appointmentService = new AppointmentService();