# Glossary of Terms

This glossary contains 300 terms from the Applied Linear Algebra for AI and Machine Learning course, organized alphabetically with ISO 11179-compliant definitions.

#### 2D Rotation

A linear transformation that rotates vectors in a two-dimensional plane around the origin by a specified angle.

**Example:** Rotating a point (1, 0) by 90 degrees counterclockwise yields (0, 1).

See also: 3D Rotation, Rotation Matrix

#### 2D Vector

An ordered pair of real numbers representing a point or direction in a two-dimensional plane.

**Example:** The vector (3, 4) represents a point 3 units along the x-axis and 4 units along the y-axis.

See also: 3D Vector, N-Dimensional Vector

#### 2x2 Determinant

The determinant of a 2×2 matrix, calculated as ad - bc for matrix [[a, b], [c, d]].

**Example:** For matrix [[3, 2], [1, 4]], the determinant is 3×4 - 2×1 = 10.

See also: 3x3 Determinant, Determinant

#### 3D Coordinate System

A reference frame using three perpendicular axes (typically x, y, z) to specify positions in three-dimensional space.

**Example:** The point (2, 3, 5) is located 2 units along x, 3 units along y, and 5 units up the z-axis.

See also: Homogeneous Coordinates, Coordinate System

#### 3D Rotation

A linear transformation that rotates vectors in three-dimensional space around a specified axis by a given angle.

**Example:** Rotating a vector around the z-axis preserves its z-component while rotating its x and y components.

See also: 2D Rotation, Euler Angles, Quaternion Rotation

#### 3D Vector

An ordered triple of real numbers representing a point or direction in three-dimensional space.

**Example:** The vector (1, 2, 3) points from the origin to a location one unit along x, two along y, and three along z.

See also: 2D Vector, N-Dimensional Vector

#### 3x3 Determinant

The determinant of a 3×3 matrix, computed using cofactor expansion along any row or column.

**Example:** Using the rule of Sarrus or cofactor expansion to compute the determinant of a 3×3 rotation matrix yields 1.

See also: 2x2 Determinant, Cofactor Expansion

#### Abstract Vector Space

A set of elements (vectors) together with operations of addition and scalar multiplication satisfying the vector space axioms.

**Example:** The set of all polynomials of degree at most n forms an abstract vector space with standard polynomial addition.

See also: Vector Space, Vector Space Axioms

#### Activation Function

A nonlinear function applied element-wise to the output of a neural network layer, introducing nonlinearity into the model.

**Example:** ReLU returns max(0, x), allowing neural networks to learn complex, nonlinear patterns in data.

See also: ReLU, Sigmoid, Tanh, Softmax

#### Adam Optimizer

An adaptive learning rate optimization algorithm combining momentum and RMSprop for efficient gradient descent.

Adam adjusts the learning rate for each parameter individually based on estimates of first and second moments of gradients.

**Example:** Training a deep neural network with Adam typically converges faster than standard SGD.

See also: SGD, Momentum, RMSprop

#### Algebraic Multiplicity

The number of times an eigenvalue appears as a root of the characteristic polynomial.

**Example:** If λ = 2 is a repeated root appearing twice in the characteristic polynomial, its algebraic multiplicity is 2.

See also: Eigenvalue, Geometric Multiplicity, Characteristic Polynomial

#### Attention Mechanism

A neural network component that computes weighted combinations of values based on learned relevance scores between queries and keys.

Attention allows models to focus on relevant parts of the input when producing each part of the output.

**Example:** In machine translation, attention helps the model focus on specific source words when generating each target word.

See also: Self-Attention, Cross-Attention, Multi-Head Attention

#### Attention Score

A scalar value indicating the relevance between a query vector and a key vector, typically computed as their scaled dot product.

**Example:** Higher attention scores mean the model considers those key-value pairs more relevant for the current query.

See also: Attention Weights, Query Matrix, Key Matrix

#### Attention Weights

Normalized attention scores (typically via softmax) that determine how much each value contributes to the output.

**Example:** If a word has attention weight 0.7 for another word, it strongly influences how that word is processed.

See also: Attention Score, Softmax, Value Matrix

#### Augmented Matrix

A matrix formed by appending the constant terms of a system of linear equations as an additional column to the coefficient matrix.

**Example:** For the system 2x + 3y = 5 and x - y = 1, the augmented matrix is [[2, 3, 5], [1, -1, 1]].

See also: Matrix Equation Form, Gaussian Elimination

#### Back Substitution

A technique for solving triangular systems of equations by solving for variables in reverse order, starting from the last equation.

**Example:** In a row echelon form system, you first find the last variable, then substitute it back to find the others.

See also: Row Echelon Form, Gaussian Elimination

#### Backpropagation

An algorithm for computing gradients of the loss function with respect to neural network weights by applying the chain rule layer by layer.

Backpropagation efficiently computes gradients by propagating error signals backward through the network.

**Example:** During training, backpropagation calculates how much each weight contributed to the prediction error.

See also: Forward Propagation, Chain Rule Matrices, Gradient Descent

#### Basic Variable

A variable in a system of linear equations that corresponds to a pivot column in the reduced row echelon form.

**Example:** In a system with two pivot columns for x and y, these are basic variables while z (if present without a pivot) is free.

See also: Free Variable, Pivot Column

#### Basis Transition Matrix

A matrix that converts vector coordinates from one basis representation to another.

**Example:** To express a vector given in standard basis using a custom basis, multiply by the appropriate transition matrix.

See also: Change of Basis, Basis Vector

#### Basis Vector

A vector that is part of a basis, which is a linearly independent set that spans the entire vector space.

**Example:** In 2D, the vectors (1, 0) and (0, 1) form the standard basis.

See also: Standard Basis, Linear Independence, Span

#### Batch Gradient Descent

An optimization method that computes the gradient using the entire training dataset before updating parameters.

**Example:** After processing all 10,000 training examples, batch gradient descent makes one parameter update.

See also: SGD, Mini-Batch SGD, Learning Rate

#### Batch Normalization

A technique that normalizes layer inputs across a mini-batch to accelerate training and improve stability.

**Example:** Before applying the activation function, batch normalization centers and scales the values using mini-batch statistics.

See also: Layer Normalization, Neural Network Layer

#### BFGS Algorithm

A quasi-Newton optimization method that approximates the inverse Hessian matrix to find the minimum of a function efficiently.

BFGS builds an approximation of curvature information without computing second derivatives explicitly.

**Example:** BFGS is commonly used for training logistic regression and other convex optimization problems.

See also: Quasi-Newton Method, Hessian Matrix, Newton's Method

#### Bias Vector

A vector of constant terms added to the weighted sum in each layer of a neural network, allowing shifts in the activation function.

**Example:** Adding a bias of 0.5 to all neurons allows the network to output non-zero values even when all inputs are zero.

See also: Weight Matrix, Neural Network Layer

#### Block Matrix

A matrix partitioned into rectangular submatrices (blocks) that can be manipulated as individual elements.

**Example:** A 4×4 matrix can be viewed as a 2×2 block matrix where each block is a 2×2 matrix.

See also: Matrix, Sparse Matrix

#### Blur Filter

A convolution kernel that averages neighboring pixel values to reduce image sharpness and noise.

**Example:** A 3×3 averaging filter replaces each pixel with the mean of its 9 neighbors.

See also: Image Convolution, Sharpen Filter, Image Filter

#### Bounding Box

A rectangular region defined by coordinates that encloses an object of interest in an image or 3D space.

**Example:** An object detector outputs bounding boxes as (x_min, y_min, x_max, y_max) coordinates around detected cars.

See also: Object Detection, Object Tracking

#### Camera Calibration

The process of estimating camera parameters (intrinsic and extrinsic) to accurately map 3D world points to 2D image coordinates.

**Example:** Using a checkerboard pattern to determine focal length, principal point, and lens distortion coefficients.

See also: Camera Matrix, Intrinsic Parameters, Extrinsic Parameters

#### Camera Matrix

A matrix that maps 3D world coordinates to 2D image coordinates, combining intrinsic and extrinsic parameters.

**Example:** The 3×4 camera matrix projects a 3D point onto the image plane using perspective projection.

See also: Projection Matrix, Intrinsic Parameters, Extrinsic Parameters

#### Cauchy-Schwarz Inequality

A fundamental inequality stating that the absolute value of an inner product is at most the product of the norms.

**Example:** For any vectors u and v, |⟨u, v⟩| ≤ ||u|| · ||v||, with equality when vectors are parallel.

See also: Inner Product, Norm from Inner Product

#### Chain Rule Matrices

Matrix representations of derivative chains used in backpropagation to compute gradients through composed functions.

**Example:** The gradient flows backward through layers as products of Jacobian matrices.

See also: Backpropagation, Gradient Vector

#### Change of Basis

The process of expressing vectors in terms of a different set of basis vectors than the original representation.

**Example:** Converting from Cartesian coordinates to polar-like basis vectors requires a change of basis operation.

See also: Basis Transition Matrix, Basis Vector

#### Characteristic Equation

An equation obtained by setting the characteristic polynomial equal to zero, whose roots are the eigenvalues.

**Example:** For a 2×2 matrix, solving det(A - λI) = 0 gives the characteristic equation λ² - trace(A)λ + det(A) = 0.

See also: Characteristic Polynomial, Eigenvalue

#### Characteristic Polynomial

A polynomial whose roots are the eigenvalues of a matrix, computed as det(A - λI).

**Example:** For a 3×3 matrix, the characteristic polynomial is a cubic in λ.

See also: Characteristic Equation, Eigenvalue, Determinant

#### Cholesky Decomposition

A factorization of a positive definite matrix into the product of a lower triangular matrix and its transpose.

Cholesky decomposition is computationally efficient and numerically stable for solving systems with positive definite matrices.

**Example:** A covariance matrix can be decomposed as A = LL^T, where L is lower triangular.

See also: Positive Definite Matrix, LU Decomposition

#### Codomain

The set of all possible output values of a function or transformation.

**Example:** For a transformation from R² to R³, the codomain is R³.

See also: Domain, Image, Range

#### Cofactor

The signed minor of a matrix element, used in computing determinants and the adjugate matrix.

**Example:** The cofactor of element a₁₂ is (-1)^(1+2) times the minor M₁₂.

See also: Minor, Cofactor Expansion

#### Cofactor Expansion

A method for computing the determinant by expanding along a row or column using minors and cofactors.

**Example:** Expanding a 3×3 determinant along the first row: det(A) = a₁₁C₁₁ + a₁₂C₁₂ + a₁₃C₁₃.

See also: Determinant, Minor, Cofactor

#### Color Space Transform

A linear transformation that converts image data between different color representations.

**Example:** Converting from RGB to YUV separates luminance from color information using a matrix transformation.

See also: RGB Image, Image Matrix

#### Column Space

The set of all possible linear combinations of the column vectors of a matrix, also called the range.

**Example:** If a 3×2 matrix has linearly independent columns, its column space is a 2D plane in R³.

See also: Range, Row Space, Rank

#### Column Vector

A matrix with a single column, representing a vector as a vertical array of numbers.

**Example:** The column vector [1; 2; 3] has three rows and one column.

See also: Row Vector, Vector

#### Compact SVD

A form of singular value decomposition that retains only the non-zero singular values and corresponding vectors.

**Example:** For a rank-r matrix, compact SVD uses r singular values instead of the full min(m,n).

See also: SVD, Full SVD, Truncated SVD

#### Complex Eigenvalue

An eigenvalue that has a nonzero imaginary component, occurring in conjugate pairs for real matrices.

**Example:** A 2D rotation matrix has complex eigenvalues cos(θ) ± i·sin(θ).

See also: Eigenvalue, Characteristic Polynomial

#### Composition of Transforms

The result of applying one linear transformation followed by another, represented by matrix multiplication.

**Example:** Rotating then scaling is represented by multiplying the rotation matrix by the scaling matrix.

See also: Linear Transformation, Transformation Matrix

#### Condition Number

A measure of how sensitive a matrix computation is to small changes in input, defined as the ratio of largest to smallest singular values.

Large condition numbers indicate ill-conditioned matrices prone to numerical instability.

**Example:** A condition number of 10⁶ means errors can be amplified by up to a million times.

See also: Singular Value, Numerical Stability

#### Constrained Optimization

Optimization of an objective function subject to equality or inequality constraints on the variables.

**Example:** Minimizing cost while meeting quality requirements is a constrained optimization problem.

See also: Lagrange Multiplier, KKT Conditions

#### Convex Function

A function where any line segment between two points on its graph lies above or on the graph.

Convex functions have a single global minimum, making optimization straightforward.

**Example:** f(x) = x² is convex because the parabola curves upward everywhere.

See also: Convexity, Hessian Matrix

#### Convexity

The property of a set or function ensuring that any weighted average of two elements remains within the set or below the function graph.

**Example:** A convex optimization problem has no local minima that are not also global minima.

See also: Convex Function, Constrained Optimization

#### Convolution Kernel

A small matrix of weights used in convolution operations to detect features or patterns in input data.

**Example:** A 3×3 edge detection kernel highlights boundaries between regions of different intensities.

See also: Convolutional Layer, Image Convolution

#### Convolutional Layer

A neural network layer that applies learnable convolution kernels to detect local patterns in input data.

**Example:** Early convolutional layers might detect edges, while deeper layers detect complex features like faces.

See also: Convolution Kernel, Stride, Padding

#### Coordinate System

A system that uses numerical values (coordinates) to uniquely specify the position of points in a space.

**Example:** The Cartesian coordinate system uses perpendicular x and y axes to locate points in a plane.

See also: 3D Coordinate System, Basis Vector

#### Correlation Matrix

A matrix of pairwise Pearson correlation coefficients between features, with values ranging from -1 to 1.

**Example:** A correlation matrix shows which stock prices tend to move together.

See also: Covariance Matrix, Feature Matrix

#### Cosine Similarity

A measure of similarity between two vectors computed as the cosine of the angle between them.

**Example:** Two parallel vectors have cosine similarity of 1, while orthogonal vectors have similarity of 0.

See also: Dot Product, Semantic Similarity

#### Covariance Matrix

A symmetric matrix containing covariances between pairs of variables, with variances on the diagonal.

The covariance matrix captures how features vary together in a dataset.

**Example:** A 3×3 covariance matrix for height, weight, and age shows how these variables co-vary.

See also: Correlation Matrix, PCA

#### Cramers Rule

A formula for solving systems of linear equations using ratios of determinants.

**Example:** For a 2×2 system, x = det(A_x)/det(A), where A_x replaces the first column with the constant terms.

See also: Determinant, System of Equations

#### Cross-Attention

An attention mechanism where queries come from one sequence and keys/values come from a different sequence.

**Example:** In translation, cross-attention allows the decoder to attend to relevant parts of the encoded source sentence.

See also: Self-Attention, Attention Mechanism

#### Cross-Entropy Loss

A loss function measuring the difference between predicted probability distributions and true labels.

**Example:** For classification, cross-entropy heavily penalizes confident wrong predictions.

See also: Loss Function, Softmax

#### Cross Product

A binary operation on two 3D vectors that produces a vector perpendicular to both inputs.

**Example:** The cross product of (1, 0, 0) and (0, 1, 0) is (0, 0, 1).

See also: Dot Product, Vector

#### Data Matrix

A matrix where rows represent observations (samples) and columns represent features (variables).

**Example:** A data matrix for 1000 patients with 50 measurements has dimensions 1000×50.

See also: Feature Matrix, Design Matrix

#### Deep Network

A neural network with multiple hidden layers, enabling learning of hierarchical feature representations.

**Example:** A 50-layer convolutional network can learn increasingly abstract features for image classification.

See also: Hidden Layer, Neural Network Layer

#### Dense Matrix

A matrix in which most elements are non-zero, typically stored as a full 2D array.

**Example:** A random matrix with normally distributed entries is typically dense.

See also: Sparse Matrix, Matrix

#### Design Matrix

A matrix of input features used in regression, with rows as observations and columns as predictors.

**Example:** In linear regression with 100 samples and 5 features, the design matrix is 100×5.

See also: Data Matrix, Linear Regression

#### Determinant

A scalar value computed from a square matrix that indicates whether the matrix is invertible and measures volume scaling.

**Example:** A matrix with determinant zero is singular and cannot be inverted.

See also: 2x2 Determinant, 3x3 Determinant, Singular Matrix

#### Determinant Properties

Rules governing how determinants behave under matrix operations, including row operations and multiplication.

**Example:** The determinant of a product equals the product of determinants: det(AB) = det(A)·det(B).

See also: Determinant, Multiplicative Property

#### Diagonal Form

A diagonal matrix that a matrix can be transformed into through diagonalization, with eigenvalues on the diagonal.

**Example:** If A = PDP⁻¹ where D is diagonal, then D is the diagonal form of A.

See also: Diagonalization, Eigenvalue

#### Diagonal Matrix

A square matrix where all non-diagonal elements are zero.

**Example:** The matrix [[3, 0], [0, 5]] is diagonal with entries 3 and 5.

See also: Identity Matrix, Triangular Matrix

#### Diagonalization

The process of expressing a matrix as A = PDP⁻¹, where D is diagonal and P contains eigenvectors.

**Example:** Diagonalizing a symmetric matrix simplifies computing matrix powers: A^n = PD^nP⁻¹.

See also: Eigenvalue, Eigenvector, Diagonal Form

#### Dimension of Space

The number of vectors in any basis for a vector space, indicating the degrees of freedom.

**Example:** R³ has dimension 3 because any basis requires exactly three vectors.

See also: Vector Space, Basis Vector

#### Dimensionality Reduction

Techniques that reduce the number of features while preserving important information in the data.

**Example:** Using PCA to reduce 100 features to 10 principal components that capture 95% of variance.

See also: PCA, Truncated SVD

#### Domain

The set of all possible input values for a function or transformation.

**Example:** A transformation from R³ to R² has domain R³.

See also: Codomain, Range

#### Dominant Eigenvalue

The eigenvalue with the largest absolute value, which determines the long-term behavior of iterative matrix powers.

**Example:** In power iteration, multiplying by a matrix repeatedly converges to the direction of the dominant eigenvector.

See also: Eigenvalue, Power Iteration

#### Dot Product

A binary operation on two vectors that produces a scalar, computed as the sum of componentwise products.

**Example:** The dot product of (1, 2, 3) and (4, 5, 6) is 1×4 + 2×5 + 3×6 = 32.

See also: Inner Product, Cosine Similarity

#### Edge Detection

Image processing techniques that identify boundaries between regions with different intensities or colors.

**Example:** The Sobel operator detects edges by computing intensity gradients in horizontal and vertical directions.

See also: Sobel Operator, Image Convolution

#### Eigen Equation

The fundamental equation Av = λv that defines eigenvalues λ and eigenvectors v of a matrix A.

**Example:** If Av = 3v, then v is an eigenvector with eigenvalue 3.

See also: Eigenvalue, Eigenvector

#### Eigendecomposition

The representation of a matrix as a product of its eigenvector matrix, diagonal eigenvalue matrix, and inverse eigenvector matrix.

**Example:** For a symmetric matrix, eigendecomposition is A = QΛQ^T where Q is orthogonal.

See also: Diagonalization, Eigenvalue, Eigenvector

#### Eigenspace

The set of all eigenvectors corresponding to a particular eigenvalue, together with the zero vector.

**Example:** For a 3×3 matrix with eigenvalue 2 having geometric multiplicity 2, the eigenspace is a plane.

See also: Eigenvector, Geometric Multiplicity

#### Eigenvalue

A scalar λ such that Av = λv for some nonzero vector v, indicating a direction scaled by the transformation.

**Example:** A 2D rotation has complex eigenvalues, indicating no real directions are preserved.

See also: Eigenvector, Characteristic Polynomial

#### Eigenvector

A nonzero vector v such that Av = λv for some scalar λ, indicating a direction unchanged by the transformation except for scaling.

**Example:** For a horizontal stretch matrix, any vector along the x-axis is an eigenvector.

See also: Eigenvalue, Eigenspace

#### Embedding

A learned vector representation that maps discrete objects (like words or items) to continuous vector space.

Embeddings capture semantic relationships where similar items have similar vector representations.

**Example:** Word embeddings place "king" and "queen" close together in vector space.

See also: Embedding Space, Word Embedding

#### Embedding Space

A continuous vector space where embedded objects reside, with geometric relationships encoding semantic meaning.

**Example:** In an embedding space, arithmetic like "king - man + woman ≈ queen" can hold.

See also: Embedding, Latent Space

#### Epipolar Geometry

The geometric relationship between two camera views of the same 3D scene, constraining point correspondences.

**Example:** A point in one image must lie on an epipolar line in the other image.

See also: Stereo Vision, Triangulation

#### Euclidean Distance

The straight-line distance between two points, computed as the L2 norm of their difference.

**Example:** The Euclidean distance between (0, 0) and (3, 4) is √(9 + 16) = 5.

See also: L2 Norm, Vector Magnitude

#### Euler Angles

Three angles (typically roll, pitch, yaw) that describe the orientation of a rigid body in 3D space.

**Example:** An aircraft's orientation is often described as 10° roll, 5° pitch, and 30° yaw.

See also: Gimbal Lock, Quaternion, 3D Rotation

#### Extended Kalman Filter

A nonlinear extension of the Kalman filter that linearizes the system model around the current estimate.

**Example:** EKF is used when sensor measurements are nonlinear functions of the state, like bearing angles.

See also: Kalman Filter, State Estimation

#### Extrinsic Parameters

Camera parameters describing the position and orientation of the camera in world coordinates.

**Example:** Extrinsic parameters include a rotation matrix and translation vector from world to camera frame.

See also: Intrinsic Parameters, Camera Matrix

#### Feature Detection

Algorithms that identify distinctive points or regions in images that can be tracked or matched.

**Example:** SIFT and ORB algorithms detect corner-like features that are robust to rotation and scale.

See also: Edge Detection, Homography

#### Feature Matrix

A matrix organizing feature values where rows represent samples and columns represent individual features.

**Example:** A feature matrix for housing data might have columns for square footage, bedrooms, and price.

See also: Feature Vector, Data Matrix

#### Feature Vector

A vector containing the numerical feature values that describe a single data sample.

**Example:** A feature vector for an image might contain pixel intensities or extracted features like edges.

See also: Feature Matrix, Embedding

#### Forward Propagation

The process of computing outputs by passing inputs through each layer of a neural network sequentially.

**Example:** In forward propagation, input data flows through hidden layers to produce a prediction.

See also: Backpropagation, Neural Network Layer

#### Four Subspaces

The column space, row space, null space, and left null space of a matrix, with fundamental relationships.

**Example:** The column space and left null space are orthogonal complements in the output space.

See also: Column Space, Row Space, Null Space, Left Null Space

#### Fourier Transform

A transformation that decomposes a signal into its constituent frequencies using sinusoidal basis functions.

**Example:** The Fourier transform of an image reveals its frequency content for filtering or compression.

See also: Frequency Domain, Image Compression

#### Free Variable

A variable in a system of linear equations that can take any value, corresponding to a non-pivot column.

**Example:** In a system with infinitely many solutions, free variables parameterize the solution set.

See also: Basic Variable, Infinite Solutions

#### Frequency Domain

A representation of data in terms of frequency components rather than spatial or temporal values.

**Example:** High-frequency components in an image correspond to edges and fine details.

See also: Fourier Transform, Image Compression

#### Full SVD

The complete singular value decomposition with U, Σ, and V^T matrices of full dimensions.

**Example:** For an m×n matrix, full SVD has U as m×m, Σ as m×n, and V^T as n×n.

See also: SVD, Compact SVD, Truncated SVD

#### Function

A rule that assigns exactly one output value to each input value from the domain.

**Example:** f(x) = x² is a function mapping each real number to its square.

See also: Domain, Codomain, Linear Transformation

#### Gaussian Elimination

An algorithm for transforming a matrix to row echelon form using elementary row operations.

**Example:** Gaussian elimination converts an augmented matrix to a form where back substitution can solve the system.

See also: Row Operations, Row Echelon Form

#### Geometric Multiplicity

The dimension of the eigenspace corresponding to an eigenvalue, equal to the number of linearly independent eigenvectors.

**Example:** If an eigenvalue has geometric multiplicity 2, there are two independent eigenvector directions.

See also: Algebraic Multiplicity, Eigenspace

#### Gimbal Lock

A phenomenon where two rotation axes become aligned, causing loss of one degree of rotational freedom.

**Example:** When pitch reaches 90°, roll and yaw rotations become equivalent, losing independent control.

See also: Euler Angles, Quaternion

#### Gradient Descent

An iterative optimization algorithm that moves parameters in the direction opposite to the gradient to minimize a function.

**Example:** Training neural networks uses gradient descent to reduce the loss function over many iterations.

See also: Gradient Vector, Learning Rate, SGD

#### Gradient Vector

A vector of partial derivatives indicating the direction and rate of steepest increase of a function.

**Example:** The gradient of f(x, y) = x² + y² at point (1, 2) is (2, 4).

See also: Gradient Descent, Hessian Matrix

#### Gram-Schmidt Process

An algorithm for orthonormalizing a set of vectors by sequentially removing projections onto previously processed vectors.

**Example:** Starting with vectors (1, 1) and (1, 2), Gram-Schmidt produces orthonormal vectors.

See also: Orthonormal Basis, QR Decomposition

#### Gram-Schmidt QR

QR decomposition computed using the Gram-Schmidt orthogonalization process.

**Example:** The Q matrix from Gram-Schmidt contains orthonormal columns spanning the column space of A.

See also: Gram-Schmidt Process, QR Decomposition, Householder QR

#### Grayscale Image

A digital image represented by a single channel matrix of intensity values, typically ranging from 0 (black) to 255 (white).

**Example:** A 512×512 grayscale image is stored as a single 512×512 matrix of pixel values.

See also: Image Matrix, RGB Image

#### Hessian Matrix

A square matrix of second partial derivatives describing the local curvature of a multivariable function.

**Example:** For f(x, y), the Hessian is [[∂²f/∂x², ∂²f/∂x∂y], [∂²f/∂y∂x, ∂²f/∂y²]].

See also: Gradient Vector, Newton's Method

#### Hidden Layer

A neural network layer between the input and output layers that learns intermediate representations.

**Example:** A network with two hidden layers of 64 neurons each can learn hierarchical features.

See also: Neural Network Layer, Deep Network

#### Homogeneous Coordinates

An extended coordinate system using n+1 coordinates to represent points in n-dimensional space, enabling uniform treatment of transformations.

**Example:** The 2D point (3, 4) becomes (3, 4, 1) in homogeneous coordinates.

See also: Projection Matrix, SE3 Transform

#### Homogeneous System

A system of linear equations where all constant terms are zero, always having at least the trivial solution.

**Example:** The system 2x + 3y = 0 and x - y = 0 is homogeneous with solution x = y = 0.

See also: Trivial Solution, Null Space

#### Homography

A projective transformation that maps points between two planes, represented by a 3×3 matrix.

**Example:** A homography can correct perspective distortion when photographing a document at an angle.

See also: Perspective Projection, Feature Detection

#### Householder QR

QR decomposition using Householder reflections, which is numerically more stable than Gram-Schmidt.

**Example:** Householder QR is preferred for solving least squares problems due to better numerical properties.

See also: QR Decomposition, Gram-Schmidt QR

#### Identity Matrix

A square diagonal matrix with ones on the main diagonal and zeros elsewhere, acting as the multiplicative identity.

**Example:** Multiplying any matrix by the identity matrix of compatible size returns the original matrix.

See also: Diagonal Matrix, Matrix Inverse

#### Image

The set of all output values that a function or transformation actually produces from its domain.

**Example:** For f(x) = x², the image is all non-negative real numbers.

See also: Range, Codomain

#### Image Compression

Techniques that reduce the storage size of images while preserving visual quality, often using matrix decompositions.

**Example:** SVD-based compression retains only the largest singular values, approximating the image with fewer parameters.

See also: Truncated SVD, Low-Rank Approximation

#### Image Convolution

An operation that applies a kernel to each position in an image, computing weighted sums of neighboring pixels.

**Example:** Convolving with a 3×3 averaging kernel blurs the image by smoothing local variations.

See also: Convolution Kernel, Image Filter

#### Image Filter

A convolution kernel designed for specific image processing tasks like blurring, sharpening, or edge detection.

**Example:** A Gaussian filter smooths images while preserving edges better than simple averaging.

See also: Image Convolution, Blur Filter, Sharpen Filter

#### Image Matrix

A numerical representation of a digital image as a matrix (grayscale) or tensor (color) of pixel values.

**Example:** An 800×600 RGB image is stored as a 800×600×3 tensor of values.

See also: Grayscale Image, RGB Image, Image Tensor

#### Image Tensor

A multi-dimensional array representing image data, typically with dimensions for height, width, and color channels.

**Example:** A batch of 32 RGB images of size 224×224 forms a 32×224×224×3 tensor.

See also: Image Matrix, Tensor

#### Infinite Solutions

A condition where a system of linear equations has infinitely many solutions, forming a line, plane, or higher-dimensional set.

**Example:** Parallel planes that coincide have infinitely many intersection points.

See also: Solution Set, Free Variable

#### Inner Product

A generalization of the dot product that defines angles and lengths in abstract vector spaces.

**Example:** The standard inner product in R^n is the dot product ⟨u, v⟩ = Σu_i v_i.

See also: Dot Product, Inner Product Space

#### Inner Product Space

A vector space equipped with an inner product operation satisfying linearity, symmetry, and positive-definiteness.

**Example:** R^n with the dot product is an inner product space.

See also: Inner Product, Vector Space

#### Interpolation

Creating intermediate values or states between known data points using mathematical techniques.

**Example:** Linear interpolation between embeddings generates semantically meaningful intermediate representations.

See also: Latent Space, Embedding

#### Intrinsic Parameters

Camera parameters describing internal properties like focal length, principal point, and lens distortion.

**Example:** A camera with focal length 50mm and sensor size 36mm has specific intrinsic parameters.

See also: Extrinsic Parameters, Camera Matrix

#### Invertible Matrix

A square matrix that has an inverse, equivalent to having a nonzero determinant and full rank.

**Example:** The matrix [[1, 2], [3, 4]] is invertible because its determinant 1×4 - 2×3 = -2 ≠ 0.

See also: Matrix Inverse, Singular Matrix, Determinant

#### Invertible Transform

A linear transformation that can be reversed, mapping each output uniquely back to its input.

**Example:** Rotation is invertible—rotating by angle θ can be reversed by rotating by -θ.

See also: Linear Transformation, Matrix Inverse

#### Kalman Filter

An optimal recursive algorithm for estimating the state of a linear dynamic system from noisy measurements.

The Kalman filter combines predictions from a system model with sensor measurements, weighting by their uncertainties.

**Example:** GPS receivers use Kalman filters to estimate position by fusing measurements over time.

See also: State Estimation, Kalman Gain, Extended Kalman Filter

#### Kalman Gain

A matrix that determines how much the state estimate should be updated based on the measurement residual.

**Example:** High Kalman gain means trusting measurements more; low gain means trusting predictions more.

See also: Kalman Filter, Update Step

#### Kernel

The set of all vectors mapped to zero by a linear transformation, also called the null space.

**Example:** For a projection matrix onto a line, the kernel is the orthogonal complement of that line.

See also: Null Space, Rank-Nullity Theorem

#### Key Matrix

A learned matrix that transforms input embeddings into key vectors used for computing attention scores.

**Example:** In transformers, the key matrix creates representations that queries match against.

See also: Query Matrix, Value Matrix, Attention Mechanism

#### KKT Conditions

Necessary conditions for optimality in constrained optimization problems with both equality and inequality constraints.

KKT conditions generalize Lagrange multiplier conditions to handle inequality constraints.

**Example:** At an optimal point, KKT conditions require zero gradient and complementary slackness for active constraints.

See also: Lagrange Multiplier, Constrained Optimization

#### L1 Norm

The sum of absolute values of vector components, also called the Manhattan distance or taxicab norm.

**Example:** The L1 norm of vector (3, -4, 2) is |3| + |-4| + |2| = 9.

See also: L2 Norm, L-Infinity Norm

#### L2 Norm

The square root of the sum of squared components, equal to the Euclidean length of a vector.

**Example:** The L2 norm of vector (3, 4) is √(9 + 16) = 5.

See also: L1 Norm, Vector Magnitude, Euclidean Distance

#### L-Infinity Norm

The maximum absolute value among all vector components.

**Example:** The L-infinity norm of vector (3, -7, 2) is max(|3|, |-7|, |2|) = 7.

See also: L1 Norm, L2 Norm

#### Lagrange Multiplier

A scalar variable introduced to convert a constrained optimization problem into an unconstrained one.

**Example:** To minimize f(x) subject to g(x) = 0, solve ∇f = λ∇g where λ is the Lagrange multiplier.

See also: Constrained Optimization, KKT Conditions

#### Lasso Regression

Linear regression with L1 regularization, promoting sparse solutions by shrinking some coefficients to exactly zero.

**Example:** Lasso with 100 features might zero out 80 of them, performing automatic feature selection.

See also: Ridge Regression, Regularization

#### Latent Space

A lower-dimensional space containing learned representations that capture meaningful variations in data.

**Example:** A variational autoencoder learns a latent space where each dimension controls a meaningful image attribute.

See also: Embedding Space, Dimensionality Reduction

#### Layer Normalization

A technique that normalizes activations across features for each individual sample, independent of batch size.

**Example:** Layer normalization is preferred over batch normalization for transformers and recurrent networks.

See also: Batch Normalization, Neural Network Layer

#### Learning Rate

A hyperparameter controlling the step size in gradient-based optimization.

**Example:** A learning rate of 0.001 means each gradient update moves parameters by 0.001 times the gradient.

See also: Gradient Descent, SGD

#### Least Squares Problem

An optimization problem seeking to minimize the sum of squared differences between observed and predicted values.

**Example:** Fitting a line to scattered points by minimizing the sum of squared vertical distances.

See also: Normal Equations, Linear Regression

#### Left Null Space

The null space of a matrix transpose, containing all vectors orthogonal to the row space.

**Example:** Vectors in the left null space of A satisfy A^T x = 0.

See also: Null Space, Four Subspaces

#### Left Singular Vector

A column of the U matrix in singular value decomposition, representing a direction in the output space.

**Example:** Left singular vectors form an orthonormal basis for the column space of the matrix.

See also: SVD, Right Singular Vector

#### LIDAR Point Cloud

A set of 3D points measured by a laser scanner, representing the geometry of the surrounding environment.

**Example:** Autonomous vehicles use LIDAR point clouds to detect obstacles and map road surfaces.

See also: Point Cloud, Sensor Fusion

#### Linear Combination

A sum of vectors multiplied by scalar coefficients.

**Example:** 2·(1, 0) + 3·(0, 1) = (2, 3) is a linear combination of the standard basis vectors.

See also: Span, Linear Independence

#### Linear Dependence

A property of a set of vectors where at least one vector can be written as a linear combination of the others.

**Example:** Vectors (1, 2), (2, 4), and (3, 6) are linearly dependent because (3, 6) = 3·(1, 2).

See also: Linear Independence, Span

#### Linear Equation

An equation where variables appear only to the first power with constant coefficients.

**Example:** 3x + 2y - z = 7 is a linear equation in three variables.

See also: System of Equations, Matrix Equation Form

#### Linear Independence

A property of a set of vectors where no vector can be written as a linear combination of the others.

**Example:** Vectors (1, 0) and (0, 1) are linearly independent in R².

See also: Linear Dependence, Basis Vector

#### Linear Regression

A method for modeling the relationship between variables by fitting a linear equation to observed data.

**Example:** Predicting house prices from square footage using a line: price = m × sqft + b.

See also: Least Squares Problem, Design Matrix

#### Linear Transformation

A function between vector spaces that preserves vector addition and scalar multiplication.

**Example:** A rotation is a linear transformation because rotating a sum equals the sum of rotations.

See also: Transformation Matrix, Matrix

#### Localization

The process of determining an agent's position and orientation within a known map or environment.

**Example:** A robot uses sensor data to estimate it is at coordinates (10, 5) facing north.

See also: SLAM, Mapping, State Estimation

#### LoRA

Low-Rank Adaptation, a technique for efficiently fine-tuning large language models by learning low-rank updates to weight matrices.

**Example:** LoRA reduces fine-tuning parameters from billions to millions by decomposing updates as BA where B and A are small matrices.

See also: Weight Matrix, Low-Rank Approximation

#### Loss Function

A function measuring the discrepancy between model predictions and true values, guiding optimization.

**Example:** Mean squared error loss penalizes large prediction errors quadratically.

See also: Cross-Entropy Loss, Gradient Descent

#### Low-Rank Approximation

An approximation of a matrix using a product of smaller matrices, capturing the most significant patterns.

**Example:** Truncating SVD to k singular values gives the best rank-k approximation in Frobenius norm.

See also: Truncated SVD, Matrix Rank

#### Lower Triangular

A matrix where all entries above the main diagonal are zero.

**Example:** The matrix [[2, 0, 0], [3, 1, 0], [4, 5, 6]] is lower triangular.

See also: Upper Triangular, Triangular Matrix

#### LU Decomposition

Factorization of a matrix into the product of a lower triangular and an upper triangular matrix.

**Example:** LU decomposition enables efficient solving of multiple systems with the same coefficient matrix.

See also: Cholesky Decomposition, Gaussian Elimination

#### Mapping

The process of building a representation of the environment from sensor observations.

**Example:** A robot creates a 2D occupancy grid showing walls and open spaces as it explores.

See also: SLAM, Localization

#### Matrix

A rectangular array of numbers arranged in rows and columns, representing linear transformations or data.

**Example:** A 2×3 matrix has 2 rows and 3 columns, containing 6 entries.

See also: Matrix Dimensions, Vector

#### Matrix Addition

Element-wise addition of two matrices with the same dimensions.

**Example:** [[1, 2], [3, 4]] + [[5, 6], [7, 8]] = [[6, 8], [10, 12]].

See also: Matrix, Matrix Scalar Multiply

#### Matrix Dimensions

The number of rows and columns in a matrix, written as m×n where m is rows and n is columns.

**Example:** A 4×3 matrix has 4 rows and 3 columns.

See also: Matrix, Row Vector, Column Vector

#### Matrix Entry

A single element of a matrix, identified by its row and column position.

**Example:** In matrix A, the entry a₂₃ is in row 2 and column 3.

See also: Matrix, Matrix Notation

#### Matrix Equation Form

Expression of a system of linear equations as a single matrix equation Ax = b.

**Example:** The system 2x + y = 5 and x - y = 1 becomes [[2, 1], [1, -1]]·[x, y]^T = [5, 1]^T.

See also: System of Equations, Augmented Matrix

#### Matrix Factorization

Decomposition of a matrix into a product of simpler matrices revealing structure or enabling computation.

**Example:** Factoring a rating matrix into user and item matrices enables recommendation systems.

See also: LU Decomposition, SVD

#### Matrix Inverse

A matrix A⁻¹ such that AA⁻¹ = A⁻¹A = I, existing only for square invertible matrices.

**Example:** For [[a, b], [c, d]], the inverse is (1/(ad-bc))·[[d, -b], [-c, a]].

See also: Invertible Matrix, Identity Matrix

#### Matrix Multiplication

An operation combining two matrices by taking dot products of rows of the first with columns of the second.

**Example:** A (2×3) matrix times a (3×4) matrix yields a (2×4) matrix.

See also: Matrix-Vector Product, Composition of Transforms

#### Matrix Notation

Conventions for writing matrices, including bracket notation and subscript indexing.

**Example:** A matrix A with element a_{ij} in row i and column j is written as A = [a_{ij}].

See also: Matrix, Matrix Entry

#### Matrix Rank

The maximum number of linearly independent rows or columns in a matrix.

**Example:** A 5×3 matrix has rank at most 3, the smaller of its dimensions.

See also: Rank, Column Space, Row Space

#### Matrix Scalar Multiply

Multiplication of every entry of a matrix by a scalar value.

**Example:** 3·[[1, 2], [3, 4]] = [[3, 6], [9, 12]].

See also: Scalar Multiplication, Matrix

#### Matrix Transpose

The matrix obtained by interchanging rows and columns of the original matrix.

**Example:** The transpose of [[1, 2, 3], [4, 5, 6]] is [[1, 4], [2, 5], [3, 6]].

See also: Symmetric Matrix, Transpose Determinant

#### Matrix-Vector Product

Multiplication of a matrix by a vector, producing a new vector.

**Example:** [[1, 2], [3, 4]]·[5, 6]^T = [17, 39]^T.

See also: Matrix Multiplication, Linear Transformation

#### Measurement Vector

A vector containing sensor observations at a given time step, used for updating state estimates.

**Example:** A measurement vector might contain GPS position and compass heading readings.

See also: State Vector, Kalman Filter

#### Mini-Batch SGD

Stochastic gradient descent using small batches of training examples to estimate the gradient.

**Example:** With batch size 32, gradients are computed from 32 samples before each parameter update.

See also: SGD, Batch Gradient Descent

#### Minor

The determinant of a submatrix formed by deleting one row and one column from a matrix.

**Example:** For a 3×3 matrix, M₁₂ is the determinant of the 2×2 submatrix with row 1 and column 2 removed.

See also: Cofactor, Cofactor Expansion

#### Momentum

An optimization technique that accelerates gradient descent by accumulating a velocity vector of past gradients.

**Example:** Momentum helps overcome local minima and oscillations by adding inertia to parameter updates.

See also: SGD, Adam Optimizer

#### Motion Planning

Computing a sequence of configurations or trajectories to move from start to goal while avoiding obstacles.

**Example:** A robotic arm plans a collision-free path from its current position to grasp an object.

See also: Path Planning, Trajectory Optimization

#### Multi-Head Attention

Parallel attention mechanisms that attend to different representation subspaces, capturing diverse relationships.

**Example:** With 8 attention heads, a transformer can simultaneously focus on syntax, semantics, and other aspects.

See also: Attention Mechanism, Self-Attention

#### Multiplicative Property

The property that the determinant of a product equals the product of determinants: det(AB) = det(A)·det(B).

**Example:** If det(A) = 2 and det(B) = 3, then det(AB) = 6.

See also: Determinant, Determinant Properties

#### N-Dimensional Vector

An ordered list of n real numbers representing a point or direction in n-dimensional space.

**Example:** A 100-dimensional feature vector in machine learning might represent an image or document.

See also: 2D Vector, 3D Vector, Vector

#### Neural Network Layer

A computational unit in a neural network that transforms input through weights, biases, and activation functions.

**Example:** A dense layer with 128 neurons applies a 128-dimensional linear transformation followed by activation.

See also: Hidden Layer, Activation Function

#### Neuron Model

A mathematical abstraction of a biological neuron, computing a weighted sum of inputs plus bias through an activation.

**Example:** A neuron computes output = σ(w₁x₁ + w₂x₂ + ... + b) where σ is the activation function.

See also: Perceptron, Activation Function

#### Newton's Method

An optimization algorithm using second-order derivatives to take optimal steps toward a function's minimum.

**Example:** Newton's method converges quadratically near the optimum but requires computing the Hessian.

See also: Hessian Matrix, Quasi-Newton Method, BFGS Algorithm

#### No Solution

A condition where a system of linear equations has no values satisfying all equations simultaneously.

**Example:** The system x + y = 1 and x + y = 2 has no solution because the planes are parallel.

See also: Solution Set, Infinite Solutions

#### Non-Uniform Scaling

Scaling a transformation that uses different scale factors along different axes.

**Example:** Scaling by 2 in x and 0.5 in y stretches horizontally while compressing vertically.

See also: Uniform Scaling, Scaling Matrix

#### Normal Equations

The system A^T A x = A^T b derived from the least squares problem, giving the optimal solution.

**Example:** Solving the normal equations finds the best-fit line coefficients for linear regression.

See also: Least Squares Problem, Pseudoinverse

#### Norm from Inner Product

A vector norm derived from an inner product as ||v|| = √⟨v, v⟩.

**Example:** The Euclidean norm is induced by the standard dot product: ||v|| = √(v · v).

See also: Inner Product, L2 Norm

#### Null Space

The set of all vectors mapped to zero by a matrix, representing the homogeneous solution set.

**Example:** The null space of [[1, 2], [2, 4]] is all multiples of (-2, 1).

See also: Kernel, Rank-Nullity Theorem

#### Nullity

The dimension of the null space, indicating the number of free variables in the homogeneous solution.

**Example:** A 4×5 matrix with rank 3 has nullity 5 - 3 = 2.

See also: Null Space, Rank-Nullity Theorem

#### Numerical Rank

The number of singular values above a tolerance threshold, accounting for floating-point errors.

**Example:** A matrix might have theoretical rank 10 but numerical rank 8 due to tiny singular values from noise.

See also: Matrix Rank, Condition Number

#### Numerical Stability

The property of an algorithm being resistant to accumulation and amplification of rounding errors.

**Example:** Householder QR is more numerically stable than Gram-Schmidt for solving least squares problems.

See also: Condition Number, Partial Pivoting

#### Object Detection

Computer vision tasks that identify and localize objects of interest within images or video.

**Example:** YOLO detects cars, pedestrians, and traffic signs in autonomous driving applications.

See also: Bounding Box, Object Tracking

#### Object Tracking

Following the movement of detected objects across consecutive frames in video sequences.

**Example:** Kalman filters predict object positions between frames to maintain identity through occlusions.

See also: Object Detection, Kalman Filter

#### Orthogonal Matrix

A square matrix whose columns (and rows) are orthonormal, satisfying Q^T Q = I.

**Example:** A rotation matrix is orthogonal because rotating preserves lengths and angles.

See also: Orthonormal Basis, Matrix Inverse

#### Orthogonal Projection

Mapping a vector onto a subspace by dropping the perpendicular component.

**Example:** Projecting (3, 4) onto the x-axis gives (3, 0).

See also: Projection, Projection onto Subspace

#### Orthogonal Vectors

Vectors whose inner product is zero, meaning they are perpendicular.

**Example:** Vectors (1, 1) and (1, -1) are orthogonal because 1×1 + 1×(-1) = 0.

See also: Orthogonality, Dot Product

#### Orthogonality

The property of being perpendicular, characterized by zero inner product between vectors.

Orthogonality is fundamental to many algorithms including QR decomposition and principal component analysis.

**Example:** Eigenvectors of a symmetric matrix corresponding to different eigenvalues are orthogonal.

See also: Orthogonal Vectors, Orthonormal Basis

#### Orthonormal Basis

A basis consisting of mutually orthogonal unit vectors.

**Example:** The standard basis {(1, 0, 0), (0, 1, 0), (0, 0, 1)} is orthonormal in R³.

See also: Orthonormal Set, Gram-Schmidt Process

#### Orthonormal Set

A set of vectors that are mutually orthogonal and all have unit length.

**Example:** The vectors (1, 0) and (0, 1) form an orthonormal set in R².

See also: Orthonormal Basis, Unit Vector

#### Padding

Adding extra values (typically zeros) around input data to control output dimensions in convolution.

**Example:** Zero-padding a 5×5 image to 7×7 before 3×3 convolution produces a 5×5 output.

See also: Convolutional Layer, Stride

#### Partial Pivoting

Row swapping during Gaussian elimination to place the largest magnitude element in the pivot position.

**Example:** Partial pivoting improves numerical stability by avoiding division by small numbers.

See also: Gaussian Elimination, LU Decomposition

#### Path Planning

Determining a route through space from start to goal, typically avoiding obstacles.

**Example:** A* algorithm finds shortest paths on navigation graphs for robotic path planning.

See also: Motion Planning, Trajectory Optimization

#### PCA

Principal Component Analysis, a technique that finds orthogonal directions of maximum variance in data.

PCA reduces dimensionality while preserving as much variance as possible.

**Example:** PCA on face images extracts eigenfaces, the principal components of facial variation.

See also: Principal Component, Variance Explained, Dimensionality Reduction

#### Perceptron

The simplest neural network unit, computing a weighted sum of inputs passed through a step function.

**Example:** A perceptron can learn to classify linearly separable patterns like AND and OR functions.

See also: Neuron Model, Activation Function

#### Perspective Projection

Mapping 3D points to 2D image coordinates using perspective geometry where distant objects appear smaller.

**Example:** Parallel lines in 3D appear to converge at a vanishing point in perspective projection.

See also: Projection Matrix, Camera Matrix

#### Pivot Column

A column in a matrix that contains a pivot position (leading 1 in row echelon form).

**Example:** In reduced row echelon form, pivot columns correspond to basic variables.

See also: Pivot Position, Basic Variable

#### Pivot Position

The location of a leading entry (first nonzero element) in a row of an echelon form matrix.

**Example:** After Gaussian elimination, pivot positions identify which variables are determined.

See also: Pivot Column, Row Echelon Form

#### Point Cloud

A set of data points in 3D space, typically from LIDAR or depth sensors, representing surface geometry.

**Example:** A point cloud of a room might contain millions of points representing walls, furniture, and objects.

See also: LIDAR Point Cloud, 3D Coordinate System

#### Pooling Layer

A neural network layer that reduces spatial dimensions by aggregating values within local regions.

**Example:** Max pooling takes the maximum value in each 2×2 region, reducing resolution by half.

See also: Convolutional Layer, Stride

#### Position Encoding

Fixed or learned vectors added to embeddings that convey sequence position information.

**Example:** Sinusoidal position encodings allow transformers to understand word order in sentences.

See also: Transformer Architecture, Embedding

#### Positive Definite Matrix

A symmetric matrix where x^T Ax > 0 for all nonzero vectors x, having all positive eigenvalues.

**Example:** Covariance matrices of non-degenerate distributions are positive definite.

See also: Cholesky Decomposition, Eigenvalue

#### Power Iteration

An iterative algorithm for computing the dominant eigenvalue and eigenvector of a matrix.

**Example:** Multiplying a random vector by a matrix repeatedly and normalizing converges to the dominant eigenvector.

See also: Dominant Eigenvalue, Eigenvalue

#### Prediction Step

The Kalman filter phase that projects the state estimate forward using the system dynamics model.

**Example:** The prediction step estimates where a tracked vehicle will be at the next time step.

See also: Update Step, Kalman Filter

#### Principal Component

A direction in data space corresponding to maximum variance, computed as an eigenvector of the covariance matrix.

**Example:** The first principal component of height and weight data might point along the "body size" direction.

See also: PCA, Variance Explained

#### Projection

A linear transformation that maps vectors onto a subspace, reducing dimension.

**Example:** Projecting 3D points onto the xy-plane removes the z-coordinate.

See also: Orthogonal Projection, Projection Matrix

#### Projection Matrix

A matrix P satisfying P² = P, used to project vectors onto a subspace.

**Example:** The projection matrix onto a line through unit vector u is P = uu^T.

See also: Projection, Orthogonal Projection

#### Projection onto Subspace

Mapping a vector to the closest point in a subspace, minimizing the distance from the original vector.

**Example:** Projecting a 3D vector onto a plane gives the point in the plane nearest to the vector.

See also: Orthogonal Projection, Least Squares Problem

#### Pseudoinverse

A generalization of the matrix inverse to non-square or singular matrices, computed from SVD as A⁺ = VΣ⁺U^T.

**Example:** The pseudoinverse solves the least squares problem: x = A⁺b minimizes ||Ax - b||.

See also: SVD, Least Squares Problem

#### Quaternion

A four-component hypercomplex number used to represent 3D rotations without gimbal lock.

**Example:** A unit quaternion q = (cos(θ/2), sin(θ/2)·axis) represents rotation by angle θ around the given axis.

See also: Quaternion Rotation, Euler Angles

#### Quaternion Rotation

Rotation of a 3D vector using quaternion multiplication, avoiding gimbal lock and enabling smooth interpolation.

**Example:** Quaternion rotation is computed as v' = qvq* where q* is the quaternion conjugate.

See also: Quaternion, 3D Rotation

#### Query Matrix

A learned matrix that transforms input embeddings into query vectors for computing attention.

**Example:** In self-attention, each token's query asks "what information should I gather?"

See also: Key Matrix, Value Matrix, Attention Mechanism

#### Quasi-Newton Method

Optimization methods that approximate second-order information without explicit Hessian computation.

**Example:** BFGS builds a Hessian approximation from gradients observed during optimization.

See also: BFGS Algorithm, Newton's Method

#### Range

The set of all output vectors that a linear transformation can produce, equivalent to the column space.

**Example:** For a 3×2 matrix with linearly independent columns, the range is a 2D plane in R³.

See also: Column Space, Image

#### Rank

The dimension of the column space (or row space) of a matrix, indicating its linear independence structure.

**Example:** A 5×5 matrix with rank 3 has 3 linearly independent columns.

See also: Matrix Rank, Column Space

#### Rank-Nullity Theorem

The theorem stating that rank plus nullity equals the number of columns: rank(A) + nullity(A) = n.

**Example:** A 4×6 matrix with rank 4 has nullity 6 - 4 = 2.

See also: Rank, Nullity

#### Reduced Row Echelon Form

A matrix form where each pivot is 1, pivots are the only nonzero entries in their columns, and rows are ordered by pivot position.

**Example:** [[1, 0, 2], [0, 1, -1]] is in reduced row echelon form.

See also: Row Echelon Form, Gaussian Elimination

#### Reflection Matrix

A matrix representing a linear transformation that mirrors vectors across a line, plane, or hyperplane.

**Example:** The matrix [[1, 0], [0, -1]] reflects vectors across the x-axis.

See also: Linear Transformation, Transformation Matrix

#### Regularization

A technique adding penalty terms to loss functions to prevent overfitting by constraining model complexity.

**Example:** L2 regularization adds λ||w||² to the loss, shrinking weights toward zero.

See also: Ridge Regression, Lasso Regression

#### ReLU

Rectified Linear Unit, an activation function returning max(0, x), popular in deep learning for its simplicity and effectiveness.

**Example:** ReLU(5) = 5 and ReLU(-3) = 0, providing nonlinearity while avoiding vanishing gradients for positive values.

See also: Activation Function, Sigmoid, Tanh

#### RGB Image

A color image represented by three channel matrices for red, green, and blue intensity values.

**Example:** Each pixel in an RGB image has three values, like (255, 128, 0) for orange.

See also: Grayscale Image, Image Matrix

#### Ridge Regression

Linear regression with L2 regularization, shrinking coefficients toward zero to prevent overfitting.

**Example:** Ridge regression with λ = 0.1 adds 0.1×||w||² to the least squares loss.

See also: Lasso Regression, Regularization

#### Right Singular Vector

A column of the V matrix in singular value decomposition, representing a direction in the input space.

**Example:** Right singular vectors form an orthonormal basis for the row space of the matrix.

See also: SVD, Left Singular Vector

#### Rigid Body Transform

A transformation preserving distances and angles, consisting of rotation and translation.

**Example:** Moving and rotating a robot arm's end effector is a rigid body transformation.

See also: SE3 Transform, Rotation Matrix

#### RMSprop

An adaptive learning rate optimizer that divides the learning rate by a running average of squared gradients.

**Example:** RMSprop adapts to different gradient magnitudes, learning slowly for large gradients and quickly for small ones.

See also: Adam Optimizer, SGD

#### Rotation Matrix

A square orthogonal matrix with determinant 1 that rotates vectors by a fixed angle around a fixed axis.

**Example:** A 2D rotation by angle θ is represented by [[cos(θ), -sin(θ)], [sin(θ), cos(θ)]].

See also: 2D Rotation, 3D Rotation, Orthogonal Matrix

#### Row Addition

An elementary row operation adding a scalar multiple of one row to another row.

**Example:** Subtracting 2 times row 1 from row 2 eliminates the leading entry in row 2.

See also: Row Operations, Gaussian Elimination

#### Row Echelon Form

A matrix form where each row's leading entry is to the right of the row above, and all-zero rows are at the bottom.

**Example:** [[2, 3, 1], [0, 4, 2], [0, 0, 5]] is in row echelon form.

See also: Reduced Row Echelon Form, Gaussian Elimination

#### Row Operations

Elementary transformations on matrix rows: swapping rows, scaling rows, or adding multiples of rows.

**Example:** Row operations transform a matrix to row echelon form without changing the solution set.

See also: Row Swap, Row Scaling, Row Addition

#### Row Scaling

An elementary row operation multiplying all entries in a row by a nonzero scalar.

**Example:** Multiplying row 2 by 1/4 makes the leading entry 1.

See also: Row Operations, Gaussian Elimination

#### Row Space

The set of all linear combinations of the row vectors of a matrix.

**Example:** For a 3×2 matrix with linearly independent rows, the row space is a 3D subspace of R³.

See also: Column Space, Four Subspaces

#### Row Swap

An elementary row operation exchanging two rows of a matrix.

**Example:** Swapping rows 1 and 2 places the row with larger leading entry on top.

See also: Row Operations, Partial Pivoting

#### Row Vector

A matrix with a single row, representing a vector as a horizontal array of numbers.

**Example:** The row vector [1, 2, 3] has one row and three columns.

See also: Column Vector, Vector

#### Scalar

A single numerical value, as opposed to a vector or matrix.

**Example:** In the expression 3v, the number 3 is a scalar multiplying vector v.

See also: Scalar Multiplication, Vector

#### Scalar Multiplication

Multiplication of a vector by a scalar, scaling all components by that factor.

**Example:** 3 × (1, 2, 3) = (3, 6, 9).

See also: Scalar, Vector

#### Scaling Matrix

A diagonal matrix that scales vectors by different factors along different axes.

**Example:** The diagonal matrix [[2, 0], [0, 3]] scales x by 2 and y by 3.

See also: Uniform Scaling, Non-Uniform Scaling

#### Scree Plot

A graph of eigenvalues or variance explained in decreasing order, used to determine how many components to retain.

**Example:** A scree plot showing a sharp "elbow" at component 5 suggests retaining 5 principal components.

See also: PCA, Variance Explained

#### SE3 Transform

The Special Euclidean group in 3D, representing rigid body transformations as rotation plus translation.

**Example:** An SE3 transform combines a 3×3 rotation matrix and a translation vector into a 4×4 homogeneous matrix.

See also: Rigid Body Transform, Homogeneous Coordinates

#### Self-Attention

An attention mechanism where queries, keys, and values all derive from the same sequence.

**Example:** In self-attention, each word attends to all other words in the same sentence.

See also: Attention Mechanism, Cross-Attention

#### Semantic Similarity

The degree to which two pieces of text or concepts share meaning, measured by embedding proximity.

**Example:** "Happy" and "joyful" have high semantic similarity, reflected in similar embedding vectors.

See also: Cosine Similarity, Embedding

#### Sensor Fusion

Combining data from multiple sensors to achieve more accurate and reliable state estimates.

**Example:** Fusing GPS, IMU, and camera data improves vehicle localization compared to any single sensor.

See also: Kalman Filter, LIDAR Point Cloud

#### SGD

Stochastic Gradient Descent, an optimization algorithm that updates parameters using gradients from random single samples.

**Example:** SGD makes many small updates per epoch rather than one large update, introducing beneficial noise.

See also: Batch Gradient Descent, Mini-Batch SGD

#### Sharpen Filter

A convolution kernel that enhances edges and details by emphasizing high-frequency components.

**Example:** A sharpening kernel subtracts blurred versions from the original, boosting differences.

See also: Image Convolution, Blur Filter

#### Shear Matrix

A transformation matrix that skews shapes by shifting points parallel to an axis by an amount proportional to their distance from it.

**Example:** A horizontal shear slides the top of a square right while keeping the bottom fixed, creating a parallelogram.

See also: Transformation Matrix, Linear Transformation

#### Sigmoid

An S-shaped activation function mapping real values to the range (0, 1), defined as σ(x) = 1/(1 + e^(-x)).

**Example:** Sigmoid outputs 0.5 at x = 0, approaching 1 for large positive x and 0 for large negative x.

See also: Activation Function, Tanh

#### Signed Area

The determinant of a 2×2 matrix, representing the oriented area of the parallelogram spanned by two vectors.

**Example:** Vectors (2, 0) and (0, 3) span a parallelogram with signed area 2×3 - 0×0 = 6.

See also: 2x2 Determinant, Volume Scaling Factor

#### Similar Matrices

Matrices A and B related by B = P⁻¹AP for some invertible P, sharing eigenvalues and determinant.

**Example:** A matrix and its diagonalization are similar, connected by the eigenvector matrix.

See also: Diagonalization, Eigenvalue

#### Singular Matrix

A square matrix with determinant zero, having no inverse and reduced rank.

**Example:** [[1, 2], [2, 4]] is singular because row 2 is twice row 1.

See also: Determinant, Invertible Matrix

#### Singular Value

A non-negative value on the diagonal of Σ in SVD, equal to the square root of an eigenvalue of A^T A.

**Example:** The largest singular value indicates the maximum scaling factor applied by the matrix.

See also: SVD, Left Singular Vector, Right Singular Vector

#### SLAM

Simultaneous Localization and Mapping, algorithms that build a map while tracking the agent's position within it.

**Example:** A robot vacuum uses SLAM to create a floor plan while cleaning, avoiding revisiting areas.

See also: Localization, Mapping

#### Sobel Operator

A convolution kernel for edge detection computing horizontal and vertical intensity gradients.

**Example:** The Sobel x-kernel [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] detects vertical edges.

See also: Edge Detection, Image Convolution

#### Softmax

An activation function that converts a vector of values into a probability distribution summing to 1.

**Example:** Softmax([1, 2, 3]) ≈ [0.09, 0.24, 0.67], emphasizing the largest value.

See also: Activation Function, Attention Weights

#### Solution Set

The set of all variable assignments satisfying a system of equations.

**Example:** A system might have a solution set that is a single point, a line, a plane, or empty.

See also: Unique Solution, Infinite Solutions, No Solution

#### Span

The set of all possible linear combinations of a given set of vectors.

**Example:** The span of (1, 0) and (0, 1) is all of R².

See also: Linear Combination, Basis Vector

#### Sparse Matrix

A matrix where most elements are zero, stored using specialized formats for efficiency.

**Example:** A 10000×10000 matrix with only 50000 nonzero entries is 99.95% sparse.

See also: Dense Matrix, Matrix

#### Spectral Theorem

A theorem stating that symmetric matrices have orthonormal eigenvectors and real eigenvalues, enabling orthogonal diagonalization.

**Example:** Any real symmetric matrix A can be written as QΛQ^T where Q is orthogonal.

See also: Symmetric Eigenvalues, Eigendecomposition

#### Standard Basis

The set of unit vectors along coordinate axes, forming the default basis for R^n.

**Example:** In R³, the standard basis is {(1, 0, 0), (0, 1, 0), (0, 0, 1)}.

See also: Basis Vector, Coordinate System

#### Standardization

Transforming features to have zero mean and unit variance for consistent scaling.

**Example:** Standardized values are computed as z = (x - μ)/σ for each feature.

See also: Feature Matrix, PCA

#### State Estimation

The process of inferring hidden system states from noisy observations using probabilistic models.

**Example:** Estimating a drone's actual position from GPS measurements with known error characteristics.

See also: Kalman Filter, State Vector

#### State Vector

A vector containing all variables needed to describe the current state of a dynamic system.

**Example:** A tracking state vector might be [x, y, vx, vy] for position and velocity.

See also: State Estimation, Kalman Filter

#### Stereo Vision

Depth perception using two cameras, analogous to human binocular vision.

**Example:** Stereo matching finds corresponding points in left and right images to compute depth.

See also: Triangulation, Epipolar Geometry

#### Stride

The step size by which a convolution kernel moves across the input, affecting output dimensions.

**Example:** With stride 2, the kernel moves 2 pixels at a time, reducing output size by half.

See also: Convolutional Layer, Padding

#### Subspace

A subset of a vector space that is itself a vector space under the same operations.

**Example:** The xy-plane in R³ is a subspace: any linear combination of xy-plane vectors stays in the plane.

See also: Vector Space, Span

#### SVD

Singular Value Decomposition, a factorization A = UΣV^T revealing the fundamental structure of any matrix.

SVD is one of the most important decompositions in applied linear algebra, with applications in dimensionality reduction, compression, and pseudoinverse computation.

**Example:** Truncating SVD provides the best low-rank matrix approximation.

See also: Singular Value, Left Singular Vector, Right Singular Vector

#### Symmetric Eigenvalues

The property that symmetric matrices have only real eigenvalues (no complex values).

**Example:** The symmetric matrix [[1, 2], [2, 1]] has real eigenvalues 3 and -1.

See also: Spectral Theorem, Symmetric Matrix

#### Symmetric Matrix

A square matrix equal to its transpose, meaning a_{ij} = a_{ji} for all entries.

**Example:** Covariance matrices are symmetric because Cov(X, Y) = Cov(Y, X).

See also: Matrix Transpose, Spectral Theorem

#### System of Equations

A collection of linear equations that must all be satisfied simultaneously.

**Example:** The system 2x + y = 5, x - y = 1 has two equations in two unknowns.

See also: Linear Equation, Matrix Equation Form

#### Tanh

Hyperbolic tangent activation function mapping values to (-1, 1), defined as tanh(x) = (e^x - e^(-x))/(e^x + e^(-x)).

**Example:** Tanh is centered at zero unlike sigmoid, making it often preferable for hidden layers.

See also: Activation Function, Sigmoid, ReLU

#### Tensor

A multi-dimensional array generalizing scalars, vectors, and matrices to higher dimensions.

**Example:** A 3D tensor with shape (batch_size, height, width) stores a batch of grayscale images.

See also: Tensor Operations, Image Tensor

#### Tensor Operations

Mathematical operations on tensors including element-wise operations, contractions, and products.

**Example:** Batched matrix multiplication multiplies corresponding matrices across the batch dimension.

See also: Tensor, Matrix Multiplication

#### Trajectory Optimization

Computing optimal paths through state space that minimize cost while satisfying dynamics and constraints.

**Example:** Planning a fuel-efficient trajectory for a spacecraft to reach Mars.

See also: Path Planning, Motion Planning

#### Transformation Matrix

A matrix that represents a linear transformation, mapping input vectors to output vectors.

**Example:** A 2D rotation by 45° has transformation matrix [[√2/2, -√2/2], [√2/2, √2/2]].

See also: Linear Transformation, Rotation Matrix

#### Transformer Architecture

A neural network architecture using self-attention to process sequences in parallel without recurrence.

Transformers are the foundation of modern large language models and many vision systems.

**Example:** GPT models use transformer decoders to generate text one token at a time.

See also: Self-Attention, Multi-Head Attention, Position Encoding

#### Transpose Determinant

The property that the determinant of a transpose equals the original determinant: det(A^T) = det(A).

**Example:** This property allows cofactor expansion along any row or column.

See also: Determinant, Matrix Transpose

#### Triangular Matrix

A square matrix where all entries either above or below the main diagonal are zero.

**Example:** Triangular systems can be solved efficiently using back or forward substitution.

See also: Upper Triangular, Lower Triangular

#### Triangulation

Computing 3D point positions from multiple 2D observations using geometric constraints.

**Example:** With two calibrated cameras, triangulation determines the 3D location of a visible feature.

See also: Stereo Vision, Epipolar Geometry

#### Trivial Solution

The zero solution x = 0 that always satisfies a homogeneous system of equations.

**Example:** The system 2x + 3y = 0 always has the trivial solution x = 0, y = 0.

See also: Homogeneous System, Null Space

#### Truncated SVD

Singular value decomposition keeping only the k largest singular values and corresponding vectors.

**Example:** Truncated SVD with k = 100 reduces a million-dimensional space to 100 dimensions.

See also: SVD, Low-Rank Approximation, Dimensionality Reduction

#### Uniform Scaling

Scaling by the same factor in all directions, preserving shape while changing size.

**Example:** Uniform scaling by factor 2 doubles all distances, making a circle twice as large.

See also: Non-Uniform Scaling, Scaling Matrix

#### Unique Solution

A system of equations having exactly one solution.

**Example:** Two non-parallel lines in 2D have a unique intersection point.

See also: Solution Set, No Solution, Infinite Solutions

#### Unit Vector

A vector with magnitude (length) equal to one.

**Example:** The unit vector in the direction of (3, 4) is (3/5, 4/5) = (0.6, 0.8).

See also: Vector Normalization, Vector Magnitude

#### Update Step

The Kalman filter phase that corrects the prediction using new measurements and the Kalman gain.

**Example:** When a GPS measurement arrives, the update step adjusts the position estimate.

See also: Prediction Step, Kalman Gain

#### Upper Triangular

A matrix where all entries below the main diagonal are zero.

**Example:** The matrix [[1, 2, 3], [0, 4, 5], [0, 0, 6]] is upper triangular.

See also: Lower Triangular, Triangular Matrix

#### Value Matrix

A learned matrix that transforms input embeddings into value vectors aggregated by attention weights.

**Example:** Values contain the information that attention mechanisms choose to pass forward.

See also: Query Matrix, Key Matrix, Attention Mechanism

#### Variance Explained

The proportion of total data variance captured by principal components, guiding dimensionality reduction decisions.

**Example:** If the first 10 components explain 95% of variance, 90% of features can be discarded.

See also: PCA, Scree Plot

#### Vector

An ordered list of numbers representing magnitude and direction in a space.

**Example:** The velocity (5, 3) represents movement of 5 units/s in x and 3 units/s in y.

See also: 2D Vector, 3D Vector, Vector Space

#### Vector Addition

Adding two vectors by summing their corresponding components.

**Example:** (1, 2) + (3, 4) = (4, 6).

See also: Vector, Vector Subtraction

#### Vector Magnitude

The length of a vector, computed as the square root of the sum of squared components.

**Example:** The magnitude of vector (3, 4) is √(9 + 16) = 5.

See also: L2 Norm, Unit Vector

#### Vector Normalization

Dividing a vector by its magnitude to produce a unit vector with the same direction.

**Example:** Normalizing (3, 4) gives (3/5, 4/5) with magnitude 1.

See also: Unit Vector, Vector Magnitude

#### Vector Notation

Conventions for writing vectors, including bold letters, arrows, or component lists.

**Example:** The vector v = (v₁, v₂, v₃) can also be written as **v** or with an arrow above.

See also: Vector, Matrix Notation

#### Vector Space

A collection of vectors with defined addition and scalar multiplication operations satisfying axioms.

**Example:** R² with standard vector addition and scalar multiplication is a vector space.

See also: Abstract Vector Space, Vector Space Axioms

#### Vector Space Axioms

The eight properties that addition and scalar multiplication must satisfy for a set to be a vector space.

**Example:** The axioms include commutativity, associativity, and the existence of zero and inverse vectors.

See also: Vector Space, Abstract Vector Space

#### Vector Subtraction

Subtracting two vectors by computing the difference of corresponding components.

**Example:** (5, 7) - (2, 3) = (3, 4).

See also: Vector Addition, Vector

#### Volume Scaling Factor

The absolute value of a determinant, indicating how much a transformation scales volumes.

**Example:** A matrix with determinant 3 triples the volume of any region it transforms.

See also: Determinant, Signed Area

#### Weight Matrix

A matrix of learnable parameters connecting layers in a neural network.

**Example:** A layer connecting 100 inputs to 50 outputs has a 50×100 weight matrix.

See also: Bias Vector, Neural Network Layer

#### Word Embedding

A vector representation of a word learned from text data, capturing semantic meaning.

**Example:** Word2Vec learns that "king" - "man" + "woman" ≈ "queen" in embedding space.

See also: Embedding, Semantic Similarity
