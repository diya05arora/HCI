// src/seedHospitals.js
import "dotenv/config";
import mongoose from "mongoose";
import Hospital from "./models/Hospital.js";
import Doctor from "./models/Doctor.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hui_senior_care";

const HOSPITALS = [
  { name: "Apollo Hospital",      branch: "Main Branch"   },
  { name: "Apollo Hospital",      branch: "North Branch"  },
  { name: "Fortis Healthcare",    branch: "City Centre"   },
  { name: "Fortis Healthcare",    branch: "East Wing"     },
  { name: "Max Super Speciality", branch: "Central Block" },
  { name: "AIIMS",                branch: "Main Campus"   },
  { name: "Medanta Hospital",     branch: "Gurugram"      },
  { name: "Kokilaben Hospital",   branch: "Mumbai West"   },
];

const DOCTORS_SEED = [
  { hospitalIndex: 0, specialty: "General Checkup",  name: "Dr. Anil Sharma"     },
  { hospitalIndex: 0, specialty: "General Checkup",  name: "Dr. Priya Mehta"     },
  { hospitalIndex: 0, specialty: "Cardiologist",     name: "Dr. Suresh Nair"     },
  { hospitalIndex: 0, specialty: "Cardiologist",     name: "Dr. Kavita Rao"      },
  { hospitalIndex: 0, specialty: "Dentist",          name: "Dr. Neha Joshi"      },
  { hospitalIndex: 0, specialty: "Orthopedic",       name: "Dr. Rajesh Bose"     },
  { hospitalIndex: 0, specialty: "Dermatologist",    name: "Dr. Pooja Desai"     },
  { hospitalIndex: 0, specialty: "Neurologist",      name: "Dr. Karan Malhotra"  },
  { hospitalIndex: 0, specialty: "Ophthalmologist",  name: "Dr. Anjali Saxena"   },
  { hospitalIndex: 0, specialty: "Pediatrician",     name: "Dr. Girish Kulkarni" },
  { hospitalIndex: 1, specialty: "General Checkup",  name: "Dr. Rohan Gupta"     },
  { hospitalIndex: 1, specialty: "Cardiologist",     name: "Dr. Arjun Kapoor"    },
  { hospitalIndex: 1, specialty: "Dentist",          name: "Dr. Vikram Patel"    },
  { hospitalIndex: 1, specialty: "Gynecologist",     name: "Dr. Rekha Nambiar"   },
  { hospitalIndex: 1, specialty: "Psychiatrist",     name: "Dr. Nidhi Agarwal"   },
  { hospitalIndex: 1, specialty: "Physiotherapist",  name: "Dr. Bhavna Yadav"    },
  { hospitalIndex: 1, specialty: "ENT Specialist",   name: "Dr. Harish Pandey"   },
  { hospitalIndex: 2, specialty: "General Checkup",  name: "Dr. Sunita Pillai"   },
  { hospitalIndex: 2, specialty: "Cardiologist",     name: "Dr. Deepak Jain"     },
  { hospitalIndex: 2, specialty: "Orthopedic",       name: "Dr. Meena Iyer"      },
  { hospitalIndex: 2, specialty: "Dermatologist",    name: "Dr. Amit Thakur"     },
  { hospitalIndex: 2, specialty: "Neurologist",      name: "Dr. Sunita Pillai"   },
  { hospitalIndex: 2, specialty: "Ophthalmologist",  name: "Dr. Naveen Reddy"    },
  { hospitalIndex: 2, specialty: "ENT Specialist",   name: "Dr. Lalita Mishra"   },
  { hospitalIndex: 2, specialty: "Gynecologist",     name: "Dr. Pallavi Sood"    },
  { hospitalIndex: 2, specialty: "Pediatrician",     name: "Dr. Madhuri Shah"    },
  { hospitalIndex: 3, specialty: "General Checkup",  name: "Dr. Ramesh Kumar"    },
  { hospitalIndex: 3, specialty: "Cardiologist",     name: "Dr. Sanjay Verma"    },
  { hospitalIndex: 3, specialty: "Dentist",          name: "Dr. Simran Kaur"     },
  { hospitalIndex: 3, specialty: "Psychiatrist",     name: "Dr. Saurabh Menon"   },
  { hospitalIndex: 3, specialty: "Physiotherapist",  name: "Dr. Rohit Bansal"    },
  { hospitalIndex: 4, specialty: "Cardiologist",     name: "Dr. Ritu Singh"      },
  { hospitalIndex: 4, specialty: "Neurologist",      name: "Dr. Seema Bhat"      },
  { hospitalIndex: 4, specialty: "Orthopedic",       name: "Dr. Manish Tiwari"   },
  { hospitalIndex: 4, specialty: "Gynecologist",     name: "Dr. Usha Trivedi"    },
  { hospitalIndex: 4, specialty: "Pediatrician",     name: "Dr. Tarun Bajaj"     },
  { hospitalIndex: 4, specialty: "General Checkup",  name: "Dr. Divya Choudhary" },
  { hospitalIndex: 5, specialty: "General Checkup",  name: "Dr. Prakash Nair"    },
  { hospitalIndex: 5, specialty: "Cardiologist",     name: "Dr. Sunanda Roy"     },
  { hospitalIndex: 5, specialty: "Neurologist",      name: "Dr. Vikram Bose"     },
  { hospitalIndex: 5, specialty: "Orthopedic",       name: "Dr. Anita Menon"     },
  { hospitalIndex: 5, specialty: "Dermatologist",    name: "Dr. Farhan Siddiqui" },
  { hospitalIndex: 5, specialty: "Psychiatrist",     name: "Dr. Leela Krishnan"  },
  { hospitalIndex: 5, specialty: "Ophthalmologist",  name: "Dr. Gaurav Tiwari"   },
  { hospitalIndex: 5, specialty: "ENT Specialist",   name: "Dr. Nisha Kapoor"    },
  { hospitalIndex: 5, specialty: "Pediatrician",     name: "Dr. Arvind Pandey"   },
  { hospitalIndex: 5, specialty: "Gynecologist",     name: "Dr. Meera Chatterjee"},
  { hospitalIndex: 6, specialty: "Cardiologist",     name: "Dr. Rajiv Anand"     },
  { hospitalIndex: 6, specialty: "Neurologist",      name: "Dr. Preethi Nair"    },
  { hospitalIndex: 6, specialty: "Orthopedic",       name: "Dr. Sunil Mathur"    },
  { hospitalIndex: 6, specialty: "General Checkup",  name: "Dr. Kamla Verma"     },
  { hospitalIndex: 6, specialty: "Physiotherapist",  name: "Dr. Shweta Dubey"    },
  { hospitalIndex: 6, specialty: "Dentist",          name: "Dr. Yusuf Khan"      },
  { hospitalIndex: 7, specialty: "Cardiologist",     name: "Dr. Hema Rao"        },
  { hospitalIndex: 7, specialty: "Neurologist",      name: "Dr. Cyrus Patel"     },
  { hospitalIndex: 7, specialty: "Gynecologist",     name: "Dr. Savita Iyer"     },
  { hospitalIndex: 7, specialty: "Dermatologist",    name: "Dr. Fiona D'Souza"   },
  { hospitalIndex: 7, specialty: "General Checkup",  name: "Dr. Abhijit Sen"     },
  { hospitalIndex: 7, specialty: "Pediatrician",     name: "Dr. Nalini Reddy"    },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  await Hospital.deleteMany({});
  await Doctor.deleteMany({});
  console.log("🗑  Cleared existing hospitals and doctors");

  const insertedHospitals = await Hospital.insertMany(HOSPITALS);
  console.log(`🏥  Inserted ${insertedHospitals.length} hospitals`);

  const doctorsToInsert = DOCTORS_SEED.map(d => ({
    name:       d.name,
    specialty:  d.specialty,
    hospitalId: insertedHospitals[d.hospitalIndex]._id,
  }));

  const insertedDoctors = await Doctor.insertMany(doctorsToInsert);
  console.log(`👨‍⚕️  Inserted ${insertedDoctors.length} doctors`);

  console.log("\n✅ Seed complete!");
  insertedHospitals.forEach((h, i) =>
    console.log(`  [${i}] ${h.name} — ${h.branch}`)
  );

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});