// Theme management
        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('gb:theme', isDark ? 'dark' : 'light');
            
            const themeBtn = document.querySelector('.nav-actions .btn-secondary');
            themeBtn.textContent = isDark ? '☀️' : '🌙';
        }

        // Initialize theme
        function initTheme() {
            const savedTheme = localStorage.getItem('gb:theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                document.querySelector('.nav-actions .btn-secondary').textContent = '☀️';
            }
        }

        // Load user profile
        function loadProfile() {
            const userEmail = localStorage.getItem('gb:userEmail');
            const userName = localStorage.getItem('gb:userName');
            
            if (!userEmail) {
                window.location.href = 'login.html';
                return;
            }

            const users = JSON.parse(localStorage.getItem('gb:users') || '{}');
            const userData = users[userEmail];

            if (userData) {
                document.getElementById('profileName').textContent = userData.fullName;
                document.getElementById('profileEmail').textContent = userEmail;
                document.getElementById('profileAvatar').textContent = userData.fullName.charAt(0).toUpperCase();
                document.getElementById('experienceCount').textContent = userData.experiencesShared || 0;
                document.getElementById('profileViews').textContent = userData.profileViews || 0;
                document.getElementById('reputation').textContent = userData.reputation || 0;
                
                const joinDate = new Date(userData.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                });
                document.getElementById('joinDate').textContent = joinDate;
            }

            loadExperiences();
        }

        // Load user experiences
        function loadExperiences() {
            const userEmail = localStorage.getItem('gb:userEmail');
            const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
            const userExperiences = experiences.filter(exp => exp.author === userEmail);
            
            const experienceList = document.getElementById('experienceList');
            
            if (userExperiences.length === 0) {
                experienceList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📝</div>
                        <p>You haven't shared any experiences yet.</p>
                        <p>Share your first experience above!</p>
                    </div>
                `;
                return;
            }

            experienceList.innerHTML = userExperiences.map(exp => `
                <div class="experience-item">
                    <div class="experience-header">
                        <div>
                            <h4 class="experience-title">${exp.title}</h4>
                            <div class="experience-meta">
                                ${new Date(exp.date).toLocaleDateString()} • ${exp.views || 0} views
                            </div>
                        </div>
                    </div>
                    <div class="experience-content">${exp.content}</div>
                    <div class="experience-actions">
                        <button class="btn btn-danger btn-small" onclick="deleteExperience('${exp.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        // Share experience
        document.getElementById('experienceForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('experienceTitle').value;
            const content = document.getElementById('experienceContent').value;
            const userEmail = localStorage.getItem('gb:userEmail');
            const userName = localStorage.getItem('gb:userName');
            
            if (!title || !content) return;

            const experience = {
                id: Date.now().toString(),
                title: title,
                content: content,
                author: userEmail,
                authorName: userName,
                date: new Date().toISOString(),
                views: 0
            };

            // Save experience
            const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
            experiences.unshift(experience);
            localStorage.setItem('gb:experiences', JSON.stringify(experiences));

            // Update user stats
            const users = JSON.parse(localStorage.getItem('gb:users') || '{}');
            if (users[userEmail]) {
                users[userEmail].experiencesShared = (users[userEmail].experiencesShared || 0) + 1;
                users[userEmail].reputation = (users[userEmail].reputation || 0) + 10;
                localStorage.setItem('gb:users', JSON.stringify(users));
            }

            // Reset form
            document.getElementById('experienceTitle').value = '';
            document.getElementById('experienceContent').value = '';

            // Reload profile and experiences
            loadProfile();
        });

        // Delete experience
        function deleteExperience(experienceId) {
            if (!confirm('Are you sure you want to delete this experience?')) return;

            const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
            const updatedExperiences = experiences.filter(exp => exp.id !== experienceId);
            localStorage.setItem('gb:experiences', JSON.stringify(updatedExperiences));

            // Update user stats
            const userEmail = localStorage.getItem('gb:userEmail');
            const users = JSON.parse(localStorage.getItem('gb:users') || '{}');
            if (users[userEmail]) {
                users[userEmail].experiencesShared = Math.max(0, (users[userEmail].experiencesShared || 0) - 1);
                users[userEmail].reputation = Math.max(0, (users[userEmail].reputation || 0) - 10);
                localStorage.setItem('gb:users', JSON.stringify(users));
            }

            loadProfile();
        }

        // Logout
        function logout() {
            localStorage.removeItem('gb:loggedIn');
            localStorage.removeItem('gb:userEmail');
            localStorage.removeItem('gb:userName');
            window.location.href = 'login.html';
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            loadProfile();
        });