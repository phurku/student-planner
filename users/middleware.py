from django.contrib.auth import logout

class SingleSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            # Check if the current session matches the last login session
            if request.user.last_login_session and request.user.last_login_session != request.session.session_key:
                logout(request)  # Log the user out
        return self.get_response(request)