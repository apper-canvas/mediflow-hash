import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import PatientForm from "@/components/organisms/PatientForm";
import { patientService } from "@/services/api/patientService";
import { appointmentService } from "@/services/api/appointmentService";
import { medicalRecordService } from "@/services/api/medicalRecordService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    try {
      setError("");
      const [patientData, appointmentsData, recordsData] = await Promise.all([
        patientService.getById(parseInt(id)),
        appointmentService.getAll(),
        medicalRecordService.getAll()
      ]);

      if (!patientData) {
        setError("Patient not found");
        return;
      }

      setPatient(patientData);
      setAppointments(appointmentsData.filter(apt => apt.patientId === parseInt(id)));
      setMedicalRecords(recordsData.filter(record => record.patientId === parseInt(id)));
    } catch (err) {
      setError("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePatient = async (patientData) => {
    try {
      await patientService.update(parseInt(id), patientData);
      await loadPatientData();
      setEditing(false);
    } catch (error) {
      throw error;
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPatientData} />;
  if (!patient) return <Error message="Patient not found" />;

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/patients")} icon="ArrowLeft">
            Back to Patients
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit Patient Information</h2>
            <p className="text-gray-600 mt-1">Update patient details and medical information</p>
          </div>
          <PatientForm
            patient={patient}
            onSubmit={handleUpdatePatient}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/patients")} icon="ArrowLeft">
            Back to Patients
          </Button>
        </div>
        <Button onClick={() => setEditing(true)} icon="Edit">
          Edit Patient
        </Button>
      </div>

      {/* Patient Information */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">Medical ID: {patient.medicalId}</p>
              <Badge variant="primary">{patient.gender}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-900">
                <ApperIcon name="Phone" className="h-4 w-4 mr-2 text-gray-400" />
                {patient.phone}
              </div>
              <div className="flex items-center text-gray-900">
                <ApperIcon name="Mail" className="h-4 w-4 mr-2 text-gray-400" />
                {patient.email || "Not provided"}
              </div>
              <div className="flex items-start text-gray-900">
                <ApperIcon name="MapPin" className="h-4 w-4 mr-2 mt-1 text-gray-400" />
                <span>{patient.address || "Not provided"}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-900">
                <ApperIcon name="Calendar" className="h-4 w-4 mr-2 text-gray-400" />
                Born: {format(new Date(patient.dateOfBirth), "MMM dd, yyyy")}
              </div>
            </div>
          </div>

          {patient.emergencyContact?.name && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Emergency Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-900">
                  <ApperIcon name="User" className="h-4 w-4 mr-2 text-gray-400" />
                  {patient.emergencyContact.name}
                </div>
                <div className="flex items-center text-gray-900">
                  <ApperIcon name="Phone" className="h-4 w-4 mr-2 text-gray-400" />
                  {patient.emergencyContact.phone}
                </div>
                <div className="flex items-center text-gray-900">
                  <ApperIcon name="Users" className="h-4 w-4 mr-2 text-gray-400" />
                  {patient.emergencyContact.relation}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Medical Information */}
        {(patient.allergies?.length > 0 || patient.currentMedications?.length > 0) && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patient.allergies?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <ApperIcon name="AlertTriangle" className="h-4 w-4 mr-2 text-warning" />
                    Allergies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="warning">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {patient.currentMedications?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <ApperIcon name="Pill" className="h-4 w-4 mr-2 text-info" />
                    Current Medications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.currentMedications.map((medication, index) => (
                      <Badge key={index} variant="primary">
                        {medication}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Appointments History */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointment History</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments found for this patient.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.Id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={appointment.status.toLowerCase().replace('-', '')}>
                      {appointment.status}
                    </Badge>
                    <span className="text-sm text-gray-600">{appointment.type}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(appointment.date), "MMM dd, yyyy")} at {appointment.time}
                  </span>
                </div>
                {appointment.notes && (
                  <p className="text-gray-700 text-sm">{appointment.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;