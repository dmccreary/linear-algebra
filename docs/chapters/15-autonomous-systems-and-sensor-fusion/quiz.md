# Quiz: Autonomous Systems and Sensor Fusion

Test your understanding of state estimation, SLAM, and autonomous systems concepts.

---

#### 1. The state vector in a Kalman filter represents:

<div class="upper-alpha" markdown>
1. The sensor measurements
2. The variables we want to estimate (position, velocity, etc.)
3. The control inputs
4. The noise covariance
</div>

??? question "Show Answer"
    The correct answer is **B**. The state vector contains all the variables we want to estimate, such as position, velocity, orientation, and angular velocity. The Kalman filter recursively updates this estimate.

    **Concept Tested:** State Vector

---

#### 2. The Kalman gain determines:

<div class="upper-alpha" markdown>
1. The number of sensors
2. How much to trust the measurement vs the prediction
3. The sampling rate
4. The state dimension
</div>

??? question "Show Answer"
    The correct answer is **B**. The Kalman gain optimally weights the prediction and measurement. When measurement noise is low, the gain is high (trust measurement); when prediction uncertainty is low, the gain is low (trust prediction).

    **Concept Tested:** Kalman Gain

---

#### 3. The prediction step in a Kalman filter:

<div class="upper-alpha" markdown>
1. Incorporates new measurements
2. Propagates the state forward in time using the motion model
3. Computes the Kalman gain
4. Initializes the filter
</div>

??? question "Show Answer"
    The correct answer is **B**. The prediction step uses the state transition model to propagate the state estimate forward in time, while also increasing the uncertainty (covariance) due to process noise.

    **Concept Tested:** Prediction Step

---

#### 4. Sensor fusion is important because:

<div class="upper-alpha" markdown>
1. Single sensors are always sufficient
2. Different sensors provide complementary information and compensate for each other's weaknesses
3. It reduces the number of sensors needed
4. It eliminates all measurement noise
</div>

??? question "Show Answer"
    The correct answer is **B**. Different sensors have different strengths and weaknesses (GPS has absolute position but is slow; IMU is fast but drifts). Fusion combines them to achieve better accuracy and robustness than any single sensor.

    **Concept Tested:** Sensor Fusion

---

#### 5. SLAM simultaneously estimates:

<div class="upper-alpha" markdown>
1. Speed and acceleration only
2. The robot's pose and a map of the environment
3. Image features only
4. Control inputs
</div>

??? question "Show Answer"
    The correct answer is **B**. SLAM (Simultaneous Localization and Mapping) jointly estimates the robot's trajectory (localization) and the positions of landmarks in the environment (mapping).

    **Concept Tested:** SLAM

---

#### 6. The Extended Kalman Filter (EKF) differs from the standard Kalman filter by:

<div class="upper-alpha" markdown>
1. Using only linear models
2. Linearizing nonlinear models using Jacobians
3. Eliminating the prediction step
4. Not using covariance matrices
</div>

??? question "Show Answer"
    The correct answer is **B**. The EKF handles nonlinear systems by linearizing the motion and observation models around the current estimate using Jacobian matrices, then applying the standard Kalman filter equations.

    **Concept Tested:** Extended Kalman Filter

---

#### 7. Object tracking across frames requires:

<div class="upper-alpha" markdown>
1. Only detection, no prediction
2. Data association between predictions and new detections
3. Removing all objects from view
4. Constant lighting conditions
</div>

??? question "Show Answer"
    The correct answer is **B**. Tracking requires associating predicted object positions with new detections across frames. Algorithms like the Hungarian method find optimal matches based on distance or appearance.

    **Concept Tested:** Object Tracking

---

#### 8. A 3D bounding box for an object includes:

<div class="upper-alpha" markdown>
1. Only the object's color
2. Center position, dimensions (length, width, height), and orientation
3. Only the 2D image coordinates
4. The object's velocity only
</div>

??? question "Show Answer"
    The correct answer is **B**. A 3D bounding box is typically parameterized as $(x, y, z, l, w, h, \theta)$: center position, three dimensions, and heading angle. This defines the object's extent in 3D space.

    **Concept Tested:** Bounding Box

---

#### 9. Path planning algorithms like A* find:

<div class="upper-alpha" markdown>
1. The longest possible path
2. A collision-free path from start to goal
3. All possible paths simultaneously
4. Paths that maximize collisions
</div>

??? question "Show Answer"
    The correct answer is **B**. Path planning algorithms find collision-free routes from a start position to a goal. A* uses a heuristic to efficiently search for the optimal path in terms of a cost function.

    **Concept Tested:** Path Planning

---

#### 10. Loop closure in SLAM:

<div class="upper-alpha" markdown>
1. Ends the SLAM algorithm
2. Recognizes previously visited places to correct accumulated drift
3. Closes physical doors in the environment
4. Stops the robot
</div>

??? question "Show Answer"
    The correct answer is **B**. Loop closure detects when the robot returns to a previously visited location. This constraint corrects accumulated drift in both the trajectory and the map, dramatically improving accuracy.

    **Concept Tested:** SLAM
