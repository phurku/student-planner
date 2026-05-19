from django.contrib import admin
from users.models import FcmTokens, Profile, PasswordReset, Feedback

admin.site.register(Profile)
admin.site.register(PasswordReset)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display  = ('id', 'user', 'rating', 'category', 'short_message', 'created_at')
    list_filter   = ('category', 'rating', 'created_at')
    search_fields = ('user__username', 'user__email', 'message')
    readonly_fields = ('user', 'rating', 'category', 'message', 'created_at')
    ordering      = ('-created_at',)

    def short_message(self, obj):
        return obj.message[:80] + ('…' if len(obj.message) > 80 else '')
    short_message.short_description = 'Message'
