// Global variables
        let currentCollege = 'nit';
        let experiences = [];
        let guidanceSessions = 0;
        let activeUsers = new Set();
        
        // Load saved data from localStorage
        function loadSavedData() {
            try {
                const savedExperiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
                experiences = savedExperiences;
                
                const savedGuidanceSessions = parseInt(localStorage.getItem('gb:guidanceSessions') || '0');
                guidanceSessions = savedGuidanceSessions;
                
                const savedActiveUsers = JSON.parse(localStorage.getItem('gb:activeUsers') || '[]');
                activeUsers = new Set(savedActiveUsers);
                
                // Update stats display
                updateStatsDisplay();
            } catch (e) {
                console.warn('Failed to load saved data:', e);
            }
        }
        
        // Save data to localStorage
        function saveData() {
            try {
                localStorage.setItem('gb:experiences', JSON.stringify(experiences));
                localStorage.setItem('gb:guidanceSessions', guidanceSessions.toString());
                localStorage.setItem('gb:activeUsers', JSON.stringify(Array.from(activeUsers)));
            } catch (e) {
                console.warn('Failed to save data:', e);
            }
        }
        
        // Update stats display
        function updateStatsDisplay() {
            const experienceCount = document.getElementById('experienceCount');
            const guidanceCount = document.getElementById('guidanceCount');
            
            if (experienceCount) experienceCount.textContent = experiences.length;
            if (guidanceCount) guidanceCount.textContent = guidanceSessions;
            
            // Update the other stats dynamically
            updateCommunityStats();
        }
        
        // Update community stats
        function updateCommunityStats() {
            const communityGrowth = document.querySelector('.stat-card:nth-child(3) .stat-number');
            const studentStories = document.querySelector('.stat-card:nth-child(4) .stat-number');
            
            if (communityGrowth) {
                if (activeUsers.size === 0) {
                    communityGrowth.textContent = 'Starting';
                } else if (activeUsers.size < 5) {
                    communityGrowth.textContent = 'Growing';
                } else if (activeUsers.size < 20) {
                    communityGrowth.textContent = 'Active';
                } else {
                    communityGrowth.textContent = 'Thriving';
                }
            }
            
            if (studentStories) {
                if (experiences.length === 0) {
                    studentStories.textContent = 'Real';
                } else if (experiences.length < 5) {
                    studentStories.textContent = 'Growing';
                } else if (experiences.length < 20) {
                    studentStories.textContent = 'Rich';
                } else {
                    studentStories.textContent = 'Vibrant';
                }
            }
        }
        
        // Track user activity
        function trackUserActivity() {
            const userEmail = localStorage.getItem('gb:userEmail') || 'anonymous';
            activeUsers.add(userEmail);
            saveData();
            updateStatsDisplay();
        }
        
        // Add visual feedback for stats updates
        function animateStatUpdate(statElement) {
            if (statElement) {
                statElement.style.transform = 'scale(1.1)';
                statElement.style.color = '#1e40af';
                setTimeout(() => {
                    statElement.style.transform = 'scale(1)';
                    statElement.style.color = '#1a202c';
                }, 300);
            }
        }
        
        // Show stats summary
        function showStatsSummary() {
            const summary = `
                📊 Current Stats:
                • Experiences Shared: ${experiences.length}
                • Guidance Sessions: ${guidanceSessions}
                • Active Users: ${activeUsers.size}
                • Last Updated: ${new Date().toLocaleString()}
            `;
            console.log(summary);
        }

        // Page Navigation
         function showPage(pageId, evt) {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));

            // Show selected page
            document.getElementById(pageId).classList.add('active');

            // Update navigation state
            updateNavigation(pageId);
            localStorage.setItem('gb:lastPage', pageId);
            
            // Track user activity
            trackUserActivity();
             
             // Load opportunities when opportunities page is shown
             if (pageId === 'opportunities' && allOpportunities.length === 0) {
                 fetchOpportunities();
             }
        }

        // Update navigation active state
        function updateNavigation(pageId) {
            // Remove active class from all nav items
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to corresponding nav item
            const activeNavItem = document.querySelector(`[onclick*="${pageId}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }
        }

        // College Selection
        function selectCollege(college, evt) {
            currentCollege = college;
            const buttons = document.querySelectorAll('.college-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            if (evt && evt.target) { evt.target.classList.add('active'); }
            
            // Update content based on selected college
            updateContentForCollege(college);
            localStorage.setItem('gb:college', college);
        }

        function updateContentForCollege(college) {
            // This would filter content based on selected college
            console.log(`Updated content for: ${college}`);
        }

        // AI Guidance Generation
        function generateGuidance() {
            const category = document.getElementById('guidanceCategory').value;
            const query = document.getElementById('guidanceQuery').value;
            
            if (!category || !query.trim()) {
                alert('Please select a category and enter your question.');
                return;
            }

            // Show loading state
            const resultDiv = document.getElementById('guidanceResult');
            const textDiv = document.getElementById('guidanceText');
            
            resultDiv.style.display = 'block';
            textDiv.innerHTML = '<div class="pulse">AI is processing experiences and generating guidance...</div>';
            
            // Simulate AI processing
            setTimeout(() => {
                const guidance = getAIGuidance(category, query);
                displayTypingEffect(textDiv, guidance);
                
                // Track guidance session
                guidanceSessions++;
                saveData();
                updateStatsDisplay();
            }, 2000);
        }

        function getAIGuidance(category, query) {
            // Simulate AI-generated guidance based on experiences
            const relevantExperiences = experiences.filter(exp => exp.category === category);
            
            let guidance = `Based on experiences shared by senior students:\n\n`;
            
            if (relevantExperiences.length > 0) {
                relevantExperiences.forEach((exp, index) => {
                    guidance += `💡 **Insight ${index + 1}:** ${exp.guidance}\n\n`;
                });
                
                                 guidance += `**Specific to your question:** `;
                
                // Category-specific responses
                switch(category) {
                    case 'academic':
                        guidance += 'Focus on understanding concepts rather than rote learning. Practice regularly and don\'t hesitate to ask for help from seniors and professors.';
                        break;
                    case 'placement':
                        guidance += 'Start preparation early, focus on both technical and soft skills. Practice coding daily and participate in mock interviews.';
                        break;
                    case 'internship':
                        guidance += 'Apply to multiple companies, customize your resume for each application, and leverage your network for referrals.';
                        break;
                    case 'projects':
                        guidance += 'Choose projects that align with your career goals. Focus on learning new technologies and documenting your work properly.';
                        break;
                    case 'campus':
                        guidance += 'Get involved in clubs and activities. Balance academics with extracurriculars and build meaningful relationships.';
                        break;
                    default:
                        guidance += 'Take advice from seniors, stay focused on your goals, and don\'t be afraid to make mistakes as they are learning opportunities.';
                }
            } else {
                guidance += `While we don't have specific experiences for "${category}" yet, here's general guidance: Stay persistent, seek help when needed, and remember that every senior was once in your position. Consider sharing your question in student forums or approaching seniors directly.`;
            }
            
            guidance += `\n\n🔊 This guidance is generated from real student experiences and processed by our AI to provide you with actionable advice.`;
            
            return guidance;
        }

        function displayTypingEffect(element, text) {
            element.innerHTML = '';
            element.classList.add('typing-demo');
            
            let i = 0;
            const speed = 30;
            
            function typeWriter() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    element.classList.remove('typing-demo');
                    // Convert markdown-like formatting to HTML
                    element.innerHTML = element.innerHTML
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br>');
                }
            }
            
            typeWriter();
        }

        function playGuidance() {
            const text = document.getElementById('guidanceText').textContent;
            
            // Check if browser supports speech synthesis
            if ('speechSynthesis' in window) {
                // Cancel any ongoing speech
                speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.8;
                utterance.pitch = 1;
                utterance.volume = 1;
                
                // Update button during speech
                const playBtn = event ? event.target : document.querySelector('.play-btn');
                playBtn.textContent = '⏸️ Playing...';
                playBtn.disabled = true;
                
                utterance.onend = function() {
                    playBtn.textContent = '🔊 Listen to Guidance';
                    playBtn.disabled = false;
                };
                
                speechSynthesis.speak(utterance);
            } else {
                alert('Speech synthesis is not supported in your browser. Please try a modern browser.');
            }
        }

        // Copy guidance
        function copyGuidance() {
            const text = document.getElementById('guidanceText').textContent.trim();
            if (!text) { showToast('Nothing to copy yet', 'error'); return; }
            navigator.clipboard.writeText(text)
                .then(() => showToast('Guidance copied to clipboard', 'success'))
                .catch(() => showToast('Copy failed', 'error'));
        }

        // Download guidance as .txt
        function downloadGuidance() {
            const text = document.getElementById('guidanceText').textContent.trim();
            if (!text) { showToast('Nothing to download yet', 'error'); return; }
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'guidance.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showToast('Guidance downloaded', 'success');
        }

        // Toast helper
        function showToast(message, type = 'success') {
            const container = document.getElementById('toastContainer');
            const el = document.createElement('div');
            el.className = `toast ${type}`;
            el.textContent = message;
            container.appendChild(el);
            setTimeout(() => el.remove(), 3600);
        }

        // Theme toggle with persistence
        function toggleTheme() {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('gb:dark', isDark ? '1' : '0');
            const btn = document.getElementById('themeToggle');
            if (btn) {
                btn.textContent = isDark ? '☀️' : '🌙';
            }
        }

        function submitExperience() {
            const category = document.getElementById('experienceCategory').value;
            const title = document.getElementById('experienceTitle').value;
            const details = document.getElementById('experienceDetails').value;
            const takeaways = document.getElementById('keyTakeaways').value;
            const year = document.getElementById('studentYear').value;
            const college = document.getElementById('experienceCollege').value;
            
            if (!category || !title || !details || !takeaways || !year) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            const experience = {
                id: Date.now(),
                category,
                title,
                details,
                takeaways,
                year,
                college: college || '', // Optional college selection
                timestamp: new Date().toISOString(),
                author: localStorage.getItem('gb:userName') || 'Anonymous'
            };
            
            // Save to localStorage
            const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
            experiences.unshift(experience);
            localStorage.setItem('gb:experiences', JSON.stringify(experiences));
            
            // Update experience count
            const currentCount = parseInt(localStorage.getItem('gb:experienceCount') || '0');
            localStorage.setItem('gb:experienceCount', (currentCount + 1).toString());
            updateExperienceCount();
            
            // Clear form
            document.getElementById('experienceCategory').value = '';
            document.getElementById('experienceTitle').value = '';
            document.getElementById('experienceDetails').value = '';
            document.getElementById('keyTakeaways').value = '';
            document.getElementById('studentYear').value = '';
            document.getElementById('experienceCollege').value = '';
            
            // Show success message with college info
            const collegeMsg = college ? ` for ${college.toUpperCase()}` : '';
            showToast(`Experience shared successfully${collegeMsg}! 🎉`, 'success');
            
            // Refresh recent experiences display
            loadRecentExperiences();
            
            // If current filter matches the submitted experience, refresh the filtered view
            if (currentCollegeFilter === college || (currentCollegeFilter === 'all' && !college)) {
                filterExperiencesByCollege(currentCollegeFilter);
            }
        }
         
         function updateStats() {
             const experienceCountEl = document.getElementById('experienceCount');
             const guidanceCountEl = document.getElementById('guidanceCount');
             
             if (experienceCountEl) {
                 experienceCountEl.textContent = experiences.length;
             }
             
             if (guidanceCountEl) {
                 // Calculate guidance sessions (each experience can generate multiple guidance sessions)
                 const guidanceCount = experiences.length * 3; // Estimate 3 guidance sessions per experience
                 guidanceCountEl.textContent = guidanceCount;
             }
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
             // Check login status
             checkLoginStatus();
             
             // Load saved data first
             loadSavedData();
             
             // Fetch real opportunities
             fetchOpportunities();
        });
        
        // Profile Management Functions
        function showPage(pageId, event) {
            if (event) {
                event.preventDefault();
            }
            
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show selected page
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
            // Update navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            if (event && event.target) {
                event.target.classList.add('active');
            }
            
            // Handle college navigation visibility
            const collegeNav = document.querySelector('.college-nav');
            const content = document.querySelector('.content');
            
            if (pageId === 'home') {
                // Show college navigation on home page
                collegeNav.classList.remove('hidden');
                content.classList.remove('no-college-nav');
            } else {
                // Hide college navigation on other pages
                collegeNav.classList.add('hidden');
                content.classList.add('no-college-nav');
            }
            
            // Load page-specific content
            if (pageId === 'share') {
                loadRecentExperiences();
            } else if (pageId === 'profile') {
                loadProfileData();
                loadProfileOverview();
            } else if (pageId === 'opportunities') {
                fetchOpportunities();
            } else if (pageId === 'nit') {
                loadNiTExperiences();
            }
        }
        
        function loadProfileData() {
            const userEmail = localStorage.getItem('gb:userEmail');
            const userName = localStorage.getItem('gb:userName');
            const userProfile = JSON.parse(localStorage.getItem('gb:userProfile') || '{}');
            const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
            const userExperiences = experiences.filter(exp => exp.authorEmail === userEmail);
            
            if (userName) {
                const profileNameEl = document.getElementById('profileName');
                const profileEmailEl = document.getElementById('profileEmail');
                const profileAvatarEl = document.getElementById('profileAvatar');
                const profileExperiencesEl = document.getElementById('profileExperiences');
                const memberSinceEl = document.getElementById('memberSince');
                
                if (profileNameEl) profileNameEl.textContent = userName;
                if (profileEmailEl) profileEmailEl.textContent = userEmail;
                if (profileAvatarEl) profileAvatarEl.textContent = userName.charAt(0).toUpperCase();
                
                // Update stats with proper calculations
                if (profileExperiencesEl) profileExperiencesEl.textContent = userExperiences.length;
                
                // Update member since
                if (memberSinceEl) {
                    const joinDate = userProfile.joinDate || new Date().toISOString();
                    const date = new Date(joinDate);
                    memberSinceEl.textContent = `Member since ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
                }
            }
        }
        
        function loadProfileOverview() {
            const userProfile = JSON.parse(localStorage.getItem('gb:userProfile') || '{}');
            
            // Load bio
            const bioElement = document.getElementById('profileBio');
            if (bioElement) {
                if (userProfile.bio) {
                    bioElement.textContent = userProfile.bio;
                    bioElement.classList.remove('empty-state');
                } else {
                    bioElement.textContent = "No bio added yet. Click 'Edit Profile' to add your bio.";
                    bioElement.classList.add('empty-state');
                }
            }
            
            // Load education
            const educationElement = document.getElementById('profileEducation');
            if (educationElement) {
                if (userProfile.university || userProfile.degree) {
                    educationElement.innerHTML = `
                        <div class="education-item">
                            ${userProfile.degree || 'Degree'} at ${userProfile.university || 'University'}
                            ${userProfile.year ? ` • ${userProfile.year}` : ''}
                        </div>
                    `;
                } else {
                    educationElement.innerHTML = '<p class="empty-state">No education information added yet.</p>';
                }
            }
            
            // Load skills
            const skillsElement = document.getElementById('profileSkills');
            if (skillsElement) {
                if (userProfile.skills && userProfile.skills.length > 0) {
                    skillsElement.innerHTML = userProfile.skills.map(skill => 
                        `<span class="skill-tag">${skill.trim()}</span>`
                    ).join('');
                } else {
                    skillsElement.innerHTML = '<p class="empty-state">No skills added yet.</p>';
                }
            }
            
            // Load achievements
            const achievementsElement = document.getElementById('profileAchievements');
            if (achievementsElement) {
                const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
                const userEmail = localStorage.getItem('gb:userEmail');
                const userExperiences = experiences.filter(exp => exp.authorEmail === userEmail);
                
                if (userExperiences.length > 0) {
                    const achievements = [];
                    if (userExperiences.length >= 1) achievements.push('First Experience Shared');
                    if (userExperiences.length >= 5) achievements.push('Active Contributor');
                    if (userExperiences.length >= 10) achievements.push('Experience Master');
                    
                    const totalViews = userExperiences.reduce((sum, exp) => sum + (exp.views || 0), 0);
                    if (totalViews >= 50) achievements.push('Popular Content Creator');
                    
                    if (achievements.length > 0) {
                        achievementsElement.innerHTML = achievements.map(achievement => 
                            `<span class="achievement-item">${achievement}</span>`
                        ).join('');
                    } else {
                        achievementsElement.innerHTML = '<p class="empty-state">Share experiences to unlock achievements!</p>';
                    }
                } else {
                    achievementsElement.innerHTML = '<p class="empty-state">Share experiences to unlock achievements!</p>';
                }
            }
        }
        
        function loadProfileEditForm() {
            const userProfile = JSON.parse(localStorage.getItem('gb:userProfile') || '{}');
            
            // Populate form fields with null checks
            const editBio = document.getElementById('editBio');
            const editUniversity = document.getElementById('editUniversity');
            const editDegree = document.getElementById('editDegree');
            const editYear = document.getElementById('editYear');
            const editSkills = document.getElementById('editSkills');
            const editInterests = document.getElementById('editInterests');
            const editLocation = document.getElementById('editLocation');
            const editLinkedIn = document.getElementById('editLinkedIn');
            const editGitHub = document.getElementById('editGitHub');
            
            if (editBio) editBio.value = userProfile.bio || '';
            if (editUniversity) editUniversity.value = userProfile.university || '';
            if (editDegree) editDegree.value = userProfile.degree || '';
            if (editYear) editYear.value = userProfile.year || '';
            if (editSkills) editSkills.value = userProfile.skills ? userProfile.skills.join(', ') : '';
            if (editInterests) editInterests.value = userProfile.interests ? userProfile.interests.join(', ') : '';
            if (editLocation) editLocation.value = userProfile.location || '';
            if (editLinkedIn) editLinkedIn.value = userProfile.linkedin || '';
            if (editGitHub) editGitHub.value = userProfile.github || '';
        }
        
        function loadUserExperiences() {
            const userEmail = localStorage.getItem('gb:userEmail');
            const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
            const userExperiences = experiences.filter(exp => exp.authorEmail === userEmail);
            
            const listElement = document.getElementById('userExperiencesList');
            if (!listElement) return;
            
            if (userExperiences.length === 0) {
                listElement.innerHTML = '<p class="empty-state">No experiences shared yet. Share your first experience!</p>';
                return;
            }
            
            listElement.innerHTML = userExperiences.map(exp => {
                const date = new Date(exp.date);
                return `
                    <div class="user-experience-card">
                        <h4>${exp.title}</h4>
                        <p>${exp.content.length > 200 ? exp.content.substring(0, 200) + '...' : exp.content}</p>
                        <div class="experience-meta">
                            <span>Category: ${exp.category || 'General'} • ${date.toLocaleDateString()} • ${exp.views || 0} views</span>
                            <button class="delete-btn" onclick="deleteExperience('${exp.id}')">Delete</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        function deleteExperience(experienceId) {
            if (!confirm('Are you sure you want to delete this experience?')) {
                return;
            }
            
            const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
            const updatedExperiences = experiences.filter(exp => exp.id !== experienceId);
            localStorage.setItem('gb:experiences', JSON.stringify(updatedExperiences));
            
            // Reload experiences list
            loadUserExperiences();
            loadSharedExperiences(); // Update home page
            loadProfileData(); // Update stats
        }
        
        // Toast notification function
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            
            // Toast styles
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            
            document.body.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }
        
        // Initialize profile forms when page loads
        function initializeProfileForms() {
            // Profile edit form
            const profileEditForm = document.getElementById('profileEditForm');
            if (profileEditForm) {
                profileEditForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const editBio = document.getElementById('editBio');
                    const editUniversity = document.getElementById('editUniversity');
                    const editDegree = document.getElementById('editDegree');
                    const editYear = document.getElementById('editYear');
                    const editSkills = document.getElementById('editSkills');
                    const editInterests = document.getElementById('editInterests');
                    const editLocation = document.getElementById('editLocation');
                    const editLinkedIn = document.getElementById('editLinkedIn');
                    const editGitHub = document.getElementById('editGitHub');
                    
                    const userProfile = {
                        bio: editBio ? editBio.value : '',
                        university: editUniversity ? editUniversity.value : '',
                        degree: editDegree ? editDegree.value : '',
                        year: editYear ? editYear.value : '',
                        skills: editSkills ? editSkills.value.split(',').map(s => s.trim()).filter(s => s) : [],
                        interests: editInterests ? editInterests.value.split(',').map(s => s.trim()).filter(s => s) : [],
                        location: editLocation ? editLocation.value : '',
                        linkedin: editLinkedIn ? editLinkedIn.value : '',
                        github: editGitHub ? editGitHub.value : '',
                        joinDate: JSON.parse(localStorage.getItem('gb:userProfile') || '{}').joinDate || new Date().toISOString()
                    };
                    
                    localStorage.setItem('gb:userProfile', JSON.stringify(userProfile));
                    
                    // Show success message
                    showToast('Profile updated successfully!', 'success');
                    
                    // Switch to overview tab and reload data
                    loadProfileData();
                    loadProfileOverview();
                    
                    // Switch to overview tab
                    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                    document.getElementById('overviewTab').classList.add('active');
                    document.querySelector('.tab-btn').classList.add('active');
                });
            }
            
            // Share experience form
            const shareExperienceForm = document.getElementById('shareExperienceForm');
            if (shareExperienceForm) {
                shareExperienceForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const userEmail = localStorage.getItem('gb:userEmail');
                    const userName = localStorage.getItem('gb:userName');
                    
                    if (!userEmail) {
                        showToast('Please log in to share experiences', 'error');
                        return;
                    }
                    
                    const titleEl = document.getElementById('experienceTitle');
                    const contentEl = document.getElementById('experienceContent');
                    const categoryEl = document.getElementById('experienceCategory');
                    
                    if (!titleEl || !contentEl || !titleEl.value.trim() || !contentEl.value.trim()) {
                        showToast('Please fill in all required fields', 'error');
                        return;
                    }
                    
                    const experience = {
                        id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        title: titleEl.value.trim(),
                        content: contentEl.value.trim(),
                        category: categoryEl ? categoryEl.value : 'General',
                        authorName: userName,
                        authorEmail: userEmail,
                        date: new Date().toISOString(),
                        views: 0
                    };
                    
                    const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
                    experiences.unshift(experience); // Add to beginning
                    localStorage.setItem('gb:experiences', JSON.stringify(experiences));
                    
                    // Update user reputation
                    const userProfile = JSON.parse(localStorage.getItem('gb:userProfile') || '{}');
                    userProfile.reputation = (userProfile.reputation || 0) + 10;
                    localStorage.setItem('gb:userProfile', JSON.stringify(userProfile));
                    
                    // Clear form
                    shareExperienceForm.reset();
                    
                    // Show success message
                    showToast('Experience shared successfully!', 'success');
                    
                    // Reload data
                    loadUserExperiences();
                    loadSharedExperiences();
                    loadProfileData();
                    loadProfileOverview();
                });
            }
        }
        
        // College Navigation Functions
        function selectCollegeNav(college) {
            // Update active button
            document.querySelectorAll('.college-nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Handle college selection
            if (college === 'nit') {
                // Show NiT experiences
                showCollegeExperiences('nit');
                showToast('Showing NiT experiences', 'success');
            } else {
                // Show coming soon for other colleges
                showToast('Coming soon! This college will be available in future updates.', 'info');
            }
        }
        
        function showCollegeExperiences(college) {
            const collegeExperiences = experiences.filter(exp => exp.college === college);
            
            if (collegeExperiences.length === 0) {
                showToast('No experiences shared for this college yet. Be the first to share!', 'info');
                return;
            }
            
            // Create a modal or section to show college-specific experiences
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;
            
            const content = document.createElement('div');
            content.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 20px;
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            `;
            
            if (document.body.classList.contains('dark-mode')) {
                content.style.background = 'rgba(30, 41, 59, 0.95)';
                content.style.color = '#f1f5f9';
                content.style.border = '1px solid rgba(148, 163, 184, 0.2)';
            }
            
            content.innerHTML = `
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: inherit;
                ">×</button>
                <h2>NiT Experiences (${collegeExperiences.length})</h2>
                <div style="margin-top: 20px;">
                    ${collegeExperiences.map(exp => `
                        <div style="
                            background: rgba(248, 250, 252, 0.8);
                            padding: 20px;
                            border-radius: 12px;
                            margin-bottom: 15px;
                            border-left: 4px solid #4f46e5;
                        ">
                            <h4>${exp.title}</h4>
                            <p style="color: #64748b; margin: 10px 0;">${exp.category} • ${exp.year} Year</p>
                            <p>${exp.content.length > 200 ? exp.content.substring(0, 200) + '...' : exp.content}</p>
                            <p style="margin-top: 15px; font-weight: 600; color: #4f46e5;">Key Takeaways:</p>
                            <p>${exp.guidance}</p>
                        </div>
                    `).join('')}
                </div>
            `;
            
            modal.appendChild(content);
            document.body.appendChild(modal);
            
            // Close on background click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
        
        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            checkLoginStatus();
            showPage('home');
            loadSharedExperiences();
            
            // Initialize theme
            const savedTheme = localStorage.getItem('gb:theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) {
                    themeToggle.textContent = '☀️';
                }
            }
            
            // Load profile data if logged in
            const isLoggedIn = localStorage.getItem('gb:loggedIn') === 'true';
            if (isLoggedIn) {
                loadProfileData();
                // Initialize profile forms after a short delay to ensure DOM is ready
                setTimeout(initializeProfileForms, 100);
            }
            
            // Initialize profile forms for when user logs in later
            initializeProfileForms();
        });

                 // Real opportunities data and functions
         let allOpportunities = [];
         let filteredOpportunities = [];
         let autoRefreshInterval = null;
         let autoRefreshEnabled = true;

         // Fetch opportunities from multiple sources
         async function fetchOpportunities() {
             const loadingDiv = document.getElementById('opportunitiesLoading');
             const containerDiv = document.getElementById('opportunitiesContainer');
             const noOppsDiv = document.getElementById('noOpportunities');
             
             loadingDiv.style.display = 'block';
             containerDiv.innerHTML = '';
             noOppsDiv.style.display = 'none';

             try {
                 const opportunities = [];
                 
                 // Fetch from GitHub Jobs API (free and reliable)
                 try {
                     const githubResponse = await fetch('https://jobs.github.com/positions.json?description=intern&location=remote');
                     const githubJobs = await githubResponse.json();
                     
                     githubJobs.slice(0, 10).forEach(job => {
                         opportunities.push({
                             id: job.id,
                             title: job.title,
                             company: job.company,
                             location: job.location,
                             type: job.type || 'Full-time',
                             description: job.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                             url: job.url,
                             created_at: job.created_at,
                             source: 'GitHub Jobs',
                             category: job.title.toLowerCase().includes('intern') ? 'internship' : 'job',
                             isRemote: job.location.toLowerCase().includes('remote') || job.title.toLowerCase().includes('remote')
                         });
                     });
                 } catch (e) {
                     console.warn('GitHub Jobs API failed:', e);
                 }

                 // Fetch from Adzuna API (free tier available)
                 try {
                     const adzunaResponse = await fetch('https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY&results_per_page=10&what=software%20intern&content-type=application/json');
                     // Note: You'll need to sign up for free API keys at adzuna.com
                     // For demo, we'll use mock data
                     const mockAdzunaJobs = [
                         {
                             id: 'adz-1',
                             title: 'Software Engineering Intern',
                             company: 'TechCorp',
                             location: 'London, UK',
                             type: 'Internship',
                             description: 'Join our dynamic team for a summer internship in software engineering...',
                             url: 'https://example.com/apply',
                             created_at: new Date().toISOString(),
                             source: 'Adzuna',
                             category: 'internship',
                             isRemote: false
                         }
                     ];
                     opportunities.push(...mockAdzunaJobs);
                 } catch (e) {
                     console.warn('Adzuna API failed:', e);
                 }

                 // Add some realistic opportunities from well-known companies
                 const realisticOpportunities = [
                     {
                         id: 'real-1',
                         title: 'Software Engineering Intern',
                         company: 'Google',
                         location: 'Mountain View, CA (Remote Available)',
                         type: 'Internship',
                         description: 'Join Google for a 12-week summer internship. Work on real projects that impact millions of users worldwide. Open to students pursuing Computer Science or related fields.',
                         url: 'https://careers.google.com/jobs/results/',
                         created_at: new Date(Date.now() - 86400000).toISOString(),
                         source: 'Google Careers',
                         category: 'internship',
                         isRemote: true
                     },
                     {
                         id: 'real-2',
                         title: 'Frontend Developer Intern',
                         company: 'Meta',
                         location: 'Menlo Park, CA',
                         type: 'Internship',
                         description: 'Build the next generation of social media experiences. Work with React, JavaScript, and cutting-edge web technologies.',
                         url: 'https://www.metacareers.com/',
                         created_at: new Date(Date.now() - 172800000).toISOString(),
                         source: 'Meta Careers',
                         category: 'internship',
                         isRemote: false
                     },
                     {
                         id: 'real-3',
                         title: 'Junior Software Engineer',
                         company: 'Microsoft',
                         location: 'Redmond, WA (Hybrid)',
                         type: 'Full-time',
                         description: 'Start your career at Microsoft. Work on Azure, Windows, or Office products. Great benefits and learning opportunities.',
                         url: 'https://careers.microsoft.com/',
                         created_at: new Date(Date.now() - 259200000).toISOString(),
                         source: 'Microsoft Careers',
                         category: 'job',
                         isRemote: false
                     },
                     {
                         id: 'real-4',
                         title: 'Remote Software Developer',
                         company: 'GitHub',
                         location: 'Remote',
                         type: 'Full-time',
                         description: 'Join GitHub and help build the future of software development. Work from anywhere in the world.',
                         url: 'https://github.com/about/careers',
                         created_at: new Date(Date.now() - 345600000).toISOString(),
                         source: 'GitHub Careers',
                         category: 'job',
                         isRemote: true
                     },
                     {
                         id: 'real-5',
                         title: 'Data Science Intern',
                         company: 'Netflix',
                         location: 'Los Gatos, CA',
                         type: 'Internship',
                         description: 'Help Netflix understand user behavior and improve content recommendations. Work with big data and machine learning.',
                         url: 'https://jobs.netflix.com/',
                         created_at: new Date(Date.now() - 432000000).toISOString(),
                         source: 'Netflix Careers',
                         category: 'internship',
                         isRemote: false
                     }
                 ];
                 
                 opportunities.push(...realisticOpportunities);
                 
                 // Sort by creation date (newest first)
                 opportunities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                 
                 allOpportunities = opportunities;
                 filteredOpportunities = [...opportunities];
                 
                 displayOpportunities();
                 
             } catch (error) {
                 console.error('Error fetching opportunities:', error);
                 showToast('Failed to load opportunities. Please try again.', 'error');
                 
                 // Show fallback opportunities
                 allOpportunities = [
                     {
                         id: 'fallback-1',
                         title: 'Software Engineering Intern',
                         company: 'Example Tech',
                         location: 'San Francisco, CA',
                         type: 'Internship',
                         description: 'Join our team for an exciting internship opportunity in software engineering.',
                         url: 'https://example.com',
                         created_at: new Date().toISOString(),
                         source: 'Example',
                         category: 'internship',
                         isRemote: false
                     }
                 ];
                 filteredOpportunities = [...allOpportunities];
                 displayOpportunities();
             } finally {
                 loadingDiv.style.display = 'none';
             }
         }

         function displayOpportunities() {
             const containerDiv = document.getElementById('opportunitiesContainer');
             const noOppsDiv = document.getElementById('noOpportunities');
             
             if (filteredOpportunities.length === 0) {
                 containerDiv.innerHTML = '';
                 noOppsDiv.style.display = 'block';
                 return;
             }
             
             noOppsDiv.style.display = 'none';
             
             containerDiv.innerHTML = filteredOpportunities.map(opp => `
                 <div class="opportunity-card" data-category="${opp.category}" data-remote="${opp.isRemote}">
                     <div class="opportunity-type">${getOpportunityIcon(opp.category)} ${opp.type}</div>
                     <h3>${opp.title} - ${opp.company}</h3>
                     <p><strong>📍 Location:</strong> ${opp.location}</p>
                     <p><strong>📅 Posted:</strong> ${formatDate(opp.created_at)}</p>
                     <p><strong>🏢 Source:</strong> ${opp.source}</p>
                     <p>${opp.description}</p>
                     <div style="display: flex; gap: 10px; margin-top: 15px;">
                         <button class="btn" onclick="window.open('${opp.url}', '_blank')">🔗 Apply Now</button>
                         <button class="btn secondary-btn" onclick="saveOpportunity('${opp.id}')">💾 Save</button>
                     </div>
                 </div>
             `).join('');
         }

         function getOpportunityIcon(category) {
             switch(category) {
                 case 'internship': return '🚀';
                 case 'job': return '💼';
                 case 'remote': return '🏠';
                 case 'entry': return '●';
                 default: return '💼';
             }
         }

         function formatDate(dateString) {
             const date = new Date(dateString);
             const now = new Date();
             const diffTime = Math.abs(now - date);
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
             
             if (diffDays === 1) return 'Today';
             if (diffDays === 2) return 'Yesterday';
             if (diffDays <= 7) return `${diffDays - 1} days ago`;
             return date.toLocaleDateString();
         }

         function filterOpportunities() {
             const filter = document.getElementById('opportunityFilter').value;
             
             if (filter === 'all') {
                 filteredOpportunities = [...allOpportunities];
             } else {
                 filteredOpportunities = allOpportunities.filter(opp => {
                     switch(filter) {
                         case 'internship':
                             return opp.category === 'internship';
                         case 'job':
                             return opp.category === 'job';
                         case 'remote':
                             return opp.isRemote;
                         case 'entry':
                             return opp.title.toLowerCase().includes('junior') || 
                                    opp.title.toLowerCase().includes('entry') ||
                                    opp.title.toLowerCase().includes('graduate');
                         default:
                             return true;
                     }
                 });
             }
             
             displayOpportunities();
         }

         function refreshOpportunities() {
             fetchOpportunities();
             showToast('Opportunities refreshed!', 'success');
         }

         function toggleAutoRefresh() {
             autoRefreshEnabled = !autoRefreshEnabled;
             const statusSpan = document.getElementById('autoRefreshStatus');
             statusSpan.textContent = autoRefreshEnabled ? 'ON' : 'OFF';
             
             if (autoRefreshEnabled) {
                 if (!autoRefreshInterval) {
                     autoRefreshInterval = setInterval(refreshOpportunities, 300000); // 5 minutes
                 }
                 showToast('Auto-refresh enabled', 'success');
             } else {
                 if (autoRefreshInterval) {
                     clearInterval(autoRefreshInterval);
                     autoRefreshInterval = null;
                 }
                 showToast('Auto-refresh disabled', 'success');
             }
         }

         function saveOpportunity(opportunityId) {
             const saved = JSON.parse(localStorage.getItem('gb:savedOpportunities') || '[]');
             if (!saved.includes(opportunityId)) {
                 saved.push(opportunityId);
                 localStorage.setItem('gb:savedOpportunities', JSON.stringify(saved));
                 showToast('Opportunity saved!', 'success');
             } else {
                 showToast('Already saved!', 'success');
             }
         }

         // Auto-refresh opportunities every 5 minutes
        setInterval(() => {
             if (autoRefreshEnabled && document.getElementById('opportunities').classList.contains('active')) {
                 fetchOpportunities();
             }
         }, 300000);

        // College experience filtering
        let currentCollegeFilter = 'all';

        function showCollegeExperiences(college) {
            // Update active button
            document.querySelectorAll('.college-btn').forEach(btn => btn.classList.remove('active'));
            event.target.closest('.college-btn').classList.add('active');
            
            const collegeNames = {
                'nit': 'NiT',
                'nearby': 'Nearby Universities',
                'schools': 'Schools',
                'state': 'State Level',
                'national': 'National & Global'
            };
            
            if (college === 'nit') {
                // Open NiT experiences page
                showPage('nit', event);
                loadNiTExperiences();
                showToast(`Welcome to ${collegeNames[college]} Experiences`, 'success');
            } else {
                showToast(`${collegeNames[college]} - Coming Soon!`, 'info');
            }
        }

        function filterExperiencesByCollege(college) {
            const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
            let filteredExperiences;
            
            if (college === 'all' || college === 'nit') {
                // Show NiT experiences or all experiences
                filteredExperiences = experiences.filter(exp => 
                    college === 'all' ? true : exp.college === 'nit'
                );
            } else {
                // For other colleges, show empty state for now
                filteredExperiences = [];
            }
            
            displayFilteredExperiences(filteredExperiences, college);
        }

        function displayFilteredExperiences(experiences, college) {
            const container = document.getElementById('recentExperiences');
            if (!container) return;
            
            if (experiences.length === 0) {
                const collegeNames = {
                    'nit': 'NiT',
                    'nearby': 'Nearby Universities',
                    'schools': 'Schools',
                    'state': 'State Level',
                    'national': 'National & Global'
                };
                
                if (college === 'nit') {
                    container.innerHTML = `
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 10px 0; text-align: center; color: #666;">
                            <p>No ${collegeNames[college]} experiences shared yet.</p>
                            <p style="font-size: 0.9rem; margin-top: 10px;">Be the first to share your ${collegeNames[college]} experience!</p>
                        </div>
                    `;
                } else {
                    container.innerHTML = `
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 10px 0; text-align: center; color: #666;">
                            <p>${collegeNames[college]} - Coming Soon!</p>
                            <p style="font-size: 0.9rem; margin-top: 10px;">We're expanding to more institutions. Stay tuned!</p>
                        </div>
                    `;
                }
            } else {
                container.innerHTML = experiences.map(exp => `
                    <div class="user-experience-card">
                        <h4>${exp.title}</h4>
                        <p>${exp.details.substring(0, 200)}${exp.details.length > 200 ? '...' : ''}</p>
                        <div class="experience-meta">
                            <span>${exp.category} • ${exp.college ? exp.college.toUpperCase() : 'General'}</span>
                            <span>${new Date(exp.timestamp).toLocaleDateString()}</span>
                        </div>
                    </div>
                `).join('');
            }
        }

        // NiT-specific experience functions
        function submitNiTExperience() {
            const category = document.getElementById('nitExperienceCategory').value;
            const title = document.getElementById('nitExperienceTitle').value;
            const details = document.getElementById('nitExperienceDetails').value;
            const takeaways = document.getElementById('nitKeyTakeaways').value;
            const year = document.getElementById('nitStudentYear').value;
            
            if (!category || !title || !details || !takeaways || !year) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            const experience = {
                id: Date.now(),
                category,
                title,
                details,
                takeaways,
                year,
                college: 'nit', // Always NiT for this page
                timestamp: new Date().toISOString(),
                author: localStorage.getItem('gb:userName') || 'Anonymous'
            };
            
            // Save to localStorage
            const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
            experiences.unshift(experience);
            localStorage.setItem('gb:experiences', JSON.stringify(experiences));
            
            // Update experience count
            const currentCount = parseInt(localStorage.getItem('gb:experienceCount') || '0');
            localStorage.setItem('gb:experienceCount', (currentCount + 1).toString());
            updateExperienceCount();
            
            // Clear form
            document.getElementById('nitExperienceCategory').value = '';
            document.getElementById('nitExperienceTitle').value = '';
            document.getElementById('nitExperienceDetails').value = '';
            document.getElementById('nitKeyTakeaways').value = '';
            document.getElementById('nitStudentYear').value = '';
            
            // Show success message
            showToast('NiT Experience shared successfully! 🎉', 'success');
            
            // Refresh NiT experiences display
            loadNiTExperiences();
        }

        function loadNiTExperiences() {
            const experiences = JSON.parse(localStorage.getItem('gb:experiences') || '[]');
            const nitExperiences = experiences.filter(exp => exp.college === 'nit');
            const container = document.getElementById('nitExperiences');
            
            if (!container) return;
            
            if (nitExperiences.length === 0) {
                container.innerHTML = `
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 10px 0; text-align: center; color: #666;">
                        <p>No NiT experiences shared yet. Be the first to share your valuable NiT experience!</p>
                        <p style="font-size: 0.9rem; margin-top: 10px;">Your experience will help junior NiT students and generate AI guidance for the community.</p>
                    </div>
                `;
            } else {
                container.innerHTML = nitExperiences.map(exp => `
                    <div class="user-experience-card">
                        <h4>${exp.title}</h4>
                        <p>${exp.details.substring(0, 200)}${exp.details.length > 200 ? '...' : ''}</p>
                        <div class="experience-meta">
                            <span>${exp.category} • ${exp.year} Year • NiT</span>
                            <span>${new Date(exp.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0,0,0,0.1);">
                            <strong>Key Takeaways:</strong>
                            <p style="margin-top: 8px; font-style: italic; color: #666;">${exp.takeaways}</p>
                        </div>
                    </div>
                `).join('');
            }
        }

                // Login/Logout functions
        function checkLoginStatus() {
            const isLoggedIn = localStorage.getItem('gb:loggedIn') === 'true';
            const userEmail = localStorage.getItem('gb:userEmail');
            const userName = localStorage.getItem('gb:userName');
            
            if (isLoggedIn && userEmail) {
                document.getElementById('userProfile').style.display = 'block';
                document.getElementById('loginButtons').style.display = 'none';
                document.getElementById('profileNavItem').style.display = 'block';
                document.getElementById('userEmail').textContent = userName || userEmail;
            } else {
                document.getElementById('userProfile').style.display = 'none';
                document.getElementById('loginButtons').style.display = 'flex';
                document.getElementById('profileNavItem').style.display = 'none';
            }
        }

        function logout() {
            localStorage.removeItem('gb:loggedIn');
            localStorage.removeItem('gb:userEmail');
            localStorage.removeItem('gb:userName');
            window.location.href = 'login.html';
        }

        // Navbar scroll behavior
        let lastScrollTop = 0;
        let scrollThreshold = 5; // Minimum scroll distance to trigger hide/show
        let isScrolling = false;

        function handleNavbarScroll() {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const header = document.querySelector('header');
            const collegeNav = document.querySelector('.college-nav');
            
            // Prevent negative scrollTop values
            if (currentScrollTop < 0) return;
            
            // Only trigger on significant scroll changes
            if (Math.abs(currentScrollTop - lastScrollTop) < scrollThreshold) return;
            
            // Show navbar and college nav when at top of page
            if (currentScrollTop <= 100) {
                header.classList.remove('hidden');
                if (collegeNav) collegeNav.classList.remove('scroll-hidden');
            }
            // Hide navbar and college nav when scrolling down, show when scrolling up
            else if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                // Scrolling down - hide both navbar and college nav
                header.classList.add('hidden');
                if (collegeNav) collegeNav.classList.add('scroll-hidden');
            } else if (currentScrollTop < lastScrollTop) {
                // Scrolling up - show both navbar and college nav
                header.classList.remove('hidden');
                if (collegeNav) collegeNav.classList.remove('scroll-hidden');
            }
            
            lastScrollTop = currentScrollTop;
        }

        // Throttle scroll events for better performance
        function throttleScroll() {
            if (!isScrolling) {
                window.requestAnimationFrame(handleNavbarScroll);
                isScrolling = true;
                setTimeout(() => {
                    isScrolling = false;
                }, 16); // ~60fps
            }
        }

        // Add scroll event listener when page loads
        window.addEventListener('scroll', throttleScroll, { passive: true });