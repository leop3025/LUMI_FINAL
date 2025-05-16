function startLearning() {
    window.location.href = "courses.html"; // Redirect to courses page
}
window.onload = () => {
  createBubbles();
  createFish();
};

function createBubbles() {
  const bubbleCount = 20;
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = Math.random() * 15 + 5;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    document.body.appendChild(bubble);
  }
}

function createFish() {
  const fishCount = 4;
  const fishTypes = ['🐠', '🐟', '🐡', '🦈'];
  for (let i = 0; i < fishCount; i++) {
    const fish = document.createElement('div');
    fish.classList.add('fish');
    fish.textContent = fishTypes[i % fishTypes.length];
    fish.style.fontSize = `${Math.random() * 20 + 30}px`;
    fish.style.top = `${Math.random() * 70 + 15}vh`;
    fish.style.animationDuration = `${Math.random() * 20 + 20}s`;
    fish.style.animationDelay = `${Math.random() * 10}s`;
    document.body.appendChild(fish);
  }
}

function showActivities() {
  document.getElementById("btnActivities").classList.add("bg-blue-500", "text-white");
  document.getElementById("btnActivities").classList.remove("bg-blue-100", "text-blue-600");
  document.getElementById("btnVocab").classList.add("bg-blue-100", "text-blue-600");
  document.getElementById("btnVocab").classList.remove("bg-blue-500", "text-white");
  document.getElementById("activityGrid").classList.remove("hidden");
  document.getElementById("vocabGrid").classList.add("hidden");
}

function showVocab() {
  document.getElementById("btnVocab").classList.add("bg-blue-500", "text-white");
  document.getElementById("btnVocab").classList.remove("bg-blue-100", "text-blue-600");
  document.getElementById("btnActivities").classList.add("bg-blue-100", "text-blue-600");
  document.getElementById("btnActivities").classList.remove("bg-blue-500", "text-white");
  document.getElementById("activityGrid").classList.add("hidden");
  document.getElementById("vocabGrid").classList.remove("hidden");
}

// User Progress Tracking System
const userProgress = {
    level: 1,
    xp: 0,
    achievements: [],
    completedLessons: [],
    streak: 0,
    lastLogin: new Date(),
    
    // XP required for each level
    xpPerLevel: [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000],
    
    // Add XP and check for level up
    addXP(amount) {
        this.xp += amount;
        this.checkLevelUp();
        this.saveProgress();
    },
    
    // Check if user has leveled up
    checkLevelUp() {
        while (this.xp >= this.xpPerLevel[this.level]) {
            this.level++;
            this.unlockAchievement(`Reached Level ${this.level}`);
            this.showLevelUpNotification();
        }
    },
    
    // Unlock achievements
    unlockAchievement(name) {
        if (!this.achievements.includes(name)) {
            this.achievements.push(name);
            this.showAchievementNotification(name);
        }
    },
    
    // Complete a lesson
    completeLesson(lessonId) {
        if (!this.completedLessons.includes(lessonId)) {
            this.completedLessons.push(lessonId);
            this.addXP(50); // Base XP for completing a lesson
            this.unlockAchievement(`Completed ${lessonId}`);
        }
    },
    
    // Update login streak
    updateStreak() {
        const today = new Date();
        const lastLogin = new Date(this.lastLogin);
        const diffTime = Math.abs(today - lastLogin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            this.streak++;
            this.addXP(10 * this.streak); // Bonus XP for maintaining streak
        } else if (diffDays > 1) {
            this.streak = 1;
        }
        
        this.lastLogin = today;
        this.saveProgress();
    },
    
    // Save progress to localStorage
    saveProgress() {
        localStorage.setItem('userProgress', JSON.stringify({
            level: this.level,
            xp: this.xp,
            achievements: this.achievements,
            completedLessons: this.completedLessons,
            streak: this.streak,
            lastLogin: this.lastLogin
        }));
    },
    
    // Load progress from localStorage
    loadProgress() {
        const savedProgress = localStorage.getItem('userProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            Object.assign(this, progress);
            this.lastLogin = new Date(this.lastLogin);
        }
    },
    
    // Show level up notification
    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>Level Up!</h3>
                <p>You've reached level ${this.level}!</p>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    },
    
    // Show achievement notification
    showAchievementNotification(name) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>Achievement Unlocked!</h3>
                <p>${name}</p>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};

// Initialize progress tracking
document.addEventListener('DOMContentLoaded', () => {
    userProgress.loadProgress();
    userProgress.updateStreak();
    
    // Add progress display to the page
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = `
        <div class="progress-info">
            <span>Level ${userProgress.level}</span>
            <span>${userProgress.xp}/${userProgress.xpPerLevel[userProgress.level]} XP</span>
            <span>Streak: ${userProgress.streak} days</span>
        </div>
        <div class="progress-fill" style="width: ${(userProgress.xp / userProgress.xpPerLevel[userProgress.level]) * 100}%"></div>
    `;
    document.body.appendChild(progressBar);
});

// Spaced Repetition System
const spacedRepetition = {
    // Difficulty levels and their intervals (in days)
    intervals: {
        'easy': 4,
        'medium': 2,
        'hard': 1
    },
    
    // Store vocabulary items with their review dates
    vocabulary: new Map(),
    
    // Add a new word to the system
    addWord(word, translation, difficulty = 'medium') {
        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() + this.intervals[difficulty]);
        
        this.vocabulary.set(word, {
            translation,
            difficulty,
            reviewDate,
            timesReviewed: 0,
            lastReview: new Date()
        });
        
        this.saveVocabulary();
    },
    
    // Review a word
    reviewWord(word, success) {
        const item = this.vocabulary.get(word);
        if (!item) return;
        
        item.timesReviewed++;
        item.lastReview = new Date();
        
        // Adjust difficulty based on success
        if (success) {
            if (item.difficulty === 'hard') item.difficulty = 'medium';
            else if (item.difficulty === 'medium') item.difficulty = 'easy';
        } else {
            if (item.difficulty === 'easy') item.difficulty = 'medium';
            else if (item.difficulty === 'medium') item.difficulty = 'hard';
        }
        
        // Set next review date
        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() + this.intervals[item.difficulty]);
        item.reviewDate = reviewDate;
        
        this.saveVocabulary();
    },
    
    // Get words due for review
    getDueWords() {
        const today = new Date();
        const dueWords = [];
        
        for (const [word, item] of this.vocabulary) {
            if (item.reviewDate <= today) {
                dueWords.push({
                    word,
                    translation: item.translation,
                    difficulty: item.difficulty
                });
            }
        }
        
        return dueWords;
    },
    
    // Save vocabulary to localStorage
    saveVocabulary() {
        const serialized = Array.from(this.vocabulary.entries()).map(([word, data]) => ({
            word,
            ...data,
            reviewDate: data.reviewDate.toISOString(),
            lastReview: data.lastReview.toISOString()
        }));
        localStorage.setItem('spacedRepetition', JSON.stringify(serialized));
    },
    
    // Load vocabulary from localStorage
    loadVocabulary() {
        const saved = localStorage.getItem('spacedRepetition');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.vocabulary = new Map(parsed.map(item => [
                item.word,
                {
                    ...item,
                    reviewDate: new Date(item.reviewDate),
                    lastReview: new Date(item.lastReview)
                }
            ]));
        }
    }
};

// Initialize spaced repetition
document.addEventListener('DOMContentLoaded', () => {
    spacedRepetition.loadVocabulary();
    
    // Add daily review reminder
    const dueWords = spacedRepetition.getDueWords();
    if (dueWords.length > 0) {
        const reminder = document.createElement('div');
        reminder.className = 'review-reminder';
        reminder.innerHTML = `
            <div class="reminder-content">
                <h3>Daily Review</h3>
                <p>You have ${dueWords.length} words to review today!</p>
                <button onclick="startReview()">Start Review</button>
            </div>
        `;
        document.body.appendChild(reminder);
    }
});

// Start vocabulary review
function startReview() {
    const dueWords = spacedRepetition.getDueWords();
    if (dueWords.length === 0) return;
    
    const reviewContainer = document.createElement('div');
    reviewContainer.className = 'review-container';
    reviewContainer.innerHTML = `
        <div class="review-content">
            <h3>Vocabulary Review</h3>
            <div class="word-display">
                <p class="word">${dueWords[0].word}</p>
                <p class="translation hidden">${dueWords[0].translation}</p>
            </div>
            <div class="review-buttons">
                <button onclick="showTranslation()">Show Translation</button>
                <button onclick="markCorrect()">I Know This</button>
                <button onclick="markIncorrect()">I Don't Know This</button>
            </div>
        </div>
    `;
    document.body.appendChild(reviewContainer);
}

// Social Features
const socialFeatures = {
    // Store user's social data
    socialData: {
        friends: [],
        sharedAchievements: [],
        activityFeed: []
    },
    
    // Add a friend
    addFriend(friendId) {
        if (!this.socialData.friends.includes(friendId)) {
            this.socialData.friends.push(friendId);
            this.saveSocialData();
            this.addToActivityFeed('friend_added', { friendId });
        }
    },
    
    // Share an achievement
    shareAchievement(achievement) {
        if (!this.socialData.sharedAchievements.includes(achievement)) {
            this.socialData.sharedAchievements.push(achievement);
            this.saveSocialData();
            this.addToActivityFeed('achievement_shared', { achievement });
        }
    },
    
    // Add to activity feed
    addToActivityFeed(type, data) {
        const activity = {
            type,
            data,
            timestamp: new Date()
        };
        this.socialData.activityFeed.unshift(activity);
        this.saveSocialData();
    },
    
    // Get activity feed
    getActivityFeed() {
        return this.socialData.activityFeed;
    },
    
    // Save social data to localStorage
    saveSocialData() {
        localStorage.setItem('socialData', JSON.stringify(this.socialData));
    },
    
    // Load social data from localStorage
    loadSocialData() {
        const saved = localStorage.getItem('socialData');
        if (saved) {
            this.socialData = JSON.parse(saved);
        }
    }
};

// Initialize social features
document.addEventListener('DOMContentLoaded', () => {
    socialFeatures.loadSocialData();
    
    // Add social feed to the page
    const socialFeed = document.createElement('div');
    socialFeed.className = 'social-feed';
    socialFeed.innerHTML = `
        <h3>Activity Feed</h3>
        <div class="feed-content"></div>
    `;
    document.body.appendChild(socialFeed);
    
    // Display activity feed
    const feedContent = socialFeed.querySelector('.feed-content');
    const activities = socialFeatures.getActivityFeed();
    
    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        
        switch (activity.type) {
            case 'friend_added':
                activityElement.innerHTML = `
                    <p>Added a new friend: ${activity.data.friendId}</p>
                    <small>${new Date(activity.timestamp).toLocaleString()}</small>
                `;
                break;
            case 'achievement_shared':
                activityElement.innerHTML = `
                    <p>Shared achievement: ${activity.data.achievement}</p>
                    <small>${new Date(activity.timestamp).toLocaleString()}</small>
                `;
                break;
        }
        
        feedContent.appendChild(activityElement);
    });
});

// Share progress function
function shareProgress() {
    const progress = {
        level: userProgress.level,
        xp: userProgress.xp,
        streak: userProgress.streak,
        achievements: userProgress.achievements
    };
    
    // Create share dialog
    const shareDialog = document.createElement('div');
    shareDialog.className = 'share-dialog';
    shareDialog.innerHTML = `
        <div class="share-content">
            <h3>Share Your Progress</h3>
            <div class="progress-summary">
                <p>Level: ${progress.level}</p>
                <p>XP: ${progress.xp}</p>
                <p>Streak: ${progress.streak} days</p>
                <p>Achievements: ${progress.achievements.length}</p>
            </div>
            <div class="share-buttons">
                <button onclick="shareToSocial('twitter')">Share on Twitter</button>
                <button onclick="shareToSocial('facebook')">Share on Facebook</button>
                <button onclick="copyProgressLink()">Copy Link</button>
            </div>
        </div>
    `;
    document.body.appendChild(shareDialog);
}

// Share to social media
function shareToSocial(platform) {
    const progress = {
        level: userProgress.level,
        xp: userProgress.xp,
        streak: userProgress.streak
    };
    
    let shareUrl = '';
    let shareText = `I'm learning Spanish with Lumi! Level ${progress.level}, ${progress.xp} XP, ${progress.streak} day streak!`;
    
    switch (platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
            break;
    }
    
    window.open(shareUrl, '_blank');
}

// Copy progress link
function copyProgressLink() {
    const progress = {
        level: userProgress.level,
        xp: userProgress.xp,
        streak: userProgress.streak
    };
    
    const shareText = `Check out my Spanish learning progress on Lumi! Level ${progress.level}, ${progress.xp} XP, ${progress.streak} day streak!`;
    const shareUrl = `${window.location.href}?share=${encodeURIComponent(shareText)}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
    });
}
