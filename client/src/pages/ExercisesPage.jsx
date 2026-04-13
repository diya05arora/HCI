import React, { useState, useEffect } from "react";
// Assumed styles are in ExercisesPage.css
import "./ExercisesPage.css";

function ExercisesPage({ labels, currentUser, onListen }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [activeExercise, setActiveExercise] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  
  // State for weekly plan tracking
  const [completedDays, setCompletedDays] = useState([]);
  const [currentDayStr, setCurrentDayStr] = useState("");

  // Determine current day on load
  useEffect(() => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const today = new Date().getDay();
    setCurrentDayStr(days[today]);
  }, []);

  // Exactly 3 exercises per level (9 total)
  const exercises = [
    // --- BEGINNER ---
    {
      id: 1,
      name: "Gentle Walking",
      difficulty: "beginner",
      duration: 10,
      description: "A slow and easy walk to improve circulation and mood.",
      instructions: "Walk at a comfortable pace, swing your arms gently, keep your back straight.",
      benefits: "Improves heart health, increases energy, enhances balance.",
      reps: 1,
      safety: "Wear comfortable shoes, walk on a flat surface, stay hydrated.",
      icon: "🚶",
      bgColor: "#f4ede8"
    },
    {
      id: 2,
      name: "Seated Stretches",
      difficulty: "beginner",
      duration: 8,
      description: "Easy stretching exercises while sitting to improve flexibility.",
      instructions: "Sit in a chair with good posture. Slowly stretch each limb and hold for 20 seconds.",
      benefits: "Increases flexibility, reduces stiffness, improves circulation.",
      reps: 10,
      safety: "Move slowly, don't bounce, stop if you feel pain.",
      icon: "🪑",
      bgColor: "#fcf8f2"
    },
    {
      id: 3,
      name: "Arm Circles",
      difficulty: "beginner",
      duration: 5,
      description: "Gentle shoulder and arm rotation exercise.",
      instructions: "Stand or sit comfortably. Extend arms to the sides and make slow circles forward, then backward.",
      benefits: "Improves shoulder mobility, strengthens arm muscles.",
      reps: 15,
      safety: "Keep movements controlled and gentle, don't overextend.",
      icon: "🦋",
      bgColor: "#f3eff6"
    },
    
    // --- INTERMEDIATE ---
    {
      id: 4,
      name: "Standing Balance",
      difficulty: "intermediate",
      duration: 10,
      description: "Improve balance and stability with guided standing exercises.",
      instructions: "Stand safely, place hands on a chair or wall. Hold on and slowly lift one foot slightly, alternating feet.",
      benefits: "Improves balance, prevents falls, strengthens leg muscles.",
      reps: 10,
      safety: "Always have support nearby, perform near a wall or chair.",
      icon: "🧘",
      bgColor: "#fcf8f2"
    },
    {
      id: 5,
      name: "Wall Push-ups",
      difficulty: "intermediate",
      duration: 8,
      description: "Gentle upper body strengthening using a wall.",
      instructions: "Stand facing a wall, hands on wall at shoulder height. Lean in and push back.",
      benefits: "Strengthens chest and arms, improves posture.",
      reps: 10,
      safety: "Ensure wall is stable, move slowly and controlled.",
      icon: "💪",
      bgColor: "#eef4f1"
    },
    {
      id: 6,
      name: "Gentle Step-Ups",
      difficulty: "intermediate",
      duration: 10,
      description: "Use a bottom stair or stable block to step up and down safely.",
      instructions: "Hold a handrail. Step up with right foot, then left. Step down right, then left.",
      benefits: "Strengthens legs and improves cardiovascular health.",
      reps: 10,
      safety: "Always hold a rail and look exactly where you step.",
      icon: "🪜",
      bgColor: "#f4ede8"
    },

    // --- ADVANCED ---
    {
      id: 7,
      name: "Advanced Chair Squats",
      difficulty: "advanced",
      duration: 12,
      description: "Strengthens legs and improves mobility using a chair for support.",
      instructions: "Stand in front of a chair. Slowly sit down and stand up without dropping.",
      benefits: "Builds leg strength, improves balance, supports independence.",
      reps: 10,
      safety: "Use a stable chair and keep movements slow and controlled.",
      icon: "🦵",
      bgColor: "#f3eff6"
    },
    {
      id: 8,
      name: "Resistance Band Rows",
      difficulty: "advanced",
      duration: 15,
      description: "Strengthen upper back and posture using a light resistance band.",
      instructions: "Sit on the floor or chair, loop band around feet, pull handles back toward waist.",
      benefits: "Improves posture and upper back strength.",
      reps: 12,
      safety: "Ensure the band is securely anchored around your feet before pulling.",
      icon: "🎗️",
      bgColor: "#eef4f1"
    },
    {
      id: 9,
      name: "Supported Lunges",
      difficulty: "advanced",
      duration: 10,
      description: "Build lower body strength using a chair for balance.",
      instructions: "Hold a chair back. Step one foot back, lower hips slightly, then return.",
      benefits: "Enhances leg strength, hip flexibility, and coordination.",
      reps: 8,
      safety: "Don't let your front knee go past your toes. Keep movements shallow if needed.",
      icon: "🧎",
      bgColor: "#fcf8f2"
    }
  ];

  // Dynamic Weekly Plan mapped to actual library exercises
  const weeklyPlanData = [
    { day: "MON", exerciseName: "Seated Stretches", isRest: false },
    { day: "TUE", exerciseName: "Wall Push-ups", isRest: false },
    { day: "WED", exerciseName: "Rest day", isRest: true },
    { day: "THU", exerciseName: "Gentle Walking", isRest: false },
    { day: "FRI", exerciseName: "Standing Balance", isRest: false },
    { day: "SAT", exerciseName: "Supported Lunges", isRest: false },
    { day: "SUN", exerciseName: "Rest day", isRest: true }
  ];

  const filteredExercises = exercises.filter(
    (e) => e.difficulty === selectedDifficulty || selectedDifficulty === "all"
  );

  const handleStartGuided = (exercise) => {
    setActiveExercise(exercise);
    setIsGuidedMode(true);
    const guidanceText = `Welcome to ${exercise.name}. This exercise will take about ${exercise.duration} minutes. ${exercise.instructions}. Let's begin!`;
    if (onListen) onListen(guidanceText);
  };

  const handleCompleteExercise = (exerciseId) => {
    setExerciseProgress((prev) => ({
      ...prev,
      [exerciseId]: (prev[exerciseId] || 0) + 1
    }));
    setActiveExercise(null);
    setIsGuidedMode(false);
    if (onListen) onListen("Great job! Exercise completed. Take a moment to breathe and relax.");
  };

  const toggleDayCompletion = (dayStr) => {
    setCompletedDays((prev) => 
      prev.includes(dayStr) ? prev.filter(d => d !== dayStr) : [...prev, dayStr]
    );
  };

  const renderDifficultyDots = (difficulty) => {
    const dots = difficulty === "beginner" ? 1 : difficulty === "intermediate" ? 2 : 3;
    return (
      <div className="difficulty-dots">
        {[1, 2, 3].map(dot => (
          <span key={dot} className={`dot ${dot <= dots ? 'filled' : ''}`}></span>
        ))}
      </div>
    );
  };

  return (
    <div className="exercises-page-main">

      <main className="exercises-container">
        
        {/* Exercise Library Section */}
        <section className="exercise-library">
          <div className="section-header">
            <h2>EXERCISE LIBRARY</h2>
            <hr />
          </div>
          <p className="section-subtitle">All exercises are low-impact, chair-friendly options available, and can be adapted to your comfort level.</p>

          <div className="difficulty-filters">
            <button className={`filter-btn ${selectedDifficulty === 'all' ? 'active' : ''}`} onClick={() => setSelectedDifficulty('all')}>All</button>
            <button className={`filter-btn ${selectedDifficulty === 'beginner' ? 'active' : ''}`} onClick={() => setSelectedDifficulty('beginner')}>Beginner</button>
            <button className={`filter-btn ${selectedDifficulty === 'intermediate' ? 'active' : ''}`} onClick={() => setSelectedDifficulty('intermediate')}>Intermediate</button>
            <button className={`filter-btn ${selectedDifficulty === 'advanced' ? 'active' : ''}`} onClick={() => setSelectedDifficulty('advanced')}>Advanced</button>
          </div>

          <div className="exercises-grid">
            {filteredExercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <div className="card-top" style={{ backgroundColor: exercise.bgColor }}>
                  <span className="card-icon">{exercise.icon}</span>
                </div>
                <div className="card-body">
                  <span className="duration-badge">{exercise.duration} MIN</span>
                  <h3>{exercise.name}</h3>
                  <p>{exercise.description}</p>
                </div>
                <div className="card-footer">
                  {renderDifficultyDots(exercise.difficulty)}
                  <button className="action-text-btn" onClick={() => handleStartGuided(exercise)}>
                    Start workout
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stay Safe Section */}
        <section className="stay-safe-section">
          <div className="section-header">
            <h2>STAY SAFE</h2>
            <hr />
          </div>
          <p className="section-subtitle">Your well-being is always the priority. Keep these principles in mind every session.</p>
          
          <div className="safety-grid">
            <div className="safety-card">
              <span className="safety-icon">🩺</span>
              <h4>Consult your doctor</h4>
              <p>Always get medical clearance before starting any new exercise program.</p>
            </div>
            <div className="safety-card">
              <span className="safety-icon">💧</span>
              <h4>Stay hydrated</h4>
              <p>Drink water before, during, and after every session — even light activity.</p>
            </div>
            <div className="safety-card">
              <span className="safety-icon">🧘</span>
              <h4>Warm up first</h4>
              <p>Begin every workout with 3-5 minutes of gentle movement to prepare your body.</p>
            </div>
            <div className="safety-card">
              <span className="safety-icon">🔴</span>
              <h4>Listen to your body</h4>
              <p>Use smooth movements and stop if you experience shortness of breath.</p>
            </div>
          </div>
        </section>

        {/* Weekly Plan */}
        <section className="weekly-plan-section">
          <div className="section-header">
            <h2>WEEKLY PLAN</h2>
            <hr />
          </div>
          <p className="section-subtitle">Rest is just as important as movement. Check off your daily activities below to track your progress!</p>
          
          <div className="weekly-days">
            {weeklyPlanData.map((plan) => {
              const isToday = plan.day === currentDayStr;
              const isDone = completedDays.includes(plan.day);

              return (
                <div 
                  key={plan.day} 
                  className={`day-card ${isToday ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                  style={isDone ? { opacity: 0.7, border: '2px solid #4a7c59' } : {}}
                >
                  <strong>{plan.day} {isToday && "(Today)"}</strong>
                  
                  {plan.isRest ? (
                    <>
                      <span className="icon" style={{ marginTop: '5px' }}>🌿</span>
                      <span>{plan.exerciseName}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ marginBottom: '8px', fontWeight: '500' }}>{plan.exerciseName}</span>
                      <button 
                        onClick={() => toggleDayCompletion(plan.day)}
                        style={{
                          marginTop: 'auto',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: isDone ? '#eef4f1' : '#f0f0f0',
                          color: isDone ? '#2c4c3b' : '#333',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}
                      >
                        {isDone ? "✅ Done" : "Mark Done"}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Guided Modal */}
      {isGuidedMode && activeExercise && (
        <div className="modal-overlay">
          <div className="guided-modal">
            <button className="close-btn" onClick={() => setIsGuidedMode(false)}>✕</button>
            <h2>{activeExercise.name}</h2>
            <div className="modal-badge">{activeExercise.duration} MIN</div>
            <div className="modal-content">
              <p><strong>Instructions:</strong> {activeExercise.instructions}</p>
              <p><strong>Benefits:</strong> {activeExercise.benefits}</p>
              <p><strong>Safety:</strong> {activeExercise.safety}</p>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => onListen && onListen(activeExercise.instructions)}>
                🔊 Hear Instructions
              </button>
              <button className="btn-secondary" onClick={() => handleCompleteExercise(activeExercise.id)}>
                ✓ Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExercisesPage;