import { Appointment } from "../models/Appointment.js";

export const getAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ userId }).sort({ appointmentDate: 1 });
    return res.json(appointments);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { doctorName, specialty, appointmentDate, location, notes, type } = req.body;

    if (!doctorName || !appointmentDate) {
      return res.status(400).json({ message: "Doctor name and appointment date are required." });
    }

    const appointment = new Appointment({
      userId,
      doctorName,
      specialty,
      appointmentDate: new Date(appointmentDate),
      location,
      notes,
      type
    });

    await appointment.save();
    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorName, specialty, appointmentDate, location, notes, type, completed } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        doctorName,
        specialty,
        appointmentDate: appointmentDate ? new Date(appointmentDate) : undefined,
        location,
        notes,
        type,
        completed
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    return res.json(appointment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    return res.json({ message: "Appointment deleted successfully." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const markAppointmentComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    return res.json(appointment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
