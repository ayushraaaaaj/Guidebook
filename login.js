// Password toggle
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleBtn = document.querySelector('.password-toggle');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        }

        // Authentication state
        let isSignUpMode = false;
        
        // Toggle between sign in and sign up
        function switchAuthMode() {
            isSignUpMode = !isSignUpMode;
            const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
            const nameGroup = document.getElementById('nameGroup');
            const authBtn = document.getElementById('authBtn');
            const btnText = authBtn.querySelector('.btn-text');
            const authSwitchText = document.getElementById('authSwitchText');
            
            if (isSignUpMode) {
                confirmPasswordGroup.style.display = 'block';
                nameGroup.style.display = 'block';
                btnText.textContent = 'Sign Up';
                authSwitchText.innerHTML = 'Already have an account? <a href="#" onclick="switchAuthMode()">Sign in</a>';
                document.getElementById('confirmPassword').required = true;
                document.getElementById('fullName').required = true;
            } else {
                confirmPasswordGroup.style.display = 'none';
                nameGroup.style.display = 'none';
                btnText.textContent = 'Sign In';
                authSwitchText.innerHTML = 'Don\'t have an account? <a href="#" onclick="switchAuthMode()">Sign up</a>';
                document.getElementById('confirmPassword').required = false;
                document.getElementById('fullName').required = false;
            }
        }
        
        // Password toggle functions
        function toggleConfirmPassword() {
            const passwordInput = document.getElementById('confirmPassword');
            const toggleBtn = document.querySelectorAll('.password-toggle')[1];
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        }
        
        // Form submission
        document.getElementById('authForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const fullName = document.getElementById('fullName').value;
            
            if (!email || !password) {
                showError('Please fill in all required fields');
                return;
            }
            
            if (isSignUpMode) {
                if (!fullName) {
                    showError('Please enter your full name');
                    return;
                }
                if (password !== confirmPassword) {
                    showError('Passwords do not match');
                    return;
                }
                if (password.length < 6) {
                    showError('Password must be at least 6 characters long');
                    return;
                }
            }
            
            // Show loading state
            const btn = document.getElementById('authBtn');
            const btnText = btn.querySelector('.btn-text');
            const loading = btn.querySelector('.loading');
            
            btnText.style.display = 'none';
            loading.style.display = 'flex';
            btn.disabled = true;
            
            // Simulate authentication process
            setTimeout(() => {
                if (isSignUpMode) {
                    // Sign up process
                    const users = JSON.parse(localStorage.getItem('gb:users') || '{}');
                    
                    if (users[email]) {
                        showError('An account with this email already exists');
                        resetButton();
                        return;
                    }
                    
                    // Create new user
                    users[email] = {
                        password: password,
                        fullName: fullName,
                        joinDate: new Date().toISOString(),
                        experiencesShared: 0,
                        profileViews: 0,
                        reputation: 0
                    };
                    
                    localStorage.setItem('gb:users', JSON.stringify(users));
                    
                    // Auto login after signup
                    localStorage.setItem('gb:loggedIn', 'true');
                    localStorage.setItem('gb:userEmail', email);
                    localStorage.setItem('gb:userName', fullName);
                    
                    window.location.href = 'index.html';
                } else {
                    // Sign in process
                    const users = JSON.parse(localStorage.getItem('gb:users') || '{}');
                    
                    if (!users[email] || users[email].password !== password) {
                        showError('Invalid email or password');
                        resetButton();
                        return;
                    }
                    
                    // Login successful
                    localStorage.setItem('gb:loggedIn', 'true');
                    localStorage.setItem('gb:userEmail', email);
                    localStorage.setItem('gb:userName', users[email].fullName);
                    
                    window.location.href = 'index.html';
                }
            }, 2000);
            
            function resetButton() {
                btnText.style.display = 'block';
                loading.style.display = 'none';
                btn.disabled = false;
            }
        });

        // Social login
        function socialLogin(provider) {
            showError(`${provider} login coming soon!`);
        }


        // Error handling
        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }

        // Check if already logged in
        document.addEventListener('DOMContentLoaded', function() {
            if (localStorage.getItem('gb:loggedIn') === 'true') {
                window.location.href = 'index.html';
            }
            
            // Initialize the mindblowing animations
            initializeAnimations();
        });

        // Enhanced Midjourney-Style Particle System
        function createAdvancedParticle() {
            const particleContainer = document.getElementById('particleContainer');
            const particle = document.createElement('div');
            
            // Enhanced particle types with beams
            const types = ['particle-small', 'particle-medium', 'particle-large', 'particle-glow'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            
            particle.className = `particle ${randomType}`;
            
            // Random starting position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '100vh';
            
            // Enhanced animation timing
            const duration = 12 + Math.random() * 8; // 12-20 seconds for smoother effect
            const delay = Math.random() * 3; // 0-3 seconds
            
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = delay + 's';
            
            particleContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, (duration + delay) * 1000);
        }

        // Mouse interaction for dynamic effects
        function addMouseInteraction() {
            document.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                // Update morphing shapes based on mouse position
                const shapes = document.querySelectorAll('.shape');
                shapes.forEach((shape, index) => {
                    const offsetX = (mouseX - 0.5) * 50 * (index + 1);
                    const offsetY = (mouseY - 0.5) * 50 * (index + 1);
                    
                    shape.style.transform += ` translate(${offsetX}px, ${offsetY}px)`;
                });
                
                // Create particles on mouse movement (throttled)
                if (Math.random() < 0.1) {
                    createInteractiveParticle(e.clientX, e.clientY);
                }
            });
        }

        // Interactive particles that follow mouse
        function createInteractiveParticle(x, y) {
            const particle = document.createElement('div');
            particle.className = 'particle particle-glow';
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.pointerEvents = 'none';
            particle.style.animation = 'none';
            particle.style.opacity = '0.8';
            particle.style.zIndex = '10';
            
            document.body.appendChild(particle);
            
            // Animate the particle
            let opacity = 0.8;
            let size = 3;
            
            const animate = () => {
                opacity -= 0.02;
                size += 0.1;
                
                particle.style.opacity = opacity;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.transform = `translate(-50%, -50%) scale(${1 + (3 - size) * 0.1})`;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(particle);
                }
            };
            
            requestAnimationFrame(animate);
        }

        // Enhanced login form animations
        function enhanceFormAnimations() {
            const loginCard = document.querySelector('.login-card');
            const inputs = document.querySelectorAll('input');
            
            // Add focus effects
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    loginCard.style.transform = 'translateY(-5px) scale(1.02)';
                    loginCard.style.boxShadow = '12px 12px 24px #c0c0c0, -12px -12px 24px #ffffff';
                    
                    // Create particles around the input
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            const rect = input.getBoundingClientRect();
                            createInteractiveParticle(
                                rect.left + Math.random() * rect.width,
                                rect.top + Math.random() * rect.height
                            );
                        }, i * 100);
                    }
                });
                
                input.addEventListener('blur', () => {
                    loginCard.style.transform = 'translateY(0) scale(1)';
                    loginCard.style.boxShadow = '8px 8px 16px #c8c8c8, -8px -8px 16px #ffffff';
                });
            });
        }

        // Optimized Neural Network Generation
        function createNeuralNetwork() {
            const neuralContainer = document.getElementById('neuralNetwork');
            const nodeCount = 10; // Reduced for better performance
            const nodes = [];
            
            // Create neural nodes
            for (let i = 0; i < nodeCount; i++) {
                const node = document.createElement('div');
                node.className = 'neural-node';
                node.style.left = Math.random() * 100 + '%';
                node.style.top = Math.random() * 100 + '%';
                node.style.animationDelay = Math.random() * 3 + 's';
                
                neuralContainer.appendChild(node);
                nodes.push({
                    element: node,
                    x: parseFloat(node.style.left),
                    y: parseFloat(node.style.top)
                });
            }
            
            // Create connections between nearby nodes
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const distance = Math.sqrt(
                        Math.pow(nodes[i].x - nodes[j].x, 2) + 
                        Math.pow(nodes[i].y - nodes[j].y, 2)
                    );
                    
                    if (distance < 30 && Math.random() > 0.5) {
                        const connection = document.createElement('div');
                        connection.className = 'neural-connection';
                        
                        const angle = Math.atan2(
                            nodes[j].y - nodes[i].y, 
                            nodes[j].x - nodes[i].x
                        ) * 180 / Math.PI;
                        
                        connection.style.left = nodes[i].x + '%';
                        connection.style.top = nodes[i].y + '%';
                        connection.style.width = distance + 'vw';
                        connection.style.transform = `rotate(${angle}deg)`;
                        connection.style.animationDelay = Math.random() * 4 + 's';
                        
                        neuralContainer.appendChild(connection);
                    }
                }
            }
        }
        
        // Optimized AI Data Stream Generation
        function createDataStream() {
            const streamContainer = document.getElementById('dataStream');
            
            for (let i = 0; i < 5; i++) { // Reduced count for performance
                const dataLine = document.createElement('div');
                dataLine.className = 'data-line';
                dataLine.style.left = Math.random() * 100 + '%';
                dataLine.style.animationDelay = Math.random() * 6 + 's';
                dataLine.style.animationDuration = (4 + Math.random() * 4) + 's';
                
                streamContainer.appendChild(dataLine);
                
                // Remove and recreate after animation
                setTimeout(() => {
                    if (dataLine.parentNode) {
                        dataLine.parentNode.removeChild(dataLine);
                    }
                    
                    // Create new one
                    setTimeout(() => {
                        if (streamContainer) {
                            const newLine = document.createElement('div');
                            newLine.className = 'data-line';
                            newLine.style.left = Math.random() * 100 + '%';
                            newLine.style.animationDelay = '0s';
                            newLine.style.animationDuration = (4 + Math.random() * 4) + 's';
                            streamContainer.appendChild(newLine);
                        }
                    }, Math.random() * 2000);
                }, 8000);
            }
        }
        
        // Theme detection with light mode default
        function initializeTheme() {
            // Check for saved theme preference
            const savedTheme = localStorage.getItem('gb:theme');
            
            // Default to light mode for better aesthetics
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            
            // Add theme toggle button
            const themeToggle = document.createElement('button');
            themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            themeToggle.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 1.5rem;
                cursor: pointer;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                z-index: 1000;
            `;
            
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                themeToggle.innerHTML = isDark ? '☀️' : '🌙';
                localStorage.setItem('gb:theme', isDark ? 'dark' : 'light');
            });
            
            document.body.appendChild(themeToggle);
        }
        
        // Initialize all animations
        function initializeAnimations() {
            // Create initial particles
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createAdvancedParticle();
                }, i * 300);
            }
            
            // Create neural network (reduced for performance)
            createNeuralNetwork();
            
            // Create data streams (optimized)
            createDataStream();
            
            // Enhanced particle generation for Midjourney effect
            setInterval(createAdvancedParticle, 800);
            
            // More frequent effects for dynamic feel
            setInterval(createDataStream, 12000);
            
            // Add mouse interactions
            addMouseInteraction();
            
            // Enhance form animations
            enhanceFormAnimations();
            
            // Initialize theme
            initializeTheme();
            
            // Add window resize handler
            window.addEventListener('resize', () => {
                // Recreate particles for new dimensions
                const particles = document.querySelectorAll('#particleContainer .particle');
                particles.forEach(particle => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                });
                
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        createAdvancedParticle();
                    }, i * 100);
                }
            });
        }

        // Add particle animation
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            document.querySelector('.floating-particles').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 6000);
        }

        // Create particles periodically
        setInterval(createParticle, 2000);