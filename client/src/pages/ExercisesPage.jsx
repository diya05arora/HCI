import { useEffect, useState } from "react";

function ExercisesPage({ labels, currentUser, onListen }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [activeExercise, setActiveExercise] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [completedToday, setCompletedToday] = useState(0);

  const exercises = [
    {
      id: 1,
      name: "Gentle Walking",
      difficulty: "beginner",
      duration: 10,
      description: "A slow and easy walk to improve circulation and mood.",
      instructions: "Walk at a comfortable pace, swing your arms gently, keep your back straight.",
      video: "https://www.youtube.com/embed/wjEAVnCqeKo",
      benefits: "Improves heart health, increases energy, enhances balance.",
      reps: 1,
      safety: "Wear comfortable shoes, walk on a flat surface, stay hydrated."
    },
    {
      id: 2,
      name: "Seated Stretches",
      difficulty: "beginner",
      duration: 8,
      description: "Easy stretching exercises while sitting to improve flexibility.",
      instructions: "Sit in a chair with good posture. Slowly stretch each limb and hold for 20 seconds.",
      video: "https://www.youtube.com/embed/gTCYvGT92TQ",
      benefits: "Increases flexibility, reduces stiffness, improves circulation.",
      reps: 10,
      safety: "Move slowly, don't bounce, stop if you feel pain."
    },
    {
      id: 3,
      name: "Arm Circles",
      difficulty: "beginner",
      duration: 5,
      description: "Gentle shoulder and arm rotation exercise.",
      instructions: "Stand or sit comfortably. Extend arms to the sides and make slow circles forward, then backward.",
      video: "https://www.youtube.com/embed/ksSQqxMR9N8",
      benefits: "Improves shoulder mobility, strengthens arm muscles.",
      reps: 15,
      safety: "Keep movements controlled and gentle, don't overextend."
    },
    {
      id: 4,
      name: "Seated Marching",
      difficulty: "beginner",
      duration: 7,
      description: "Lift legs alternately while seated to activate leg muscles.",
      instructions: "Sit in a chair and lift one knee up, then the other, in a marching motion.",
      video: "https://www.youtube.com/embed/S3rn18_eZRw",
      benefits: "Strengthens legs, improves energy, boosts circulation.",
      reps: 20,
      safety: "Keep pace steady, hold the chair for support if needed."
    },
    {
      id: 5,
      name: "Shoulder Rolls",
      difficulty: "beginner",
      duration: 5,
      description: "Roll shoulders backward and forward to release tension.",
      instructions: "Sit or stand upright. Slowly roll shoulders backward 10 times, then forward 10 times.",
      video: "https://www.youtube.com/embed/4J0yAl8OMpE",
      benefits: "Relieves shoulder tension, improves posture, reduces stiffness.",
      reps: 20,
      safety: "Move smoothly without jerking motions."
    },
    {
      id: 6,
      name: "Standing Balance",
      difficulty: "intermediate",
      duration: 10,
      description: "Improve balance and stability with guided standing exercises.",
      instructions: "Stand safely, place hands on a chair or wall. Hold on and slowly lift one foot slightly, alternating feet.",
      video: "https://www.youtube.com/embed/60O8aQODSA8",
      benefits: "Improves balance, prevents falls, strengthens leg muscles.",
      reps: 10,
      safety: "Always have support nearby, perform near a wall or chair."
    },
    {
      id: 7,
      name: "Wall Push-ups",
      difficulty: "intermediate",
      duration: 8,
      description: "Gentle upper body strengthening using a wall.",
      instructions: "Stand facing a wall, hands on wall at shoulder height. Lean in and push back.",
      video: "https://www.youtube.com/embed/lXBnEFQqtCU",
      benefits: "Strengthens chest and arms, improves posture.",
      reps: 10,
      safety: "Ensure wall is stable, move slowly and controlled."
    },
    {
      id: 8,
      name: "Neck Stretches",
      difficulty: "beginner",
      duration: 6,
      description: "Gently stretch neck muscles to relieve tension.",
      instructions: "Sit upright. Turn head slowly to each side, tilt ear toward shoulder.",
      video: "https://www.youtube.com/embed/zSZNsIFID0I",
      benefits: "Relieves neck pain, improves flexibility, reduces tension headaches.",
      reps: 8,
      safety: "Move slowly, never force, stop if you feel sharp pain."
    }
  ];

  const filteredExercises = exercises.filter(e => e.difficulty === selectedDifficulty);

  const handleStartGuided = (exercise) => {
    setActiveExercise(exercise);
    setIsGuidedMode(true);
    // Start with voice guidance
    const guidanceText = `Welcome to ${exercise.name}. This exercise will take about ${exercise.duration} minutes. ${exercise.instructions}. Let's begin!`;
    onListen(guidanceText);
  };

  const handleCompleteExercise = (exerciseId) => {
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseId]: (prev[exerciseId] || 0) + 1
    }));
    setCompletedToday(completedToday + 1);
    setActiveExercise(null);
    const successMessage = "Great job! Exercise completed. Take a moment to breathe and relax.";
    onListen(successMessage);
  };

  const getDailyGoal = () => {
    const userAge = currentUser?.age || 65;
    if (userAge > 75) return 15; // 15 min for 75+
    if (userAge > 65) return 20; // 20 min for 65-75
    return 30; // 30 min for under 65
  };

  const getTotalMinutesToday = () => {
    return Object.entries(exerciseProgress).reduce((total, [exerciseId, count]) => {
      const exercise = exercises.find(e => e.id === parseInt(exerciseId));
      return total + (exercise ? exercise.duration * count : 0);
    }, 0);
  };

  return (
    <div className="exercises-page-main">
      <section className="panel home-section">
        <h2>{labels.exercises || "Guided Workouts"}</h2>
        <p>Safe, age-appropriate exercises with voice guidance and video demonstrations.</p>
      </section>

      <div className="exercises-container">
        {/* Progress Section */}
        <section className="panel exercise-progress-card">
          <h3>Today's Activity</h3>
          <div className="progress-summary">
            <div className="progress-item">
              <div className="progress-number">{completedToday}</div>
              <div className="progress-label">Exercises Done</div>
            </div>
            <div className="progress-item">
              <div className="progress-number">{getTotalMinutesToday()}</div>
              <div className="progress-label">Minutes</div>
            </div>
            <div className="progress-item">
              <div className="progress-number">{getDailyGoal()}</div>
              <div className="progress-label">Daily Goal</div>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min((getTotalMinutesToday() / getDailyGoal()) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {getTotalMinutesToday() >= getDailyGoal() 
              ? "🎉 Daily goal achieved! Great work!" 
              : `Keep going! ${getDailyGoal() - getTotalMinutesToday()} minutes left.`}
          </p>
        </section>

        {/* Quick Tips */}
        <section className="panel exercise-tips-card">
          <h3>💡 Safety Reminders</h3>
          <ul className="tips-list">
            <li>Start slowly and gradually increase intensity</li>
            <li>Wear comfortable, supportive shoes</li>
            <li>Stay hydrated during exercise</li>
            <li>Stop if you feel dizzy or experience pain</li>
            <li>Exercise in a safe, clear space</li>
          </ul>
        </section>

        {/* Difficulty Selection */}
        <section className="exercises-difficulty-section">
          <h3>Select Difficulty Level</h3>
          <div className="difficulty-buttons">
            {["beginner", "intermediate", "advanced"].map(level => (
              <button
                key={level}
                className={`difficulty-btn ${selectedDifficulty === level ? "difficulty-btn-active" : ""}`}
                onClick={() => setSelectedDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Active Guided Exercise Modal */}
        {isGuidedMode && activeExercise && (
          <div className="guided-workout-modal">
            <div className="guided-workout-card">
              <button 
                className="guided-close-btn" 
                onClick={() => setIsGuidedMode(false)}
              >
                ✕
              </button>
              
              <h2>{activeExercise.name}</h2>
              
              <div className="guided-timer">
                <div className="timer-display">{activeExercise.duration} min</div>
              </div>

              <div className="guided-instructions">
                <p><strong>Instructions:</strong></p>
                <p>{activeExercise.instructions}</p>
              </div>

              <div className="guided-video">
                <iframe
                  width="100%"
                  height="300"
                  src={activeExercise.video}
                  title={activeExercise.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="guided-benefits">
                <p><strong>Benefits:</strong> {activeExercise.benefits}</p>
              </div>

              <div className="guided-actions">
                <button 
                  className="audio-btn"
                  onClick={() => onListen(activeExercise.instructions)}
                >
                  🔊 Hear Instructions
                </button>
                <button 
                  className="audio-btn"
                  onClick={() => onListen(`Repeat ${activeExercise.reps} times. Starting now. One.`)}
                >
                  🔊 Start Counting
                </button>
                <button 
                  className="plain-btn"
                  onClick={() => setIsGuidedMode(false)}
                >
                  Continue Solo
                </button>
              </div>

              <button 
                className="audio-btn"
                onClick={() => handleCompleteExercise(activeExercise.id)}
              >
                ✓ Complete Exercise
              </button>
            </div>
          </div>
        )}

        {/* Exercises Grid */}
        <div className="exercises-grid">
          {filteredExercises.map(exercise => (
            <div key={exercise.id} className="exercise-card">
              <div className="exercise-header">
                <h3>{exercise.name}</h3>
                <span className="difficulty-badge">{exercise.difficulty}</span>
              </div>

              <p className="exercise-description">{exercise.description}</p>

              <div className="exercise-details">
                <div className="detail-item">
                  <span className="detail-label">⏱️ Duration:</span>
                  <span>{exercise.duration} min</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🔄 Reps:</span>
                  <span>{exercise.reps}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">✓ Completed:</span>
                  <span>{exerciseProgress[exercise.id] || 0} times</span>
                </div>
              </div>

              <div className="exercise-benefits">
                <strong>Benefits:</strong> {exercise.benefits}
              </div>

              <div className="exercise-safety">
                <strong>Safety:</strong> {exercise.safety}
              </div>

              <div className="exercise-actions">
                <button 
                  className="audio-btn"
                  onClick={() => handleStartGuided(exercise)}
                >
                  🎯 Start Guided
                </button>
                <button 
                  className="plain-btn"
                  onClick={() => onListen(exercise.instructions)}
                >
                  🔊 Hear Tips
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Recommendation */}
        <section className="panel exercise-recommendation-card">
          <h3>📋 Today's Recommendation</h3>
          <p>
            Based on your profile, aim for <strong>{getDailyGoal()} minutes</strong> of gentle activity today. 
            Start with beginner exercises, then progress to intermediate if you feel comfortable.
          </p>
          <p>
            <strong>Suggested routine:</strong> Gentle Walking → Arm Circles → Seated Stretches → Rest
          </p>
        </section>
      </div>
    </div>
  );
}

export default ExercisesPage;
