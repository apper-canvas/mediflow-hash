import React, { useEffect, useState } from "react";
import { doctorService } from "@/services/api/doctorService";
import { appointmentService } from "@/services/api/appointmentService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const Doctors = () => {
const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    availability: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: ''
    }
  });
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      const [doctorsData, appointmentsData] = await Promise.all([
        doctorService.getAll(),
        appointmentService.getAll()
      ]);

      setDoctors(doctorsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

const getDoctorAppointments = (doctorId) => {
    return appointments.filter(apt => apt.doctorId === doctorId);
  };

  const getTodayAppointments = (doctorId) => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.doctorId === doctorId && apt.date === today);
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      availability: {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: ''
      }
    });
    setShowForm(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      availability: doctor.availability || {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: ''
      }
    });
    setShowForm(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      await doctorService.delete(doctorId);
      setDoctors(doctors.filter(d => d.Id !== doctorId));
      toast.success('Doctor deleted successfully');
    } catch (err) {
      toast.error('Failed to delete doctor');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.specialization.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingDoctor) {
        const updatedDoctor = await doctorService.update(editingDoctor.Id, formData);
        setDoctors(doctors.map(d => d.Id === editingDoctor.Id ? updatedDoctor : d));
        toast.success('Doctor updated successfully');
      } else {
        const newDoctor = await doctorService.create(formData);
        setDoctors([...doctors, newDoctor]);
        toast.success('Doctor added successfully');
      }
      setShowForm(false);
    } catch (err) {
      toast.error(editingDoctor ? 'Failed to update doctor' : 'Failed to add doctor');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('availability.')) {
      const day = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [day]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
<div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1">Manage doctor profiles and availability</p>
        </div>
        <Button 
          variant="primary"
          onClick={handleAddDoctor}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Doctor</span>
        </Button>
      </div>

      {doctors.length === 0 ? (
        <Empty
          title="No doctors registered"
          description="No doctors have been added to the system yet."
          icon="UserCheck"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => {
            const totalAppointments = getDoctorAppointments(doctor.Id).length;
            const todayAppointments = getTodayAppointments(doctor.Id);
            
            return (
<div key={doctor.Id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="UserCheck" className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Dr. {doctor.name}</h3>
                      <Badge variant="primary">{doctor.specialization}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditDoctor(doctor)}
                      className="p-2"
                      title="Edit Doctor"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDoctor(doctor.Id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:border-red-300"
                      title="Delete Doctor"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
                    <p className="text-sm text-gray-500">Total Appointments</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{todayAppointments.length}</p>
                    <p className="text-sm text-gray-500">Today's Schedule</p>
                  </div>
                </div>

                {doctor.availability && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Availability</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(doctor.availability).map(([day, hours]) => (
                        hours && (
                          <Badge key={day} variant="outline">
                            {day}: {hours}
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
</div>
      )}
    </div>

    {/* Doctor Form Modal */}
    {showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
            </h2>
            <Button
              variant="ghost"
              onClick={() => setShowForm(false)}
              className="p-2"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Doctor Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="form-input"
                  placeholder="Enter doctor name"
                  required
                />
              </div>
              <div>
                <label className="form-label">Specialization *</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  className="form-input"
                  placeholder="Enter specialization"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="form-input"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="form-input"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Weekly Availability</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.availability).map(([day, hours]) => (
                  <div key={day}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{day}</label>
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => handleInputChange(`availability.${day}`, e.target.value)}
                      className="form-input"
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  );
};

export default Doctors;