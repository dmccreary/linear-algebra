# Quiz: 3D Geometry and Transformations

Test your understanding of 3D coordinate systems, rotations, and camera models.

---

#### 1. A right-hand coordinate system is characterized by:

<div class="upper-alpha" markdown>
1. All axes pointing to the right
2. Curling right-hand fingers from X to Y points thumb in Z direction
3. The Z-axis always pointing down
4. Negative coordinates only
</div>

??? question "Show Answer"
    The correct answer is **B**. In a right-hand system, if you curl your right hand's fingers from the X-axis toward the Y-axis, your thumb points in the Z direction. This is the standard convention in mathematics and many graphics systems.

    **Concept Tested:** 3D Coordinate System

---

#### 2. Euler angles can suffer from gimbal lock when:

<div class="upper-alpha" markdown>
1. All angles are zero
2. Two rotation axes become aligned
3. The angles are too small
4. Only yaw is non-zero
</div>

??? question "Show Answer"
    The correct answer is **B**. Gimbal lock occurs when two rotation axes align (typically when pitch is ±90°), causing loss of one degree of freedom. This is an inherent limitation of Euler angle representation.

    **Concept Tested:** Gimbal Lock

---

#### 3. A quaternion representing rotation uses:

<div class="upper-alpha" markdown>
1. Three components
2. Four components with a unit norm constraint
3. Nine components like a rotation matrix
4. Two complex numbers
</div>

??? question "Show Answer"
    The correct answer is **B**. A unit quaternion has four components $(w, x, y, z)$ with $w^2 + x^2 + y^2 + z^2 = 1$. This provides a singularity-free representation of 3D rotations.

    **Concept Tested:** Quaternion

---

#### 4. Homogeneous coordinates allow:

<div class="upper-alpha" markdown>
1. Only rotation operations
2. Combining rotation and translation in a single matrix multiplication
3. Eliminating the need for matrices
4. Representing only 2D points
</div>

??? question "Show Answer"
    The correct answer is **B**. Homogeneous coordinates add an extra dimension (e.g., $(x, y, z, 1)$ for 3D points), enabling both rotation and translation to be represented as matrix multiplication.

    **Concept Tested:** Homogeneous Coordinates

---

#### 5. An SE(3) transformation represents:

<div class="upper-alpha" markdown>
1. Scaling only
2. A rigid body motion (rotation and translation) in 3D
3. Projection to 2D
4. Color transformation
</div>

??? question "Show Answer"
    The correct answer is **B**. SE(3) is the Special Euclidean group in 3D, representing all rigid body transformations—combinations of rotation and translation that preserve distances and angles.

    **Concept Tested:** SE3 Transform

---

#### 6. The camera intrinsic matrix $K$ contains:

<div class="upper-alpha" markdown>
1. The camera's position in the world
2. Focal length and principal point (internal camera geometry)
3. The rotation of the camera
4. The image pixel values
</div>

??? question "Show Answer"
    The correct answer is **B**. The intrinsic matrix contains internal camera parameters: focal lengths ($f_x$, $f_y$), principal point ($c_x$, $c_y$), and optionally skew. These describe how 3D camera coordinates project to 2D pixels.

    **Concept Tested:** Intrinsic Parameters

---

#### 7. Perspective projection causes:

<div class="upper-alpha" markdown>
1. All objects to appear the same size
2. Distant objects to appear smaller than near objects
3. Parallel lines to remain parallel in the image
4. Colors to change
</div>

??? question "Show Answer"
    The correct answer is **B**. Perspective projection divides by depth (Z-coordinate), causing distant objects to appear smaller. This mimics human vision and camera optics.

    **Concept Tested:** Perspective Projection

---

#### 8. In stereo vision, depth is inversely proportional to:

<div class="upper-alpha" markdown>
1. The baseline between cameras
2. The disparity (difference in image positions)
3. The focal length
4. The image resolution
</div>

??? question "Show Answer"
    The correct answer is **B**. The relationship $Z = \frac{fb}{d}$ shows depth is inversely proportional to disparity. Larger disparity means closer objects; smaller disparity means farther objects.

    **Concept Tested:** Stereo Vision

---

#### 9. Triangulation in stereo vision:

<div class="upper-alpha" markdown>
1. Detects triangular shapes
2. Computes 3D position from corresponding 2D points in multiple views
3. Measures triangle areas
4. Filters noise from images
</div>

??? question "Show Answer"
    The correct answer is **B**. Triangulation uses the intersection of projection rays from multiple cameras to determine the 3D position of a point observed in multiple images.

    **Concept Tested:** Triangulation

---

#### 10. A point cloud is:

<div class="upper-alpha" markdown>
1. A type of weather pattern
2. A set of 3D points representing surfaces or structure
3. A 2D image format
4. A neural network architecture
</div>

??? question "Show Answer"
    The correct answer is **B**. A point cloud is a collection of 3D points, often with associated attributes (color, intensity, normals), representing the surface or structure of objects and environments.

    **Concept Tested:** Point Cloud
