// Check if user is logged in
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(currentUser);
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Check if user is a teacher
function isTeacher() {
    const user = checkAuth();
    return user && user.type === 'teacher';
}

// Check if user is a student
function isStudent() {
    const user = checkAuth();
    return user && user.type === 'student';
}

// Redirect if wrong user type
function redirectIfWrongUserType() {
    const user = checkAuth();
    if (!user) return;

    const isTeacherPage = window.location.pathname.includes('teacher.html');
    const isStudentPage = window.location.pathname.includes('greetings.html') || 
                         window.location.pathname.includes('listening.html');

    if (isTeacherPage && !isTeacher()) {
        window.location.href = 'greetings.html';
    } else if (isStudentPage && !isStudent()) {
        window.location.href = 'teacher.html';
    }
} 